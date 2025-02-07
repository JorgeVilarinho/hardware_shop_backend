import { pool } from "../db.js";
import { OrderBy } from "../models/types/orderBy.js";
import type { Product } from "../models/product.js";

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

export const getProductsByFiltersRepository = async (orderBy: string, minPrice: number, 
  maxPrice: number, category: number, brands: string) => {
  let queryText = `SELECT p.id, p.nombre AS name, p.descripcion AS description, 
                  m.nombre AS brand, c.nombre AS category, p.unidades AS units, 
                  p.precio AS price, p.descuento AS discount, p.image_name AS image
                  FROM producto p
                  JOIN categoria c ON c.id = p.id_categoria
                  JOIN marca m ON m.id = p.id_marca`;
  let queryTextFilters = [];
  let values: any[] = [];
  let count = 0;
  
  if(minPrice) {
    queryTextFilters.push('p.precio >= $' + (count + 1));
    values.push(minPrice);
    count++;
  }

  if(maxPrice) {
    queryTextFilters.push('p.precio <= $' + (count + 1));
    values.push(maxPrice);
    count++;
  }

  if(category) {
    queryTextFilters.push('c.id = $' + (count + 1));
    values.push(category);
    count++;
  }

  if(brands) {
    queryTextFilters.push('m.id IN(' + brands + ')');
  }

  if(queryTextFilters.length !== 0) {
    queryText = queryText.concat(' WHERE ')
    queryText = queryText.concat(queryTextFilters.join(' AND '))
  }

  if(orderBy) {
    switch(orderBy) {
      case OrderBy.LOWER_PRICE:
        queryText = queryText.concat(' ORDER BY p.precio');
        break
      case OrderBy.GREATER_PRICE:
        queryText = queryText.concat(' ORDER BY p.precio DESC');
        break
      case OrderBy.DISCOUNT:
        queryText = queryText.concat(' ORDER BY p.descuento DESC NULLS LAST');
        break
      case OrderBy.STOCK:
        queryText = queryText.concat(' ORDER BY p.unidades DESC');
        break
      default:
        throw Error('OrderBy filter error');
    }
  } else {
    queryText = queryText.concat(' ORDER BY p.nombre;');
  }
  
  const query = {
    text: queryText,
    values
  }

  const res = await pool.query(query);
  
  return res.rows;
}

export const getMaxPriceRepository = async () => {
  const query = {
    name: 'get-max-price-product',
    text: `SELECT max(precio) AS maxPrice
          FROM producto;`
  };
  
  const res = await pool.query(query);
  
  return res.rows[0].maxprice;
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