import { Router } from 'express'
import chatbotController from '../controllers/chatbot.controller.js';

const chatbotRouter = Router();

chatbotRouter.post('/webhook', (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  
  switch (intent) {
    case 'ProductDetails':
      return chatbotController.handleProductDetailsIntent(req, res);
    case 'ProductAvailability':
      return chatbotController.handleProductAvailabilityIntent(req, res);
    case 'ProductPrice':
      return chatbotController.handleProductPriceIntent(req, res);
    default:
      return res.json({
        fulfillmentText: "I'm not sure how to help with that yet."
      });
  }
});

export default chatbotRouter;