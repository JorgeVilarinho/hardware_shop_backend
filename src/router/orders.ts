import express from 'express'
import { isAuthenticated } from '../middlewares/index.js'
import { cancelOrder, getActiveOrders, getCanceledOrders, getProductsFromOrder, getShippingOptionCost, processOrderPayment } from '../controllers/orders.js'

export default (router: express.Router) => {
  router.get('/api/orders/active', isAuthenticated, getActiveOrders)
  router.get('/api/orders/canceled', isAuthenticated, getCanceledOrders)
  router.get('/api/orders/:orderId/products', isAuthenticated, getProductsFromOrder)
  router.get('/api/orders/:shippingOptionId/cost', isAuthenticated, getShippingOptionCost)
  router.post('/api/orders/:orderId/payment', isAuthenticated, processOrderPayment)
  router.put('/api/orders/:orderId/cancel', isAuthenticated, cancelOrder)
}