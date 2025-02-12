import express from 'express'
import { cancelOrderRepository, getClientCanceledOrdersRepository, getClientActiveOrdersRepository, getOrderFromRepository, getProductsFromOrderRepository, getSippingOptionCostRepository, updateOrderPaymentRepository, getUnassignedOrdersRepository } from '../db/orders.js'
import { getClientByIdRepository } from '../db/users.js'
import { sendMail } from '../helpers/mailer.js'
import { getShippingMethodByIdRepository } from '../db/checkout.js'
import { ShippingMethodValue } from '../models/types/shippingMethodValue.js'
import type { AuthenticatedUser } from '../models/authenticatedUser.js'

export const getClientActiveOrders = async (req: express.Request, res: express.Response) => {
  try {
    const authenticatedUser = req.body.authenticatedUser as AuthenticatedUser

    const client = await getClientByIdRepository(authenticatedUser.id)

    if(!client) {
      res.status(400).json({ message: 'No se ha encontrado el cliente' })
      return
    }

    const orders = await getClientActiveOrdersRepository(client.id)

    res.status(200).json({ orders })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const getClientCanceledOrders = async (req: express.Request, res: express.Response) => {
  try {
    const authenticatedUser = req.body.authenticatedUser as AuthenticatedUser

    const client = await getClientByIdRepository(authenticatedUser.id)

    if(!client) {
      res.status(400).json({ message: 'No se ha encontrado el cliente' })
      return
    }

    const orders = await getClientCanceledOrdersRepository(client.id)

    res.status(200).json({ orders })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const getUnassignedOrders = async (req: express.Request, res: express.Response) => {
  try {
    const orders = await getUnassignedOrdersRepository()

    res.status(200).json({ orders })
  } catch (error) {
    res.status(500).json({ message: 'No se ha podido devolver los pedidos no asignados' })
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

export const processOrderPayment = async (req: express.Request, res: express.Response) => {
  try {
    const { orderId } = req.params
    const { authenticatedUser } = req.body

    const client = await getClientByIdRepository(authenticatedUser.id)

    if(!client) {
      res.status(400).json({ message: 'El cliente no existe' })
      return
    }

    if(!orderId) {
      res.status(400).json({ message: 'Se necesita enviar el id del pedido para realizar el pago del pedido' })
      return
    }

    const order = await updateOrderPaymentRepository(orderId)

    const shippingMethod = await getShippingMethodByIdRepository(order.id_metodo_envio)

    let to = client.email
    let subject = `[${order?.id}], Pedido pagado con éxito. Total ${order?.total.toFixed(2)} €`
    let html = `<h1>Gracias por realizar la compra de su pedido.</h1>
    <p>Te agradecemos la confianza en nuestra tienda.</p>
    <p>Número de pedido: ${order?.id}</p>
    <p>Total: ${order?.total.toFixed(2)} €</p>`
    if(shippingMethod?.valor == ShippingMethodValue.HOME_DELIVERY) {
      html += `<h2>Se le notificará cuando su pedido esté en proceso de envío</h2>`
    } else {
      html += `<h2>El producto ya está preparado para ser recogido en la tienda</h2>`
    }
    
    sendMail(to, subject, html)

    res.status(200).json({ order })
  } catch (error) {
    res.status(500).json({ message: 'No se ha podido realizar el pago del pedido' })
  }
}

export const cancelOrder = async (req: express.Request, res: express.Response) => {
  try {
    const { orderId } = req.params
    const { authenticatedUser } = req.body

    const client = await getClientByIdRepository(authenticatedUser.id)

    if(!client) {
      res.status(400).json({ message: 'El cliente no existe' })
      return
    }

    if(!orderId) {
      res.status(400).json({ message: 'Se necesita enviar el id del pedido para realizar la cancelación del pedido' })
      return
    }

    await cancelOrderRepository(orderId)

    const order = await getOrderFromRepository(orderId)

    let to = client.email
    let subject = `[${order?.id}], Pedido cancelado. Total ${order?.total.toFixed(2)} €`
    let html = `<h1>Su pedido ha sido cancelado</h1>
    <p>Te informamos que tu pedido ha sido cancelado, y no será enviado. Si se ha producido algún pago, este será devuelto.</p>
    <p>Gracias por su confianza.</p>
    <p>Número de pedido: ${order?.id}</p>`
    
    sendMail(to, subject, html)

    res.status(200).json({ order })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'No se ha podido cancelar el pedido' })
  }
}