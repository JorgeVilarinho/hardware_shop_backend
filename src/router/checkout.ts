import express from 'express'
import { processCheckout } from '../controllers/checkout.js'

export default (router: express.Router) => {
  router.post('/api/checkout', processCheckout);
}