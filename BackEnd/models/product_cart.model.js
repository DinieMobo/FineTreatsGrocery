import mongoose from "mongoose";

const productCartSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        default: 1
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
},{
    timestamps: true
});

productCartSchema.index({ userId: 1, productId: 1 }, { unique: true });

const ProductCartModel = mongoose.model("Product_Cart", productCartSchema);

export default ProductCartModel;
