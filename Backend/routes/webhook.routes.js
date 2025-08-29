const { Router } = require("express");
const bodyParser = require("body-parser");
const WebhookController = require("../controllers/webhook.controller");

const router = Router();
const webhookController = new WebhookController();

// ==================== webhook Routes ====================
router.post(
    "/stripe",
    bodyParser.raw({ type: "application/json" }),
    async (req, res) => {
        await webhookController.handleStripeWebhook(req, res);
    }
);

module.exports = router