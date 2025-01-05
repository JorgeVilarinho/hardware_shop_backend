import express, { Router } from 'express';
import authentication from './authentication.js';
import users from './users.js';
import products from './products.js';
import shopping_basket from './shopping_basket.js';

const router = Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  products(router);
  shopping_basket(router);
  
  return router;
}