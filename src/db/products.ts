import { pool } from "../db.js";

export const getAllProductsRepository = async () => {
  const query = {
    name: 'get-all-products',
    text: `SELECT p.id, p.nombre AS name, p.descripcion AS description, 
          m.nombre AS brand, c.nombre AS category, p.unidades AS units, 
          p.precio AS price, p.descuento AS discount, p.image_name AS image
          FROM producto p
          JOIN categoria c ON c.id = p.id_categoria
          JOIN marca m ON m.id = p.id_marca
          WHERE unidades > 0
          ORDER BY p.nombre;`
  };
  
  const res = await pool.query(query);
  
  return res.rows;
}

export const getProductStockRepository = async (id: string) => {
  const query = {
    name: 'get-product-stock',
    text: `SELECT p.unidades AS units 
          FROM producto p
          WHERE p.id = $1;`,
    values: [ id ]
  };
  
  const res = await pool.query(query);
  
  return res.rows[0].units;
}