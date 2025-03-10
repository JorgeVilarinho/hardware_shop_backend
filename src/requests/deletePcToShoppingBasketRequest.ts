import type { AuthenticatedUser } from "../models/authenticatedUser.js"

export interface DeletePcToShoppingBasketRequest extends Express.Request {
  body: {
    authenticatedUser: AuthenticatedUser,
    pcId: string
  }
}