import express from 'express'
import { isAuthenticated } from '../middlewares';
import { getUserByDni, getUserByEmail, updateUserData, updateUserPassword } from '../controllers/users'

export default (router: express.Router) => {
  router.get('/api/users/:email', isAuthenticated, getUserByEmail);
  router.get('/api/users/:dni', isAuthenticated, getUserByDni);
  router.put('/api/users/data', isAuthenticated, updateUserData);
  router.put('/api/users/password', isAuthenticated, updateUserPassword);
}