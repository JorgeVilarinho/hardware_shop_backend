import type { User } from "../models/user.js";
import { pool } from "./../db.js";
import type { Client } from "../models/client.js";
import type { Address } from "../models/address.js";

export const getUserByEmailRepository = async (email: string): Promise<User | undefined> => {
  const query = {
    name: 'get-user-by-email',
    text: 'SELECT * FROM usuario WHERE email = $1;',
    values: [ email ]
  };

  const res = await pool.query(query);
  
  if(res.rowCount! > 0) {
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
  
  if(res.rowCount! > 0) {
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
  
  if(res.rowCount! > 0) {
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

export const getUserTypeRepository = async (id: number) => {
  let queryCommand = `
    SELECT *
    FROM cliente 
    WHERE user_id = $1;
  `;

  let query = {
    name: 'get-client-by-user-id',
    text: queryCommand,
    values: [ id ]
  };

  let res = await pool.query(query);
  
  if(res.rowCount! > 0) return 'client';

  queryCommand = `
    SELECT *
    FROM trabajador 
    WHERE user_id = $1;
  `;

  query = {
    name: 'get-employee-by-user-id',
    text: queryCommand,
    values: [ id ]
  };

  res = await pool.query(query);

  if(res.rowCount! > 0) return 'employee';

  return undefined;
}

export const getClientByIdRepository = async (id: number): Promise<Client | undefined> => {
  const queryCommand = `
    SELECT u.name, u.email, u.password, u.dni, u.phone, 
    d.id, d.nombre, d.direccion, d.cod_postal, d.provincia, 
    d.ciudad, d.telefono
    FROM usuario u 
    INNER JOIN cliente c ON u.id = c.user_id
    INNER JOIN direccion d ON d.client_id = c.id
    WHERE u.id = $1;
  `;

  const query = {
    name: 'get-client-by-id',
    text: queryCommand,
    values: [ id ]
  };

  const res = await pool.query(query);
  
  if(res.rowCount! > 0) {
    let address: Address | undefined = undefined

    if(res.rows[0].nombre != null) {
      address = {
        id: res.rows[0].id,
        name: res.rows[0].nombre,
        address: res.rows[0].direccion,
        city: res.rows[0].ciudad,
        province: res.rows[0].provincia,
        cp: res.rows[0].cod_postal,
        phone: res.rows[0].telefono
      } 
    }

    const client: Client = {
      id: id,
      name: res.rows[0].name,
      email: res.rows[0].email,
      password: res.rows[0].password,
      dni: res.rows[0].dni,
      phone: res.rows[0].phone,
      address
    }

    return client;
  } 

  return undefined;
}

export const createClientRepository = async (name: string, email: string, password: string) => {
  const dbClient = await pool.connect();

  try {
    await dbClient.query('BEGIN')

    let query = {
      name: 'create-user',
      text: 'INSERT INTO usuario (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      values: [ name, email, password ]
    };
  
    let res = await dbClient.query(query);
  
    query = {
      name: 'create-client',
      text: 'INSERT INTO cliente (user_id) VALUES ($1);',
      values: [ res.rows[0].id ]
    };
  
    await dbClient.query(query);
    await dbClient.query('COMMIT')
  } catch (error) {
    await dbClient.query('ROLLBACK')
    console.log(error)
    throw error
  } finally {
    dbClient.release()
  }
}

export const updateUserDataRepository = async (id: number, name: string, dni: string, email: string, phone: string) => {
  const query = {
    name: 'update-user-data',
    text: 'UPDATE usuario SET name = $1, dni = $2, email = $3, phone = $4 WHERE id = $5; ',
    values: [ name, dni, email, phone, id ]
  };

  const res = await pool.query(query)
  return res.rowCount! > 0;
}

export const updateUserPasswordRepository = async (id: number, password: string) => {
  const query = {
    name: 'update-user-password',
    text: 'UPDATE usuario SET password = $1 WHERE id = $2; ',
    values: [ password, id ]
  };

  const res = await pool.query(query)
  return res.rowCount! > 0;
}

export const addAddressToClientRepository = async (name: string, address: string, cp: number, 
  province: string, city: string, phone: string, client_id: number) => {
  const query = {
    name: 'create-address',
    text: 'INSERT INTO direccion (nombre, direccion, cod_postal, provincia, ciudad, telefono, client_id) VALUES ($1, $2, $3, $4, $5, $6, $7);',
    values: [ name, address, cp, province, city, phone, client_id ]
  };

  const res = await pool.query(query);
  return res.rowCount! > 0;
}