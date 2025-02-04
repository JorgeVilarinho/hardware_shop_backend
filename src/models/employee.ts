import type { User } from "./user.js";

export interface Employee extends User {
  tipo_trabajador: string,
  admin: boolean
}