import type { ShippingMethodValue } from "./shippingMethodValue.js";

export interface ShippingMethod {
  id: number,
  valor: ShippingMethodValue,
  descripcion: string,
  coste: number
}