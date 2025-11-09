import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    avatar: {
        type: String,
        default: ""
    },
    phone: {
        type: Number,
        default: null
    },
    refresh_token: {
        type: String,
        default: ""
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    last_login_date: {
        type: Date,
        default: ""
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    address_details: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        }
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product_Cart"
        }
    ],
    order_history: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
        }
    ],
    forgot_password_otp: {
        type: String,
        default: null
    },
    forgot_password_expiry: {
        type: Date,
        default: ""
    },
    role : {
        type : String,
        enum : ["Admin","User"],
        default : "User"
    },
    theme_preference: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system"
    },
    ui_preferences: {
        language: {
            type: String,
            default: "en"
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            },
            marketing: {
                type: Boolean,
                default: false
            }
        },
        display: {
            compact_mode: {
                type: Boolean,
                default: false
            },
            show_prices_with_tax: {
                type: Boolean,
                default: true
            }
        }
    },
},{
    timestamps: true
})

const UserModel = mongoose.model("User", userSchema);

export default UserModel;