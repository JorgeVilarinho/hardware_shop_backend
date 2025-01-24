import type { QueryConfig } from "pg";
import { pool } from "../db.js";
import { OrderStatusValue } from "../models/orderStatusValue.model.js";
import type { ActiveOrder } from "../models/activeOrder.js";
import type { Product } from "../models/product.js";

export const getActiveOrdersRepository = async () => {
  let query: QueryConfig = {
    name: 'get-active-orders',
    text: `SELECT p.id, id_cliente, id_trabajador, id_metodo_envio, 
          id_opcion_envio, fecha_creacion, total, id_direccion, 
          ep.valor AS estado_pedido_valor, ep.descripcion AS estado_pedido_desc
          FROM pedido p
          JOIN estado_pedido ep 
          ON p.id_estado_pedido = ep.id
          WHERE ep.valor != $1`,
    values: [ OrderStatusValue.CANCELED ]
  }

  let res1 = await pool.query<ActiveOrder>(query);

  for (let i = 0; i < res1.rows.length; i++) {
    const activeOrder = res1.rows[i];
    
    query = {
      name: 'get-first-product-image',
      text: `SELECT image_name AS imagen
            FROM pedido_producto pp
            JOIN pedido p 
            ON pp.id_pedido = p.id
            JOIN producto pro
            ON pp.id_producto = pro.id
            WHERE p.id = $1
            LIMIT 1`,
      values: [ activeOrder?.id ]
    }

    let res2 = await pool.query<any>(query)
    activeOrder!.imagen = res2.rows[0]?.imagen
  }

  return res1.rows;
}

export const getProductsFromOrderRepository = async (orderId: string) => {
  const query: QueryConfig = {
    name: 'get-products-from-order',
    text: `SELECT p.id, m.nombre AS brand, c.nombre AS category, 
          p.nombre AS name, p.descripcion AS description, p.descuento AS discount, 
          p.unidades AS units, p.precio AS price, p.image_name AS image
          FROM producto p
          JOIN pedido_producto pp
          ON p.id = pp.id_producto
          JOIN marca m
          ON p.id_marca = m.id
          JOIN categoria c
          ON p.id_categoria = c.id
          WHERE pp.id_pedido = $1;`,
    values: [ orderId ]
  }

  const res = await pool.query<Product>(query);

  return res.rows
}