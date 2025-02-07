import type { ShippingOptionValue } from "./types/shippingOptionValue.js";

export interface ShippingOption {
  id: number,
  valor: ShippingOptionValue,
  descripcion: string,
  coste: number,
  imagen: string
}