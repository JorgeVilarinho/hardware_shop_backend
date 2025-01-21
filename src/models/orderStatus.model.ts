import type { OrderStatusValue } from "./orderStatusValue.model.js";

export interface OrderStatus {
  id: number,
  valor: OrderStatusValue,
  descripcion: string
}