import { pool } from "../db.js"

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