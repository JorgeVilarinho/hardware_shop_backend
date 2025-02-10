import type { Employee } from "../models/employee.js"

export interface getEmployeeByIdRequest extends Express.Request {
  body: {
    employee: Employee
  }
}