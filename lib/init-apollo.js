import {ApolloClient, HttpLink, InMemoryCache} from 'apollo-boost';

import {WebSocketLink} from 'apollo-link-ws';

import cookie from "js-cookie"
import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';

import {getMainDefinition} from 'apollo-utilities';
import {onError} from 'apollo-link-error';
import {setContext} from 'apollo-link-context';
import {split} from 'apollo-link';

import {signOut} from './authenticate';

let apolloClient = null;

const {publicRuntimeConfig} = getConfig();
const {HASURA_GRAPHQL} = publicRuntimeConfig;
const {HASURA_WS} = publicRuntimeConfig;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState, {getToken}) {
  const wsLink = process.browser
    ? new WebSocketLink({
      uri: `${HASURA_WS}`,
      options: {
        reconnect: true,
        connectionParams: {
          headers: {
            Authorization: `Bearer ${cookie.get('token')}`
          }
        }
      }
    })
    : null;

  const httpLink = new HttpLink({
    uri: `${HASURA_GRAPHQL}`
  });

  /**
   * Error link.
   * @type {ApolloLink}
   */
  const errorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors) {
      let noAuthentication = false;

      const errors = graphQLErrors.map(({message, extensions, path}) => {

        ['JWTExpired', 'Missing Authorization'].map(m => {
          if (message.split(m).length > 1) noAuthentication = true;
        });

        return {message, code: extensions.code};
      });

      console.log('graphQLErrors', errors);

      // todo: Need to create new custom error to specify.
      if (noAuthentication) {
        signOut();
      }
    }

    if (networkError) {
      if (networkError.statusCode === 401) signOut();
    }
  });

  /**
   * Auth link.
   *
   * @type {ApolloLink}
   */
  const authLink = setContext((_, {headers}) => {
    const token = getToken();
    let baseHeaders = {...headers};

    if (token) {
      baseHeaders.authorization = `Bearer ${token}`;
    }

    return {headers: baseHeaders};
  });

  /**
   * Browser link.
   */
  const link = process.browser
    ? split(
      // split based on operation type
      ({query}) => {
        const {kind, operation} = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      httpLink
    )
    : httpLink;

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: authLink.concat(errorLink.concat(link)),
    cache: new InMemoryCache().restore(initialState || {})
  });
}

export default function initApollo(initialState, options) {
  console.log('initializing apollo');

  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, {...options, fetchOptions: {}})
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    console.log('creating new apollo client');

    apolloClient = create(initialState, options)
  }

  return apolloClient
}
