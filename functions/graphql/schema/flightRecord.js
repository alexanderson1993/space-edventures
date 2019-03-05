const { gql, UserInputError } = require("apollo-server-express");
const {
  FlightRecord,
  FlightType,
  Simulator,
  Badge,
  User,
  FlightUserRecord // Used to mirror the data in a way that makes it easier to query based on user
} = require("../models");
const tokenGenerator = require("../helpers/tokenGenerator");
const getCenter = require("../helpers/getCenter");
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
    userId: ID # ID of the user who was at this station for this flight
  }

  # Get all the flight records that are tied to this particular badge (meaning that they have a station assigned to that badge)
  extend type Badge {
    flight: FlightRecord
  }

  extend type User {
    flights: [FlightRecord] @auth(requires: [authenticated])
  }

  extend type Query {
    flightRecord(id: ID!): FlightRecord @auth(requires: [director])
    flightRecords(userId: ID, centerId: ID, simulatorId: ID): [FlightRecord]
      @auth(requires: [director])
  }

  extend type Profile {
    flightHours: Float
    classHours: Float
  }

  extend type Center {
    flightRecordCount: Int
    flightRecords(limit: Int, skip: Int): [FlightRecord]
  }

  extend type Mutation {
    # Creates the record of the flight
    # Uses the ID of the flight from Thorium so a flight cannot be recorded twice
    flightRecordCreate(
      thoriumFlightId: ID!
      flightTypeId: ID!
      simulators: [FlightSimulatorInput!]!
    ): FlightRecord @auth(requires: [center, director])

    flightClaim(token: String!): FlightRecord @auth(requires: [authenticated])

    flightEdit(
      id: ID!
      thoriumFlightId: ID
      date: Date
      flightTypeId: ID
      simulators: [FlightSimulatorInput]
    ): FlightRecord @auth(requires: [director])

    flightDelete(id: ID!): Boolean @auth(requires: [director])
  }
  # We can extend other graphQL types using the "extend" keyword.
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    flightRecord: (rootQuery, { id }, context) =>
      FlightRecord.getFlightRecord(id),
    flightRecords: async (
      rootQuery,
      { userId, centerId, simulatorId },
      context
    ) => {
      const center = await getCenter(context.user);
      const records = await FlightRecord.getFlightRecords(
        userId,
        centerId || center.id,
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
      let flightRecord = await FlightRecord.getFlightRecordByToken(token);

      if (!flightRecord) {
        throw new UserInputError(
          "No flight records were found for this token."
        );
      }

      return flightRecord.claim(context.user.id);
    },

    /**
     * Creates a flight record for the logged in center
     */
    flightRecordCreate: async (
      rootQuery,
      { thoriumFlightId, flightTypeId, simulators },
      context
    ) => {
      // Make sure this center has this flight type ID
      let flightType = await FlightType.getFlightType(flightTypeId);
      if (!flightType) {
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

      // Get the center id (if this is a director and not a center)
      let centerIdValue =
        typeof context.center !== "undefined" ? context.center.id : null;
      if (!centerIdValue) {
        const center = await getCenter(context.user);
        if (!center) {
          throw new UserInputError("No Valid center found for user or token.");
        }
        centerIdValue = center.id;
      }

      // Make sure this center has these simulators
      const simChecks = simulators.map(sim =>
        Simulator.getSimulator(sim.id).then(sim => {
          if (!sim || sim.centerId !== centerIdValue) {
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
      const usersCheck = stations
        .map(station => {
          if (station.userId) {
            User.getUserById(station.userId).then(user => {
              if (!user) {
                throw new UserInputError("Invalid user id provided")
              }
              return;
            })
          }
          else {
            // Generate a token and add it to the station
            station.token = tokenGenerator();
          }
          return station;
        });

      // Do all of the checks at once.
      // It will error if there is a problem
      await Promise.all(
        []
          .concat(simChecks)
          .concat(badgesCheck)
          .concat(usersCheck)
      );

      // Set the simulator stations to be the version with the tokens
      simulators.stations = stations;

      // Create the flight record object and include the simulator/station information
      const record = await FlightRecord.createFlightRecord(
        centerIdValue,
        thoriumFlightId,
        flightTypeId,
        simulators
      );

      // Also create the flight user record (to help when querying based on user/token)
      const flightUserRecord = await FlightUserRecord.createFightUserRecordFromFlightRecord(record);

      return record;
    },
    // End flight record create
    flightDelete: async (rootObj, { id }, context) => {
      let flightRecord = await FlightRecord.getFlightRecord(id);

      // Make sure they have permissions for this flight record
      let center = await getCenter(context.user);

      if (flightRecord.spaceCenterId !== center.id) {
        throw new UserInputError("Insufficient permissions");
      }

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
      { id, thoriumFlightId, date, flightTypeId, simulators },
      context
    ) => {
      let center = await getCenter(context.user);

      return FlightRecord.createFlightRecord(
        center.id,
        thoriumFlightId,
        flightTypeId,
        simulators,
        id,
        date
      );
    }
  },
  Badge: {
    flight: (badge, args, context) => {}
  },

  User: {
    flights: (user, args, context) => {
      return FlightRecord.getFlightRecordsByUser(user.id);
    }
  },
  Center: {
    flightRecordCount: (center, args, context) => {
      return FlightRecord.flightRecordCount(center.id);
    },
    flightRecords: (center, { limit, skip }, context) => {}
  }
};

// Assign/claim flight records
