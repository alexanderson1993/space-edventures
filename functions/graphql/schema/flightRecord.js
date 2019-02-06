const { gql } = require("apollo-server-express");

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
  extend type Badge {
    flight: FlightRecord
  }
  extend type Query {
    flightRecord(id: ID!): FlightRecord
    flightRecords(userId: ID, centerId: ID, simulatorId: ID): FlightRecord
  }
  extend type Mutation {
    flightAssign(flightId: ID!, userId: ID, stations: [String]): FlightRecord
  }
  # We can extend other graphQL types using the "extend" keyword.
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    flightRecord: (rootQuery, args, context) => {},
    flightRecords: (rootQuery, args, context) => {}
  },
  Mutation: {
    flightAssign: (rootQuery, { flightId, userId, stations }, context) => {}
  },
  Badge: {
    flight: (badge, args, context) => {}
  }
};
