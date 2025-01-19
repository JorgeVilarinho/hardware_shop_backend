import express from 'express'
import { getAllProductsRepository, getMaxPriceRepository, getProductsByFiltersRepository, getProductStockRepository } from '../db/products.js'

export const getProducts = async (req: express.Request, res: express.Response) => {
  try {
    const { orderBy, minPrice, maxPrice, category, brands } = req.query;

    let products;

    if(!orderBy && !minPrice && !maxPrice && !category && !brands) {
      products = await getAllProductsRepository();
      res.status(200).json({ products })
      return
    }

    products = await getProductsByFiltersRepository(orderBy as string, +minPrice!, +maxPrice!, +category!, brands as string);

    res.status(200).json({ products });
  } catch(error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const getMaxProductPrice = async (req: express.Request, res: express.Response) => {
  try {
    const maxPrice = await getMaxPriceRepository();

    res.status(200).json({ maxPrice })
  } catch(error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const getAvailableStock = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const stock = await getProductStockRepository(id!);

    res.status(200).json({ stock });
  } catch(error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}