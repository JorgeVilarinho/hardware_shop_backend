import type { QueryConfig } from "pg";
import { pool } from "../db.js";
import type { Category } from "../models/category.js";

export const getCategoriesRepository = async () => {
  const query: QueryConfig = {
    name: 'get-all-categories',
    text: `SELECT * FROM categoria ORDER BY nombre ASC;`
  };
  
  const res = await pool.query<Category>(query);
  
  return res.rows;
}

export const getCategoryByValueRepository = async (categoryValue: string) => {
  const query: QueryConfig = {
    name: 'get-category-by-value',
    text: `SELECT * FROM categoria WHERE nombre = $1`,
    values: [ categoryValue ]
  };
  
  const res = await pool.query<Category>(query);
  
  return res.rows[0];
}