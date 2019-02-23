const Stripe = require("./Stripe");
const { firestore } = require("../connectors/firebase");
const { UserInputError } = require("apollo-server-express");
const uuid = require("uuid");
const uploadFile = require("../helpers/uploadFile");

// =============================================================================
// Class for Querying/Mutating space centers
// =============================================================================

module.exports = class Center {
  static getCenters() {
    return firestore()
      .collection("spaceCenters")
      .get()
      .then(res => res.docs.map(d => ({ ...d.data(), id: d.id })));
  }

  static getCenter(id) {
    return firestore()
      .collection("spaceCenters")
      .doc(id)
      .get()
      .then(res => ({ ...res.data(), id: res.id }));
  }

  static async getCenterByDirector(directorId) {
    const centers = await firestore()
      .collection("spaceCenters")
      .where("directorId", "==", directorId)
      .get();

    if (centers.length > 1) {
      throw new Error(
        "Multiple space centers found for director: director's user id: " +
          directorId
      );
    }

    return centers.docs[0];
  }

  static getByApiToken(token) {
    return firestore()
      .collection("spaceCenters")
      .where("apiToken", "==", token)
      .get()
      .then(res =>
        res.docs.length > 0
          ? { ...res.docs[0].data(), id: res.docs[0].id }
          : null
      );
  }
  static getCenterForUserId(userId) {
    return firestore()
      .collection("spaceCenters")
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
      const newData = {
        name,
        email,
        website,
        registeredDate: new Date(),
        stripeCustomer: customer.id,
        directorId,
        apiToken: uuid.v4()
      };
      return firestore()
        .collection("spaceCenters")
        .add(newData);
    } catch (err) {
      throw new UserInputError(`Unable to create center: ${err.message}`);
    }
  }
  static async setApiToken(directorId) {
    const center = await getCenterByDirector(directorId);
    if (!center || !center.exists)
      throw new UserInputError(
        "The current user is not a director of a space center."
      );
    const apiToken = uuid.v4();
    center.ref.update({ apiToken });
    return { ...center.data(), apiToken, id: center.id };
  }
  constructor(params) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.website = params.website;
    this.imageUrl = params.imageUrl;
  }
  async updateName(name) {
    await firestore()
      .collection("spaceCenters")
      .doc(this.id)
      .update({ name });
    this.name = name;
    return this;
  }
  async updateDescription(description) {
    await firestore()
      .collection("spaceCenters")
      .doc(this.id)
      .update({ description });
    this.description = description;
    return this;
  }
  async updateWebsite(website) {
    this.website = website;
    return this;
  }
  async updateImage(image) {
    const path = `centers/${this.id}/image`;
    const file = await uploadFile(image, path);
    await firestore()
      .collection("spaceCenters")
      .doc(this.id)
      .update({ imageUrl: file.metadata.mediaLink });

    this.imageUrl = file.metadata.mediaLink;
    return this;
  }
};
