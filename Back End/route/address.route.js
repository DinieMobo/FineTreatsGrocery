import { Router } from 'express'
import auth from '../middleware/auth.js'
import { AddAddressController, DeleteAddresscontroller, GetAddressController, UpdateAddressController } from '../controllers/address.controller.js'

const addressRouter = Router()

addressRouter.post('/create',auth,AddAddressController)
addressRouter.get("/get",auth,GetAddressController)
addressRouter.put('/update',auth,UpdateAddressController)
addressRouter.delete("/disable",auth,DeleteAddresscontroller)

export default addressRouter