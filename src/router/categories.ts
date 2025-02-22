import express from 'express';
import { getCategories, getCategoryByValue } from '../controllers/categories.js';

export default (router: express.Router) => {
  router.get('/api/categories', getCategories);
  router.get('/api/categories/:categoryValue', getCategoryByValue);
}