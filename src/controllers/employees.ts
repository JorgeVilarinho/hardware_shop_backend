import express from 'express'
import { getEmployeesRepository } from '../db/employees.js'

export const getEmployees = async (_: express.Request, res: express.Response) => {
  try {
    const employees = await getEmployeesRepository()

    res.status(200).json({ employees })
  } catch(error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}