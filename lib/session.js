import cookie from "js-cookie";

/**
 * Set cookie
 *
 * @param key
 * @param value
 */
export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1,
      path: "/"
    });
  }
};

/**
 * Remove Cookie
 *
 * @param key
 */
export const removeCookie = key => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1
    });
  }
};

/**
 * Get cookie.
 * @param key
 * @param req
 * @return {*}
 */
export const getCookie = (key, req) => {
  return process.browser || !req
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
};

/**
 * Get cookie from browser.
 *
 * @param key
 * @return {*}
 */
const getCookieFromBrowser = key => {
  return cookie.get(key);
};

/**
 * Get cookie from the server.
 *
 * @param key
 * @param req
 * @return {string|undefined}
 */
const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const rawCookie = req.headers.cookie
    .split(";")
    .find(c => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split("=")[1];
};
