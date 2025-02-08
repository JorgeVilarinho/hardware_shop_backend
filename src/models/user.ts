import type { UserType } from "./types/userType.js";

export interface User {
  user_id: number,
  kind?: UserType
  name: string,
  email: string, 
  password: string,
  dni?: string,
  phone?: string,
}