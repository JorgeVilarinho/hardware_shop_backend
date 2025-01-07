import express from 'express'
import { getCategoriesRepository } from '../db/categories.js'

export const getCategories = async (req: express.Request, res: express.Response) => {
  try {
    const categories = await getCategoriesRepository();

    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}