import type { User } from "../models/user.js";
import { pool } from "./../db.js";
import type { Client } from "../models/client.js";
import type { Address } from "../models/address.js";
import { UserType } from "../models/types/userType.js";
import type { QueryConfig } from "pg";
import type { Employee } from "../models/employee.js";
import type { EmployeeData } from "../models/employeeData.js";

export const getUserByEmailRepository = async (email: string): Promise<User | undefined> => {
  const query = {
    name: 'get-user-by-email',
    text: 'SELECT * FROM usuario WHERE email = $1;',
    values: [ email ]
  };

  const res = await pool.query(query);
  
  if(res.rowCount! > 0) {
    const user: User = {
      user_id: res.rows[0].id,
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
      user_id: res.rows[0].id,
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
      user_id: res.rows[0].id,
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

export const getUserTypeRepository = async (user_id: number) => {
  let queryCommand = `
    SELECT *
    FROM cliente 
    WHERE user_id = $1;
  `;

  let query = {
    name: 'get-client-by-user-id',
    text: queryCommand,
    values: [ user_id ]
  };

  let res = await pool.query(query);
  
  if(res.rowCount! > 0) return UserType.CLIENT;

  queryCommand = `
    SELECT *
    FROM trabajador 
    WHERE user_id = $1;
  `;

  query = {
    name: 'get-employee-by-user-id',
    text: queryCommand,
    values: [ user_id ]
  };

  res = await pool.query(query);

  if(res.rowCount! > 0) return UserType.EMPLOYEE;

  return undefined;
}

export const getEmployeeDataRepository = async (user_id: number) => {
  let query = {
    name: 'get-employee-data',
    text: `SELECT admin, tt.valor AS tipo_trabajador, 
          tt.descripcion tipo_trabajador_desc
          FROM trabajador t
          JOIN tipo_trabajador tt ON t.tipo_trabajador = tt.id
          WHERE user_id = $1`,
    values: [ user_id ]
  };

  let res = await pool.query<EmployeeData>(query);
  
  if(res.rowCount! > 0) return res.rows[0]
}

export const getClientByIdRepository = async (user_id: number) => {
  const queryCommand = `
    SELECT u.id AS user_id, c.id, u.name, u.email, u.password, u.dni, u.phone
    FROM usuario AS u 
    JOIN cliente AS c ON c.user_id = u.id
    WHERE u.id = $1;
  `;

  const query: QueryConfig = {
    name: 'get-client-by-id',
    text: queryCommand,
    values: [ user_id ]
  };

  const res = await pool.query<Client>(query)
  
  if(res.rowCount! > 0) return res.rows[0]

  return undefined
}

export const getEmployeeByIdRepository = async (user_id: number) => {
  const query: QueryConfig = {
    name: 'get-employee-by-id',
    text: `SELECT u.id AS user_id, t.id, u.name, u.email, u.password, u.dni, u.phone, t.admin, 
          tt.valor AS tipo_trabajador, tt.descripcion AS tipo_trabajador_desc  
          FROM usuario u 
          JOIN trabajador t ON t.user_id = u.id
          JOIN tipo_trabajador tt ON t.tipo_trabajador = tt.id
          WHERE u.id = $1;`,
    values: [ user_id ]
  }

  const res = await pool.query<Employee>(query)

  if(res.rowCount! > 0) return res.rows[0]

  return undefined
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
      text: 'INSERT INTO cliente (user_id) VALUES ($1) RETURNING *;',
      values: [ res.rows[0].id ]
    };

    res = await dbClient.query(query);

    query = {
      name: 'create-shopping-basket',
      text: 'INSERT INTO cesta (client_id) VALUES ($1);',
      values: [ res.rows[0].id ]
    };
  
    await dbClient.query(query);
    await dbClient.query('COMMIT')
  } catch (error) {
    await dbClient.query('ROLLBACK')
    throw error
  } finally {
    dbClient.release()
  }
}

export const updateUserDataRepository = async (user_id: number, name: string, dni: string, email: string, phone: string) => {
  const query = {
    name: 'update-user-data',
    text: 'UPDATE usuario SET name = $1, dni = $2, email = $3, phone = $4 WHERE id = $5; ',
    values: [ name, dni, email, phone, user_id ]
  };

  const res = await pool.query(query)
  return res.rowCount! > 0;
}

export const updateUserPasswordRepository = async (user_id: number, password: string) => {
  const query = {
    name: 'update-user-password',
    text: 'UPDATE usuario SET password = $1 WHERE id = $2; ',
    values: [ password, user_id ]
  };

  const res = await pool.query(query)
  return res.rowCount! > 0;
}

export const addAddressToClientRepository = async (name: string, address: string, cp: number, 
  province: string, city: string, phone: string, client_id: number): Promise<Address | undefined> => {
  const query = {
    name: 'create-address',
    text: 'INSERT INTO direccion (nombre, direccion, cod_postal, provincia, ciudad, telefono, client_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    values: [ name, address, cp, province, city, phone, client_id ]
  };

  const res = await pool.query(query);
  
  if(res.rowCount! > 0) {
    return {
      id: res.rows[0].id,
      nombre: res.rows[0].nombre,
      direccion: res.rows[0].direccion,
      cod_postal: res.rows[0].cod_postal,
      provincia: res.rows[0].provincia,
      ciudad: res.rows[0].ciudad,
      telefono: res.rows[0].telefono
    }
  }

  return undefined
}

export const getAddressesFromClientRepository = async (client_id: number) => {
  const query = {
    name: 'get-addresses-from-client',
    text: 'SELECT id, nombre, direccion, cod_postal, provincia, ciudad, telefono FROM direccion WHERE client_id = $1;',
    values: [ client_id ]
  };

  const res = await pool.query(query);
  
  return res.rows;
}

export const deleteAddressFromClientRepository = async (address_id: string) => {
  const query = {
    name: 'get-addresses-from-client-id',
    text: 'DELETE FROM direccion WHERE id = $1;',
    values: [ address_id ]
  };

  const res = await pool.query(query);

  return res.rowCount! > 0;
}