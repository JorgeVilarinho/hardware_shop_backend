import express from 'express'
import { 
  cancelOrderRepository, getClientCanceledOrdersRepository, getClientActiveOrdersRepository, getOrderFromRepository, 
  getProductsFromOrderRepository, getSippingOptionCostRepository, updateOrderPaymentRepository, getUnassignedOrdersRepository, 
  getAssignedOrdersToEmployeeRepository, getOrderStatusByValueRepository, updateOrderStatusByEmployeeRepository, 
  getOrdersInShippingRepository
} from '../db/orders.js'
import { getAddressByIdRepository, getClientByIdRepository, getClientByUserIdRepository, getEmployeeByIdRepository } from '../db/users.js'
import { sendMail } from '../helpers/mailer.js'
import { getShippingMethodByIdRepository } from '../db/checkout.js'
import { ShippingMethodValue } from '../models/types/shippingMethodValue.js'
import type { AuthenticatedUser } from '../models/authenticatedUser.js'
import { OrderStatusValue } from '../models/types/orderStatusValue.model.js'
import { EmployeeTypeValue } from '../models/types/employeeTypeValue.js'
import type { OrderStatus } from '../models/orderStatus.model.js'

export const getClientActiveOrders = async (req: express.Request, res: express.Response) => {
  try {
    const authenticatedUser = req.body.authenticatedUser as AuthenticatedUser

    const client = await getClientByUserIdRepository(authenticatedUser.id)

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

    const client = await getClientByUserIdRepository(authenticatedUser.id)

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

export const getAssignedOrders = async (req: express.Request, res: express.Response) => {
  try {
    const { employeeId } = req.params 

    if(!employeeId) {
      res.status(400).json({ message: 'Se necesita enviar el id del cliente' })
      return
    }

    const orders = await getAssignedOrdersToEmployeeRepository(employeeId)

    res.status(200).json({ orders })
  } catch (error) {
    res.status(500).json({ message: 'No se ha podido devolver los pedidos no asignados' })
  }
}

export const updateOrderStatusByEmployee = async (req: express.Request, res: express.Response) => {
  try {
    const { orderId, employeeId } = req.params 

    if(!orderId) {
      res.status(400).json({ message: 'Se necesita enviar el id del pedido' })
      return
    }

    if(!employeeId) {
      res.status(400).json({ message: 'Se necesita enviar el id del empleado' })
      return
    }

    const employee = await getEmployeeByIdRepository(+employeeId)

    if(!employee) {
      res.status(400).json({ message: 'No se ha encontrado el empleado' })
      return
    }

    const order = await getOrderFromRepository(orderId)

    if(!order) {
      res.status(400).json({ message: 'No se ha encontrado el pedido' })
      return
    }

    let orderStatusValue: OrderStatusValue | undefined
    
    if(employee.tipo_trabajador == EmployeeTypeValue.DELIVERY) {
      let orderStatus: OrderStatus | undefined

      orderStatus = await getOrderStatusByValueRepository(order.estado_pedido_valor)

      switch(orderStatus?.valor) {
        case OrderStatusValue.PAID:
          orderStatusValue = OrderStatusValue.IN_SHIPPING
          break
        case OrderStatusValue.IN_SHIPPING:
          orderStatusValue = OrderStatusValue.COMPLETED
          break
      }
    }

    if(!orderStatusValue) {
      res.status(400).json({ message: 'No se ha podido establecer el estado del pedido' })
      return
    }

    const orderStatus = await getOrderStatusByValueRepository(orderStatusValue)

    if(!orderStatus) {
      res.status(400).json({ message: 'No se ha podido encontrar el estado del pedido' })
      return
    }
    
    await updateOrderStatusByEmployeeRepository(order, orderStatus)

    const client = await getClientByIdRepository(order.id_cliente)

    if(!client) {
      res.status(400).json({ message: 'No se ha podido encontrar el cliente del pedido' })
      return
    }

    const address = await getAddressByIdRepository(order.id_direccion)

    if(!address) {
      res.status(400).json({ message: 'No se ha podido encontrar la dirección de envío del pedido' })
      return
    }

    let to: string = client.email
    let subject: string = `Pedido Nº ${order.id} ya está en proceso de envío`
    let html: string = `<h1>Su pedido ya está en proceso de envío</h1>
    <p>Se le notifica que su pedido ya está en proceso de envío hacia la dirección indicada</p>
    <h2>Dirección:</h2>
    <p>${address.direccion}</p>
    <p>${address.ciudad}, ${address.provincia}, ${address.cod_postal}</p>
    <p>Número de teléfono: ${address.telefono}</p>
    <p>Gracias por confiar en nosotros</p>
    `

    if(orderStatusValue == OrderStatusValue.IN_SHIPPING) {
      subject = `Pedido Nº ${order.id} ya está en proceso de envío`
      html = `<h1>Su pedido ya está en proceso de envío</h1>
      <p>Se le notifica que su pedido ya está en proceso de envío hacia la dirección indicada</p>
      <h2>Dirección:</h2>
      <p>${address.direccion}</p>
      <p>${address.ciudad}, ${address.provincia}, ${address.cod_postal}</p>
      <p>Número de teléfono: ${address.telefono}</p>
      <p>Gracias por confiar en nosotros</p>
      `
    } else {
      subject = `Su pedido Nº ${order.id} se le ha sido entregado satisfactoriamente`
      html = `<h1>Su pedido ha sido entregado satisfactoriamente</h1>
      <p>Se le notifica que su pedido ha sido entregado satisfactoriamente ha la siguiente dirección</p>
      <h2>Dirección:</h2>
      <p>${address.direccion}</p>
      <p>${address.ciudad}, ${address.provincia}, ${address.cod_postal}</p>
      <p>Número de teléfono: ${address.telefono}</p>
      <p>Gracias por confiar en nosotros</p>
      `
    }

    sendMail(to, subject, html)

    res.status(200).end()
  } catch (error) {
    res.status(500).json({ message: 'No se ha podido devolver los pedidos no asignados' })
  }
}

export const getOrdersInShipping = async (req: express.Request, res: express.Response) => {
  try {
    const { employeeId } = req.params

    if(!employeeId) {
      res.status(400).json({ message: 'Se necesita enviar el id del cliente' })
      return
    }

    const orderStatus = await getOrderStatusByValueRepository(OrderStatusValue.IN_SHIPPING)

    if(!orderStatus) {
      res.status(400).json({ message: 'No se encuentra el estado pedido a establecer' })
      return
    }

    const orders = await getOrdersInShippingRepository(employeeId, orderStatus.id);

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

export const processOrderPayment = async (req: express.Request, res: express.Response) => {
  try {
    const { orderId } = req.params
    const { authenticatedUser } = req.body

    const client = await getClientByUserIdRepository(authenticatedUser.id)

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

    const client = await getClientByUserIdRepository(authenticatedUser.id)

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