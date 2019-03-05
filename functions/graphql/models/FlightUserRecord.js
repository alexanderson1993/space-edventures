const { firestore } = require("../connectors/firebase");
const tokenGenerator = require("../helpers/tokenGenerator"); // USed to generate a temporary token when the user doesn't exist yet

// =============================================================================
// Class for Querying/Mutating flight user records
/**
 * There isn't a corresponding graphql schema file because these models are interacted with through the flight record endpoints
 */
// =============================================================================

const collectionName = "flightUserRecord";

module.exports = class FlightUserRecord {
  // ===========================================================================
  // Constructor
  // ===========================================================================
  constructor({
    id,
    token,
    userId,
    simulatorId,
    stationName,
    date,
    flightRecordId
  }) {
    this.id = id;
    this.token = token;
    this.userId = userId;
    this.simulatorId = simulatorId;
    this.stationName = stationName;
    this.date = date;
    this.flightRecordId = flightRecordId;
  }

  // ===========================================================================
  // Static methods
  // ===========================================================================
  static async createFightUserRecordFromFlightRecord(flightRecord) {
    return flightRecord.simulators.map(
      sim => sim.stations.map(
        station => this.createFlightUserRecord({
          simulatorId: sim.id,
          token: station.token,
          userId: station.userId,
          stationName: station.name,
          flightRecordId: flightRecord.id
        })
      )
    );
  }

  static async createFlightUserRecord({simulatorId, token, userId, stationName, flightRecordId}) {
    let data = {
      stationName: stationName,
      flightRecordId: flightRecordId,
      simulatorId: simulatorId,
      date: new Date()
    }
    if (typeof(userId) !== "undefined") {
      data.userId = userId;
    }
    if (typeof(token) !== "undefined") {
      data.token = token;
    }
    let newFlightUserRecord = await firestore()
      .collection(collectionName)
      .add(data);
    let newFlightUserRecordData = await firestore()
      .collection(collectionName)
      .doc(newFlightUserRecord.id)
      .get();
      
    return new FlightUserRecord({id: newFlightUserRecordData.id, ...newFlightUserRecordData.data()})
  }

  static async getFlightUserRecordsByUser(userId) {

  }

  // ===========================================================================
  // Non-Static Methods
  // ===========================================================================
  async delete() {

  }

  async save() {

  }
};
