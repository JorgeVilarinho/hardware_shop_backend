import express from 'express'
import { isAuthenticated } from '../middlewares/index.js';
import { addAddress, deleteAddress, getAddresses, getUserData, 
  updateUserData, updateUserPassword } from '../controllers/users.js'

export default (router: express.Router) => {
  router.get('/api/users/addresses', isAuthenticated, getAddresses);
  router.route('/api/users/data')
    .get(isAuthenticated, getUserData)
    .put(isAuthenticated, updateUserData)
  router.put('/api/users/password', isAuthenticated, updateUserPassword);
  router.post('/api/users/address', isAuthenticated, addAddress);
  router.delete('/api/users/address/:id', isAuthenticated, deleteAddress);
}