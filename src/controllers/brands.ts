import express from 'express';
import { getBrandByValueRepository, getBrandsByCategoryRepository, getBrandsRepository } from '../db/brands.js';

export const getBrands = async (req: express.Request, res: express.Response) => {
  try {
    const brands = await getBrandsRepository();

    res.status(200).json({ brands })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const getBrandByValue = async (req: express.Request, res: express.Response) => {
  try {
    const { brandValue } = req.params

    if(!brandValue) {
      res.status(400).json({ message: 'No se ha enviado una marca correcta' })
      return
    }

    const brand = await getBrandByValueRepository(brandValue);

    res.status(200).json({ brand })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

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