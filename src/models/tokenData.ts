import type { UserType } from "./userType.js";

export interface TokenData {
  id: number,
  email: string,
  userType: UserType
}