import express from 'express'
import { createPc } from '../controllers/pc.js';

export default (router: express.Router) => {
  router.post('/api/pc', createPc);
}