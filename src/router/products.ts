import express from 'express';
import { getAllProducts } from '../controllers/products.js';

export default (router: express.Router) => {
  router.get('/api/products', getAllProducts);
}