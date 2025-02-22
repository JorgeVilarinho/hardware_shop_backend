import express from 'express';
import { getProducts, getAvailableStock, getMaxProductPrice, getProductById } from '../controllers/products.js';

export default (router: express.Router) => {
  router.get('/api/products', getProducts);
  router.get('/api/products/:id', getProductById);
  router.get('/api/products/:id/stock', getAvailableStock);
  router.get('/api/products/maxPrice', getMaxProductPrice);
}