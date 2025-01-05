import express from 'express';
import { isAuthenticated } from '../middlewares/index.js';
import { upsertItemToShoppingBasket, createShoppingBasket, 
  deleteItemToShoppingBasket, deleteAllItemsToShoppingBasket } from '../controllers/shopping_basket.js';

export default (router: express.Router) => {
  router.post('/api/shopping-basket', isAuthenticated, createShoppingBasket);
  router.post('/api/shopping-basket/item', isAuthenticated, upsertItemToShoppingBasket);
  router.delete('/api/shopping-basket/item', isAuthenticated, deleteItemToShoppingBasket);
  router.delete('/api/shopping-basket/items', isAuthenticated, deleteAllItemsToShoppingBasket);
}