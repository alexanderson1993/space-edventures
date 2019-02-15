const { firestore } = require("../connectors/firebase");

// =============================================================================
// Class for Querying/Mutating flight types
// =============================================================================

const collectionName = "flightTypes";

module.exports = class FlightType {
  constructor({ id, name, spaceCenterId, classHours, flightHours }) {
    this.id = id;
    this.name = name;
    this.spaceCenterId = spaceCenterId;
    this.classHours = classHours;
    this.flightHours = flightHours;
  }

  static async getFlightType(id) {
    let flightType = await firestore()
      .collection(collectionName)
      .doc(id)
      .get();

    if (!flightType.exists) {
      return false;
    }

    return new FlightType({ ...flightType.data(), id: flightType.id });
  }

  static getFlightTypes(centerId) {
    return firestore()
      .collection(collectionName)
      .where("spaceCenterId", "==", centerId)
      .get()
      .then(ref => {
        return ref.docs.map(
          doc => new FlightType({ ...doc.data(), id: doc.id })
        );
      });
  }

  static async createFlightType(data) {
    // Make sure data contains the space center id
    if (typeof data.spaceCenterId === "undefined") {
      throw new Error("Flight types require a space center id.");
    }

    let newId = (await firestore()
      .collection(collectionName)
      .add(data)).id;

    // If successfully added the id
    if (typeof newId === "undefined") {
      throw new Error("Unable to add new flight type");
    }

    let newFlightType = await firestore()
      .collection(collectionName)
      .doc(newId)
      .get();

    return new FlightType({ ...newFlightType.data(), id: newFlightType.id });
  }

  async editFlightType(newData) {
    let isSuccess = await firestore()
      .collection(collectionName)
      .doc(this.id)
      .set(newData, { merge: true })
      .then(() => true)
      .catch(() => false);
    return isSuccess;
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
