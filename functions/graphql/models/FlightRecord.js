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
    simulatorId,
    flightTypeId
  }) {
    this.id = id;
    this.date = date;
    this.spaceCenterId = spaceCenterId;
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

  static getFlightRecords(userId, centerId, simulatorId) {
    let matchingRecords = firestore().collection(collectionName)
    
    if (typeof(centerId) !== 'undefined') {
      matchingRecords = matchingRecords.where("spaceCenterId", "==", centerId);
    }
      
    // return Promise.all(
    return matchingRecords.get()
    .then(ref => {
      return ref.docs.map(
        doc => {
          return new FlightRecord({ ...doc.data(), id: doc.id })
        }
      );
    })
    .then((results) => {
      return results.filter((result) => {
        let matchesSim = (typeof(simulatorId) !== 'undefined' ? result.simulatorId === simulatorId : true);
        let matchesUser = (typeof(userId) !== 'undefined' 
          ? result.stations.reduce(
            (accumulator, currentValue)=>(accumulator || currentValue.userId === userId), false
          ) 
          : true
        );
        return (matchesSim && matchesUser);
      })
    })
  }

  static async createFlightRecord(centerId, thoriumFlightId, flightTypeId, simulators) {
    // Make sure the required properties are provided, and the related objects exist
    if (typeof centerId === "undefined") {
      throw new Error("Flight records require a space center id.");
    }

    
    // Build out the simulators in a way for firestore to recognize it
    let simulatorInput = simulators.map(
      sim => ({id: sim.id, stations: sim.stations.map(
        (station)=>{
          let stationData = {name: station.name, badges: station.badges};

          // If there is a valid user on this station, assign the user, otherwise generate a token to be redeemed later
          if (typeof(station.userId) !== 'undefined') {
            stationData.userId = station.userId;
          } else {
            stationData.token = tokenGenerator();
          }

          return stationData;
        }
      )})
    );

    let data = {
      spaceCenterId: centerId,
      thoriumFlightId: thoriumFlightId,
      flightTypeId: flightTypeId,
      simulatorInput: simulatorInput,
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
