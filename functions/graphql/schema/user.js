const { gql } = require("apollo-server-express");
const { firestore } = require("../connectors/firebase");

module.exports.schema = gql`
  extend type Query {
    me: User
    user(id: ID!): User
  }

  type Profile @auth(requires: [self]) {
    age: Int
    name: String
    displayName: String
    profilePicture: String
  }

  type User {
    id: ID!
    email: String
    username: String @auth(requires: [self])
    profile: Profile
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
    me: (_, __, context) =>
      console.log("CONTEXT", context.user) || context.user,
    user: (_, { id }, context) => {
      console.log("HERE IS THE OUTPUT");
      console.log(firestore.collection("users"));
      return { email: "This is a test" };
    }
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
