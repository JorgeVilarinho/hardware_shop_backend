import express from 'express'
import { 
  addProductRepository,
  deleteProductRepository,
  getAllProductsRepository, getMaxPriceRepository, getProductByIdRepository, 
  getProductsByFiltersRepository, getProductStockRepository, updateProductByIdRepository 
} from '../db/products.js'

export const getProducts = async (req: express.Request, res: express.Response) => {
  try {
    const { orderBy, minPrice, maxPrice, category, brands } = req.query;

    let products;

    if(!orderBy && !minPrice && !maxPrice && !category && !brands) {
      products = await getAllProductsRepository();
      res.status(200).json({ products })
      return
    }

    products = await getProductsByFiltersRepository(orderBy as string, +minPrice!, +maxPrice!, +category!, brands as string);

    res.status(200).json({ products });
  } catch(error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const getMaxProductPrice = async (req: express.Request, res: express.Response) => {
  try {
    const maxPrice = await getMaxPriceRepository();

    res.status(200).json({ maxPrice })
  } catch(error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const getAvailableStock = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const stock = await getProductStockRepository(id!);

    res.status(200).json({ stock });
  } catch(error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const getProductById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    if(!id) {
      res.status(400).json({ message: 'El id del producto a buscar es incorrecto' })
      return
    }

    const product = await getProductByIdRepository(id)

    res.status(200).json({ product })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const updateProductById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const { name, description, price, units, discount, categoryId, brandId, imageName } = req.body

    if(!id) {
      res.status(400).json({ message: 'No se ha recibido correctamente el id del producto' })
      return
    }

    if (
      !name ||
      !description ||
      price == undefined ||
      units == undefined ||
      discount == undefined ||
      categoryId == undefined ||
      brandId == undefined
    ) {
      res.status(400).json({ message: 'No se han establecido todos los datos para poder modificar un producto' })
      return
    }
    
    await updateProductByIdRepository(id, name, description, price, units, discount, categoryId, brandId, imageName)

    res.status(200).end()
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const addProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { name, description, price, units, discount, categoryId, brandId, imageName } = req.body

    if (
      !name ||
      !description ||
      price == undefined ||
      units == undefined ||
      discount == undefined ||
      categoryId == undefined ||
      brandId == undefined ||
      !imageName
    ) {
      res.status(400).json({ message: 'No se han establecido todos los datos para poder añadir un producto' })
      return
    }

    await addProductRepository(name, description, price, units, discount, categoryId, brandId, imageName)

    res.status(200).end()
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const deleteProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params

    if(!id) {
      res.status(400).json({ message: 'No se ha recibido el id del producto a eliminar' })
      return
    }

    await deleteProductRepository(id)

    res.status(200).end()
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}