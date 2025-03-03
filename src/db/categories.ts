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

export const getCategoryByNameRepository = async (categoryName: string) => {
  const query: QueryConfig = {
    name: 'get-category-by-name',
    text: `SELECT * FROM categoria WHERE nombre = $1`,
    values: [ categoryName ]
  };
  
  const res = await pool.query<Category>(query);
  
  return res.rows[0];
}

export const getCategoryByValueRepository = async (categoryName: string) => {
  const query: QueryConfig = {
    name: 'get-category-by-value',
    text: `SELECT * FROM categoria WHERE valor = $1`,
    values: [ categoryName ]
  };
  
  const res = await pool.query<Category>(query);
  
  return res.rows[0];
}