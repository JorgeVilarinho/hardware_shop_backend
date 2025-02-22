import express from 'express';
import { getBrandByValue, getBrands, getBrandsByCategory } from '../controllers/brands.js';

export default (router: express.Router) => {
  router.get('/api/brands', getBrands);
  router.get('/api/brands/:brandValue', getBrandByValue);
  router.get('/api/brands/:categoryId', getBrandsByCategory);
}