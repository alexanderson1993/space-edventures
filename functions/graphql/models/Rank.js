const { firestore } = require("../connectors/firebase");

// =============================================================================
// Class for Querying/Mutating flight types
// =============================================================================

const collectionName = "ranks";

module.exports = class Rank {
  constructor({ id, name, description, classHours, flightHours }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.classHours = classHours;
    this.flightHours = flightHours;
  }

  static async getRank(id) {
    let rank = await firestore()
      .collection(collectionName)
      .doc(id)
      .get();

    if (!rank.exists) {
      return false;
    }

    return new Rank({ ...rank.data(), id: rank.id });
  }

  static getRanks() {
    return firestore()
      .collection(collectionName)
      .get()
      .then(ref => {
        return ref.docs.map(doc => new Rank({ ...doc.data(), id: doc.id }));
      });
  }

  static async create(data) {
    // Turns any undefined entry into an empty string.
    const parsedData = Object.entries(data).reduce(
      (prev, [key, value]) => ({ ...prev, [key]: value || "" }),
      {}
    );
    let newId = (await firestore()
      .collection(collectionName)
      .add(parsedData)).id;

    // If successfully added the id
    if (!newId) {
      throw new Error("Unable to add new rank.");
    }

    let newRank = await firestore()
      .collection(collectionName)
      .doc(newId)
      .get();

    return new Rank({ ...newRank.data(), id: newRank.id });
  }

  async edit({ name, description, flightHours, classHours }) {
    const data = {};
    if (name) {
      this.name = name;
      data.name = name;
    }
    if (description) {
      this.description = description;
      data.description = description;
    }
    if (flightHours || flightHours === 0) {
      this.flightHours = flightHours;
      data.flightHours = flightHours;
    }
    if (classHours || classHours === 0) {
      this.classHours = classHours;
      data.classHours = classHours;
    }
    await firestore()
      .collection(collectionName)
      .doc(this.id)
      .set(data, { merge: true });
    return this;
  }

  async delete() {
    const isSuccess = await firestore()
      .collection(collectionName)
      .doc(this.id)
      .delete()
      .then(() => true)
      .catch(() => false);
    return isSuccess;
  }
};
