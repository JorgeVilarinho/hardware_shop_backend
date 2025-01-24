import type { OrderStatusValue } from "./orderStatusValue.model.js";

export interface ActiveOrder {
  id: number,
  id_cliente: number,
  id_trabajador: number,
  id_metodo_envio: number,
  id_opcion_envio: number,
  fecha_creacion: string,
  total: number,
  id_direccion: number,
  estado_pedido_valor: OrderStatusValue,
  estado_pedido_desc: string,
  imagen?: string
}