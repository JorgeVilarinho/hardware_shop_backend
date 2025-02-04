import type { Address } from "./address.js";
import type { User } from "./user.js";

export interface Client extends User {
  address?: Address
}