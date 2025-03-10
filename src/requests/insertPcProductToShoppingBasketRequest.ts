import type { AuthenticatedUser } from "../models/authenticatedUser.js"
import type { PcProduct } from "../models/pcProduct.js"

export interface InsertPcProductToShoppingBasketRequest extends Express.Request {
  body: {
    authenticatedUser: AuthenticatedUser,
    pcProduct: PcProduct
  }
}