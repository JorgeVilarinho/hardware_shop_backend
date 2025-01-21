import type { ShippingOptionValue } from "./shippingOptionValue.js";

export interface ShippingOption {
  id: number,
  valor: ShippingOptionValue,
  descripcion: string,
  coste: number,
  imagen: string
}