import { pool } from "../db.js";
import type { Category } from "../models/category.js";

export const getCategoriesRepository = async () => {
  const query = {
    name: 'get-all-categories',
    text: `SELECT * FROM categoria ORDER BY nombre ASC;`
  };
  
  const res = await pool.query<Category>(query);
  
  return res.rows;
}