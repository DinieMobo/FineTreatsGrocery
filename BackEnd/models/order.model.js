import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    orderId: {
        type: String,
        required: [true, "Please provide an order Id"],
        unique: true
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        default: ""
    },
    product_details: {
        name : String,
        image : Array,
    },
    paymentId: {
        type: String,
        default: ""
    },
    payment_status: {
        type: String,
        default: ""
    },
    order_status: {
        type: String,
        enum: ["ordered", "processing", "shipped", "delivered", "cancelled"],
        default: "ordered"
    },
    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: "Address"
    },
    subTotalAmt: {
        type: Number,
        default: 0
    },
    totalAmt: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 1
    },
    invoice_receipt: {
        type: String,
        default: ""
    }
},{
    timestamps: true
});

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;