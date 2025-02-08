import type { EmployeeTypeValue } from "./types/employeeTypeValue.js";
import type { User } from "./user.js";

export interface Employee extends User {
  id: number
  admin: boolean
  tipo_trabajador: EmployeeTypeValue
  tipo_trabajador_desc: string
}