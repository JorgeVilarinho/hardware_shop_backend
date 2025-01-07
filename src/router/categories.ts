import express from 'express';
import { getCategories } from '../controllers/categories.js';

export default (router: express.Router) => {
  router.get('/api/categories', getCategories);
}