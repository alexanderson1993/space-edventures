const { gql } = require("apollo-server-express");
const { FlightRecord } = require("../models");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type FlightRecord {
    id: ID!
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
    userId: ID # The ID of the Space Edventures user
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
      flightId: ID!
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
    flightRecords: (
      rootQuery,
      { userId = None, centerId = None, simulatorId = None },
      context
    ) => {}
  },
  Mutation: {
    flightAssign: (rootQuery, { flightId, userId, stations }, context) => {},
    /**
     * Creates a flight record for the logged in center
     */
    flightRecordCreate: (
      rootQuery,
      { flightId, flightTypeId, simulators },
      context
    ) => {
      // Make sure this center has this flight ID
      // Make sure this center has these simulators
    }
  },
  Badge: {
    flight: (badge, args, context) => {}
  }
};
