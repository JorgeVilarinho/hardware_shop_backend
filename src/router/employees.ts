import express from 'express'
import { isAdmin, isAuthenticated } from '../middlewares/index.js'
import { createEmployee, deleteEmployee, getEmployees, getEmployeeTypes } from '../controllers/employees.js'

export default (router: express.Router) => {
  router.get('/api/employees', isAuthenticated, getEmployees)
  router.get('/api/employee/types', isAuthenticated, getEmployeeTypes)
  router.delete('/api/employee/:userId', isAuthenticated, deleteEmployee)
  router.post('/api/employee', isAuthenticated, isAdmin, createEmployee)
}