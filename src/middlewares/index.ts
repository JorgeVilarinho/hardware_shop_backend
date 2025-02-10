import { JWT_SECRET } from '../config.js';
import express from 'express'
import jwt from 'jsonwebtoken'
import type { AuthenticatedUser } from '../models/authenticatedUser.js';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const access_token = req.cookies.access_token;

    if(!access_token) {
      res.status(403).json({ message: 'No se puede realizar esta acción' })
      return
    }

    const data = jwt.verify(access_token, JWT_SECRET);

    req.body.authenticatedUser = data
    next()
  } catch(error) {
    res.status(500).end()
  }
}

export const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const authenticatedUser = req.body.authenticatedUser as AuthenticatedUser;

    if(!authenticatedUser.admin) {
      res.status(403).json({ message: 'No se puede realizar esta acción' })
      return
    }

    next()
  } catch(error) {
    res.status(500).end()
  }
}

export const isAdminOrOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const authenticatedUser = req.body.authenticatedUser as AuthenticatedUser;

    let isOwner = authenticatedUser.id == req.body.userId

    if(!authenticatedUser.admin && !isOwner) {
      res.status(403).json({ message: 'No se puede realizar esta acción' })
      return
    }

    next()
  } catch(error) {
    res.status(500).end()
  }
}