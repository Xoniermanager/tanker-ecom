const Stripe = require("stripe");
const customError = require("../utils/error");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Stripe Payment Service
 * Handles creating and managing payments.
 */
class StripeService {
    
    async createPaymentIntent(amount, currency = "nzd") {
        try {
            const amountInCents = Math.round(amount * 100);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountInCents,
                currency,
                automatic_payment_methods: { enabled: true },
            });

            console.log('paymentIntent: ', paymentIntent);

            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                amountInCents: paymentIntent.amount,
                currency: currency
            };
        } catch (error) {
            throw customError(error.message, 400);
        }
    }


    constructEvent(rawBody, signature) {
        return stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    }

    
    async confirmPayment(paymentIntentId, paymentMethodId) {
        try {
            const confirmedIntent = await stripe.paymentIntents.confirm(
                paymentIntentId,
                { payment_method: paymentMethodId }
            );
            return confirmedIntent;
        } catch (error) {
            throw customError(error.message, 400);
        }
    }

    
    async refundPayment(paymentIntentId, amount = null) {
        try {
            const refund = await stripe.refunds.create({
                payment_intent: paymentIntentId,
                amount: amount ? Math.round(amount * 100) : undefined,
            });
            return refund;
        } catch (error) {
            throw customError(error.message, 400);
        }
    }

   
    async getPayment(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            return paymentIntent;
        } catch (error) {
            throw customError(error.message, 400);
        }
    }


    async createCheckoutSession({ items, successUrl, cancelUrl }) {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: items,
                mode: "payment",
                success_url: successUrl,
                cancel_url: cancelUrl,
                currency: "nzd", 
            });

            return session;
        } catch (error) {
            throw customError(`Stripe session creation failed: ${error.message}`, 500);
        }
    }

    /**
     * Retrieve a Stripe Session by ID
     * @param {String} sessionId
     * @returns {Object} session
     */
    async getSession(sessionId) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            return session;
        } catch (error) {
            throw customError(`Stripe session fetch failed: ${error.message}`, 500);
        }
    }
}

module.exports = new StripeService();
