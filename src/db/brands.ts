import { pool } from "../db.js";
import type { Brand } from "../models/brand.js";

export const getBrandsByCategoryRepository = async (categoryId: string) => {
  const query = {
      name: 'get-brands-by-category',
      text: `SELECT m.id, m.nombre 
            FROM marca m
            INNER JOIN categoria_marca cm
            ON cm.id_marca = m.id
            INNER JOIN categoria c
            ON cm.id_categoria = c.id
            WHERE id_categoria = $1;`,
      values: [ categoryId ]
    };
    
    const res = await pool.query<Brand>(query);
    
    return res.rows;
};