import { createClientRepository, getEmployeeDataRepository, getClientByIdRepository, 
  getEmployeeByIdRepository, getUserByEmailRepository, getUserTypeRepository } from '../db/users.js';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, SALT_ROUNDS } from '../config.js';
import { UserType } from '../models/types/userType.js';
import type { TokenData } from '../models/tokenData.js';
import type { User } from '../models/user.js';
import type { EmployeeData } from '../models/employeeData.js';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, password } = req.body

    if(!name || !email || !password) {
      res.status(400).json({ message: 'Error al introducir los datos.' });
      return;
    }

    const user = await getUserByEmailRepository(email);

    if(user) {
      res.status(400).json({ message: 'Ya existe una cuenta con ese email' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await createClientRepository(name, email, hashedPassword);
    res.status(200).json({ message: 'Se ha realizado el registro correctamente' });
  } catch(error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body

    let employeeData: EmployeeData | undefined

    if(!email || !password) {
      res.status(400).json({ message: 'Error al introducir los datos.' });
      return;
    }

    const user = await getUserByEmailRepository(email);

    if(!user) {
      res.status(401).json({ message: 'Inicio de sesión incorrecto' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if(!isValid) {
      res.status(401).json({ message: 'Inicio de sesión incorrecto' });
      return;
    }

    const userType = await getUserTypeRepository(user.id);

    if(!userType) {
      res.status(400).json({ message: 'Error con el tipo de usuario.' });
      return;
    }

    if(userType == UserType.EMPLOYEE) {
      employeeData = await getEmployeeDataRepository(user.id)
    }

    const token = jwt.sign(
      { id: user.id, user: user.email, userType }, 
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
    .json({
        name: user.name,
        email: user.email,
        dni: user.dni,
        phone: user.phone,
        userType,
        admin: employeeData?.admin,
        tipo_trabajador: employeeData?.tipo_trabajador
      }
    )
  } catch(error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const logout = (req: express.Request, res: express.Response) => {
  try {
    res.clearCookie('access_token')
    .status(200)
    .json({ message: 'Se ha cerrado la sesión correctamente' });
  } catch(error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const isAuthenticated = async (req: express.Request, res: express.Response) => {
  try {
    const access_token = req.cookies['access_token'];
    let user: User | undefined

    if(!access_token) {
      res.status(401).end();
      return;
    }

    const data = jwt.verify(access_token, JWT_SECRET) as TokenData

    if(data.userType == UserType.CLIENT) {
      user = await getClientByIdRepository(data.id)

      if(!user) {
        res.status(500).json({ message: 'No se devuelve correctamente el usuario' })
        return
      }

      res.status(200).json({ user })
    } else {
      user = await getEmployeeByIdRepository(data.id)

      if(!user) {
        res.status(500).json({ message: 'No se devuelve correctamente el usuario' })
        return
      }

      res.status(200).json({ user })
    }
  } catch(error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}