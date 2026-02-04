import ProductCartModel from "../models/product_cart.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";

export const addToCartItemController = async(request,response)=>{
    try {
        const  userId = request.userId
        const { productId } = request.body
        
        if(!productId){
            return response.status(400).json({
                message : "Please Provide Product Id",
                error : true,
                success : false
            })
        }

        const product = await ProductModel.findById(productId);
        if(!product){
            return response.status(404).json({
                message : "Product not found",
                error : true,
                success : false
            })
        }

        if(product.stock <= 0){
             return response.status(400).json({
                message : "Product is out of stock",
                error : true,
                success : false
            })
        }

        const checkItemCart = await ProductCartModel.findOne({
            userId : userId,
            productId : productId
        })

        if(checkItemCart){
            return response.status(400).json({
                message : "Item already available in cart"
            })
        }

        const cartItem = new ProductCartModel({
            quantity : 1,
            userId : userId,
            productId : productId
        })
        const save = await cartItem.save()

        return response.json({
            data : save,
            message : "Item successfully added to cart",
            error : false,
            success : true
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const GetCartItemController = async(request,response)=>{
    try {
        const userId = request.userId

        const cartItem =  await ProductCartModel.find({
            userId : userId
        }).populate('productId')

        return response.json({
            data : cartItem,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const UpdateCartItemQtyController = async(request,response)=>{
    try {
        const userId = request.userId 
        const { _id,qty } = request.body

        if(!_id ||  !qty){
            return response.status(400).json({
                message : "Provide User Id and Quantity",
            })
        }

        const cartItem = await ProductCartModel.findOne({ _id: _id, userId: userId }).populate('productId');
        if(!cartItem){
             return response.status(404).json({
                message : "Cart item not found",
                error : true,
                success : false
            })
        }

        if(qty > cartItem.productId.stock){
            return response.status(400).json({
                message : `Only ${cartItem.productId.stock} items available in stock`,
                error : true,
                success : false
            })
        }

        const updateCartitem = await ProductCartModel.updateOne({
            _id : _id,
            userId : userId
        },{
            quantity : qty
        })

        return response.json({
            message : "Cart Updated",
            data : updateCartitem,
            success : true,
            error : false
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const DeleteCartItemQtyController = async(request,response)=>{
    try {
      const userId = request.userId
      const { _id } = request.body 
      
      if(!_id){
        return response.status(400).json({
            message : "Please Provide _id",
            error : true,
            success : false
        })
      }

      const deleteCartItem  = await ProductCartModel.deleteOne({_id : _id, userId : userId })

      return response.json({
        message : "Item removed from cart",
        data : deleteCartItem,
        error : false,
        success : true
      })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async function clearCartController(request, response) {
    try {
        const userId = request.userId;
        
        await ProductCartModel.deleteMany({ userId: userId });
        
        return response.json({
            message: "Cart cleared successfully",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}