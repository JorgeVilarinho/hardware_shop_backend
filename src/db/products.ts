import type { QueryConfig } from "pg";
import { pool } from "../db.js";
import type { Product } from "../models/product.js";
import { OrderBy } from "../models/types/orderBy.js";

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
  
  const res = await pool.query<Product>(query);
  
  return res.rows;
}

export const getProductsByFiltersRepository = async (orderBy: string, minPrice: number, 
  maxPrice: number, category: number, brands: string, searchByText: string) => {
  let queryText = `SELECT p.id, p.nombre AS name, p.descripcion AS description, 
                  m.nombre AS brand, c.nombre AS category, p.unidades AS units, 
                  p.precio AS price, p.descuento AS discount, p.image_name AS image
                  FROM producto p
                  JOIN categoria c ON c.id = p.id_categoria
                  JOIN marca m ON m.id = p.id_marca`;
  let queryTextFilters = [];
  let values: any[] = [];
  let count = 1;
  
  if(minPrice) {
    queryTextFilters.push('p.precio >= $' + count);
    values.push(minPrice);
    count++;
  }

  if(maxPrice) {
    queryTextFilters.push('p.precio <= $' + count);
    values.push(maxPrice);
    count++;
  }

  if(category) {
    queryTextFilters.push('c.id = $' + count);
    values.push(category);
    count++;
  }

  if(brands) {
    queryTextFilters.push('m.id IN(' + brands + ')');
  }

  if(searchByText) {
    queryTextFilters.push(`to_tsvector(p.nombre) @@ to_tsquery('${searchByText}')`);
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

  const res = await pool.query<Product>(query);
  
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

export const getProductByIdRepository = async (productId: string) => {
  const query: QueryConfig = {
    name: 'get-product-by-id',
    text: `SELECT p.id, p.nombre AS name, p.descripcion AS description, 
          m.nombre AS brand, c.nombre AS category, p.unidades AS units, 
          p.precio AS price, p.descuento AS discount, p.image_name AS image
          FROM producto p
          JOIN categoria c ON c.id = p.id_categoria
          JOIN marca m ON m.id = p.id_marca
          WHERE p.id = $1`,
    values: [ productId ]
  };
  
  const res = await pool.query<Product>(query);
  
  return res.rows[0];
}

export const updateProductByIdRepository = async (
  productId: string,
  name: string,
  description: string,
  price: number,
  units: number,
  discount: number,
  categoryId: number,
  brandId: number,
  imageName: string | undefined
) => {
  let query: QueryConfig

  if(imageName) {
    query = {
      name: 'update-product-by-id-with-image',
      text: `UPDATE producto SET nombre = $1, descripcion = $2, precio = $3, unidades = $4, 
            descuento = $5, id_categoria = $6, id_marca = $7, image_name = $8 WHERE id = $9`,
      values: [ name, description, price, units, discount, categoryId, brandId, imageName, productId ],
    }
  } else {
    query = {
      name: 'update-product-by-id-without-image',
      text: `UPDATE producto SET nombre = $1, descripcion = $2, precio = $3, unidades = $4, 
            descuento = $5, id_categoria = $6, id_marca = $7 WHERE id = $8`,
      values: [ name, description, price, units, discount, categoryId, brandId, productId ],
    }
  }

  await pool.query<Product>(query);
};

export const addProductRepository = async (
  name: string,
  description: string,
  price: number,
  units: number,
  discount: number,
  categoryId: number,
  brandId: number,
  imageName: string
) => {
  const query: QueryConfig = {
    name: 'add-new-product',
    text: `INSERT INTO producto(nombre, descripcion, precio, unidades, descuento, id_categoria, id_marca, image_name) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
    values: [ name, description, price, units, discount, categoryId, brandId, imageName ]
  };
  
  let res = await pool.query(query);
}

export const deleteProductRepository = async (productId: string) => {
  const query: QueryConfig = {
    name: 'delete-product-by-id',
    text: `DELETE FROM producto WHERE id = $1`,
    values: [ productId ]
  };
  
  await pool.query(query);
}