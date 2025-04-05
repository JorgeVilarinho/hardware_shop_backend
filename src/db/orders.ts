import type { QueryConfig } from "pg";
import { pool } from "../db.js";
import { OrderStatusValue } from "../models/types/orderStatusValue.model.js";
import type { Order } from "../models/order.js";
import type { Product } from "../models/product.js";
import type { ShippingOption } from "../models/shippingOption.js";
import type { OrderStatus } from "../models/orderStatus.model.js";
import { ShippingMethodValue } from "../models/types/shippingMethodValue.js";
import type { ShippingMethod } from "../models/shippingMethod.js";
import { CategoryValue } from "../models/types/categoryValue.js";
import type { Pc } from "../models/pc.js";
import type { PaymentOption } from "../models/paymentOption.js";
import type { EmployeeData } from "../models/employeeData.js";
import { EmployeeTypeValue } from "../models/types/employeeTypeValue.js";

export const getOrderByIdRepository = async (orderId: string) => {
  let query: QueryConfig = {
    name: 'get-order-by-id',
    text: `SELECT p.id, id_cliente, id_trabajador, id_metodo_envio, 
          id_opcion_envio, id_opcion_pago, fecha_creacion, total, id_direccion, 
          ep.valor AS estado_pedido_valor, ep.descripcion AS estado_pedido_desc
          FROM pedido p
          JOIN estado_pedido ep 
          ON p.id_estado_pedido = ep.id
          WHERE p.id = $1`,
    values: [ orderId ]
  }

  let res1 = await pool.query<Order>(query);

  for (let i = 0; i < res1.rows.length; i++) {
    const order = res1.rows[i];

    query = {
      name: 'has-pc',
      text: `SELECT * 
            FROM pedido_pc
            WHERE id_pedido = $1`,
      values: [ order?.id ]
    }

    let res2 = await pool.query(query)

    if(res2.rowCount! > 0) {
      query = {
        text: `SELECT image_name AS imagen
              FROM pedido_pc p_pc
              INNER JOIN pc_producto p_pro
              ON p_pc.id_pc = p_pro.id_pc
              INNER JOIN producto p
              ON p_pro.id_producto = p.id
              INNER JOIN categoria c
              ON p.id_categoria = c.id
              WHERE id_pedido = $1
              AND c.valor = $2`,
        values: [ order?.id, CategoryValue.PC_TOWERS_AND_ENCLOSURES ]
      }

      let res3 = await pool.query<any>(query)
      order!.imagen = res3.rows[0]?.imagen
    } else {
      query = {
        text: `SELECT image_name AS imagen
              FROM pedido_producto pp
              JOIN pedido p 
              ON pp.id_pedido = p.id
              JOIN producto pro
              ON pp.id_producto = pro.id
              WHERE p.id = $1
              LIMIT 1`,
        values: [ order?.id ]
      }
  
      let res3 = await pool.query<any>(query)
      order!.imagen = res3.rows[0]?.imagen
    }
  }

  return res1.rows[0];
}

export const getClientActiveOrdersRepository = async (clientId: number) => {
  let query: QueryConfig = {
    name: 'get-client-active-orders',
    text: `SELECT p.id, id_cliente, id_trabajador, id_metodo_envio, 
          id_opcion_envio, id_opcion_pago, fecha_creacion, total, id_direccion, 
          ep.valor AS estado_pedido_valor, ep.descripcion AS estado_pedido_desc
          FROM pedido p
          JOIN estado_pedido ep 
          ON p.id_estado_pedido = ep.id
          WHERE ep.valor NOT IN ('canceled', 'completed')
          AND p.id_cliente = $1`,
    values: [ clientId ]
  }

  let res1 = await pool.query<Order>(query);

  for (let i = 0; i < res1.rows.length; i++) {
    const activeOrder = res1.rows[i];

    query = {
      name: 'has-pc',
      text: `SELECT * 
            FROM pedido_pc
            WHERE id_pedido = $1`,
      values: [ activeOrder?.id ]
    }

    let res2 = await pool.query(query)

    if(res2.rowCount! > 0) {
      query = {
        text: `SELECT image_name AS imagen
              FROM pedido_pc p_pc
              INNER JOIN pc_producto p_pro
              ON p_pc.id_pc = p_pro.id_pc
              INNER JOIN producto p
              ON p_pro.id_producto = p.id
              INNER JOIN categoria c
              ON p.id_categoria = c.id
              WHERE id_pedido = $1
              AND c.valor = $2`,
        values: [ activeOrder?.id, CategoryValue.PC_TOWERS_AND_ENCLOSURES ]
      }

      let res3 = await pool.query<any>(query)
      activeOrder!.imagen = res3.rows[0]?.imagen
    } else {
      query = {
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
  
      let res3 = await pool.query<any>(query)
      activeOrder!.imagen = res3.rows[0]?.imagen
    }
  }

  return res1.rows;
}

export const getClientCanceledOrdersRepository = async (clientId: number) => {
  let query: QueryConfig = {
    name: 'get-canceled-orders',
    text: `SELECT p.id, id_cliente, id_trabajador, id_metodo_envio, 
          id_opcion_envio, id_opcion_pago, fecha_creacion, total, id_direccion, 
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
      name: 'has-pc',
      text: `SELECT * 
            FROM pedido_pc
            WHERE id_pedido = $1`,
      values: [ canceledOrder?.id ]
    }

    let res2 = await pool.query(query)

    if(res2.rowCount! > 0) {
      query = {
        text: `SELECT image_name AS imagen
              FROM pedido_pc p_pc
              INNER JOIN producto p
              ON p_pc.id_producto = p.id
              INNER JOIN categoria c
              ON p.id_categoria = c.id
              WHERE id_pedido = $1
              AND c.valor = $2`,
        values: [ canceledOrder?.id, CategoryValue.PC_TOWERS_AND_ENCLOSURES ]
      }

      let res3 = await pool.query<any>(query)
      canceledOrder!.imagen = res3.rows[0]?.imagen
    } else {
      query = {
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

      let res3 = await pool.query<any>(query)
      canceledOrder!.imagen = res3.rows[0]?.imagen
    }
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

export const getUnassignedOrdersRepository = async (employeeData: EmployeeData) => {
  let orderStatus: OrderStatus | undefined
  let shippingMethod: ShippingMethod | undefined
  let query: QueryConfig | undefined

  switch(employeeData.tipo_trabajador) {
    case EmployeeTypeValue.DELIVERY: 
      orderStatus = await getOrderStatusByValueRepository(OrderStatusValue.PAID)
      shippingMethod = await getShippingMethodByValueRepository(ShippingMethodValue.HOME_DELIVERY)

      query = {
        text: `SELECT p.id, id_cliente, id_trabajador, id_metodo_envio, 
              id_opcion_envio, id_opcion_pago, fecha_creacion, total, id_direccion, 
              ep.valor AS estado_pedido_valor, ep.descripcion AS estado_pedido_desc
              FROM pedido p
              LEFT JOIN pedido_pc_montaje p_pc_mon
              ON p.id = p_pc_mon.id_pedido
              JOIN estado_pedido ep 
              ON p.id_estado_pedido = ep.id
              WHERE ep.id = $1
              AND id_metodo_envio = $2
              AND id_trabajador IS NULL
              AND (
                (p_pc_mon.montaje = true AND p_pc_mon.montado = true) 
                OR (p_pc_mon.montaje = false) 
                OR p_pc_mon.id_pedido IS NULL
              )
              ORDER BY fecha_creacion`,
        values: [ orderStatus?.id, shippingMethod?.id ]
      }
      break
    case EmployeeTypeValue.COMPUTER_ASSEMBLER:
      query = {
        text: `SELECT DISTINCT p.id, id_cliente, id_trabajador, id_metodo_envio, 
              id_opcion_envio, id_opcion_pago, fecha_creacion, total, id_direccion, 
              ep.valor AS estado_pedido_valor, ep.descripcion AS estado_pedido_desc
              FROM pedido p
              JOIN estado_pedido ep 
              ON p.id_estado_pedido = ep.id
              JOIN pedido_pc p_pc
              ON p.id = p_pc.id_pedido
              JOIN pedido_pc_montaje p_pc_m
              ON p.id = p_pc_m.id_pedido
              WHERE p_pc_m.montaje = true
              AND p_pc_m.montado = false
              AND id_trabajador IS NULL
              ORDER BY fecha_creacion`
      }
      break
    default:
      throw Error('No es un tipo de empleado válido')
  }

  let res = await pool.query<Order>(query);

  for (let i = 0; i < res.rows.length; i++) {
    const unassignedOrder = res.rows[i];

    query = {
      name: 'has-pc',
      text: `SELECT * 
            FROM pedido_pc
            WHERE id_pedido = $1`,
      values: [ unassignedOrder?.id ]
    }

    let res2 = await pool.query(query)

    if(res2.rowCount! > 0) {
      query = {
        text: `SELECT image_name AS imagen
              FROM pedido_pc p_pc
              INNER JOIN producto p
              ON p_pc.id_producto = p.id
              INNER JOIN categoria c
              ON p.id_categoria = c.id
              WHERE id_pedido = $1
              AND c.valor = $2`,
        values: [ unassignedOrder?.id, CategoryValue.PC_TOWERS_AND_ENCLOSURES ]
      }

      let res3 = await pool.query<any>(query)
      unassignedOrder!.imagen = res3.rows[0]?.imagen
    } else {
      query = {
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
  
      let res3 = await pool.query<any>(query)
      unassignedOrder!.imagen = res3.rows[0]?.imagen
    }
  }

  return res.rows
}

export const getAssignedOrdersToEmployeeRepository = async (employeeId: string) => {
  let query: QueryConfig = {
    name: 'get-assigned-orders',
    text: `SELECT p.id, id_cliente, id_trabajador, id_metodo_envio, 
          id_opcion_envio, id_opcion_pago, fecha_creacion, total, id_direccion, 
          ep.valor AS estado_pedido_valor, ep.descripcion AS estado_pedido_desc
          FROM pedido p
          JOIN estado_pedido ep 
          ON p.id_estado_pedido = ep.id
          WHERE id_trabajador = $1
          AND ep.valor NOT IN ('in-shipping', 'completed')
          ORDER BY fecha_creacion`,
    values: [ employeeId ]
  }

  let res = await pool.query<Order>(query);

  for (let i = 0; i < res.rows.length; i++) {
    const assignedOrder = res.rows[i];

    query = {
      name: 'has-pc',
      text: `SELECT * 
            FROM pedido_pc
            WHERE id_pedido = $1`,
      values: [ assignedOrder?.id ]
    }

    let res2 = await pool.query(query)

    if(res2.rowCount! > 0) {
      query = {
        text: `SELECT image_name AS imagen
              FROM pedido_pc p_pc
              INNER JOIN producto p
              ON p_pc.id_producto = p.id
              INNER JOIN categoria c
              ON p.id_categoria = c.id
              WHERE id_pedido = $1
              AND c.valor = $2`,
        values: [ assignedOrder?.id, CategoryValue.PC_TOWERS_AND_ENCLOSURES ]
      }

      let res3 = await pool.query<any>(query)
      assignedOrder!.imagen = res3.rows[0]?.imagen
    } else {
      query = {
        text: `SELECT image_name AS imagen
              FROM pedido_producto pp
              JOIN pedido p 
              ON pp.id_pedido = p.id
              JOIN producto pro
              ON pp.id_producto = pro.id
              WHERE p.id = $1
              LIMIT 1`,
        values: [ assignedOrder?.id ]
      }
  
      let res3 = await pool.query<any>(query)
      assignedOrder!.imagen = res3.rows[0]?.imagen
    }
  }

  return res.rows
}

export const updateOrderStatusByEmployeeRepository = async (order: Order, orderStatus: OrderStatus) => {
  let query: QueryConfig = {
    name: 'update-order-status-by-employee',
    text: `UPDATE pedido SET id_estado_pedido = $1 WHERE id = $2`,
    values: [ orderStatus.id, order.id ]
  }

  await pool.query(query);
}

export const updateOrderAssembledValueRepository = async (order: Order) => {
  let query: QueryConfig = {
    name: 'update-order-assembled-value',
    text: `UPDATE pedido_pc_montaje SET montado = true WHERE id_pedido = $1 AND montaje = true;`,
    values: [ order.id ]
  }

  await pool.query(query);
}

export const unassignEmployeeToOrderRepository = async (order: Order) => {
  let query: QueryConfig = {
    name: 'unassign-employee-to-order',
    text: `UPDATE pedido SET id_trabajador = NULL WHERE id = $1`,
    values: [ order.id ]
  }

  await pool.query(query);
}

export const getOrderFromRepository = async (orderId: string) => {
  let query: QueryConfig = {
    name: 'get-order-by-id',
    text: `SELECT p.id, id_cliente, id_trabajador, id_metodo_envio, 
          id_opcion_envio, id_opcion_pago, fecha_creacion, total, id_direccion, 
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

export const getOrdersInShippingRepository = async (employeeId: string, orderStatusId: number) => {
  let query: QueryConfig = {
    name: 'get-orders-in-shipping-by-employee-id',
    text: `SELECT p.id, id_cliente, id_trabajador, id_metodo_envio, 
          id_opcion_envio, id_opcion_pago, fecha_creacion, total, id_direccion, 
          ep.valor AS estado_pedido_valor, ep.descripcion AS estado_pedido_desc
          FROM pedido p
          JOIN estado_pedido ep 
          ON p.id_estado_pedido = ep.id
          WHERE p.id_trabajador = $1
          AND p.id_estado_pedido = $2`,
    values: [ employeeId, orderStatusId ]
  }

  let res = await pool.query<Order>(query);

  for (let i = 0; i < res.rows.length; i++) {
    const inShippingOrder = res.rows[i];

    query = {
      name: 'has-pc',
      text: `SELECT * 
            FROM pedido_pc
            WHERE id_pedido = $1`,
      values: [ inShippingOrder?.id ]
    }

    let res2 = await pool.query(query)

    if(res2.rowCount! > 0) {
      query = {
        text: `SELECT image_name AS imagen
              FROM pedido_pc p_pc
              INNER JOIN producto p
              ON p_pc.id_producto = p.id
              INNER JOIN categoria c
              ON p.id_categoria = c.id
              WHERE id_pedido = $1
              AND c.valor = $2`,
        values: [ inShippingOrder?.id, CategoryValue.PC_TOWERS_AND_ENCLOSURES ]
      }

      let res3 = await pool.query<any>(query)
      inShippingOrder!.imagen = res3.rows[0]?.imagen
    } else {
      query = {
        text: `SELECT image_name AS imagen
              FROM pedido_producto pp
              JOIN pedido p 
              ON pp.id_pedido = p.id
              JOIN producto pro
              ON pp.id_producto = pro.id
              WHERE p.id = $1
              LIMIT 1`,
        values: [ inShippingOrder?.id ]
      }
  
      let res3 = await pool.query<any>(query)
      inShippingOrder!.imagen = res3.rows[0]?.imagen
    }
  }

  return res.rows
}

export const getOrdersInShopRepository = async (shippingMethod: ShippingMethod, orderStatus: OrderStatus) => {
  let query: QueryConfig = {
    name: 'get-orders-in-shop',
    text: `SELECT p.id, id_cliente, id_trabajador, id_metodo_envio, 
          id_opcion_envio, id_opcion_pago, fecha_creacion, total, id_direccion, 
          ep.valor AS estado_pedido_valor, ep.descripcion AS estado_pedido_desc
          FROM pedido p
          LEFT JOIN pedido_pc_montaje p_pc_mon
          ON p.id = p_pc_mon.id_pedido
          JOIN estado_pedido ep 
          ON p.id_estado_pedido = ep.id
          WHERE p.id_metodo_envio = $1
          AND p.id_estado_pedido != $2
          AND (
            (p_pc_mon.montaje = true AND p_pc_mon.montado = true) 
            OR (p_pc_mon.montaje = false) 
            OR p_pc_mon.id_pedido IS NULL
          )
          ORDER BY p.fecha_creacion`,
    values: [ shippingMethod.id, orderStatus.id ]
  }

  let res = await pool.query<Order>(query);

  for (let i = 0; i < res.rows.length; i++) {
    const inShopOrder = res.rows[i];

    query = {
      name: 'has-pc',
      text: `SELECT * 
            FROM pedido_pc
            WHERE id_pedido = $1`,
      values: [ inShopOrder?.id ]
    }

    let res2 = await pool.query(query)

    if(res2.rowCount! > 0) {
      query = {
        text: `SELECT image_name AS imagen
              FROM pedido_pc p_pc
              INNER JOIN producto p
              ON p_pc.id_producto = p.id
              INNER JOIN categoria c
              ON p.id_categoria = c.id
              WHERE id_pedido = $1
              AND c.valor = $2`,
        values: [ inShopOrder?.id, CategoryValue.PC_TOWERS_AND_ENCLOSURES ]
      }

      let res3 = await pool.query<any>(query)
      inShopOrder!.imagen = res3.rows[0]?.imagen
    } else {
      query = {
        text: `SELECT image_name AS imagen
              FROM pedido_producto pp
              JOIN pedido p 
              ON pp.id_pedido = p.id
              JOIN producto pro
              ON pp.id_producto = pro.id
              WHERE p.id = $1
              LIMIT 1`,
        values: [ inShopOrder?.id ]
      }
  
      let res3 = await pool.query<any>(query)
      inShopOrder!.imagen = res3.rows[0]?.imagen
    }
  }

  return res.rows
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

export const getPcProductsFromOrderRepository = async (orderId: string) => {
  let pcs: Pc[] = []

  let query: QueryConfig = {
    name: 'get-pcs-from-order',
    text: `SELECT pc.id, montaje
          FROM pc
          JOIN pedido_pc p_pc 
          ON p_pc.id_pc = pc.id
          WHERE p_pc.id_pedido = $1;`,
    values: [ orderId ]
  }

  let res = await pool.query<{ id: number, montaje: boolean }>(query)

  let queryComponents: QueryConfig = {
    name: 'get-pc-components-from-id-pc',
    text: `SELECT p.id, m.nombre AS brand, c.nombre AS category, 
          p.nombre AS name, p.descripcion AS description, p.descuento AS discount, 
          1 AS units, p.precio AS price, p.image_name AS image
          FROM pc
          JOIN pc_producto p_pro ON p_pro.id_pc = pc.id
          JOIN producto p ON p.id = p_pro.id_producto
          JOIN marca m ON m.id = p.id_marca
          JOIN categoria c ON c.id = p.id_categoria
          WHERE pc.id = $1`
  }

  for(let i = 0; i < res.rowCount!; i++) {
    const pc = res.rows[i]

    if(!pc) throw new Error('Invalid PC query')

    queryComponents.values = [ pc.id ]

    let resComponents = await pool.query<Product>(queryComponents)

    pcs.push({
      id: pc.id,
      components: resComponents.rows,
      assembly: pc.montaje
    })
  }

  return pcs
}

export const getShippingOptionCostRepository = async (shippingOptionId: string) => {
  const query: QueryConfig = {
    name: 'get-shipping-option-cost',
    text: `SELECT coste FROM opcion_envio WHERE id = $1;`,
    values: [ shippingOptionId ]
  }

  const res = await pool.query<ShippingOption>(query)

  return res.rows[0]?.coste
}

export const getShippingMethodRepository = async (shippingMethodId: string) => {
  const query: QueryConfig = {
    name: 'get-shipping-method',
    text: `SELECT * FROM metodo_envio WHERE id = $1;`,
    values: [ shippingMethodId ]
  }

  const res = await pool.query<ShippingMethod>(query)

  return res.rows[0]
}

export const getPaymentOptionRepository = async (paymentOptionId: string) => {
  const query: QueryConfig = {
    name: 'get-payment-option',
    text: `SELECT * FROM opcion_pago WHERE id = $1;`,
    values: [ paymentOptionId ]
  }

  const res = await pool.query<PaymentOption>(query)

  return res.rows[0]
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
      text: `SELECT DISTINCT(id_pc) 
            FROM pedido_pc
            WHERE id_pedido = $1`,
      values: [ orderId ]
    }
  
    let res1 = await dbClient.query(query)
  
    query = {
      name: 'get-pc-components-from-id-pc',
      text: `SELECT p.id, m.nombre AS brand, c.nombre AS category, 
            p.nombre AS name, p.descripcion AS description, p.descuento AS discount, 
            1 AS units, p.precio AS price, p.image_name AS image
            FROM pc
            JOIN pc_producto p_pro ON p_pro.id_pc = pc.id
            JOIN producto p ON p.id = p_pro.id_producto
            JOIN marca m ON m.id = p.id_marca
            JOIN categoria c ON c.id = p.id_categoria
            WHERE pc.id = $1;`
    }
  
    for(let i = 0; i < res1.rowCount!; i++) {
      let id_pc = res1.rows[i].id_pc
  
      query.values = [ id_pc ]
  
      let res2 = await pool.query<Product>(query)

      for(let j = 0; j < res2.rowCount!; j++) {
        const product = res2.rows[j]

        query = {
          text: `UPDATE producto SET unidades = unidades + 1 WHERE id = $1`,
          values: [ product?.id ]
        }

        await dbClient.query(query)
      }
    }
  
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
  
    let res2 = await dbClient.query<Product>(query);
  
    for(let i = 0; i < res2.rows.length; i++) {
      const product = res1.rows[i]
  
      query = {
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