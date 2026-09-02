const { hashPassword, comparePassword } = require('../libs/bcryptOperation');
const Invoice = require('../models/invoiceModel');
const Store = require('../models/storeModel');
const bcrypt = require('bcrypt');
const TempStore = require('../models/TempStore');
const jwt = require('jsonwebtoken');
const sendVerifiedEmail = require('../services/email.service');
const mongoose = require('mongoose');
const {
  currentMonthStart,
  previousMonthStart,
  sixMonthsAgoStart,
} = require('../libs/getMonthDateRange');
const { StoreOverviewPipeline } = require('../pipelines/storePipeline');
const generateOtp = require('../libs/otpGenerator');
const ForgotPassword = require('../models/forgotPasswordSchema');
const sendResponse = require('../libs/sendResponse');
const buildStoreOverview = require('../libs/buildStoreOverview');

/*
 *
 *
 * Authentication
 *  STORE ACCOUNT
 *  signup,
 * verify,
 * signin,
 * signout,
 *  forgot,
 * verify,
 *  reset,
 *  me,
 *  overview,
 * update,
 * password,
 * settings,
 * delete account
 *
 */

/*----------------------------------------*
 *                                        *
 *   CHECK AUTHENTICATION                 *
 *                                        *
 *--------------------------------------- */
const checkAuth = async (req, res) => {
  return sendResponse(res, 200, true, {
    storeId: res.locals.storeId,
  });
};

/*----------------------------------------*
 *                                        *
 *   SIGNUP                               *
 *                                        *
 *--------------------------------------- */

const signUp = async (req, res) => {
  const { email, name, password, confirmPassword } = req.body;

  try {
    if (!email || !name || !password || !confirmPassword) {
      return sendResponse(
        res,
        400,
        false,
        'Email, name, password and confirm password are required',
      );
    }

    if (password !== confirmPassword) {
      return sendResponse(res, 400, false, 'Password not Match!');
    }

    const exists = await Store.findOne({ email: email });
    if (exists) {
      return sendResponse(res, 400, false, 'Store Already Exists!');
    }

    // Create a temporary store document
    const verifyOtp = Math.floor(Math.random() * 900000 + 100000).toString();
    const otpExpires = new Date(Date.now() + 1000 * 60 * 30);

    const hashedPassword = await hashPassword(password);

    const token = jwt.sign({ email: email }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: '60m',
    });

    // Check if the store already exists in the temporary store collection
    const existsTempStore = await TempStore.findOne({ email: email });

    if (existsTempStore) {
      existsTempStore.name = name;
      existsTempStore.password = hashedPassword;
      existsTempStore.otp = verifyOtp;
      existsTempStore.otpExpires = otpExpires;
      existsTempStore.verificationToken = token;
      await existsTempStore.save();
    } else {
      await TempStore.create({
        name,
        email,
        password: hashedPassword,
        otp: verifyOtp,
        otpExpires: otpExpires,
        verificationToken: token,
      });
    }
    // Send verification email
    await sendVerifiedEmail(verifyOtp, email);

    // Set verification token cookie
    res.cookie('verificationToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000,
    });

    // Send success response
    sendResponse(
      res,
      201,
      true,
      'Verification code sent successfully. Please check your email.',
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      false,
      err.message || 'Something went wrong!!',
    );
  }
};

/*-----------------------------------*
 *                                   *
 *   VERIFY SIGNUP                   *
 *                                   *
 *-----------------------------------*/
const verifySignup = async (req, res) => {
  const { otp } = req.body;
  const verifyToken =
    req.cookies.verificationToken || req.headers.authorization?.split(' ')[1];

  try {
    if (!verifyToken) {
      return sendResponse(
        res,
        400,
        false,
        'Session expired, please request a new OTP!!.',
      );
    }

    // Check if the verification token exists
    const tempStore = await TempStore.findOne({
      verificationToken: verifyToken,
    });
    if (!tempStore) {
      return sendResponse(
        res,
        400,
        false,
        'Session expired! Please try again.',
      );
    }
    if (new Date() > tempStore.otpExpires) {
      return sendResponse(res, 400, false, 'Verification code has expired!');
    }

    if (otp !== tempStore.otp) {
      return sendResponse(res, 400, false, 'Invalid verification code!');
    }

    // Check if the store already exists in the store collection
    const exists = await Store.findOne({
      email: tempStore.email,
    });

    if (exists) {
      return sendResponse(res, 400, false, 'Store already exists!');
    }

    // Create a new store document
    const store = await Store.create({
      name: tempStore.name,
      email: tempStore.email,
      password: tempStore.password,
    });

    // Delete the temporary store document
    await TempStore.deleteOne({
      _id: tempStore._id,
    });

    // Create a JWT token
    const token = jwt.sign(
      { storeId: store._id },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: '20d' },
    );

    // Clear the verification token cookie
    res.clearCookie('verificationToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000,
    });

    // Set the JWT token cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });

    // Send success response
    sendResponse(res, 200, true, 'Verify Signup successful');
  } catch (err) {
    return sendResponse(
      res,
      400,
      false,
      err.message || 'Verify Signup Failed!',
    );
  }
};

/*-----------------------------------*
 *                                   *
 *   SIGN IN                         *
 *                                   *
 *-----------------------------------*/
const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return sendResponse(res, 400, false, 'Email and password are required!');
    }

    // Check if the store exists
    const store = await Store.findOne({ email });
    if (!store) {
      return sendResponse(res, 401, false, 'Store not Found!');
    }

    const isMatch = await comparePassword(password, store.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, 'Invalid password!');
    }

    const token = jwt.sign(
      { storeId: store._id },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: '20d',
      },
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, 200, true, 'Login successful');
  } catch (err) {
    return sendResponse(res, 500, false, err.message || 'Sign In Failed!');
  }
};

/*-----------------------------------*
 *                                   *
 *   SIGN OUT                        *
 *                                   *
 *-----------------------------------*/
const signOut = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, 200, true, 'Signed out successfully');
  } catch (err) {
    return sendResponse(res, 400, false, err.message || 'Sign Out Failed!');
  }
};

/*-----------------------------------*
 *                                   *
 *   FORGET PASSWORD                 *
 *                                   *
 *-----------------------------------*/
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return sendResponse(res, 400, false, 'Email is required!');
    }
    const store = await Store.findOne({ email });
    if (!store) {
      return sendResponse(res, 404, false, 'Store not Found!');
    }
    // generate otp
    const { otp, otpExpires } = generateOtp();

    // save otp to database
    await ForgotPassword.findOneAndUpdate(
      { email },
      {
        email,
        otp,
        otpExpires,
      },
      {
        upsert: true,
        new: true,
      },
    );
    // send otp to email
    await sendVerifiedEmail(otp, email);

    // set cookie
    res.cookie('verificationEmail', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000,
    });

    return sendResponse(res, 200, true, 'Verification code sent successfully');
  } catch (err) {
    return sendResponse(
      res,
      500,
      false,
      err.message || 'Forget Password Failed!',
    );
  }
};

/*-----------------------------------*
 *                                   *
 *   VERIFY FORGET PASSWORD          *
 *                                   *
 *-----------------------------------*/

const verifyForgotPassword = async (req, res) => {
  const { otp } = req.body;
  const email = req.cookies.verificationEmail;

  try {
    if (!email) {
      return sendResponse(
        res,
        400,
        false,
        'Session expired! , Please try again!',
      );
    }

    // check if the email is valid
    const forgotPassword = await ForgotPassword.findOne({ email });
    if (!forgotPassword) {
      return sendResponse(
        res,
        404,
        false,
        'Session expired! Please try again!!',
      );
    }

    // check if the otp is valid
    if (forgotPassword.otpExpires < new Date()) {
      await ForgotPassword.deleteOne({
        _id: forgotPassword._id,
      });
      return sendResponse(res, 400, false, 'Verification code expired');
    }

    // check if the otp is valid
    if (forgotPassword.otp !== otp) {
      return sendResponse(res, 400, false, 'Invalid verification code');
    }

    // set cookie
    const resetToken = jwt.sign({ email }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: '60m',
    });

    res.cookie('resetToken', resetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 10 * 60 * 1000,
    });

    return sendResponse(res, 200, true, 'Verification successful.');
  } catch (err) {
    return sendResponse(
      res,
      400,
      false,
      err.message || 'Verify Password Failed!',
    );
  }
};

/*-----------------------------------*
 *                                   *
 *   RESET PASSWORD                  *
 *                                   *
 *-----------------------------------*/

const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const resetToken = req.cookies.resetToken;

  try {
    if (password !== confirmPassword) {
      return sendResponse(res, 400, false, 'Password do not match');
    }

    if (!resetToken) {
      return sendResponse(res, 401, false, 'Reset session expired');
    }

    const decoded = jwt.verify(resetToken, process.env.JWT_PRIVATE_KEY);
    const store = await Store.findOne({
      email: decoded.email,
    });
    if (!store) {
      return sendResponse(res, 404, false, 'Store not found');
    }

    const hashedPassword = await hashPassword(password);
    store.password = hashedPassword;
    await store.save();

    // delete forgot password document
    await ForgotPassword.deleteOne({
      email: decoded.email,
    });

    // verification email cookie remove
    res.clearCookie('verificationEmail', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    // reset cookie remove
    res.clearCookie('resetToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return sendResponse(res, 200, true, 'Password reset successfully');
  } catch (err) {
    return sendResponse(
      res,
      400,
      false,
      err.message || 'Reset Password Failed!',
    );
  }
};

/*-----------------------------------*
 *                                   *
 *  GET  ME                          *
 *                                   *
 *-----------------------------------*/
const getStore = async (req, res) => {
  const storeId = res.locals.storeId;

  try {
    const store = await Store.findById(storeId).select('-password');
    if (!store) {
      return sendResponse(res, 404, false, 'Store not Found!');
    }

    return sendResponse(res, 200, true, 'Store Created', {
      store: store.toObject(),
    });
  } catch (err) {
    return sendResponse(res, 400, false, err.message || 'Store Get Failed!');
  }
};

/**
 *
 *
 *  STORE ACCOUNT
 *
 *
 */

/*-------------------------------------*
 *                                     *
 *  GET  OVERVIEW                      *
 *                                     *
 *-------------------------------------*/
const overview = async (req, res) => {
  try {
    const storeId = new mongoose.Types.ObjectId(res.locals.storeId);
    // overview query pipeline
    const pipeline = StoreOverviewPipeline({
      storeId,
      currentMonthStart,
      previousMonthStart,
      sixMonthsAgoStart,
    });
    const [store] = await Store.aggregate(pipeline);
    const overview = buildStoreOverview(store, currentMonthStart);

    if (!store) {
      return sendResponse(res, 404, false, 'Store not Found!');
    }

    sendResponse(res, 200, true, 'Store Created', {
      store: overview,
    });
  } catch (err) {
    return sendResponse(res, 400, false, err.message || 'Store Get Failed!');
  }
};

/*-------------------------------------*
 *                                     *
 *  UPDATE  UPDATE STORE BY ID          *
 *                                     *
 *-------------------------------------*/

const updateStoreById = async (req, res) => {
  const storeId = res.locals.storeId;
  try {
    // allowedFields
    const allowedFields = [
      'logo',
      'name',
      'tagline',
      'address',
      'phone',
      'email',
    ];

    const update = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    }

    if (update.email) {
      const exists = await Store.findOne({
        email: update.email,
        _id: { $ne: storeId },
      });

      if (exists) {
        return sendResponse(
          res,
          400,
          false,
          'This email is already in use by another Store',
        );
      }
    }

    // update store
    const store = await Store.findByIdAndUpdate(storeId, update, {
      new: true,
      runValidators: true,
    });

    if (!store) {
      return sendResponse(res, 404, false, 'Store not Found!');
    }

    sendResponse(res, 200, true, 'Store Update Successfully', {
      store: store.toObject(),
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

/*----------------------------------------*
 *                                        *
 *  UPDATE  UPDATE STORE PASSWORD BY ID   *
 *                                        *
 *---------------------------------------*/
const updateStorePasswordById = async (req, res) => {
  const storeId = res.locals.storeId;
  const { password, confirmPassword } = req.body;

  try {
    if (!password || !confirmPassword) {
      return sendResponse(
        res,
        400,
        false,
        'Password and confirm password are required',
      );
    }

    if (password !== confirmPassword) {
      return sendResponse(res, 400, false, 'Password not Match!');
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return sendResponse(res, 404, false, 'Store not Found!');
    }

    const isMatch = await bcrypt.compare(password, store.password);
    if (isMatch) {
      return sendResponse(
        res,
        400,
        false,
        'New password must be different from current password!!',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    store.password = hashedPassword;
    await store.save();

    sendResponse(res, 200, true, 'Password Update Successfully');
  } catch (err) {
    return sendResponse(
      res,
      500,
      false,
      err.message || 'Something went wrong!!',
    );
  }
};

/*----------------------------------------*
 *                                        *
 *  UPDATE  UPDATE STORE SETTINGS BY ID   *
 *                                        *
 *---------------------------------------*/
const updateStoreSettingsById = async (req, res) => {
  const storeId = res.locals.storeId;
  try {
    // allowedFields
    const allowedFields = [
      'invoicePrefix',
      'nextInvoiceNumber',
      'defaultTax',
      'defaultDuePeriod',
      'currencySymbol',
      'invoiceFooterNote',
    ];

    const update = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    }

    if (update.nextInvoiceNumber !== undefined) {
      const store = await Store.findById(storeId);

      if (!store) {
        return sendResponse(res, 404, false, 'Store not Found!');
      }

      if (update.nextInvoiceNumber < store.nextInvoiceNumber) {
        return sendResponse(
          res,
          400,
          false,
          `Next invoice number must be greater than or equal to ${store.nextInvoiceNumber}`,
        );
      }
    }
    const updatedStore = await Store.findByIdAndUpdate(storeId, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedStore) {
      return sendResponse(res, 404, false, 'Store not Found!');
    }

    const { password, ...rest } = updatedStore.toObject();
    sendResponse(res, 201, true, 'Store Update Successfully', {
      store: rest,
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

/*----------------------------------------*
 *                                        *
 *  DELETE  DELETE STORE BY ID   *
 *                                        *
 *---------------------------------------*/
const deleteStore = async (req, res) => {
  const storeId = res.locals.storeId;
  const { password } = req.body;
  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return sendResponse(res, 404, false, 'Store not Found!');
    }

    const isMatch = await comparePassword(password, store.password);
    if (!isMatch) {
      return sendResponse(res, 400, false, 'Password not Match!');
    }

    await store.deleteOne();
    sendResponse(res, 200, true, 'Store Delete Successfully');
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
  checkAuth,
  signIn,
  signUp,
  verifySignup,
  signOut,
  getStore,
  overview,
  updateStoreById,
  updateStorePasswordById,
  updateStoreSettingsById,
  deleteStore,
  forgotPassword,
  verifyForgotPassword,
  resetPassword,
};
