import express from 'express';
import { getBrandsByCategory } from '../controllers/brands.js';

export default (router: express.Router) => {
  router.get('/api/brands/:categoryId', getBrandsByCategory);
}