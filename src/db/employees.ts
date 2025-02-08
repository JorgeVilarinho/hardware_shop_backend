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

export const getEmployeeByIdRespository = async (employee_id: number) => {
  let query: QueryConfig = {
    name: 'get-employees-by-id',
    text: `SELECT u.id AS user_id, 'employee' AS kind, u.name, u.email, u.dni, u.phone, 
          t.id, t.admin, tt.valor AS tipo_trabajador, tt.descripcion AS tipo_trabajador_desc
          FROM trabajador t
          JOIN usuario u ON t.user_id = u.id
          JOIN tipo_trabajador tt ON t.tipo_trabajador = tt.id
          WHERE t.id = $1`,
    values: [ employee_id ]
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