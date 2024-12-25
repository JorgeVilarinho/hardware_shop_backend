import express from 'express'
import { getAllProductsRepository, getProductStockRepository } from '../db/products.js'

export const getAllProducts = async (req: express.Request, res: express.Response) => {
  try {
    const products = await getAllProductsRepository();

    res.status(200).json({ products });
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