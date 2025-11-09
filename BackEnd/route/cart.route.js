import { Router } from "express";
import auth from "../middleware/auth.js";
import { addToCartItemController, DeleteCartItemQtyController, GetCartItemController, UpdateCartItemQtyController, clearCartController } from "../controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.post('/create-cart',auth,addToCartItemController)
cartRouter.get("/get-cart",auth,GetCartItemController)
cartRouter.put('/update-qty',auth,UpdateCartItemQtyController)
cartRouter.delete('/delete-cart-item',auth,DeleteCartItemQtyController)
cartRouter.post('/clear-cart', auth, clearCartController);

export default cartRouter