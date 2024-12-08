import express, { Router } from 'express';
import authentication from './authentication';
import users from './users';

const router = Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  
  return router;
}