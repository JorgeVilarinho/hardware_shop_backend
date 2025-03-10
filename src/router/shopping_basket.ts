import express from 'express';
import { isAuthenticated } from '../middlewares/index.js';
import { upsertItemToShoppingBasket, createShoppingBasket, 
  deleteItemToShoppingBasket, deleteAllItemsToShoppingBasket, 
  insertPcProductToShoppingBasket,
  deleteAllPcProductsToShoppingBasket,
  deletePcToShoppingBasket} from '../controllers/shopping_basket.js';

export default (router: express.Router) => {
  router.post('/api/shopping-basket', isAuthenticated, createShoppingBasket);
  router.post('/api/shopping-basket/item', isAuthenticated, upsertItemToShoppingBasket);
  router.post('/api/shopping-basket/pc-product', isAuthenticated, insertPcProductToShoppingBasket);
  router.delete('/api/shopping-basket/item', isAuthenticated, deleteItemToShoppingBasket);
  router.delete('/api/shopping-basket/pc', isAuthenticated, deletePcToShoppingBasket);
  router.delete('/api/shopping-basket/items', isAuthenticated, deleteAllItemsToShoppingBasket);
  router.delete('/api/shopping-basket/pc-products', isAuthenticated, deleteAllPcProductsToShoppingBasket);
}