const { firestore } = require("../connectors/firebase");

// =============================================================================
// Class for Querying/Mutating flight records
// =============================================================================

const collectionName = "flightRecords";

module.exports = class FlightRecord {
  constructor({
    id,
    date,
    spaceCenterId,
    participantId,
    simulatorId,
    flightTypeId
  }) {
    this.id = id;
    this.date = date;
    this.spaceCenterId = spaceCenterId;
    this.participantId = participantId;
    this.simulatorId = simulatorId;
    this.flightTypeId = flightTypeId;
  }

  static async getFlightRecord(id) {
    let flightRecord = await firestore()
      .collection(collectionName)
      .doc(id)
      .get();

    if (!flightRecord.exists) {
      return false;
    }

    return new FlightRecord({ ...flightRecord.data(), id: flightRecord.id });
  }

  static getFlightRecords(userId) {
    return firestore()
      .collection(collectionName)
      .where("participantId", "==", userId)
      .get()
      .then(ref => {
        return ref.docs.map(
          doc => new FlightRecord({ ...doc.data(), id: doc.id })
        );
      });
  }

  static async createFlightRecord(data) {
    // Make sure the required properties are provided, and the related objects exist
    // if (typeof data.spaceCenterId === "undefined") {
    //   throw new Error("Flight types require a space center id.");
    // }

    let newId = (await firestore()
      .collection(collectionName)
      .add(data)).id;

    // If successfully added the id
    if (typeof newId === "undefined") {
      throw new Error("Unable to add new flight record");
    }

    let newFlightRecord = await firestore()
      .collection(collectionName)
      .doc(newId)
      .get();

    return new FlightRecord({
      ...newFlightRecord.data(),
      id: newFlightRecord.id
    });
  }

  async editFlightRecord(newData) {
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
