const Stripe = require("./Stripe");
const { firestore } = require("../connectors/firebase");
const { UserInputError } = require("apollo-server-express");

// =============================================================================
// Class for Querying/Mutating space centers
// =============================================================================

module.exports = class Center {
  static getCenters() {
    return firestore()
      .collection("centers")
      .get()
      .then(res => res.docs.map(d => ({ ...d.data(), id: d.id })));
  }
  static getCenter(id) {
    return firestore()
      .collection("centers")
      .doc(id)
      .get()
      .then(res => ({ ...res.data(), id: res.id }));
  }
  static getCenterForUserId(userId) {
    return firestore()
      .collection("centers")
      .where("directorId", "==", userId)
      .get()
      .then(res =>
        res.docs.length > 0
          ? { ...res.docs[0].data(), id: res.docs[0].id }
          : null
      );
  }
  static async createCenter(
    directorId,
    { name, email, website, token, planId }
  ) {
    // Create the center object in the database, create a stripe customer, and subscribe them
    // to the subscription plan specified by planId

    try {
      const customer = await Stripe.createCustomer({ name, email, token });
      await Stripe.subscribe(customer.id, planId, true);
      return firestore()
        .collection("centers")
        .add({
          name,
          email,
          website,
          registeredDate: new Date(),
          stripeCustomer: customer.id,
          directorId
        });
    } catch (err) {
      console.log(err);
      throw new UserInputError(`Unable to create center: ${err.message}`);
    }
  }
};
