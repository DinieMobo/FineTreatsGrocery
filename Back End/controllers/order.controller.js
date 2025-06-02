import Stripe from "../config/stripe.js";
import ProductCartModel from "../models/product_cart.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

 export async function CashOnDeliveryOrderController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const payload = list_items.map(el => {
            return({
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : el.productId._id, 
                product_details : {
                    name : el.productId.name,
                    image : el.productId.image
                } ,
                paymentId : "",
                payment_status : "CASH ON DELIVERY",
                delivery_address : addressId ,
                subTotalAmt  : subTotalAmt,
                totalAmt  :  totalAmt,
            })
        })

        const generatedOrder = await OrderModel.insertMany(payload)

        const removeCartItems = await ProductCartModel.deleteMany({ userId : userId })
        const updateInUser = await UserModel.updateOne({ _id : userId }, { shopping_cart : []})

        return response.json({
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

        const user = await UserModel.findById(userId)

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

        const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);
        
        const orderProducts = await GetOrderProductItems({
            lineItems,
            userId,
            addressId,
            paymentId: session.payment_intent,
            payment_status: session.payment_status
        });

        if (orderProducts.length > 0) {
            await OrderModel.insertMany(orderProducts);
            await ProductCartModel.deleteMany({ userId: userId });
            await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
        }

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
                
                const amount = item.amount_total / 100;
                
                const payload = {
                    userId: userId,
                    orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                    productId: product.metadata.productId, 
                    product_details: {
                        name: product.name,
                        image: product.images
                    },
                    paymentId: paymentId,
                    payment_status: payment_status || "paid",
                    delivery_address: addressId,
                    subTotalAmt: amount,
                    totalAmt: amount,
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

                const lineItems = await Stripe.checkout.sessions.listLineItems(session.id, { 
                    expand: ['data.price.product'] 
                });
                
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
                    
                    await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
                    await ProductCartModel.deleteMany({ userId: userId });
                } else {
                    console.warn("No order products generated from session:", session.id);
                }
            } catch (err) {
                console.error("Stripe webhook order save error:", err);
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
