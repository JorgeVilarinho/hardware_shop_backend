import express from 'express';
import { getBrandsByCategoryRepository } from '../db/brands.js';

export const getBrandsByCategory = async (req: express.Request, res: express.Response) => {
  try {
    const { categoryId } = req.params;

    if(!categoryId) {
      res.status(500).json({ message: 'El id de la categoría no puede ser nulo' })
      return
    }

    const brands = await getBrandsByCategoryRepository(categoryId);

    res.status(200).json({ brands })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}