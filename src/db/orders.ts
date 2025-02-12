import type { QueryConfig } from "pg";
import { pool } from "../db.js";
import { OrderStatusValue } from "../models/types/orderStatusValue.model.js";
import type { Order } from "../models/order.js";
import type { Product } from "../models/product.js";
import type { ShippingOption } from "../models/shippingOption.js";
import type { OrderStatus } from "../models/orderStatus.model.js";
import { ShippingMethodValue } from "../models/types/shippingMethodValue.js";
import type { ShippingMethod } from "../models/shippingMethod.js";

export const getClientActiveOrdersRepository = async (clientId: number) => {
  let query: QueryConfig = {
    name: 'get-client-active-orders',
    text: `SELECT p.id, id_cliente, id_trabajador, id_metodo_envio, 
          id_opcion_envio, fecha_creacion, total, id_direccion, 
          ep.valor AS estado_pedido_valor, ep.descripcion AS estado_pedido_desc
          FROM pedido p
          JOIN estado_pedido ep 
          ON p.id_estado_pedido = ep.id
          WHERE ep.valor != $1
          AND p.id_cliente = $2`,
    values: [ OrderStatusValue.CANCELED, clientId ]
  }

  let res1 = await pool.query<Order>(query);

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

export const getClientCanceledOrdersRepository = async (clientId: number) => {
  let query: QueryConfig = {
    name: 'get-canceled-orders',
    text: `SELECT p.id, id_cliente, id_trabajador, id_metodo_envio, 
          id_opcion_envio, fecha_creacion, total, id_direccion, 
          ep.valor AS estado_pedido_valor, ep.descripcion AS estado_pedido_desc
          FROM pedido p
          JOIN estado_pedido ep 
          ON p.id_estado_pedido = ep.id
          WHERE ep.valor = $1
          AND p.id_cliente = $2`,
    values: [ OrderStatusValue.CANCELED, clientId ]
  }

  let res1 = await pool.query<Order>(query);

  for (let i = 0; i < res1.rows.length; i++) {
    const canceledOrder = res1.rows[i];
    
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
      values: [ canceledOrder?.id ]
    }

    let res2 = await pool.query<any>(query)
    canceledOrder!.imagen = res2.rows[0]?.imagen
  }

  return res1.rows;
}

export const getOrderStatusByValueRepository = async (orderStatusValue: OrderStatusValue) => {
  let query: QueryConfig = {
    name: 'get-orders-status-by-value',
    text: `SELECT * 
          FROM estado_pedido ep
          WHERE ep.valor = $1`,
    values: [ orderStatusValue ]
  }

  let res = await pool.query<OrderStatus>(query);

  return res.rows[0]
}

export const getShippingMethodByValueRepository = async (shippingMethodValue: ShippingMethodValue) => {
  let query: QueryConfig = {
    name: 'get-shipping-method-by-value',
    text: `SELECT * 
          FROM metodo_envio 
          WHERE valor = $1`,
    values: [ shippingMethodValue ]
  }

  let res = await pool.query<ShippingMethod>(query);

  return res.rows[0]
}

export const getUnassignedOrdersRepository = async () => {
  const orderStatus = await getOrderStatusByValueRepository(OrderStatusValue.PAID)

  const shippingMethod = await getShippingMethodByValueRepository(ShippingMethodValue.HOME_DELIVERY)

  let query: QueryConfig = {
    name: 'get-unassigned-orders',
    text: `SELECT p.id, id_cliente, id_trabajador, id_metodo_envio, 
          id_opcion_envio, fecha_creacion, total, id_direccion, 
          ep.valor AS estado_pedido_valor, ep.descripcion AS estado_pedido_desc
          FROM pedido p
          JOIN estado_pedido ep 
          ON p.id_estado_pedido = ep.id
          WHERE ep.id = $1
          AND id_metodo_envio = $2
          AND id_trabajador IS NULL
          ORDER BY fecha_creacion`,
    values: [ orderStatus?.id, shippingMethod?.id ]
  }

  let res = await pool.query<Order>(query);

  for (let i = 0; i < res.rows.length; i++) {
    const unassignedOrder = res.rows[i];
    
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
      values: [ unassignedOrder?.id ]
    }

    let res1 = await pool.query<any>(query)
    unassignedOrder!.imagen = res1.rows[0]?.imagen
  }

  return res.rows
}

export const getOrderFromRepository = async (orderId: string) => {
  let query: QueryConfig = {
    name: 'get-order-by-id',
    text: `SELECT p.id, id_cliente, id_trabajador, id_metodo_envio, 
          id_opcion_envio, fecha_creacion, total, id_direccion, 
          ep.valor AS estado_pedido_valor, ep.descripcion AS estado_pedido_desc
          FROM pedido p
          JOIN estado_pedido ep 
          ON p.id_estado_pedido = ep.id
          WHERE p.id = $1`,
    values: [ orderId ]
  }

  let res1 = await pool.query<Order>(query);

  query = {
    text: `SELECT image_name AS imagen
          FROM pedido_producto pp
          JOIN pedido p 
          ON pp.id_pedido = p.id
          JOIN producto pro
          ON pp.id_producto = pro.id
          WHERE p.id = $1
          LIMIT 1`,
    values: [ orderId ]
  }

  let res2 = await pool.query<any>(query)

  const order = res1.rows[0]!
  order.imagen = res2.rows[0]?.imagen

  return order;
}

export const getProductsFromOrderRepository = async (orderId: string) => {
  const query: QueryConfig = {
    name: 'get-products-from-order',
    text: `SELECT p.id, m.nombre AS brand, c.nombre AS category, 
          p.nombre AS name, p.descripcion AS description, p.descuento AS discount, 
          pp.cantidad AS units, p.precio AS price, p.image_name AS image
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

export const getSippingOptionCostRepository = async (shippingOptionId: string) => {
  const query: QueryConfig = {
    name: 'get-shipping-option-cost',
    text: `SELECT coste FROM opcion_envio WHERE id = $1;`,
    values: [ shippingOptionId ]
  }

  const res = await pool.query<ShippingOption>(query)

  return res.rows[0]?.coste
}

export const updateOrderPaymentRepository = async (orderId: string) => {
  let query: QueryConfig = {
    name: 'select-paid-order-status',
    text: `SELECT * 
          FROM estado_pedido
          WHERE valor = $1`,
    values: [ OrderStatusValue.PAID ]
  }

  let res = await pool.query<OrderStatus>(query)

  let orderStatus = res.rows[0]!

  query = {
    name: 'update-paid-order-status',
    text: `UPDATE pedido
          SET id_estado_pedido = $1
          WHERE id = $2`,
    values: [ orderStatus?.id, orderId ]
  }

  await pool.query(query)

  return await getOrderFromRepository(orderId)
}

export const cancelOrderRepository = async (orderId: string) => {
  const dbClient = await pool.connect();

  try {
    await dbClient.query('BEGIN')

    let query: QueryConfig = {
      name: 'select-cancel-order-status',
      text: `SELECT * 
            FROM estado_pedido
            WHERE valor = $1`,
      values: [ OrderStatusValue.CANCELED ]
    }
  
    let res = await dbClient.query<OrderStatus>(query)
  
    let orderStatus = res.rows[0]!
  
    query = {
      name: 'update-cancel-order-status',
      text: `UPDATE pedido
            SET id_estado_pedido = $1
            WHERE id = $2`,
      values: [ orderStatus.id, orderId ]
    }
  
    await dbClient.query(query)
  
    query = {
      text: `SELECT p.id, m.nombre AS brand, c.nombre AS category, 
            p.nombre AS name, p.descripcion AS description, p.descuento AS discount, 
            pp.cantidad AS units, p.precio AS price, p.image_name AS image
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
  
    let res1 = await dbClient.query<Product>(query);
  
    for(let i = 0; i < res1.rows.length; i++) {
      const product = res1.rows[i]
  
      query = {
        name: 'update-product-when-canceling-order',
        text: `UPDATE producto SET unidades = unidades + $1 WHERE id = $2`,
        values: [ product?.units, product?.id ]
      }
  
      await dbClient.query(query)
    }

    await dbClient.query('COMMIT')
  } catch (error) {
    await dbClient.query('ROLLBACK')
    throw error
  } finally {
    dbClient.release()
  }
}