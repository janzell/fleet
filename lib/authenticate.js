import apiHandler from './api-handler';
import {getCookie} from "./session";

const login = (body) => {
  return apiHandler.post(`/auth/login`, body);
};

const authMe = (ctx) => {
  return apiHandler.get('/auth/me', ctx);
};

const isAuthenticated = ctx => !!getCookie("token", ctx.req);

const redirectNotAuthorized = ctx => {
  if (!isAuthenticated(ctx)) redirect("/", ctx);
};

// const ForgotPassword = (body) => {
//   return apiCore.post(`/auth/password/email`, body);
// };
//
// const ResetPassword = (body) => {
//   return apiCore.post(`/auth/password/reset`, body);
// };

export {login, authMe, redirectNotAuthorized};
