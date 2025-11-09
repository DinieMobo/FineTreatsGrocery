import ProductCartModel from "../models/product_cart.model.js";
import UserModel from "../models/user.model.js";

export const addToCartItemController = async(request,response)=>{
    try {
        const  userId = request.userId
        const { productId } = request.body
        
        if(!productId){
            return response.status(402).json({
                message : "Please Provide Product Id",
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

        const updateCartUser = await UserModel.updateOne({ _id : userId},{
            $push : { 
                shopping_cart : productId
            }
        })

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
        await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
        
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