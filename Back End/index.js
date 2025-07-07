import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import uploadRouter from './route/upload.router.js';
import subCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import addressRouter from './route/address.route.js';
import orderRouter from './route/order.route.js';
import { WebhookStripe } from './controllers/order.controller.js';

const app = express()

// Update the CORS configuration to allow Stripe domains
const corsOptions = {
    credentials: true,
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:5173',
            'https://localhost:5173',
            'https://checkout.stripe.com',
            'https://js.stripe.com',
            'https://hooks.stripe.com',
            'https://api.stripe.com',
            'https://m.stripe.network'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log(`Origin ${origin} not allowed by CORS policy. Allowed origins:`, allowedOrigins);
            callback(null, false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature']
};

app.use(cors(corsOptions));

app.post('/api/order/webhook', 
    express.raw({ type: 'application/json' }),
    WebhookStripe
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false
}));

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy", 
        "default-src 'self'; " +
        "script-src 'self' https://js.stripe.com https://checkout.stripe.com blob: 'unsafe-inline' 'unsafe-eval'; " +
        "connect-src 'self' https://*.stripe.com https://api.stripe.com; " +
        "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com; " +
        "img-src 'self' data: https: http:;"
    );
    next();
});

const PORT = process.env.PORT || 8080;

app.get("/",(request, response) => {
    response.json({
        message: "Server is running at " + PORT,
        environment: process.env.NODE_ENV || "development"
    });
});

app.use('/api/user', userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/sub-category", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);

app.use('/api/order', (req, res, next) => {
    if (req.path !== '/webhook') {
        orderRouter(req, res, next);
    } else {
        next();
    }
});

app.use((err, req, res, next) => {
    console.error("Global error handler caught:", err.stack);
    res.status(500).send({
        error: true,
        message: 'Something broke!',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running",PORT)
    })
});
