import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CreateProductController, DeleteProductDetails, GetProductByCategory, GetProductByCategoryAndSubCategory, GetProductController, GetProductDetails, SearchProduct, UpdateProductDetails } from '../controllers/product.controller.js'
import { admin } from '../middleware/Admin.js'

const productRouter = Router()

productRouter.post("/create",auth,admin,CreateProductController)
productRouter.post('/get',GetProductController)
productRouter.post("/get-product-by-category",GetProductByCategory)
productRouter.post('/get-product-by-category-and-subcategory',GetProductByCategoryAndSubCategory)
productRouter.post('/get-product-details',GetProductDetails)
productRouter.put('/update-product-details',auth,admin,UpdateProductDetails)
productRouter.delete('/delete-product',auth,admin,DeleteProductDetails)
productRouter.post('/search-product',SearchProduct)

export default productRouter