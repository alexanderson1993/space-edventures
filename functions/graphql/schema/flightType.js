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
  extend type Center {
    flightTypes: [FlightType] @auth(requires: [director, center])
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  FlightRecord: {
    flightType: (flightRecord, args, context) => {}
  },
  Center: {
    flightTypes: (center, args, context) => {
      // Stub for testing
      return [
        {
          id: "testing-short-flight-id",
          name: "2.5 Hour Flight",
          flightHours: 1.5,
          classHours: 1
        },
        {
          id: "testing-long-flight-id",
          name: "5 Hour Flight",
          flightHours: 3.5,
          classHours: 1.5
        }
      ];
    }
  }
};
