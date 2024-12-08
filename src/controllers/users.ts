import express from 'express';
import bcrypt from 'bcrypt';
import { getUserByDniRepository, getUserByEmailRepository, getUserByIdRepository, updateUserDataRepository, updateUserPasswordRepository } from '../db/users';
import { SALT_ROUNDS } from '../config';

export const getUserByEmail = async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.params;

    const user = await getUserByEmailRepository(email);

    if(!user) {
      res.status(400).json({ message: 'El usuario no existe' });
      return;
    }

    res.status(200).json({ user: {
      name: user.name,
      email: user.email
    } });
  } catch(error) {
    res.status(500).end()
  }
}

export const getUserByDni = async (req: express.Request, res: express.Response) => {
  try {
    const { dni } = req.params;

    const user = await getUserByDniRepository(dni);

    if(!user) {
      res.status(400).json({ message: 'El usuario no existe' });
      return;
    }

    res.status(200).json({ user: {
      name: user.name,
      email: user.email,
      dni: user.dni,
      phone: user.phone
    } });
  } catch(error) {
    res.status(500).end()
  }
}

export const updateUserData = async (req: express.Request, res: express.Response) => {
  try {
    const { authenticatedUser } = req.body;
    const { name, email, dni, phone } = req.body;
    let user;
    
    if(!name || !email || !dni || !phone) {
      res.status(400).json({ message: 'Error al introducir los datos.' });
      return;
    }

    const _user = await getUserByIdRepository(authenticatedUser.id);

    if(_user.email !== email) {
      user = await getUserByEmailRepository(email);

      if(user) {
        res.status(400).json({ message: 'Existe un usuario con ese email. Introduce un email distinto.' });
        return;
      }
    }

    if(_user.dni !== dni) {
      user = await getUserByDniRepository(dni);

      if(user) {
        res.status(400).json({ message: 'Existe un usuario con ese dni. Introduce un dni distinto.' });
        return;
      }
    }

    const isOk = await updateUserDataRepository(authenticatedUser.id, name, dni, email, phone);

    if(!isOk) {
      res.status(400).json({ message: 'No se ha podido actualizar los datos del usuario correctamente.' });
      return
    }

    res.status(200).json({ message: 'Se ha actualizado correctamente el usuario.' });
  } catch(error) {
    res.status(500).end()
  }
}

export const updateUserPassword = async (req: express.Request, res: express.Response) => {
  try {
    const { authenticatedUser } = req.body;
    const { password } = req.body;
    
    if(!password) {
      res.status(400).json({ message: 'Error al introducir los datos.' });
      return;
    }

    const _user = await getUserByIdRepository(authenticatedUser.id);

    const samePassword = await bcrypt.compare(password, _user.password);

    if(!samePassword) {
      const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const isOk = await updateUserPasswordRepository(authenticatedUser.id, encryptedPassword)

      if(!isOk) {
        res.status(400).json({ message: 'No se ha podido actualizar la contraseña.' });
        return;
      }

      res.status(200).json({ message: 'Se ha actualizado la contraseña correctamente.' });
      return;
    }
    
    res.status(200).json({ message: 'Se ha actualizado la contraseña correctamente.' });
  } catch(error) {
    res.status(500).end()
  }
}