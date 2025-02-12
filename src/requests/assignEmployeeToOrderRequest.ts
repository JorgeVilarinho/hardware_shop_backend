export interface AssignEmployeeToOrderRequest extends Express.Request {
  body: {
    orderId: number,
    employeeId: number
  }
}