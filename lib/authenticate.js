import apiHandler from './api-handler';
import {getCookie, removeCookie} from "./session";
import Router from "next/router";

const login = (body) => {
  return apiHandler.post(`/auth/login`, body);
};

const signOut = () => {
  if (process.browser) {
    removeCookie("token");
    removeCookie("userData");
    window.location = '/login'
  }
};

const authMe = (ctx) => {
  return apiHandler.get('/auth/me', ctx);
};

const redirect = (target, ctx = {}) => {
  if (ctx.res) {
    ctx.res.writeHead(303, {Location: target});
    ctx.res.end();
  } else {
    // In the browser, we just pretend like this never even happened ;)
    Router.replace(target);
  }
};

const isAuthenticated = ctx => !!getCookie("token", ctx.req);

const redirectNotAuthorized = ctx => {
  if (!isAuthenticated(ctx)) {
    redirect('/login', ctx);
  }
};

export {login, authMe, redirectNotAuthorized, signOut};
