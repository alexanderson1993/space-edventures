const { gql } = require("apollo-server-express");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type FlightUserRecord {
    id: ID!
    token: String
    user: User
    simulator: Simulator
    station: Station
    badges: [Badge]
    date: Date
    flightType: FlightType
    center: Center
    flightRecord: FlightRecord
  }
  extend type User {
    flightRecords: [FlightUserRecord]
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  User: {
    flightRecords: (user, args, context) => {}
  }
};
