const { gql } = require("apollo-server-express");

// Definition for Space Edventures Centers

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type Center {
    id: ID!
    name: String
    description: String
    registeredDate: Date
    website: String
    email: String
    # These Stripe properties might change to a type someday, if necessary
    stripeCustomer: String
    isSubscribed: Boolean
  }

  # We can extend other graphQL types using the "extend" keyword.
  extend type Query {
    centers: [Center]
    center(id: ID!): Center
  }

  extend type FlightType {
    center: Center
  }

  extend type FlightRecord {
    center: Center
  }
  extend type User {
    center: Center
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    centers: (rootQuery, args, context) => {},
    center: (rootQuery, { id }, context) => {}
  },
  FlightType: {
    center: (flightType, args, context) => {}
  },
  FlightRecord: {
    center: (flightRecord, args, context) => {}
  },
  User: {
    center: (user, args, context) => {
      // Returns a since center for which the user is a director
      return null;
    }
  }
};
