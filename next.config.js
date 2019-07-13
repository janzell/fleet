const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const prefix = '/app';
const dotEnvResult = require('dotenv').config();

if (dotEnvResult.error) {
  throw dotEnvResult.error
}

module.exports = withPlugins([
  [withCSS]
], {
  publicRuntimeConfig: {
    HASURA_GRAPHQL: process.env.HASURA_GRAPHQL || 'localhost:8080',
    HASURA_WS: process.env.HASURA_WS || 'localhost:8080',
    SERVICE: process.env.SERVICE || 'localhost:8000/api/v1',
    assetPrefix: prefix,
  },
  assetPrefix: prefix
});
