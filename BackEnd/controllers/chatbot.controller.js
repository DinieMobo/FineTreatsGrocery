import ProductModel from "../models/product.model.js";

const chatbotController = {
    handleProductDetailsIntent: async (req, res) => {
        try {
            const productName = req.body.queryResult?.parameters?.product;
            
            if (!productName) {
                return res.json({
                    fulfillmentText: "I couldn't find the product name in your request. Please try again."
                });
            }

            const product = await ProductModel.findOne({ 
                name: { $regex: productName, $options: 'i' } 
            });
            
            if (product) {
                return res.json({
                    fulfillmentText: `${product.name}: ${product.description || 'No description available'}. Price: Rs.${product.price}`
                });
            } else {
                return res.json({
                    fulfillmentText: `Sorry, I couldn't find information about "${productName}".`
                });
            }
        } catch (error) {
            console.error("Chatbot product details error:", error);
            return res.json({
                fulfillmentText: "Sorry, I encountered an error while looking up the product."
            });
        }
    },

    handleProductAvailabilityIntent: async (req, res) => {
        try {
            const productName = req.body.queryResult?.parameters?.product;
            
            if (!productName) {
                return res.json({
                    fulfillmentText: "I couldn't find the product name in your request. Please try again."
                });
            }

            const product = await ProductModel.findOne({ 
                name: { $regex: productName, $options: 'i' } 
            });
            
            if (product) {
                const availability = product.stock > 0 ? `Yes, we have ${product.stock} units in stock.` : "Sorry, this product is currently out of stock.";
                return res.json({
                    fulfillmentText: `${product.name}: ${availability}`
                });
            } else {
                return res.json({
                    fulfillmentText: `Sorry, I couldn't find "${productName}" in our inventory.`
                });
            }
        } catch (error) {
            console.error("Chatbot availability error:", error);
            return res.json({
                fulfillmentText: "Sorry, I encountered an error while checking product availability."
            });
        }
    },

    handleProductPriceIntent: async (req, res) => {
        try {
            const productName = req.body.queryResult?.parameters?.product;
            
            if (!productName) {
                return res.json({
                    fulfillmentText: "I couldn't find the product name in your request. Please try again."
                });
            }

            const product = await ProductModel.findOne({ 
                name: { $regex: productName, $options: 'i' } 
            });
            
            if (product) {
                let priceText = `${product.name} costs Rs.${product.price}`;
                if (product.discount && product.discount > 0) {
                    const discountedPrice = Math.ceil(product.price - (product.price * product.discount / 100));
                    priceText += ` (${product.discount}% off - now Rs.${discountedPrice})`;
                }
                return res.json({
                    fulfillmentText: priceText
                });
            } else {
                return res.json({
                    fulfillmentText: `Sorry, I couldn't find the price for "${productName}".`
                });
            }
        } catch (error) {
            console.error("Chatbot price error:", error);
            return res.json({
                fulfillmentText: "Sorry, I encountered an error while looking up the price."
            });
        }
    }
};

export default chatbotController;