const stripe = require("../connectors/stripe");
const util = require("util");

module.exports = class Stripe {
  // Query Static Methods
  static getPlans() {
    return stripe.plans.list({}).then(res => res.data);
  }
  static getCustomer(customerId) {
    return stripe.customers.retrieve(customerId);
  }

  // Mutation Static Methods
  static createCustomer({ name, email, token }) {
    return stripe.customers.create({
      description: name,
      email,
      source: token // obtained with Stripe.js
    });
  }
  static async subscribe(customerId, planId, trial = false) {
    const customer = await Stripe.getCustomer(customerId);
    if (customer.subscriptions.length > 0) {
      return stripe.subscriptions.create({
        customer: customerId,
        items: [{ plan: planId }],
        trial_from_plan: trial
      });
    }
  }
  static unsubscribe(customerId) {
    return Stripe.getCustomer(customerId).then(customer =>
      stripe.subscriptions.del(customer.subscriptions.data[0].id)
    );
  }
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
