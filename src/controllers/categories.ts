import express from 'express'
import { getCategoriesRepository, getCategoryByNameRepository, getCategoryByValueRepository } from '../db/categories.js'

export const getCategories = async (_: express.Request, res: express.Response) => {
  try {
    const categories = await getCategoriesRepository();

    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const getCategoryByName = async (req: express.Request, res: express.Response) => {
  try {
    const { categoryName } = req.params

    if(!categoryName) {
      res.status(400).json({ message: 'No se ha recibido la categoría correctamente' })
      return
    }

    const category = await getCategoryByNameRepository(categoryName);

    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const getCategoryByValue = async (req: express.Request, res: express.Response) => {
  try {
    const { categoryValue } = req.params

    if(!categoryValue) {
      res.status(400).json({ message: 'No se ha recibido la categoría correctamente' })
      return
    }

    const category = await getCategoryByValueRepository(categoryValue);

    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}