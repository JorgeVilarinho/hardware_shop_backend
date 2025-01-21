import express from 'express'
import { createOrderRepository, getPaymentOptionsRepository, getShippingMethodsRepository, getShippingOptionsRepository } from '../db/checkout.js'
import { createOrderId } from '../helpers/checkout.js';
import type { ProcessCheckoutRequest } from '../requests/processCheckoutRequest.js';
import { getClientByIdRepository } from '../db/users.js';

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

export const getPaymentOptions = async (req: express.Request, res: express.Response) => {
  try {
    const paymentOptions = await getPaymentOptionsRepository();

    res.status(200).json({ paymentOptions })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const processCheckout = async (req: ProcessCheckoutRequest, res: express.Response) => {
  try {
    const id = createOrderId();
    const { products, shippingMethod, shippingOption, paymentOption, total, address, authenticatedUser } = req.body

    const client = await getClientByIdRepository(authenticatedUser.id);

    if(!client) {
      res.status(500).json({ message: 'El cliente no existe' });
      return
    }

    const order = await createOrderRepository(id, client.id, shippingMethod.id, shippingOption?.id ?? null, 
      paymentOption.id, total, address?.id ?? null, products)

    res.status(200).json({ order })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}