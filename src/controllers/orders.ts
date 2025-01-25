import express from 'express'
import { getActiveOrdersRepository, getProductsFromOrderRepository, getSippingOptionCostRepository } from '../db/orders.js'

export const getActiveOrders = async (_: express.Request, res: express.Response) => {
  try {
    const orders = await getActiveOrdersRepository()

    res.status(200).json({ orders })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const getProductsFromOrder = async (req: express.Request, res: express.Response) => {
  try {
    const { orderId } = req.params

    if(!orderId) {
      res.status(400).json({ message: 'Se necesita enviar el id del pedido' })
      return
    }

    const products = await getProductsFromOrderRepository(orderId);

    res.status(200).json({ products })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const getShippingOptionCost = async (req: express.Request, res: express.Response) => {
  try {
    const { shippingOptionId } = req.params

    if(!shippingOptionId) {
      res.status(400).json({ message: 'Se necesita el id de la opción de envío' })
      return
    }

    const cost = await getSippingOptionCostRepository(shippingOptionId)

    if(!cost) {
      res.status(404).json({ message: 'No se ha encontrado la opción de envío' })
      return
    }

    res.status(200).json({ cost })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}