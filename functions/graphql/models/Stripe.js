// =============================================================================
// Class for querying/mutating Stripe
// =============================================================================
const stripe = require("../connectors/stripe");
const util = require("util");

module.exports = class Stripe {
  // ====================================================
  // Query Static Methods
  // ====================================================

  /**
   * Returns all stripe plans
   */
  static getPlans() {
    return stripe.plans.list({}).then(res => res.data);
  }

  /**
   * Param: customerId (string)
   * Returns: Promise(customer)
   */
  static getCustomer(customerId) {
    return stripe.customers.retrieve(customerId);
  }

  // ===========================================================================
  // Mutation Static Methods
  // ===========================================================================

  /**
   * Param name(string), email(string), token(string)
   * Return Promise(customer)
   */
  static createCustomer({ name, email, token }) {
    return stripe.customers.create({
      description: name,
      email,
      source: token // obtained with Stripe.js
    });
  }

  /**
   * Param id
   * Return Promise(boolean)
   */
  static deleteCustomer(id) {
    return stripe.customers.del(id);
  }

  /**
   * Params customerId (string), planId(string), trial (bool)
   * Returns Promise(subscription create event)
   */
  static async subscribe(customerId, planId, trial = false) {
    const customer = await Stripe.getCustomer(customerId);
    if (!customer) return {};
    if (customer.subscriptions.length > 0) {
      // Unsubscribe from every subscription.
      await Promise.all(
        customer.subscriptions.data.map(item =>
          stripe.subscriptions.del(item.id)
        )
      );
    }
    return stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId }],
      trial_from_plan: trial
    });
  }

  /**
   * Deletes the first subscription on the customer (index 0)
   * Params customerId (string)
   * Returns Promise(confirmation)
   */
  static unsubscribe(customerId) {
    return Stripe.getCustomer(customerId).then(customer =>
      stripe.subscriptions.del(customer.subscriptions.data[0].id)
    );
  }

  /**
   * Deletes all the Stripe sources for the customer, then adds the token as their source
   * Params customerId (string), token (string)
   * Returns Promise(card)
   */
  static updatePayment(customerId, token) {
    return Stripe.getCustomer(customerId)
      .then(customer =>
        Promise.all(
          customer.sources.data.map(s =>
            stripe.customers.deleteSource(customerId, s.id)
          )
        )
      )
      .then(() =>
        stripe.customers.createSource(customerId, {
          source: token // obtained with Stripe.js
        })
      );
  }
};
