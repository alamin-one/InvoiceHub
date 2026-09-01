const express = require('express');
const {
  getAllInvoices,
  getInvoicesById,
  updateInvoiceById,
  deleteInvoiceById,
  createInvoice,
  invoiceDownload,
} = require('../controllers/invoice.controller');

const invoiceRoute = express.Router();
// invoice route
const authentication = require('../authentication/authentication');

invoiceRoute.use(authentication);

invoiceRoute.get('/', getAllInvoices);
invoiceRoute.get('/:id', getInvoicesById);

invoiceRoute.post('/', createInvoice);

invoiceRoute.patch('/:id', updateInvoiceById);
invoiceRoute.delete('/:id', deleteInvoiceById);

invoiceRoute.post('/download', invoiceDownload);

module.exports = invoiceRoute;
