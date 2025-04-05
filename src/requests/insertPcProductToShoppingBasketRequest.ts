import type { AuthenticatedUser } from "../models/authenticatedUser.js"
import type { Pc } from "../models/pc.js"

export interface InsertPcProductToShoppingBasketRequest extends Express.Request {
  body: {
    authenticatedUser: AuthenticatedUser,
    pcProduct: Pc
  }
}