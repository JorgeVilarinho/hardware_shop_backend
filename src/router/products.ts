import express from 'express';
import { getProducts, getAvailableStock, getMaxProductPrice, getProductById, updateProductById, addProduct, deleteProduct } from '../controllers/products.js';
import { isAdmin, isAuthenticated } from '../middlewares/index.js';

export default (router: express.Router) => {
  router.get('/api/products', getProducts);
  router.post('/api/products/product', isAuthenticated, isAdmin, addProduct);
  router.delete('/api/products/product/:id', isAuthenticated, isAdmin, deleteProduct);
  router.get('/api/products/maxPrice', getMaxProductPrice);
  router.get('/api/products/:id', getProductById);
  router.put('/api/products/:id', isAuthenticated, isAdmin, updateProductById);
  router.get('/api/products/:id/stock', getAvailableStock);
}