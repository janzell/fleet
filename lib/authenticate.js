import Router from "next/router";

import apiHandler from './api-handler';
import {getCookie, removeCookie} from "./session";

const login = body => apiHandler.post(`/auth/login`, body);

const signOut = () => {
  if (process.browser) {
    removeCookie("token");
    removeCookie("userData");

    window.location = '/login';
  }
};

const authMe = (ctx) => apiHandler.get('/auth/me', ctx);

const redirect = (target, ctx = {}) => {
  if (ctx.res) {
    ctx.res.writeHead(303, {Location: target});
    ctx.res.end();
  } else {
    Router.replace(target);
  }
};

const isAuthenticated = ctx => !!getCookie("token", ctx.req);

const redirectNotAuthorized = ctx => {
  if (!isAuthenticated(ctx)) {
    redirect('/login', ctx);
  }
};

export {login, authMe, redirectNotAuthorized, signOut, redirect};
