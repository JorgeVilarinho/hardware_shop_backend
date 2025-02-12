import express from 'express'
import { isAdmin, isAuthenticated } from '../middlewares/index.js'
import { cancelOrder, getClientActiveOrders, getClientCanceledOrders, getProductsFromOrder, getShippingOptionCost, getUnassignedOrders, processOrderPayment } from '../controllers/orders.js'

export default (router: express.Router) => {
  router.get('/api/orders/active', isAuthenticated, getClientActiveOrders)
  router.get('/api/orders/unassigned', isAuthenticated, isAdmin, getUnassignedOrders)
  router.get('/api/orders/canceled', isAuthenticated, getClientCanceledOrders)
  router.get('/api/orders/:orderId/products', isAuthenticated, getProductsFromOrder)
  router.get('/api/orders/:shippingOptionId/cost', isAuthenticated, getShippingOptionCost)
  router.post('/api/orders/:orderId/payment', isAuthenticated, processOrderPayment)
  router.put('/api/orders/:orderId/cancel', isAuthenticated, cancelOrder)
}