const { firestore } = require("../connectors/firebase");
const tokenGenerator = require("../helpers/tokenGenerator"); // USed to generate a temporary token when the user doesn't exist yet

// =============================================================================
// Class for Querying/Mutating flight user records
// =============================================================================

const collectionName = "flightUserRecord";

module.exports = class FlightUserRecord {
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

  static async createFightUserRecord(data, generateToken) {

  }

  static async getFlightRecordsByUser(userId) {

  }
};
