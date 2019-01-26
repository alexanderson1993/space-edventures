// =============================================================================
// Create the Stripe connector for GraphQL
// =============================================================================
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

module.exports = stripe;
