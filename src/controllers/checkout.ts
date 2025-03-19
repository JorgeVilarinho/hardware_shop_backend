import express from 'express'
import { createOrderRepository, getPaymentOptionsRepository, getShippingMethodsRepository, getShippingOptionsRepository } from '../db/checkout.js'
import { createOrderId } from '../helpers/checkout.js';
import type { ProcessCheckoutRequest } from '../requests/processCheckoutRequest.js';
import { getClientByUserIdRepository } from '../db/users.js';
import { sendMail } from '../helpers/mailer.js';

export const getShippingMethods = async (_: express.Request, res: express.Response) => {
  try {
    const shippingMethods = await getShippingMethodsRepository();

    res.status(200).json({ shippingMethods })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const getShippingOptions = async (_: express.Request, res: express.Response) => {
  try {
    const shippingOptions = await getShippingOptionsRepository();

    res.status(200).json({ shippingOptions })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const getPaymentOptions = async (_: express.Request, res: express.Response) => {
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
    const { products, pcs, shippingMethod, shippingOption, paymentOption, total, address, authenticatedUser } = req.body

    const client = await getClientByUserIdRepository(authenticatedUser.id);

    if(!client) {
      res.status(500).json({ message: 'El cliente no existe' });
      return
    }

    const order = await createOrderRepository(id, client.id, shippingMethod.id, shippingOption?.id ?? null, 
      paymentOption.id, total, address?.id ?? null, products, pcs)

    let to = client.email
    let subject = `[${order?.id}], Pedido pendiente en ByteShop. Total ${order?.total.toFixed(2)} €`
    let html = `<h1>Gracias por realizar el pedido.</h1>
    <p>Te agradecemos la confianza en nuestra tienda.</p>
    <p>Número de pedido: ${order?.id}</p>
    <p>Forma de envío: ${shippingOption?.descripcion}</p>
    <p>Forma de pago: ${paymentOption.descripcion}</p>
    <p>Coste de envío: ${shippingOption?.coste} €</p>
    <p>Total: ${order?.total.toFixed(2)} €</p>`

    sendMail(to, subject, html)

    res.status(200).json({ order })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}