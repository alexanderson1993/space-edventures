const { gql, UserInputError } = require("apollo-server-express");
const {
  FlightRecord,
  FlightType,
  Simulator,
  Badge,
  User
} = require("../models");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type FlightRecord {
    id: ID!
    thoriumFlightId: ID!
    date: Date

    # There are several properties added through extension:
    # Flight Type
    # User
    # Simulator
    # Center
  }

  input FlightSimulatorInput {
    id: ID! # The ID of the Space Edventures simulator
    stations: [FlightStationInput]
  }

  input FlightStationInput {
    name: String! # The name of the station. Required
    badges: [ID]! # The list of badges that the station earned. Includes missions
    userId: ID! # ID of the user who was at this station for this flight
  }

  extend type Badge {
    flight: FlightRecord
  }

  extend type Query {
    flightRecord(id: ID!): FlightRecord
    flightRecords(userId: ID, centerId: ID, simulatorId: ID): FlightRecord
  }

  extend type Mutation {
    # Creates the record of the flight
    # Uses the ID of the flight from Thorium so a flight cannot be recorded twice
    flightRecordCreate(
      thoriumFlightId: ID!
      flightTypeId: ID!
      simulators: [FlightSimulatorInput!]!
    ): FlightRecord @auth(requires: [center, director])

    flightAssign(flightId: ID!, userId: ID, stations: [String]): FlightRecord
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
    flightRecords: (rootQuery, { userId, centerId, simulatorId }, context) =>
      FlightRecord.getFlightRecords(userId, centerId, simulatorId)
  },
  Mutation: {
    /**
     * Assign a flight record to a user, or create a flight assignment object if the user id is not specified
     */
    flightAssign: (rootQuery, { flightId, userId, stations }, context) => {},

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

      // Get the center id (if this is a director and not a center)
      let centerIdValue = context.center.id;
      if (!centerIdValue) {
        const center = await getCenter(context.user);
        if (!center) {
          throw new UserInputError("No Valid center found for user or token.");
        }
        centerIdValue = center.id;
      }

      // Make sure this center has these simulators
      let simulator;
      let badge;
      let user;
      await Promise.all(
        simulators.map(async sim => {
          simulator = await Simulator.getSimulator(sim.id);
          if (!simulator || simulator.centerId !== centerIdValue) {
            throw new UserInputError("Invalid simulator id provided");
          }
          await Promise.all(
            sim.stations.map(async station => {
              // Make sure the center has these badges
              await Promise.all(
                station.badges.map(async badgeId => {
                  badge = await Badge.getBadge(badgeId);
                  if (!badge) {
                    throw new UserInputError("Invalid badge id provided");
                  }
                })
              );

              // Make sure these users exist, and assign tokens if not
              user = await User.getUserById(station.userId);
              if (station.userId === "undefined" || !user) {
                // Add a token to the simulator station, and remove the invalid user id
                delete station.userId;
              }
            })
          );
        })
      );

      // Create the flight record object and include the simulator/station information
      return FlightRecord.createFlightRecord(
        centerIdValue,
        thoriumFlightId,
        flightTypeId,
        simulators
      );
    }
  },
  Badge: {
    flight: (badge, args, context) => {}
  }
};

// TODO add way to get the user from the flight record
// TODO get badge from flight record
// Assign/claim flight records
