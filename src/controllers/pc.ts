import express from 'express'
import type { CreatePcRequest } from '../requests/createPcRequest.js'
import { insertPcRepository } from '../db/pc.js'

export const createPc = async (req: CreatePcRequest, res: express.Response) => {
  try {
    const { pcData } = req.body

    if(!pcData) {
      res.status(400).json({ message: 'Se necesitan los datos del PC para poder añadirlo' })
      return
    }

    const pc = await insertPcRepository(pcData)

    res.status(200).json({ pc })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}