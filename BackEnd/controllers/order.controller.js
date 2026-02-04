import Stripe from "../config/stripe.js";
import ProductCartModel from "../models/product_cart.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import AddressModel from "../models/address.model.js";
import mongoose from "mongoose";

export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body

    if (!list_items || !list_items.length || !addressId) {
      return response.status(400).json({
        message: "Missing required order information",
        error: true,
        success: false
      });
    }

    const payload = list_items.map(el => {
      if (!el.productId || !el.productId._id) {
        throw new Error("Invalid product information in order items");
      }
      
      return ({
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name || 'Unknown Product',
          image: el.productId.image || []
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
        quantity: el.quantity || 1,
        invoice_receipt: `INV-${new mongoose.Types.ObjectId()}`
      })
    })

    const generatedOrder = await OrderModel.insertMany(payload)

    for(const order of generatedOrder){
        await ProductModel.updateOne({ _id : order.productId }, { $inc : { stock : -order.quantity } })
    }

    const removeCartItems = await ProductCartModel.deleteMany({ userId : userId })
    const updateInUser = await UserModel.updateOne({ _id : userId }, { shopping_cart : []})
    
    return response.status(200).json({
      message : "Order successfully",
      error : false,
      success : true,
      data : generatedOrder
    })

  } catch (error) {
    return response.status(500).json({
        message : error.message || error ,
        error : true,
        success : false
    })
  }
}

export const PricewithDiscount = (price,dis = 1)=>{
    const DiscountAmount = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(DiscountAmount)
    return actualPrice
}

export async function PaymentController(request,response){
    try {
        const userId = request.userId
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body 

        if (!list_items || !list_items.length || !addressId) {
            return response.status(400).json({
                message: "Missing required payment information",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findById(userId)

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        const line_items = list_items.map(item => {
            return{
               price_data : {
                    currency : 'lkr',
                    product_data : {
                        name : item.productId.name,
                        images : item.productId.image,
                        metadata : {
                            productId : item.productId._id
                        }
                    },
                    unit_amount : PricewithDiscount(item.productId.price, item.productId.discount) * 100   
               },
               adjustable_quantity : {
                    enabled : true,
                    minimum : 1
               },
               quantity : item.quantity 
            }
        })

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressId : addressId
            },
            line_items : line_items,
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return response.status(200).json(session)

    } catch (error) {
        console.error("Payment controller error:", error);
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


const GetOrderProductItems = async ({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
}) => {
    const productList = [];

    try {
        if (!lineItems?.data?.length) {
            console.error("No line items found in GetOrderProductItems");
            return productList;
        }

        for (const item of lineItems.data) {
            try {
                const product = await Stripe.products.retrieve(item.price.product);
                
                if (!product || !product.metadata || !product.metadata.productId) {
                    console.error(`Missing product data for item ${item.id}`);
                    continue;
                }
                
                const amount = item.amount_total / 100;
                
                const payload = {
                    userId: userId,
                    orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                    productId: product.metadata.productId, 
                    product_details: {
                        name: product.name || 'Unknown Product',
                        image: product.images || []
                    },
                    paymentId: paymentId || "",
                    payment_status: payment_status || "paid",
                    delivery_address: addressId,
                    subTotalAmt: amount,
                    totalAmt: amount,
                    quantity: item.quantity || 1,
                    invoice_receipt: `INV-${new mongoose.Types.ObjectId()}`
                };

                productList.push(payload);
            } catch (err) {
                console.error(`Error processing line item ${item.id}:`, err);
            }
        }
    } catch (error) {
        console.error("Error in GetOrderProductItems:", error);
    }

    return productList;
};

export async function WebhookStripe(request, response) {
    const sig = request.headers['stripe-signature'];
    let event;
    
    try {
        event = Stripe.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`Webhook received: ${event.type}`);

    switch (event.type) {
        case 'checkout.session.completed':
            try {
                const session = event.data.object;
                console.log("Processing session:", session.id);
                
                const userId = session.metadata.userId;
                const addressId = session.metadata.addressId;
                
                if (!userId || !addressId) {
                    console.error("Missing metadata in session:", session.id);
                    return response.status(400).json({ 
                        error: true, 
                        message: "Missing required metadata" 
                    });
                }

                const address = await AddressModel.findById(addressId);
                if (!address) {
                    console.error("Address not found:", addressId);
                    return response.status(400).json({ 
                        error: true, 
                        message: "Invalid address" 
                    });
                }

                const lineItems = await Stripe.checkout.sessions.listLineItems(session.id, { 
                    expand: ['data.price.product'] 
                });
                
                if (!lineItems || !lineItems.data || lineItems.data.length === 0) {
                    console.error("No line items found for session:", session.id);
                    return response.status(400).json({ 
                        error: true, 
                        message: "No items found in order" 
                    });
                }
                
                const orderProducts = await GetOrderProductItems({
                    lineItems,
                    userId,
                    addressId,
                    paymentId: session.payment_intent,
                    payment_status: session.payment_status,
                });
                
                console.log(`Generated ${orderProducts.length} order items`);
                
                if (orderProducts.length > 0) {
                    const savedOrders = await OrderModel.insertMany(orderProducts);
                    console.log(`Saved ${savedOrders.length} orders to database`);

                    for(const order of savedOrders){
                        await ProductModel.updateOne({ _id : order.productId }, { $inc : { stock : -order.quantity } })
                    }
                    
                    await ProductCartModel.deleteMany({ userId: userId });
                    await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
                    console.log("Cart cleared for user:", userId);
                } else {
                    console.warn("No order products generated from session:", session.id);
                }
            } catch (err) {
                console.error("Stripe webhook order save error:", err);
                return response.status(500).json({ 
                    error: true, 
                    message: "Failed to process order" 
                });
            }
            break;
            
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
}


export async function GetOrderDetailsController(request,response){
    try {
        const userId = request.userId

        const orderlist = await OrderModel.find({ userId : userId }).sort({ createdAt : -1 }).populate('delivery_address')

        return response.json({
            message : "Order list",
            data : orderlist,
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

export async function UpdateOrderStatusController(request, response) {
  try {
    const { orderId, status } = request.body;

    const validStatuses = ["ordered", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return response.status(400).json({
        message: "Invalid order status provided",
        error: true,
        success: false
      });
    }

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { orderId: orderId },
      { 
        order_status: status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedOrder) {
      return response.status(404).json({
        message: "Order not found",
        error: true,
        success: false
      });
    }

    return response.json({
      message: "Order status updated successfully",
      error: false,
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

export async function GetAllOrdersController(request, response) {
  try {
    const allOrders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .populate('delivery_address')
      .populate('userId', 'name email phone');
      
    return response.json({
      message: "All orders retrieved successfully",
      data: allOrders,
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
