const Stripe = require("./Stripe");
const { firestore } = require("../connectors/firebase");
const { UserInputError } = require("apollo-server-express");
const User = require("./User");
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
      .then(res =>
        res.docs.map(d => ({ ...d.data(), id: d.id, centerId: d.id }))
      );
  }

  static getCenter(id) {
    return firestore()
      .collection("spaceCenters")
      .doc(id)
      .get()
      .then(res => ({ ...res.data(), id: res.id, centerId: res.id }));
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
    const centerRef = centers.docs[0];
    return { ...centerRef.data(), id: centerRef.id, centerId: centerRef.id };
  }

  static getByApiToken(token) {
    return firestore()
      .collection("spaceCenters")
      .where("apiToken", "==", token)
      .get()
      .then(res =>
        res.docs.length > 0
          ? {
              ...res.docs[0].data(),
              id: res.docs[0].id,
              centerId: res.docs[0].id
            }
          : null
      );
  }
  static async getCentersForUserId(userId) {
    const user = await User.getUserById(userId);
    const centerIds = Object.entries(user.roles || [])
      .filter(
        ([key, value]) => value.includes("director") || value.includes("staff")
      )
      .map(([key]) => key);
    const documentRefs = centerIds.map(id =>
      firestore().doc(`spaceCenters/${id}`)
    );

    return firestore()
      .getAll(documentRefs)
      .then(res =>
        res.map(doc => ({ ...doc.data(), id: doc.id, centerId: doc.id }))
      );
  }
  static async createCenter(
    directorId,
    { name, email, website, token, planId }
  ) {
    // Create the center object in the database, create a stripe customer, and subscribe them
    // to the subscription plan specified by planId
    const director = new User(await User.getUserById(directorId));
    if (!director)
      throw new UserInputError(
        `Unable to create center: Invalid Director ID. Are you logged in?`
      );

    try {
      const customer = await Stripe.createCustomer({ name, email, token });
      await Stripe.subscribe(customer.id, planId, true);
      const newData = {
        name,
        email,
        website,
        registeredDate: new Date(),
        stripeCustomer: customer.id,
        apiToken: uuid.v4()
      };

      const center = await firestore()
        .collection("spaceCenters")
        .add(newData);

      // Add the director role to the user
      director.setRole({ centerId: center.id, role: "director" });
    } catch (err) {
      throw new UserInputError(`Unable to create center: ${err.message}`);
    }
  }
  static async setApiToken(centerId) {
    const center = await Center.getCenter(centerId);
    if (!center) throw new UserInputError("Center does not exist.");
    const apiToken = uuid.v4();
    await firestore()
      .collection("spaceCenters")
      .doc(center.id)
      .update({ apiToken });
    return { ...center, apiToken };
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
