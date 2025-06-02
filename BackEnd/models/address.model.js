import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    address_line1: {
        type : String,
        default: ""
    },
    address_line2: {
        type : String,
        default: ""
    },
    city: {
        type : String,
        default: ""
    },
    state: {
        type : String,
        default: ""
    },
    zipcode: {
        type : Number,
        default: null
    },
    country: {
        type : String,
        default: ""
    },
    phone: {
        type : Number,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        default : ""
    }
},{
    timestamps: true
});

const AddressModel = mongoose.model("Address", addressSchema);

export default AddressModel;