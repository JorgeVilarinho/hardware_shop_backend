import type { Address } from "../models/address.js";
import type { AuthenticatedUser } from "../models/authenticatedUser.js";
import type { PaymentOption } from "../models/paymentOption.js";
import type { Pc } from "../models/pc.js";
import type { Product } from "../models/product.js";
import type { ShippingMethod } from "../models/shippingMethod.js";
import type { ShippingOption } from "../models/shippingOption.js";

export interface ProcessCheckoutRequest extends Express.Request {
  body: {
    products: Product[],
    pcs: Pc[],
    shippingMethod: ShippingMethod,
    shippingOption?: ShippingOption,
    paymentOption: PaymentOption,
    total: number,
    address?: Address
    authenticatedUser: AuthenticatedUser
  }
}