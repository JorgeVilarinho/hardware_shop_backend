import type { QueryConfig } from "pg";
import { pool } from "../db.js";
import type { Pc } from "../models/pc.js";

export const createShoppingBasketRepository = async (client_id: number) => {
  const query = {
    name: 'create-shopping-basket',
    text: 'INSERT INTO cesta (client_id) VALUES ($1);',
    values: [ client_id ]
  };

  const res = await pool.query(query);

  return res.rowCount! > 0;
}

export const getShoppingBasketByClientIdRepository = async (client_id: number) => {
  const query = {
    name: 'get-shopping-basket-by-client-id',
    text: 'SELECT id FROM cesta WHERE client_id = $1;',
    values: [ client_id ]
  };

  const res = await pool.query(query);

  return res.rows[0].id;
}

export const productExistsInBasketRepository = async (shoppingBasket_id: string, product_id: string) => {
  const query = {
    name: 'product-exists-in-basket',
    text: 'SELECT * FROM cesta_producto WHERE id_cesta = $1 AND id_producto = $2;',
    values: [ shoppingBasket_id, product_id ]
  };

  const res = await pool.query(query);

  return res.rowCount! > 0;
}

export const addProductToShoppingBasketRepository = async (shoppingBasket_id: string, product_id: string, units: number) => {
  const query = {
    name: 'add-product-to-basket',
    text: 'INSERT INTO cesta_producto (id_cesta, id_producto, unidades) VALUES ($1, $2, $3);',
    values: [ shoppingBasket_id, product_id, units ]
  };

  const res = await pool.query(query);

  return res.rowCount! > 0;
}

export const addPcProductToShoppingBasketRepository = async (shoppingBasket_id: string, pcProduct: Pc) => {
  let query: QueryConfig = {
    name: 'add-pc-product-to-basket',
    text: 'INSERT INTO cesta_pc(id_cesta, id_pc) VALUES($1, $2);',
    values: [ shoppingBasket_id, pcProduct.id ]
  }

  await pool.query(query)
}

export const updateProductUnitsInShoppingBasketRepository = async (shoppingBasket_id: string, product_id: string, units: number) => {
  const query = {
    name: 'update-units-to-product-in-basket',
    text: 'UPDATE cesta_producto SET unidades = $1 WHERE id_cesta = $2 AND id_producto = $3;',
    values: [ units, shoppingBasket_id, product_id ]
  };

  const res = await pool.query(query);

  return res.rowCount! > 0;
}

export const deleteProductToShoppingBasketRepository = async (shoppingBasket_id: string, product_id: string) => {
  const query = {
    name: 'delete-product-from-basket',
    text: 'DELETE FROM cesta_producto WHERE id_cesta = $1 AND id_producto = $2;',
    values: [ shoppingBasket_id, product_id ]
  };

  const res = await pool.query(query);

  return res.rowCount! > 0;
}

export const deletePcToShoppingBasketRepository = async (shoppingBasket_id: string, pcId: string) => {
  let query: QueryConfig = {
    name: 'delete-pc-from-basket',
    text: 'DELETE FROM cesta_pc WHERE id_cesta = $1 AND id_pc = $2;',
    values: [ shoppingBasket_id, pcId ]
  };

  await pool.query(query);
}

export const deleteAllItemsToShoppingBasketRepository = async (shoppingBasket_id: string) => {
  const query = {
    name: 'delete-all-products-from-basket',
    text: 'DELETE FROM cesta_producto WHERE id_cesta = $1;',
    values: [ shoppingBasket_id ]
  };

  const res = await pool.query(query);

  return res.rowCount! > 0;
}

export const deleteAllPcProductsToShoppingBasketRepository = async (shoppingBasket_id: string) => {
  let query: QueryConfig = {
    name: 'delete-all-pc-products-from-basket',
    text: 'DELETE FROM cesta_pc WHERE id_cesta = $1;',
    values: [ shoppingBasket_id ]
  };

  await pool.query(query);
}