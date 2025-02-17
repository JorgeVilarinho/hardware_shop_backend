import type { QueryConfig } from "pg"
import { pool } from "../db.js"
import type { EmployeeType } from "../models/employeeType.js"
import type { Employee } from "../models/employee.js"

export const getEmployeesRepository = async () => {
  let query: QueryConfig = {
    name: 'get-all-employees',
    text: `SELECT u.id AS user_id, 'employee' AS kind, u.name, u.email, u.dni, u.phone, 
          t.id, t.admin, tt.valor AS tipo_trabajador, tt.descripcion AS tipo_trabajador_desc
          FROM trabajador t
          JOIN usuario u ON t.user_id = u.id
          JOIN tipo_trabajador tt ON t.tipo_trabajador = tt.id`
  }

  let res = await pool.query<Employee>(query)

  return res.rows
}

export const getEmployeeByIdRepository = async (employeeId: number) => {
  let query: QueryConfig = {
    name: 'get-employees-by-id',
    text: `SELECT u.id AS user_id, 'employee' AS kind, u.name, u.email, u.dni, u.phone, u.password, 
          t.id, t.admin, tt.valor AS tipo_trabajador, tt.descripcion AS tipo_trabajador_desc
          FROM trabajador t
          JOIN usuario u ON t.user_id = u.id
          JOIN tipo_trabajador tt ON t.tipo_trabajador = tt.id
          WHERE t.id = $1`,
    values: [ employeeId ]
  }

  let res = await pool.query<Employee>(query)

  return res.rows[0]
}

export const deleteEmployeeRepository = async (user_id: string) => {
  const dbClient = await pool.connect();

  try {
    await dbClient.query('BEGIN')

    let query: QueryConfig = {
      name: 'delete-employee-by-user-id',
      text: 'DELETE FROM trabajador WHERE user_id = $1',
      values: [ user_id ]
    }
  
    let res = await dbClient.query(query)
  
    query = {
      name: 'delete-user-by-id',
      text: 'DELETE FROM usuario WHERE id = $1',
      values: [ user_id ]
    }

    res = await dbClient.query(query)

    await dbClient.query('COMMIT')
  } catch (error) {
    await dbClient.query('ROLLBACK')
    throw error
  } finally {
    dbClient.release()
  }
}

export const getEmployeeTypesRepository = async () => {
  let query: QueryConfig = {
    name: 'get-all-employee-types',
    text: `SELECT * FROM tipo_trabajador`
  }

  let res = await pool.query<EmployeeType>(query)

  return res.rows
}

export const createEmployeeRepository = async (
  fullName: string,
  dni: string,
  email: string,
  phone: string,
  hashedPassword: string,
  admin: boolean,
  employeeType: string
) => {
  const dbClient = await pool.connect();

  try {
    await dbClient.query('BEGIN')

    let query = {
      name: 'create-user',
      text: `INSERT INTO usuario (name, email, password, dni, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      values: [ fullName, email, hashedPassword, dni, phone ]
    };
  
    let res = await dbClient.query(query);

    query = {
      name: 'get-employee-type',
      text: `SELECT * FROM tipo_trabajador WHERE valor = $1`,
      values: [ employeeType ]
    }

    let res1 = await dbClient.query<EmployeeType>(query)
  
    query = {
      name: 'create-employee',
      text: 'INSERT INTO trabajador (user_id, admin, tipo_trabajador) VALUES ($1, $2, $3) RETURNING id',
      values: [ res.rows[0].id, admin, res1.rows[0]?.id ]
    };

    await dbClient.query(query)

    await dbClient.query('COMMIT')
  } catch (error) {
    await dbClient.query('ROLLBACK')
    throw error
  } finally {
    dbClient.release()
  }
}

export const updateEmployeeByIdRepository = async (
  employeeId: string,
  userId: string,
  fullName: string,
  dni: string,
  email: string,
  phone: string,
  hashedPassword: string | undefined,
  admin: boolean,
  employeeType: string
) => {
  const dbClient = await pool.connect();

  try {
    await dbClient.query('BEGIN')

    let query: QueryConfig

    if(hashedPassword) {
      query = {
        name: 'update-user-with-password-by-id',
        text: `UPDATE usuario SET name = $1, dni = $2, email = $3, phone = $4, password = $5 WHERE id = $6`,
        values: [ fullName, dni, email, phone, hashedPassword, userId ]
      };
    } else {
      query = {
        name: 'update-user-without-password-by-id',
        text: `UPDATE usuario SET name = $1, dni = $2, email = $3, phone = $4 WHERE id = $5`,
        values: [ fullName, dni, email, phone, userId ]
      };
    }  
  
    await dbClient.query(query);

    query = {
      name: 'get-employee-type',
      text: `SELECT * FROM tipo_trabajador WHERE valor = $1`,
      values: [ employeeType ]
    }

    let res = await dbClient.query<EmployeeType>(query)

    query = {
      name: 'update-employee-by-id',
      text: `UPDATE trabajador SET admin = $1, tipo_trabajador = $2 WHERE id = $3`,
      values: [ admin as unknown as string, res.rows[0]?.id as unknown as string, employeeId ]
    }

    await dbClient.query(query)

    await dbClient.query('COMMIT')
  } catch (error) {
    await dbClient.query('ROLLBACK')
    throw error
  } finally {
    dbClient.release()
  }
}

export const getEmployeesOrderedByLessAssignedOrdersRepository = async () => {
  let query: QueryConfig = {
    name: 'get-employees-ordered-by-less-assigned-orders',
    text: `SELECT u.id AS user_id, 'employee' AS kind, u.name, u.email, u.dni, u.phone, 
          t.id, t.admin, tt.valor AS tipo_trabajador, tt.descripcion AS tipo_trabajador_desc
          FROM (SELECT t.user_id, t.id, t.admin, t.tipo_trabajador, count(p.id_trabajador)
          FROM trabajador t
          LEFT JOIN pedido p ON p.id_trabajador = t.id
          GROUP BY t.id
          ORDER BY count) AS t
          JOIN usuario u ON t.user_id = u.id
          JOIN tipo_trabajador tt ON t.tipo_trabajador = tt.id
          ORDER BY t.count, u.name`
  }

  let res = await pool.query<Employee>(query)

  return res.rows
}

export const assignEmployeeToOrderRepository = async (orderId: number, employeeId: number) => {
  let query: QueryConfig = {
    name: 'assign-employee-to-order',
    text: `UPDATE pedido SET id_trabajador = $1 WHERE id = $2`,
    values: [ employeeId, orderId ]
  }

  let res = await pool.query(query)

  return res.rowCount! > 0
}