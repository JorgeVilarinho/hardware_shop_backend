import express from 'express';
import { getCategories, getCategoryByName, getCategoryByValue } from '../controllers/categories.js';

export default (router: express.Router) => {
  router.get('/api/categories', getCategories);
  router.get('/api/categories/:categoryName', getCategoryByName);
  router.get('/api/categories/value/:categoryValue', getCategoryByValue);
}