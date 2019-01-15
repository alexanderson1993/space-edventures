const { gql } = require("apollo-server-express");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type Station {
    id: ID!
    name: String
  }

  # We can extend other graphQL types using the "extend" keyword.
  extend type Query {
    station(id: ID!): Station
    stations(simulatorId: ID): [Station]
  }

  extend type Simulator {
    stations: [Station]
  }
  extend type FlightRecord {
    station: Station
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  FlightRecord: {
    station: (flightRecord, args, context) => {}
  },
  Simulator: {
    stations: (simulator, args, context) => {}
  }
};
