const orderService = require("../services/order.service");

class WebhookController {
    /**
     * Handles incoming Stripe webhook events.
     */
    handleStripeWebhook = async (req, res) => {
        try {
            const signature = req.headers["stripe-signature"];
            const rawBody = req.body;

            const result = await orderService.handleStripeWebhook(signature, rawBody)
            res.json({ received: result });
        } catch (err) {
            console.error("Webhook error:", err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
        }
    };
}

module.exports = WebhookController;
