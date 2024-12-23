import express from 'express'
import { getAllProductsRepository } from '../db/products.js'

export const getAllProducts = async (req: express.Request, res: express.Response) => {
  try {
    const products = await getAllProductsRepository();

    res.status(200).json({ products });
  } catch(error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}