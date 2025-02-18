import type { EmployeeTypeValue } from "./types/employeeTypeValue.js";

export interface EmployeeData {
  id: number,
  admin: boolean,
  tipo_trabajador: EmployeeTypeValue,
  tipo_trabajador_desc: string
}