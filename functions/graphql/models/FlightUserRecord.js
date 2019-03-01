const { firestore } = require("../connectors/firebase");

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
    spaceCenterId,
    badges = [],
    date,
    flightTypeId,
    flightRecordId
  }) {
    this.id = id;
    this.token = token;
    this.userId = userId;
    this.simulatorId = simulatorId;
    this.stationName = stationName;
    this.spaceCenterId = spaceCenterId;
    this.badges = badges;
    this.date = date;
    this.flightTypeId = flightTypeId;
    this.flightRecordId = flightRecordId;
  }
};
