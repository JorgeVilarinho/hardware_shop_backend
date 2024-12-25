import express from 'express';
import { getAllProducts, getAvailableStock } from '../controllers/products.js';

export default (router: express.Router) => {
  router.get('/api/products', getAllProducts);
  router.get('/api/products/:id/stock', getAvailableStock);
}