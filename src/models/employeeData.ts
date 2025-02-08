import type { EmployeeTypeValue } from "./types/employeeTypeValue.js";

export interface EmployeeData {
  admin: boolean,
  tipo_trabajador: EmployeeTypeValue,
  tipo_trabajador_desc: string
}