import type { EmployeeTypeValue } from "../types/employeeTypevalue.js";
import type { User } from "../user.js";

export interface EmployeeResponse extends User {
  admin: boolean,
  tipo_trabajador: EmployeeTypeValue,
  tipo_trabajador_desc: string
}