const { gql } = require("apollo-server-express");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type FlightType {
    id: ID!
    name: String
    flightHours: Float
    classHours: Float
  }

  # We can extend other graphQL types using the "extend" keyword.
  extend type Query {
    flightType(id: ID!): FlightType
    flightTypes(centerId: ID): [FlightType]
  }

  extend type FlightRecord {
    flightType: FlightType
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  FlightRecord: {
    flightType: (flightRecord, args, context) => {}
  }
};
