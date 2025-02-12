import express from 'express'
import { isAdmin, isAdminOrOwner, isAuthenticated } from '../middlewares/index.js'
import { assignEmployeeToOrder, createEmployee, deleteEmployee, getEmployeeById, getEmployees, getEmployeeTypes, updateEmployeeById } from '../controllers/employees.js'

export default (router: express.Router) => {
  router.get('/api/employees', isAuthenticated, getEmployees)
  router.get('/api/employee/types', isAuthenticated, getEmployeeTypes)
  router.get('/api/employee/:employeeId', isAuthenticated, getEmployeeById)
  router.put('/api/employee/:employeeId', isAuthenticated, isAdminOrOwner, updateEmployeeById)
  router.delete('/api/employee/:userId', isAuthenticated, isAdmin, deleteEmployee)
  router.post('/api/employee', isAuthenticated, isAdmin, createEmployee)
  router.post('/api/employee/assign', isAuthenticated, isAdmin, assignEmployeeToOrder)
}