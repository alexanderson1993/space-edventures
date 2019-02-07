const { firestore } = require("../connectors/firebase");
// =============================================================================
// Class for Querying/Mutating Assignments
// =============================================================================

module.exports = class BadgeAssignment {
  static async createAssignment(badgeId, flightRecordId) {
    const assignmentData = await firestore()
        .collection("badgeAssignments")
        .add({
            badgeId,
            flightRecordId,
            dateAwarded: new Date(),
            token: generateFriendlyToken()
        })

    return assignmentData;
  }

  static async getAssignments(badgeId) {
    
  }

  static async getAssignment(id) {

  }

  constructor({ badgeId, flightRecordId, dateAwarded }) {
    this.badgeId = badgeId;
    this.flightRecordId = flightRecordId;
    this.dateAwarded = dateAwarded;
  }
  
  async delete() {

  }
};

function generateFriendlyToken() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}