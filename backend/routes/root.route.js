const customerRoute = require('./customer.route');
const invoiceRoute = require('./invoice.route');
const storeRoute = require('./store.route');

const rootRoute = app => {
  app.use('/customer', customerRoute);
  app.use('/invoice', invoiceRoute);
  app.use('/store', storeRoute);
};

module.exports = rootRoute;
