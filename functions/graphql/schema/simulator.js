const { gql } = require("apollo-server-express");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type Simulator {
    id: ID!
    name: String
  }

  # We can extend other graphQL types using the "extend" keyword.
  extend type Query {
    simulator(id: ID!): Simulator
    simulators(centerId: ID): [Simulator]
  }

  extend type Center {
    simulators: [Simulator]
  }
  extend type FlightRecord {
    simulator: Simulator
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  FlightRecord: {
    simulator: (flightRecord, args, context) => {}
  },
  Center: {
    simulators: (center, args, context) => {}
  }
};
