import { Router } from 'express'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'
import { 
  CashOnDeliveryOrderController, 
  GetOrderDetailsController, 
  PaymentController, 
  WebhookStripe, 
  UpdateOrderStatusController,
  GetAllOrdersController
} from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery", auth, CashOnDeliveryOrderController)
orderRouter.post('/checkout', auth, PaymentController)
orderRouter.post('/webhook', WebhookStripe)
orderRouter.get("/order-list", auth, GetOrderDetailsController)
orderRouter.put("/update-status", auth, admin, UpdateOrderStatusController)
orderRouter.get("/admin/all-orders", auth, admin, GetAllOrdersController)

export default orderRouter