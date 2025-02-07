import type { OrderStatusValue } from "./types/orderStatusValue.model.js";

export interface OrderStatus {
  id: number,
  valor: OrderStatusValue,
  descripcion: string
}