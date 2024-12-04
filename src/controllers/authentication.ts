import { createUser, getUser } from '../db/users';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, SALT_ROUNDS } from 'config';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, password } = req.body

    if(!name || !email || !password) {
      res.sendStatus(400);
    }

    const user = getUser(email);

    if(user) {
      res.sendStatus(400);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await createUser(name, email, hashedPassword);
    res.sendStatus(200);
  } catch(error) {
    res.sendStatus(500);
  }
}

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body

    if(!email || !password) {
      res.sendStatus(400);
    }

    const user = await getUser(email);

    if(!user) {
      res.json({ message: 'Inicio de sesión incorrecto' }).sendStatus(401);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if(!isValid) {
      res.json({ message: 'Inicio de sesión incorrecto' }).sendStatus(401);
    }

    const token = jwt.sign(
      { id: user.id, user: user.email }, 
      JWT_SECRET,
      {
        expiresIn: '1h'
      });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false, // TODO: Change this when using https
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60
    })
    .json({ message: 'Inicio de sesión correcto' })
    .sendStatus(200);
  } catch(error) {
    res.sendStatus(500);
  }
}

export const logout = (req: express.Request, res: express.Response) => {
  res.clearCookie('access_token')
  .json({ message: 'Se ha cerrado la sesión correctamente' })
  .sendStatus(200);
}