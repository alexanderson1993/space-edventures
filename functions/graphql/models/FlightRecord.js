const { firestore } = require("../connectors/firebase");
const { flightRecordLoader } = require("../loaders");
// =============================================================================
// Class for Querying/Mutating flight records
// =============================================================================

const collectionName = "flightRecords";

module.exports = class FlightRecord {
  constructor({
    id,
    date,
    spaceCenterId,
    simulators,
    flightTypeId,
  }) {
    this.id = id;
    this.date = date;
    this.spaceCenterId = spaceCenterId;
    this.simulators = simulators;
    this.flightTypeId = flightTypeId;
  }

  static async getFlightRecord(id) {
    const flightRecord = await flightRecordLoader.load(id);
    if (!flightRecord) {
      return false;
    };
    return new FlightRecord(flightRecord);
  }

  static flightRecordCount(centerId) {
    return firestore()
      .collection(collectionName)
      .where("spaceCenterId", "==", centerId)
      .get()
      .then(res => res.size);
  }
  static getFlightRecords(centerId, simulatorId) {
    let matchingRecords = firestore().collection(collectionName);

    if (typeof centerId !== "undefined") {
      matchingRecords = matchingRecords.where("spaceCenterId", "==", centerId);
    }

    // return Promise.all(
    return matchingRecords
      .get()
      .then(ref => {
        return ref.docs.map(doc => {
          return new FlightRecord({ ...doc.data(), id: doc.id });
        });
      })
      .then(results => {
        return results.filter(result => {
          let matchesSim =
            typeof simulatorId !== "undefined"
              ? result.simulatorId === simulatorId
              : true;
          
          return matchesSim;
        });
      });
  }

  static async createFlightRecord(
    centerId,
    thoriumFlightId,
    flightTypeId,
    simulators,
    overwriteId,
    date
  ) {
    // Make sure the required properties are provided, and the related objects exist
    if (typeof centerId === "undefined") {
      throw new Error("Flight records require a space center id.");
    }

    // Build out the simulators in a way for firestore to recognize it
    let simulatorInput;

    if (typeof simulators !== "undefined") {
      simulatorInput = simulators.map(sim => ({
        id: sim.id,
        stations: sim.stations.map(station => {
          let stationData = { name: station.name, badges: station.badges };

          return stationData;
        })
      }));
    }

    // These parameters will be
    let data = {
      spaceCenterId: centerId,
      date: new Date()
    };

    if (typeof thoriumFlightId !== "undefined")
      data.thoriumFlightId = thoriumFlightId;
    if (typeof flightTypeId !== "undefined") data.flightTypeId = flightTypeId;
    if (typeof simulatorInput !== "undefined") data.simulators = simulatorInput;
    if (typeof date !== "undefined") data.date = date;

    // If they provided an overwrite ID, merge with existing object, otherwise create a new object
    if (typeof overwriteId !== "undefined") {
      // --- Edit existing object --- //
      let result = await firestore()
        .collection(collectionName)
        .doc(overwriteId)
        .set(data, { merge: true });
      return true;
    } else {
      // --- Create a new object --- //
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
  }

  /**
   * Return the flight record based on the throium flight id
   * @param {str} thoriumFlightId
   */
  static async getFlightRecordByThoriumId(thoriumFlightId) {
    return firestore()
      .collection(collectionName)
      .where("thoriumFlightId", "==", thoriumFlightId)
      .get()
      .then(ref =>
        ref.docs.length > 0
          ? new FlightRecord({ ...ref.docs[0].data(), id: ref.docs[0].id })
          : false
      );
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
