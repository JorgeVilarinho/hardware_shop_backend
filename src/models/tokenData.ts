import type { UserType } from "./types/userType.js";

export interface TokenData {
  id: number,
  email: string,
  userType: UserType
}