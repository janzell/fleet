import React from 'react';
import App, {Container} from 'next/app';
import {ApolloProvider} from 'react-apollo';
import withApolloClient from '../lib/with-apollo-client';

import '../css/core.css';

class FleetApp extends App {
  render() {
    const {Component, pageProps, apolloClient} = this.props;
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    )
  }
}

export default withApolloClient(FleetApp)
