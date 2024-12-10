import { isAuthenticated, login, logout, register } from '../controllers/authentication.js';
import express from 'express';

export default (router: express.Router) => {
  router.post('/api/auth/register', register);
  router.post('/api/auth/login', login);
  router.post('/api/auth/logout', logout);
  router.get('/api/auth/isAuthenticated', isAuthenticated);
}