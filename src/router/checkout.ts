import express from 'express'
import { getPaymentOptions, getShippingMethods, getShippingOptions, processCheckout } from '../controllers/checkout.js'
import { isAuthenticated } from '../middlewares/index.js';

export default (router: express.Router) => {
  router.post('/api/checkout', isAuthenticated, processCheckout);
  router.get('/api/checkout/shipping-methods', isAuthenticated, getShippingMethods);
  router.get('/api/checkout/shipping-options', isAuthenticated, getShippingOptions);
  router.get('/api/checkout/payment-options', isAuthenticated, getPaymentOptions);
}