const { default: mongoose } = require('mongoose');

const Customer = require('../models/customerModel');
const Invoice = require('../models/invoiceModel');
const {
  customerPipeline,
  singleCustomerPipeline,
} = require('../pipelines/customerPipeline');

const sendResponse = require('../libs/sendResponse');

/*
 *
 *
 *
 *
 * Customer Controller
 * Get All Customer
 * Get Customer By ID
 * Create Customer
 * Update Customer
 * Delete Customer
 *
 *
 */

/*-----------------------------------------*
 *                                         *
 *  GET ALL CUSTOMER CONTROLLER             *
 *                                         *
 * ----------------------------------------*/

const getAllCustomers = async (req, res) => {
  const search = req.query.search?.trim() || '';

  try {
    const storeId = new mongoose.Types.ObjectId(res.locals.storeId);
    const pipeline = customerPipeline({ storeId, search });

    const customer = await Customer.aggregate(pipeline);
    if (customer.length === 0) {
      return sendResponse(res, 404, false, 'Customer not Found!');
    }
    sendResponse(res, 200, true, 'Get All Customer Successfully', { customer });
  } catch (err) {
    return sendResponse(
      res,
      500,
      false,
      err.message || 'Something went wrong!!',
    );
  }
};

/*-----------------------------------------*
 *                                         *
 *  GET CUSTOMER BY ID                     *
 *                                         *
 * ----------------------------------------*/

const getCustomersById = async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const storeId = new mongoose.Types.ObjectId(res.locals.storeId);

  try {
    // customer pipeline for single customer query
    const pipeline = singleCustomerPipeline({ storeId, customerId: id });
    const [customer] = await Customer.aggregate(pipeline);

    if (!customer) {
      return sendResponse(res, 404, false, 'Customer not Found!');
    }

    sendResponse(res, 200, true, 'Get Customer Successfully', { customer });
  } catch (err) {
    return sendResponse(
      res,
      500,
      false,
      err.message || 'Something went wrong!!',
    );
  }
};

/*-----------------------------------------*
 *                                          *
 *  CREATE CUSTOMER                        *
 *                                         *
 * ----------------------------------------*/

const createCustomer = async (req, res) => {
  const storeId = res.locals.storeId;
  const { name, phone, address } = req.body;

  try {
    // check if customer already exists
    const exists = await Customer.findOne({ phone: phone });
    if (exists) {
      return sendResponse(
        res,
        400,
        false,
        'A customer with this phone number already exists!',
      );
    }

    const newCustomer = await Customer.create({
      store: storeId,
      name,
      phone,
      address,
    });

    return sendResponse(res, 201, true, 'Customer Create Successfully', {
      newCustomer,
    });
  } catch (err) {
    return sendResponse(
      res,
      500,
      false,
      err.message || 'Something went wrong!!',
    );
  }
};

/*-----------------------------------------*
 *                                         *
 *  UPDATE CUSTOMER BY ID                  *
 *                                         *
 * ----------------------------------------*/

const updateCustomerById = async (req, res) => {
  const id = req.params.id;
  try {
    const exists = await Customer.findById(id);

    if (!exists) {
      return sendResponse(res, 404, false, 'Customer not found!');
    }

    const phoneExists = await Customer.findOne({
      phone: req.body.phone,
      _id: { $ne: id },
    });

    if (phoneExists) {
      return sendResponse(
        res,
        400,
        false,
        'Phone number already used in another customer!',
      );
    }

    const customer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return sendResponse(res, 404, false, 'Customer not Found!');
    }

    return sendResponse(res, 201, true, 'Customer Update Successfully', {
      customer,
    });
  } catch (err) {
    return sendResponse(
      res,
      500,
      false,
      err.message || 'Something went wrong!!',
    );
  }
};

/*-----------------------------------------*
 *                                         *
 *  DELETE CUSTOMER BY ID                  *
 *                                         *
 * ----------------------------------------*/

const deleteCustomerById = async (req, res) => {
  const id = req.params.id;
  try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return sendResponse(res, 404, false, 'Customer not Found!');
    }

    /// delete all invoices related to this customer
    await Invoice.deleteMany({ customer: id });

    return sendResponse(res, 200, true, 'Customer Deleted Successfully');
  } catch (err) {
    return sendResponse(
      res,
      500,
      false,
      err.message || 'Something went wrong!!',
    );
  }
};

module.exports = {
  getAllCustomers,
  getCustomersById,
  createCustomer,
  updateCustomerById,
  deleteCustomerById,
};
