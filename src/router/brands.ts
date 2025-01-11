import express from 'express';
import { getBrands, getBrandsByCategory } from '../controllers/brands.js';

export default (router: express.Router) => {
  router.get('/api/brands', getBrands);
  router.get('/api/brands/:categoryId', getBrandsByCategory);
}