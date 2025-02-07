import type { ShippingMethodValue } from "./types/shippingMethodValue.js";

export interface ShippingMethod {
  id: number,
  valor: ShippingMethodValue,
  descripcion: string,
  coste: number
}