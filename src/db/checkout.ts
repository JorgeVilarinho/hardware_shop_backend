import { pool } from "../db.js"
import type { Order } from "../models/order.js";
import type { OrderStatus } from "../models/orderStatus.model.js";
import { OrderStatusValue } from "../models/orderStatusValue.model.js";
import type { Product } from "../models/product.js";

export const getShippingMethodsRepository = async () => {
  const query = {
    name: 'get-all-shipping-methods',
    text: `SELECT * FROM metodo_envio ORDER BY id`
  };
  
  const res = await pool.query(query);
  
  return res.rows;
}

export const getShippingOptionsRepository = async () => {
  const query = {
    name: 'get-all-shipping-options',
    text: `SELECT * FROM opcion_envio ORDER BY id;`
  };
  
  const res = await pool.query(query);
  
  return res.rows;
}

export const getPaymentOptionsRepository = async () => {
  const query = {
    name: 'get-all-payment-options',
    text: `SELECT * FROM opcion_pago ORDER BY id;`
  };
  
  const res = await pool.query(query);
  
  return res.rows;
}

export const createOrderRepository = async (id: string, clientId: number, 
  shippingMethodId: number, shippingOptionId: number | null, paymentOptionId: number, 
  total: number, addressId: number | null, products: Product[]) => {
    const dbClient = await pool.connect();

    try {
      await dbClient.query('BEGIN')

      let query = {
        name: 'get-order-status',
        text: 'SELECT * FROM estado_pedido WHERE valor = $1;',
        values: [ OrderStatusValue.PENDING_PAYMENT ]
      };

      let res = await dbClient.query<OrderStatus>(query);

      let query1 = {
        name: 'create-order',
        text: 'INSERT INTO pedido (id, id_cliente, id_metodo_envio, id_opcion_envio, id_opcion_pago, total, id_direccion, id_estado_pedido) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        values: [ id, clientId, shippingMethodId, shippingOptionId, paymentOptionId, total, addressId, res.rows[0]?.id ]
      };
    
      let res1 = await dbClient.query<Order>(query1);

      for(let i = 0; i < products.length; i++) {
        const product = products[i]

        await dbClient.query(`INSERT INTO pedido_producto (id_pedido, id_producto, cantidad) VALUES (${id}, ${product?.id}, ${product?.units})`)
        await dbClient.query(`UPDATE producto SET unidades = unidades - ${product?.units} WHERE id = ${product?.id}`)
      }

      await dbClient.query('COMMIT')
      return res1.rows[0]
    } catch (error) {
      await dbClient.query('ROLLBACK')
      throw error
    } finally {
      dbClient.release()
    }
}