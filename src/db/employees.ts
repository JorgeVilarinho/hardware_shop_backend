import type { QueryConfig } from "pg"
import { pool } from "../db.js"
import type { EmployeeResponse } from "../models/responses/employeeResponse.js"

export const getEmployeesRepository = async () => {
  let query: QueryConfig = {
    name: 'get-all-employees',
    text: `SELECT u.name, u.email, u.dni, u.phone, 
          t.admin, tt.valor AS tipo_trabajador, tt.descripcion AS tipo_trabajador_desc
          FROM trabajador t
          JOIN usuario u ON t.user_id = u.id
          JOIN tipo_trabajador tt ON t.tipo_trabajador = tt.id`
  }

  let res = await pool.query<EmployeeResponse>(query)

  return res.rows
}