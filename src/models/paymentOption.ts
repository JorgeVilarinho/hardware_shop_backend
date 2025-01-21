import type { PaymentOptionValue } from "./paymentOptionValue.js";

export interface PaymentOption {
  id: number,
  valor: PaymentOptionValue,
  descripcion: string,
  imagen: string,
  informacion_adicional: string
}