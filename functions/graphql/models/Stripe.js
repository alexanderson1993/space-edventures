// =============================================================================
// Class for querying/mutating Stripe
// =============================================================================
const stripe = require("../connectors/stripe");

module.exports = class Stripe {
  // ====================================================
  // Query Static Methods
  // ====================================================

  /**
   * Returns all stripe plans
   */
  static getPlans() {
    return new Promise((resolve, reject) => {
      stripe.plans.list({}, (err, plans) => {
        if (err) return reject(err);
        return resolve(plans.data);
      });
    });
  }

  /**
   * Param: customerId (string)
   * Returns: Promise(customer)
   */
  static getCustomer(customerId) {
    return new Promise((resolve, reject) =>
      stripe.customers.retrieve(customerId, (err, customer) => {
        if (err) return reject(err);
        return resolve(customer);
      })
    );
  }

  // ===========================================================================
  // Mutation Static Methods
  // ===========================================================================

  /**
   * Param name(string), email(string), token(string)
   * Return Promise(customer)
   */
  static createCustomer({ name, email, token }) {
    return new Promise((resolve, reject) =>
      stripe.customers.create(
        {
          description: name,
          email,
          source: token // obtained with Stripe.js
        },
        (err, customer) => {
          if (err) reject(err);
          resolve(customer);
        }
      )
    );
  }

  /**
   * Params customerId (string), planId(string), trial (bool)
   * Returns Promise(subscription create event)
   * TODO (SpEd) Have subscribe check for existing planId before creating the same one
   */
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

  /**
   * Deletes the first subscription on the customer (index 0)
   * Params customerId (string)
   * Returns Promise(confirmation)
   */
  static unsubscribe(customerId) {
    return Stripe.getCustomer(customerId).then(
      customer =>
        new Promise((resolve, reject) =>
          stripe.subscriptions.del(
            customer.subscriptions.data[0].id,
            (err, confirmation) => {
              if (err) return reject(err);
              return resolve(confirmation);
            }
          )
        )
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
          customer.sources.data.map(
            s =>
              new Promise((resolve, reject) => {
                stripe.customers.deleteSource(
                  customerId,
                  s.id,
                  (err, source) => {
                    if (err) reject(err);
                    resolve();
                  }
                );
              })
          )
        )
      )
      .then(
        () =>
          new Promise((resolve, reject) => {
            stripe.customers.createSource(
              customerId,
              {
                source: token // obtained with Stripe.js
              },
              (err, card) => {
                if (err) return reject(err);
                return resolve(card);
              }
            );
          })
      );
  }
};
