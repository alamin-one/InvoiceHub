const express = require('express');
const {
  getAllCustomers,
  getCustomersById,
  createCustomer,
  updateCustomerById,
  deleteCustomerById,
} = require('../controllers/customer.controller');
const authentication = require('../authentication/authentication');

const customerRoute = express.Router();

// customer route
customerRoute.use(authentication);

customerRoute.get('/', getAllCustomers);
customerRoute.get('/:id', getCustomersById);

customerRoute.post('/', createCustomer);

customerRoute.patch('/:id', updateCustomerById);

customerRoute.delete('/:id', deleteCustomerById);

module.exports = customerRoute;
