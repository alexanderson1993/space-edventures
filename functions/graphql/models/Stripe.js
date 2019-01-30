const stripe = require("../connectors/stripe");
const util = require("util");

module.exports = class Stripe {
  // Query Static Methods
  static getPlans() {
    util.promisify(stripe.plans.list({}));
  }
  static getCustomer(customerId) {
    util.promisify(stripe.customers.retrieve(customerId));
  }

  // Mutation Static Methods
  static createCustomer({ name, email, token }) {
    return util.promisify(
      stripe.customers.create({
        description: name,
        email,
        source: token // obtained with Stripe.js
      })
    );
  }
  static subscribe(customerId, planId, trial = false) {
    return new Promise((resolve, reject) =>
      stripe.subscriptions.create(
        {
          customer: customerId,
          items: [{ plan: planId }],
          trial_from_plan: trial
        },
        (err, sub) => {
          if (err) reject(err);
          resolve();
        }
      )
    );
  }
  static unsubscribe(customerId) {
    return Stripe.getCustomer(customerId).then(customer =>
      util.promisify(
        stripe.subscriptions.del(customer.subscriptions.data[0].id)
      )
    );
  }
  static updatePayment(customerId, token) {
    return Stripe.getCustomer(customerId)
      .then(customer =>
        Promise.all(
          customer.sources.data.map(s =>
            util.promisify(stripe.customers.deleteSource(customerId, s.id))
          )
        )
      )
      .then(() =>
        util.promisify(
          stripe.customers.createSource(customerId, {
            source: token // obtained with Stripe.js
          })
        )
      );
  }
};
