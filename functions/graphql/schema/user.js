const { gql } = require("apollo-server-express");

module.exports.schema = gql`
  extend type Query {
    me: User
    user(id: ID!): User
  }

  type Profile {
    age: Int!
    name: String!
    displayName: String
    profilePicture: String!
  }

  type User {
    id: ID!
    email: String!
    username: String!
    profile: Profile!
    dateJoined: Date

    # Badges, flight records, and flight and class hours will be added
    # as type extensions
  }

  extend type Badge {
    user: User
  }
  extend type Center {
    director: User
  }
  extend type FlightRecord {
    user: User
  }
`;
module.exports.resolver = {
  Query: {
    me: (_, __, context) => {},
    user: (_, { id }, context) => {}
  },
  Badge: {
    user: (badge, args, context) => {}
  },
  Center: {
    director: (center, args, context) => {}
  },
  FlightRecord: {
    user: (flightRecord, args, context) => {}
  }
};
