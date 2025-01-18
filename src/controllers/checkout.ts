import express from 'express'
import { getShippingMethodsRepository, getShippingOptionsRepository } from '../db/checkout.js'

export const getShippingMethods = async (req: express.Request, res: express.Response) => {
  try {
    const shippingMethods = await getShippingMethodsRepository();

    res.status(200).json({ shippingMethods })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const getShippingOptions = async (req: express.Request, res: express.Response) => {
  try {
    const shippingOptions = await getShippingOptionsRepository();

    res.status(200).json({ shippingOptions })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const processCheckout = async (req: express.Request, res: express.Response) => {
  try {
    
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}