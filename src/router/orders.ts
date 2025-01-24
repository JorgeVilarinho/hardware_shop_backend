import express from 'express'
import { isAuthenticated } from '../middlewares/index.js'
import { getActiveOrders, getProductsFromOrder } from '../controllers/orders.js'

export default (router: express.Router) => {
  router.get('/api/orders/activeOrders', isAuthenticated, getActiveOrders)
  router.get('/api/orders/:orderId/products', isAuthenticated, getProductsFromOrder)
}