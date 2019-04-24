const { firestore } = require("../connectors/firebase");
const tokenGenerator = require("../helpers/tokenGenerator"); // USed to generate a temporary token when the user doesn't exist yet
const {
  hoursLoader,
  badgeLoader,
  flightTypeLoader,
  flightRecordLoader,
  flightRecordUserLoader,
  flightRecordUserLoaderByBadge
} = require("../loaders");
const emailTransport = require("../helpers/email");
const User = require("./User");
const Simulator = require("./Simulator");
const Badge = require("./Badge");
const FlightRecord = require("./FlightRecord");
const congrats = require("../emails/congrats");
const redeem = require("../emails/redeem");

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
    flightRecordId,
    badges
  }) {
    this.id = id;
    this.token = token;
    this.userId = userId;
    this.simulatorId = simulatorId;
    this.stationName = stationName;
    this.date = date;
    this.flightRecordId = flightRecordId;
    this.badges = badges; // Allows quick queries of all users who have a badge
  }

  // ===========================================================================
  // Static methods
  // ===========================================================================
  static async getById(id) {
    return firestore()
      .collection(collectionName)
      .doc(id)
      .get()
      .then(doc => doc && new FlightUserRecord({ id: doc.id, ...doc.data() }));
  }
  static async getByToken(token) {
    return firestore()
      .collection(collectionName)
      .where("token", "==", token.toLowerCase())
      .get()
      .then(ref => ref.docs[0])
      .then(doc => doc && new FlightUserRecord({ id: doc.id, ...doc.data() }));
  }

  static createFlightUserRecordsFromFlightRecord(flightRecord, silent) {
    return Promise.all(
      flightRecord.simulators.map(sim =>
        sim.stations.map(station =>
          this.createFlightUserRecord(
            {
              simulatorId: sim.simulatorId,
              token: station.token,
              userId: station.userId,
              email: station.email,
              stationName: station.name,
              flightRecordId: flightRecord.id,
              badges: station.badges,
              logs: station.logs || []
            },
            silent
          )
        )
      )
    );
  }

  static async createFlightUserRecord(
    {
      simulatorId,
      token,
      userId,
      stationName,
      flightRecordId,
      badges,
      logs,
      email
    },
    silent
  ) {
    let data = {
      stationName,
      flightRecordId,
      simulatorId,
      badges,
      logs,
      date: new Date()
    };
    if (email) data.email = email;
    if (typeof userId !== "undefined") {
      data.userId = userId;
    }
    if (typeof token !== "undefined") {
      data.token = token;
    }
    let newFlightUserRecord = await firestore()
      .collection(collectionName)
      .add(data);
    let newFlightUserRecordData = await firestore()
      .collection(collectionName)
      .doc(newFlightUserRecord.id)
      .get();

    // Send some emails
    const simulator = await Simulator.getSimulator(simulatorId);
    const badgeRecords = await badgeLoader.loadMany(badges);
    const flightRecord = await flightRecordLoader.load(flightRecordId);
    const flightType = await flightTypeLoader.load(flightRecord.flightTypeId);

    if (!silent) {
      if (data.userId) {
        // Send a congratulatory email
        const user = await User.getUserById(data.userId);
        if (user) {
          emailTransport.sendMail({
            from: `"Space EdVentures" hello@spaceedventures.org`,
            to: user.email,
            subject: "Your flight has been recorded",
            html: congrats({
              ...data,
              simulator,
              badges: badgeRecords,
              flightType
            })
          });
        }
      } else if (data.email && data.token) {
        // Send an email with the token
        emailTransport.sendMail({
          from: `"Space EdVentures" hello@spaceedventures.org`,
          to: data.email,
          subject: "Redeem your SpaceEdventures Flight",
          html: redeem({ ...data, simulator, badges: badgeRecords, flightType })
        });
      }
    }
    // Clear out some loaders so we don't have a stale cache
    if (data.userId) {
      hoursLoader
        .clear({ userId, hourType: "flightHours" })
        .clear({ userId, hourType: "classHours" });
      flightRecordUserLoader.clear(userId);
    }
    flightRecordUserLoaderByBadge.clearAll();

    return new FlightUserRecord({
      id: newFlightUserRecordData.id,
      ...newFlightUserRecordData.data()
    });
  }

  static async getFlightUserRecordsByUser(userId, limit, skip) {
    if (limit || skip) {
      return firestore()
        .collection("flightUserRecord")
        .where("userId", "==", userId)
        .orderBy("date", "desc")
        .startAt(skip || 0)
        .limit(limit || 25)
        .get()
        .then(ref => ref.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    return flightRecordUserLoader.load(userId);
  }

  static async getFlightUserRecordsByBadge(badgeId) {
    let flightUserRecords = await flightRecordUserLoaderByBadge.load(badgeId);
    return flightUserRecords.map(record => new FlightUserRecord(record));
  }

  static async deleteFlightUserRecordsByFlightRecordId(id) {
    return firestore()
      .collection(collectionName)
      .where("flightRecordId", "==", id)
      .get()
      .then(ref =>
        ref.docs.map(doc =>
          firestore()
            .collection(collectionName)
            .doc(doc.id)
            .delete()
        )
      );
  }

  static async editFlightUserRecordsByFlightRecord(flightRecord) {
    await FlightUserRecord.deleteFlightUserRecordsByFlightRecordId(
      flightRecord.id
    );
    return FlightUserRecord.createFlightUserRecordsFromFlightRecord(
      flightRecord
    );
  }

  // ===========================================================================
  // Non-Static methods
  // ===========================================================================
  claim(userId) {
    delete this.token;
    this.userId = userId;
    return this.save();
  }

  save() {
    // Filter out any undefined values
    const values = Object.entries(this)
      .filter(([key, value]) => key !== "id" && value)
      .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});
    return firestore()
      .collection(collectionName)
      .doc(this.id)
      .set({
        ...values
      });
  }
};
