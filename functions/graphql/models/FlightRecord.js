const { firestore } = require("../connectors/firebase");
const tokenGenerator = require("../helpers/tokenGenerator");
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
    redeemingToken /* Used when this was retrieved by token, so we know which station to assign user to */
  }) {
    this.id = id;
    this.date = date;
    this.spaceCenterId = spaceCenterId;
    this.simulators = simulators;
    this.flightTypeId = flightTypeId;
    this.redeemingToken = redeemingToken;
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

  static getFlightRecords(userId, centerId, simulatorId) {
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
          let matchesUser =
            typeof userId !== "undefined"
              ? result.stations.reduce(
                  (accumulator, currentValue) =>
                    accumulator || currentValue.userId === userId,
                  false
                )
              : true;
          return matchesSim && matchesUser;
        });
      });
  }

  static async createFlightRecord(
    centerId,
    thoriumFlightId,
    flightTypeId,
    simulators
  ) {
    // Make sure the required properties are provided, and the related objects exist
    if (typeof centerId === "undefined") {
      throw new Error("Flight records require a space center id.");
    }

    // Build out the simulators in a way for firestore to recognize it
    let simulatorInput = simulators.map(sim => ({
      id: sim.id,
      stations: sim.stations.map(station => {
        let stationData = { name: station.name, badges: station.badges };

        // If there is a valid user on this station, assign the user, otherwise generate a token to be redeemed later
        if (typeof station.userId !== "undefined") {
          stationData.userId = station.userId;
        } else {
          stationData.token = tokenGenerator();
        }

        return stationData;
      })
    }));

    let data = {
      spaceCenterId: centerId,
      thoriumFlightId: thoriumFlightId,
      flightTypeId: flightTypeId,
      simulators: simulatorInput,
      date: new Date() // Set the record to be the current datetime
    };

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

    /**
   * Return the flight record based on the throium flight id
   * @param {str} thoriumFlightId 
   */
  static async getFlightRecordByThoriumId(thoriumFlightId) {
    return firestore().collection(collectionName)
      .where("thoriumFlightId", "==", thoriumFlightId)
      .get()
      .then(ref => (ref.docs.length > 0 ? new FlightRecord({...ref.docs[0].data(), id: ref.docs[0].id}) : false));
  }

  static async getFlightRecordsByUser (userId) {
    let allFlightRecords = await firestore().collection(collectionName).get().then(ref => ref.docs);
    let matchingDocs = allFlightRecords
      // Filter down to just records that have the token
      .filter(doc => doc.data().simulators
        .reduce(
          (prev,simulator) => simulator.stations
            .reduce(
              (prev, next) => (prev = (typeof(next.userId) !== "undefined" && next.userId === userId) || prev), false
            )
          ,false
        )
      )
      // Map the filtered results to flight record objects
      .map(doc => new FlightRecord({
        id: doc.id,
        ...doc.data(),
        // Only include the simulators or stations that the user is on
        // simulators: doc.data().simulators.map(

        // )
      }))
    return matchingDocs;
  }

  /**
   * Assign the user to the current flght record and save to firestore
   * Retrn the new flight record
   */
  async claim(userId) {
    let newId = await firestore().collection(collectionName)
      .doc(this.id)
      .set({
        simulators: this.simulators
          .map(sim => ({...sim, stations: sim.stations
            .map(station => {
              // If the station's token matches the token that is being redeemed, replace the token with the user id
              if (typeof(station.token) !== "undefined" && station.token === this.redeemingToken) {
                delete station.token;
                station.userId = userId;
                return station;
              }
            })
          }))
      }, {merge: true})
    delete this.redeemingToken;
    return this;
  }

  /**
   * Search the list of flight records for a specific token
   * Return the flight record
   * NOTES
   *  - Could be optimized by finding some way to avoid having to search all flight record and their sub-arrays
   */
  static async getFlightRecordByToken(token) {
    let allFlightRecords = await firestore().collection(collectionName).get().then(ref => ref.docs);

    let matchingDoc = allFlightRecords
      // Filter down to just records that have the token
      .filter(doc => doc.data().simulators
        .reduce(
          (prev,simulator) => simulator.stations
            .reduce(
              (prev, next) => (prev = (typeof(next.token) !== "undefined" && next.token === token) || prev), false
            )
          ,false
        )
      )
      // Map the filtered results to flight record objects
      .map(doc => new FlightRecord({
        id: doc.id,
        ...doc.data(),
        redeemingToken: token
      }))
    return matchingDoc[0];
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
