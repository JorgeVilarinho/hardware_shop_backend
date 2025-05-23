import express, { Router } from 'express';
import authentication from './authentication.js';
import users from './users.js';
import products from './products.js';
import shopping_basket from './shopping_basket.js';
import categories from './categories.js';
import brands from './brands.js';
import checkout from './checkout.js';
import orders from './orders.js';
import employees from './employees.js';
import images from './images.js';
import pc from './pc.js';

const router = Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  products(router);
  pc(router);
  shopping_basket(router);
  categories(router);
  brands(router);
  checkout(router);
  orders(router)
  employees(router)
  images(router)
  
  return router;
}