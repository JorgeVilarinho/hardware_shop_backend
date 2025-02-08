import type { AuthenticatedUser } from "../models/authenticatedUser.js";
import type { EmployeeTypeValue } from "../models/types/employeeTypeValue.js";

export interface CreateEmployeeRequest extends Express.Request {
  body: {
    fullName: string,
    dni: string,
    email: string,
    phone: string,
    password: string,
    admin: boolean,
    employeeType: EmployeeTypeValue,
    authenticatedUser: AuthenticatedUser
  }
}