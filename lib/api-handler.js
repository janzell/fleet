import {getCookie} from "../lib/session"

import axios from 'axios';
import cookie from 'js-cookie'
import getConfig from 'next/config'

const CancelToken = axios.CancelToken;
const {publicRuntimeConfig} = getConfig();
const {SERVICE} = publicRuntimeConfig;

let def = {};
let apiConfig = {};
let cancel = null;

const obj = {
  true: (ctx) => {
    return {...def, authorization: 'Bearer ' + getToken(ctx),}
  },
  false: () => def,
};

/**
 * Get token from cookie.
 *
 * @param ctx
 * @return {*}
 */
const getToken = (ctx) => {
  if (process.browser) return cookie.get('token');
  return getCookie('token', ctx.req);
};

/**
 * Throwable respons.
 *
 * @param error
 * @return {*}
 */
const throwableError = (error) => {
  if (error.response) {
    const errorData = error.response;
    // Unauthorized
    if (errorData.status === 401) {
      // logout, redirect to login
      // removeCookie('userData');
      // removeCookie('token');
      // window.location.reload();
    }

    throw errorData;
  }
  return error;
};

export default {
  /**
   * Cancellable call.
   *
   * @param api
   * @param ctx
   * @return {Promise<AxiosResponse<any> | never>}
   */
  cancellableGet(api, ctx) {
    if (cancel) {
      cancel(); // cancel request if same token
    }

    apiConfig = {
      ...apiConfig, ...{
        headers: obj[getToken(ctx) !== null](ctx),
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      }
    };

    return axios
      .get(`${SERVICE}${api}`, apiConfig)
      .then(response => response.data)
      .catch(error => throwableError(error));
  },

  /**
   * Get
   * @param api
   * @param ctx
   * @return {Promise<AxiosResponse<any> | never>}
   */
  get(api, ctx) {
    apiConfig.headers = obj[getToken(ctx) !== null](ctx);
    return axios
      .get(`${SERVICE}${api}`, apiConfig)
      .then(response => response.data)
      .catch(error => throwableError(error));
  },

  /**
   * Put
   * @param api
   * @param body
   * @param ctx
   * @return {Promise<AxiosResponse<any> | never>}
   */
  put(api, body, ctx) {
    apiConfig.headers = obj[getToken(ctx) !== null](ctx);
    return axios
      .put(`${SERVICE}${api}`, body, apiConfig)
      .then(response => response.data)
      .catch(error => throwableError(error));
  },

  /**
   * Post form data?
   *
   * @param api
   * @param data
   * @param ctx
   * @return {Promise<AxiosResponse<any> | never>}
   */
  postFormData(api, data, ctx) {
    apiConfig.headers = obj[getToken(ctx) !== null](ctx);
    return axios
      .post(`${SERVICE}${api}`, data, apiConfig)
      .then(response => response.data)
      .catch(error => throwableError(error));
  },


  /**
   * Post method
   * @param api
   * @param body
   * @param ctx
   * @return {Promise<AxiosResponse<any> | never>}
   */
  post(api, body, ctx) {
    apiConfig.headers = obj[getToken(ctx) !== null](ctx);
    return axios
      .post(`${SERVICE}${api}`, body, apiConfig)
      .then(response => response.data)
      .catch(error => throwableError(error));
  },

  /**
   * Delete method.
   *
   * @param api
   * @param ctx
   * @return {Promise<AxiosResponse<any> | never>}
   */
  delete(api, ctx) {
    apiConfig.headers = obj[getToken(ctx) !== null](ctx);
    return axios
      .delete(`${SERVICE}${api}`, apiConfig)
      .then(response => response.data)
      .catch(error => throwableError(error));
  },
};
