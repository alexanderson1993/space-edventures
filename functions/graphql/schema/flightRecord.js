const {
  gql,
  UserInputError,
  ForbiddenError
} = require("apollo-server-express");
const {
  FlightRecord,
  FlightType,
  Simulator,
  Badge,
  User,
  Center,
  FlightUserRecord // Used to mirror the data in a way that makes it easier to query based on user
} = require("../models");
const tokenGenerator = require("../helpers/tokenGenerator");
const { hoursLoader } = require("../loaders");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type FlightRecord {
    id: ID!
    thoriumFlightId: ID!
    date: Date

    # There are several properties added through extension:
    # Flight Type
    # Simulators
    # Center
  }

  input FlightSimulatorInput {
    id: ID! # The ID of the Space Edventures simulator
    stations: [FlightStationInput]
  }

  input FlightStationInput {
    name: String! # The name of the station. Required
    badges: [ID]! # The list of badges that the station earned. Includes missions
    token: String # The token generated by Thorium and shown on the station
    email: String # The user's email address, for emailing them their token or linking to their user
    logs: [OfficerLogInput]
    userId: ID # ID of the user who was at this station for this flight
  }

  # Get all the flight records that are tied to this particular badge (meaning that they have a station assigned to that badge)
  extend type Badge {
    users: [User] @auth(requires: [director])
  }

  extend type User {
    flights: [FlightUserRecord] @auth(requires: [authenticated, self, director])
  }

  extend type Query {
    # CenterID is required for director auth
    flightRecord(id: ID!, centerId: ID!): FlightRecord
      @auth(requires: [director])

    flightRecords(userId: ID, centerId: ID!, simulatorId: ID): [FlightRecord]
      @auth(requires: [director])
  }

  extend type Profile {
    flightHours: Float
    classHours: Float
  }

  extend type Center {
    flightRecordCount: Int @auth(requires: [director])
    flightRecords(limit: Int, skip: Int): [FlightRecord]
      @auth(requires: [director])
  }

  extend type FlightUserRecord {
    flightRecord: FlightRecord
  }

  extend type Mutation {
    # Creates the record of the flight
    # Uses the ID of the flight from Thorium so a flight cannot be recorded twice
    flightRecordCreate(
      thoriumFlightId: ID!
      flightTypeId: ID!
      centerId: ID!
      simulators: [FlightSimulatorInput!]!
    ): FlightRecord @auth(requires: [center, director])

    flightClaim(token: String!): FlightUserRecord
      @auth(requires: [authenticated])

    flightEdit(
      id: ID!
      thoriumFlightId: ID
      date: Date
      flightTypeId: ID
      simulators: [FlightSimulatorInput]
      centerId: ID!
    ): FlightRecord @auth(requires: [director])

    flightDelete(id: ID!, centerId: ID!): Boolean @auth(requires: [director])
  }
  # We can extend other graphQL types using the "extend" keyword.
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    flightRecord: async (rootQuery, { id, centerId }, context) => {
      flightRecord = await FlightRecord.getFlightRecord(id);

      // Make sure this director has permission to view this flight record (it's for a space center they own)
      if (flightRecord.spaceCenterId !== centerId) {
        throw new ForbiddenError(
          "You cannot view a flight record for a space center you do not own"
        );
      }

      return FlightRecord.getFlightRecord(id);
    },
    flightRecords: async (
      rootQuery,
      { userId, centerId, simulatorId },
      context
    ) => {
      const records = await FlightRecord.getFlightRecords(
        userId,
        centerId,
        simulatorId
      );
      return records;
    }
  },
  Profile: {
    flightHours: async (profile, args, context) => {
      return hoursLoader.load({
        userId: profile.userId,
        hourType: "flightHours"
      });
    },
    classHours: async (profile, args, context) => {
      return hoursLoader.load({
        userId: profile.userId,
        hourType: "classHours"
      });
    }
  },
  Mutation: {
    /**
     * Assign a flight record to a user, based on the token. Assign to currently authentiated graphql user
     */
    flightClaim: async (rootQuery, { token }, context) => {
      // User id of currently logged in user to claim the token
      let flightUserRecord = await FlightUserRecord.getByToken(token);

      if (!flightUserRecord) {
        throw new UserInputError(
          "No flight user records were found for this token."
        );
      }

      let flightRecord = await FlightRecord.getFlightRecord(
        flightUserRecord.flightRecordId
      );

      if (!flightRecord) {
        throw new UserInputError(
          "No flight user records were found for this token."
        );
      }

      await flightRecord.claim(context.user.id, token);
      await flightUserRecord.claim(context.user.id);
      return flightUserRecord;
    },

    /**
     * Creates a flight record for the logged in center
     */
    flightRecordCreate: async (
      rootQuery,
      { thoriumFlightId, flightTypeId, simulators, centerId },
      context
    ) => {
      // Make sure this center has this flight type ID
      let flightType = await FlightType.getFlightType(flightTypeId);
      if (!flightType && flightType.spaceCenterId !== centerId) {
        throw new UserInputError("Invalid flight type id provided.");
      }
      // Make sure this flight record doesn't already exist
      let flightRecord = await FlightRecord.getFlightRecordByThoriumId(
        thoriumFlightId
      );

      if (flightRecord) {
        throw new UserInputError(
          "This Thorium flight already exists in the system."
        );
      }

      const center = await Center.getCenter(centerId || context.center.id);

      // Make sure this center has these simulators
      const simChecks = simulators.map(sim =>
        Simulator.getSimulator(sim.id).then(sim => {
          if (!sim || sim.centerId !== center.id) {
            throw new UserInputError("Invalid simulator id provided");
          }
          return;
        })
      );

      const stations = simulators.reduce(
        (prev, sim) => prev.concat(sim.stations),
        []
      );

      const badgesCheck = stations.map(station =>
        station.badges.map(badgeId =>
          Badge.getBadge(badgeId).then(badge => {
            if (!badge) {
              throw new UserInputError("Invalid badge id provided");
            }
            return;
          })
        )
      );

      // Do all of the checks at once.
      // It will error if there is a problem
      await Promise.all([].concat(simChecks).concat(badgesCheck));

      // Get the simulator object with the tokens inside.
      const processedSimulators = await fillSimsWithTokens(simulators);

      // Create the flight record object and include the simulator/station information
      const record = await FlightRecord.createFlightRecord(
        center.id,
        thoriumFlightId,
        flightTypeId,
        processedSimulators
      );

      // Also create the flight user record (to help when querying based on user/token)
      await FlightUserRecord.createFlightUserRecordsFromFlightRecord(record);

      return record;
    },
    // End flight record create
    flightDelete: async (rootObj, { id, centerId }, context) => {
      let flightRecord = await FlightRecord.getFlightRecord(id);

      if (flightRecord.spaceCenterId !== centerId) {
        throw new UserInputError("Insufficient permissions");
      }

      await FlightUserRecord.deleteFlightUserRecordsByFlightRecordId(id);

      return flightRecord.delete();
    },

    /**
     * Edit a Flight Record
     * Supports changing anything but the space center id
     * If you don't include a property, it stays the same
     * If you include a property, it will overwrite the value for it in the database
     */
    flightEdit: async (
      rootObj,
      { id, thoriumFlightId, date, flightTypeId, simulators, centerId },
      context
    ) => {
      let center = await Center.getCenter(centerId);

      simulators = await fillSimsWithTokens(simulators);

      let flightRecord = await FlightRecord.createFlightRecord(
        center.id,
        thoriumFlightId,
        flightTypeId,
        simulators,
        id,
        date
      );

      await FlightUserRecord.editFlightUserRecordsByFlightRecord(flightRecord);

      return flightRecord;
    }
  },

  /**
   * Return all of the users that have achieved this badge
   */
  Badge: {
    users: async (badge, args, context) => {
      // Use a set so that we only keep unique results
      let userIds = [
        ...new Set(
          (await FlightUserRecord.getFlightUserRecordsByBadge(badge.id))
            .filter(record => typeof record.userId !== "undefined")
            .map(record => record.userId)
        )
      ];

      return User.getUsersByIds(userIds);
    }
  },

  User: {
    flights: (user, args, context) => {
      return FlightUserRecord.getFlightUserRecordsByUser(user.id);
    }
  },

  Center: {
    flightRecordCount: (center, args, context) => {
      return FlightRecord.flightRecordCount(center.id);
    },

    flightRecords: (center, { limit, skip }, context) => {}
  },
  FlightUserRecord: {
    flightRecord(rec) {
      return FlightRecord.getFlightRecord(rec.flightRecordId);
    }
  }
};

async function fillSimsWithTokens(simulators) {
  return Promise.all(
    simulators.map(async sim => ({
      ...sim,
      stations: await Promise.all(
        sim.stations.map(async station => {
          if (station.userId) {
            const user = await User.getUserById(station.userId).then(user => {
              if (!user) {
                station.userId = null;
                return false;
              }
              return true;
            });
            if (user) return station;
          } else if (station.email) {
            const user = await User.getUserByEmail(station.email).then(user => {
              if (!user) {
                // Send the email later
                station.userId = null;
                return false;
              }
              station.userId = user.id;
              return true;
            });
            if (user) return station;
          } else {
            // Unless the token was provided, generate a token and add it to the station
            station.token = station.token || tokenGenerator();
          }
          return station;
        })
      )
    }))
  );
}

// Assign/claim flight records
