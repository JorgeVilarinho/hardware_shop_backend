import express from 'express';
import { addProductToShoppingBasketRepository, createShoppingBasketRepository, 
  deleteAllItemsToShoppingBasketRepository, 
  deleteProductToShoppingBasketRepository, 
  getShoppingBasketByClientIdRepository, 
  productExistsInBasketRepository, updateProductUnitsInShoppingBasketRepository } from '../db/shopping_basket.js';
import { getClientByUserIdRepository } from '../db/users.js';

export const createShoppingBasket = async (req: express.Request, res: express.Response) => {
  try {
    const { authenticatedUser } = req.body;

    const client = await getClientByUserIdRepository(authenticatedUser.id);

    if(!client) {
      res.status(500).json({ message: 'El cliente no existe' });
      return
    }

    const isOk = await createShoppingBasketRepository(client?.id);

    if(!isOk) {
      res.status(500).json({ message: 'No se ha podido crear la cesta de la compra' });
      return
    }

    res.status(200).end();
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const upsertItemToShoppingBasket = async (req: express.Request, res: express.Response) => {
  try {
    const { authenticatedUser } = req.body;
    const { product_id, units } = req.body;

    const client = await getClientByUserIdRepository(authenticatedUser.id);

    if(!client) {
      res.status(500).json({ message: 'El cliente no existe' });
      return
    }

    const shoppingBasket_id = await getShoppingBasketByClientIdRepository(client?.id);

    if(await productExistsInBasketRepository(shoppingBasket_id, product_id)) {
      const isOk = await updateProductUnitsInShoppingBasketRepository(shoppingBasket_id, product_id, units);

      if(!isOk) {
        res.status(500).json({ message: 'No se ha podido actualizar las unidades del producto' });
        return
      }

      res.status(200).json({ message: 'Se ha actualizado las unidades correctamente' });
      return
    }

    const isOk = await addProductToShoppingBasketRepository(shoppingBasket_id, product_id, units);

    if(!isOk) {
      res.status(500).json({ message: 'No se ha podido añadir el producto al carrito' });
      return
    }

    res.status(200).json({ message: 'Se ha añadido correctamente el producto al carrito' });
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const deleteItemToShoppingBasket = async (req: express.Request, res: express.Response) => {
  try {
    const { authenticatedUser } = req.body;
    const { product_id } = req.body;
    
    const client = await getClientByUserIdRepository(authenticatedUser.id);

    if(!client) {
      res.status(500).json({ message: 'El cliente no existe' });
      return
    }

    const shoppingBasket_id = await getShoppingBasketByClientIdRepository(client?.id);

    const isOk = await deleteProductToShoppingBasketRepository(shoppingBasket_id, product_id);

    if(!isOk) {
      res.status(500).json({ message: 'No se ha podido eliminar el producto del carrito' })
      return
    }

    res.status(200).json({ message: 'Se ha eliminado correctamente el producto del carrito' })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const deleteAllItemsToShoppingBasket = async (req: express.Request, res: express.Response) => {
  try {
    const { authenticatedUser } = req.body;

    const client = await getClientByUserIdRepository(authenticatedUser.id);

    if(!client) {
      res.status(500).json({ message: 'El cliente no existe' });
      return
    }

    const shoppingBasket_id = await getShoppingBasketByClientIdRepository(client?.id);

    const isOk = await deleteAllItemsToShoppingBasketRepository(shoppingBasket_id);

    if(!isOk) {
      res.status(500).json({ message: 'No se ha podido eliminar todos los productos del carrito' })
      return
    }

    res.status(200).json({ message: 'Se han eliminado todos los productos del carrito' });
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}