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
    # Station
    # Center
  }
  extend type Badge {
    flight: FlightRecord
  }
  # We can extend other graphQL types using the "extend" keyword.
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Badge: {
    flight: (badge, args, context) => {}
  }
};
