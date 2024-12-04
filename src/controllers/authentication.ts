import { createUser, getUser } from '../db/users';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, SALT_ROUNDS } from '../config';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, password } = req.body

    if(!name || !email || !password) {
      res.status(400).json({ message: 'Error con los datos' });
      return;
    }

    const user = await getUser(email);

    if(user) {
      res.status(400).json({ message: 'Ya existe una cuenta con ese email' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await createUser(name, email, hashedPassword);
    res.status(200).end();
  } catch(error) {
    console.log(error);
    res.status(500).end();
  }
}

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body

    if(!email || !password) {
      res.status(400).json({ message: 'Error con los datos' });
      return;
    }

    const user = await getUser(email);

    if(!user) {
      res.status(401).json({ message: 'Inicio de sesión incorrecto' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if(!isValid) {
      res.status(401).json({ message: 'Inicio de sesión incorrecto' });
      return;
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
    .status(200)
    .json({ message: 'Inicio de sesión correcto' });
  } catch(error) {
    res.status(500).end();
  }
}

export const logout = (req: express.Request, res: express.Response) => {
  res.clearCookie('access_token')
  .status(200)
  .json({ message: 'Se ha cerrado la sesión correctamente' });
}