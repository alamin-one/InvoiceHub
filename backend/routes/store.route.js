const express = require('express');
const {
  updateStoreById,
  updateStoreSettingsById,
  updateStorePasswordById,
  deleteStore,
  signUp,
  verifySignup,
  signIn,
  signOut,
  forgotPassword,
  verifyForgotPassword,
  resetPassword,

  overview,
  getStore,
  checkAuth,
} = require('../controllers/stores.controller');
const authentication = require('../authentication/authentication');

const storeRoute = express.Router();

storeRoute.post('/signup', signUp);
storeRoute.post('/verify-signup', verifySignup);
storeRoute.post('/signin', signIn);
storeRoute.post('/signout', authentication, signOut);

storeRoute.post('/forgot-password', forgotPassword);
storeRoute.post('/verify-forgot-password', verifyForgotPassword);
storeRoute.post('/reset-password', resetPassword);

// Check authentication

storeRoute.get('/check-auth', authentication, checkAuth);

storeRoute.get('/', authentication, getStore);
storeRoute.get('/overview', authentication, overview);

storeRoute.patch('/update-profile', authentication, updateStoreById);
storeRoute.patch('/update-password', authentication, updateStorePasswordById);
storeRoute.patch('/update-settings', authentication, updateStoreSettingsById);
storeRoute.delete('/delete-account', authentication, deleteStore);

module.exports = storeRoute;
