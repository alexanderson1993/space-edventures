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
        station => createFlightUserRecord({
          simulatorId: sim.id,
          token: station.token,
          userId: station.userId,
          stationName: station.name,
          flightRecordId: flightRecord.id
        })
      )
    );
  }

  static async createFightUserRecord({simulatorId, token, userId, stationName, flightRecordId}) {
    let flightUserRecord = await firestore()
      .collection(collectionName)
      .add({
        token: token,
        userId: userId,
        stationName: stationName,
        flightRecordId: flightRecordId,
        simulatorId: simulatorId,
        date: new Date()
      });

    return new FlightUserRecord({id: flightUserRecord.id, ...flightUserRecord.data()})
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
