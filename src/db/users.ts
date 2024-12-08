import { User } from "models/user";
import { pool } from "./../db";

export const getUserByEmailRepository = async (email: string): Promise<User | undefined> => {
  const query = {
    name: 'get-user-by-email',
    text: 'SELECT * FROM usuario WHERE email = $1;',
    values: [ email ]
  };

  const res = await pool.query(query);
  
  if(res.rowCount > 0) {
    const user: User = {
      id: res.rows[0].id,
      name: res.rows[0].name,
      email: res.rows[0].email,
      password: res.rows[0].password,
      dni: res.rows[0].dni,
      phone: res.rows[0].phone
    }

    return user;
  } 

  return undefined;
}

export const getUserByDniRepository = async (dni: string): Promise<User | undefined> => {
  const query = {
    name: 'get-user-by-dni',
    text: 'SELECT * FROM usuario WHERE dni = $1;',
    values: [ dni ]
  };

  const res = await pool.query(query);
  
  if(res.rowCount > 0) {
    const user: User = {
      id: res.rows[0].id,
      name: res.rows[0].name,
      email: res.rows[0].email,
      password: res.rows[0].password,
      dni: res.rows[0].dni,
      phone: res.rows[0].phone
    }

    return user;
  } 

  return undefined;
}

export const getUserByIdRepository = async (id: number): Promise<User | undefined> => {
  const query = {
    name: 'get-user-by-id',
    text: 'SELECT * FROM usuario WHERE id = $1;',
    values: [ id ]
  };

  const res = await pool.query(query);
  
  if(res.rowCount > 0) {
    const user: User = {
      id: res.rows[0].id,
      name: res.rows[0].name,
      email: res.rows[0].email,
      password: res.rows[0].password,
      dni: res.rows[0].dni,
      phone: res.rows[0].phone
    }

    return user;
  } 

  return undefined;
}

export const createUserRepository = async (name: string, email: string, password: string) => {
  const query = {
    name: 'crete-user',
    text: 'INSERT INTO usuario (name, email, password) VALUES ($1, $2, $3);',
    values: [ name, email, password ]
  };

  const res = await pool.query(query)
  return res.rowCount > 0;
}

export const updateUserDataRepository = async (id: number, name: string, dni: string, email: string, phone: string) => {
  const query = {
    name: 'update-user-data',
    text: 'UPDATE usuario SET name = $1, dni = $2, email = $3, phone = $4 WHERE id = $5; ',
    values: [ name, dni, email, phone, id ]
  };

  const res = await pool.query(query)
  return res.rowCount > 0;
}

export const updateUserPasswordRepository = async (id: number, password: string) => {
  const query = {
    name: 'update-user-password',
    text: 'UPDATE usuario SET password = $1 WHERE id = $2; ',
    values: [ password, id ]
  };

  const res = await pool.query(query)
  return res.rowCount > 0;
}