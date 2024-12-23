import express, { Router } from 'express';
import authentication from './authentication.js';
import users from './users.js';
import products from './products.js';

const router = Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  products(router);
  
  return router;
}