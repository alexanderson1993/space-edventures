const { firestore } = require("../connectors/firebase");
const { ApolloError } = require("apollo-server-express");
// =============================================================================
// Class for Querying/Mutating Assignments
// =============================================================================

module.exports = class BadgeAssignment {
  constructor({ badgeId, flightRecordId, dateAwarded, id }) {
    this.id = id;
    this.badgeId = badgeId;
    this.flightRecordId = flightRecordId;
    this.dateAwarded = dateAwarded;
  }

  static async createAssignment(badgeId, flightRecordId) {
    const assignmentData = await firestore()
      .collection("badgeAssignments")
      .add({
        badgeId,
        flightRecordId,
        dateAwarded: new Date(),
        token: generateFriendlyToken()
      });

    return assignmentData;
  }

  /**
   * Retrieve a badge assignment from the database, based on the token
   * @param string token
   * @returns BadgeAssignment
   */
  static async getAssignment(token) {
    let badgeAssignments = await firestore()
      .collection("badgeAssignments")
      .where("token", "==", token)
      .get()
      .then(found => found.docs.map(ba => ({ ...ba.data(), id: ba.id })));

    // There should only ever be one badge assignment for a token, but just in case there are conflicts
    if (badgeAssignments.length > 1) {
      throw new ApolloError(`Collision found in badge assignment tokens. Offending token:  '${token}'. Offending assignments: [' 
                ${badgeAssignments.reduce(
                  (a, b, i) => (i === 0 ? b.id : a + "', '" + b.id),
                  ""
                )}]`);
    }

    return new BadgeAssignment({ ...badgeAssignments[0] });
  }

  /**
   * Delete the loaded badge assignment (usally after having claimed it to a user)
   */
  async delete() {}
};

function generateFriendlyToken() {
  var length = 10,
    charset = "abcdefghijklmnopqrstuvwxyz0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
