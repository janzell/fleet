const express = require('express');
const next = require('next');
const detect = require('detect-port');
const routes = require('./routes');
let port = 3000;

detect(port, (err, _port) => {
  if (err) {
    console.log(err);
  }
  if (port === _port) {
    console.log(`port: ${port} was not occupied`);
    runServer(port);
  } else {
    console.log(`port: ${port} was occupied, try port: ${_port}`);
    runServer(_port);
  }
});

const runServer = (openPort) => {
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({dev});
  const handle = routes.getRequestHandler(app, ({req, res, route, query}) => {
    app.render(req, res, route.page, query);
  });

  app.prepare().then(() => {
    const server = express()

    server.use(function (req, res, next) {
      req.url = req.originalUrl.replace('app/_next', '_next');
      next(); // be sure to let the next middleware handle the modified request.
    });

    server.use(handle).listen(openPort, err => {
      if (err) {
        console.log('Try running  server again');
        return tryServer(port + 1);
      }
      console.log(`> Ready on http://localhost:${openPort}`)
    });
  });
};
