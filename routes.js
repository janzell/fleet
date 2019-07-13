const nextRoutes = require('@yolkai/next-routes').default;
const prefix = '/app';

const routes = nextRoutes()
  .add('dashboard', `${prefix}/dashboard`)
  .add('user', `${prefix}/user`)
  .add('rental', `${prefix}/rental`)
  .add('parts', `${prefix}/parts`)
  .add('driver', `${prefix}/driver`);

module.exports = routes;
