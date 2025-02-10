import express from 'express'
import bcrypt from 'bcrypt'
import { createEmployeeRepository, deleteEmployeeRepository, getEmployeeByIdRepository, getEmployeesRepository, getEmployeeTypesRepository, updateEmployeeByIdRepository } from '../db/employees.js'
import type { CreateEmployeeRequest } from '../requests/createEmployeeRequest.js'
import { getUserByDniRepository, getUserByEmailRepository, getUserByIdRepository } from '../db/users.js'
import { SALT_ROUNDS } from '../config.js'

export const getEmployees = async (_: express.Request, res: express.Response) => {
  try {
    const employees = await getEmployeesRepository()

    res.status(200).json({ employees })
  } catch(error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const deleteEmployee = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params

    if(!userId) {
      res.status(400).json({ message: 'El id del usuario a eliminar es obligatorio' })
      return
    }

    await deleteEmployeeRepository(userId)
    res.status(200).end()
  } catch(error) {
    console.log(error)
    res.status(500).json({ message: 'No se ha podido eliminar el trabajador.' })
  }
}

export const getEmployeeTypes = async (_: express.Request, res: express.Response) => {
  try {
    const employeeTypes = await getEmployeeTypesRepository()

    res.status(200).json({ employeeTypes })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error con la comunicación del servidor.' })
  }
}

export const createEmployee = async (req: CreateEmployeeRequest, res: express.Response) => {
  try {
    const { fullName, dni, email, phone, password, admin, employeeType } = req.body

    if(!fullName || !dni || !email || !password || !phone || !password || !employeeType || admin == undefined) {
      res.status(400).json({ message: 'Error al introducir los datos.' });
      return;
    }

    let user = await getUserByEmailRepository(email);
    
    if(user) {
      res.status(400).json({ message: 'Ya existe una cuenta con ese email' });
      return;
    }

    user = await getUserByDniRepository(dni)

    if(user) {
      res.status(400).json({ message: 'Ya existe una cuenta con ese dni' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    await createEmployeeRepository(fullName, dni, email, phone, hashedPassword, admin, employeeType)

    res.status(200).end()
  } catch (error) {
    res.status(500).json({ message: 'No se ha podido crear el trabajador.' })
  }
}

export const updateEmployeeById = async (req: express.Request, res: express.Response) => {
  try {
    const { employeeId } = req.params
    const { userId, fullName, dni, email, phone, password, updatePassword, admin, employeeType } = req.body
    let hashedPassword = undefined

    if(!employeeId) {
      res.status(400).json({ message: 'Se necesita el id del trabajador' })
      return
    }

    if(!fullName || !dni || !email || updatePassword == undefined || !phone || !employeeType || admin == undefined) {
      res.status(400).json({ message: 'Error al introducir los datos.' });
      return;
    }

    let user = await getUserByIdRepository(userId)
    
    if(user?.email != email) {
      let user = await getUserByEmailRepository(email)

      if(user) {
        res.status(400).json({ message: 'Ya existe un usuario con ese email. Intenta un email diferente' });
        return;
      }
    }

    if(user?.dni != dni) {
      let user = await getUserByDniRepository(dni)

      if(user) {
        res.status(400).json({ message: 'Ya existe un usuario con ese dni. Intenta un dni diferente' });
        return;
      }
    }

    if(updatePassword) {
      if(!password) {
        res.status(400).json({ message: 'La contraseña no puede estar vacía' })
        return
      }

      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    }

    await updateEmployeeByIdRepository(employeeId, userId, fullName, dni, email, phone, hashedPassword, admin, employeeType)
    res.status(200).end()
  } catch (error) {
    res.status(500).json({ message: 'No se ha podido actualizar los datos del trabajador.' })
  }
}

export const getEmployeeById = async (req: express.Request, res: express.Response) => {
  try {
    const { employeeId } = req.params

    if(!employeeId) {
      res.status(400).json({ message: 'Se necesita el id del trabajador' })
      return
    }

    const employee = await getEmployeeByIdRepository(employeeId)

    res.status(200).json({ employee })
  } catch (error) {
    res.status(500).json({ message: 'No se ha podido devolver el trabajador.' })
  }
}