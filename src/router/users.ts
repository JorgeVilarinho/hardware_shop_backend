import express from 'express'
import { isAuthenticated } from '../middlewares/index.js';
import { addAddress, deleteAddress, getAddresses, getUserByDni, getUserByEmail, updateUserData, updateUserPassword } from '../controllers/users.js'

export default (router: express.Router) => {
  router.get('/api/users/addresses', isAuthenticated, getAddresses);
  router.get('/api/users/:email', isAuthenticated, getUserByEmail);
  router.get('/api/users/:dni', isAuthenticated, getUserByDni);
  router.put('/api/users/data', isAuthenticated, updateUserData);
  router.put('/api/users/password', isAuthenticated, updateUserPassword);
  router.post('/api/users/address', isAuthenticated, addAddress);
  router.delete('/api/users/address/:id', isAuthenticated, deleteAddress);
}