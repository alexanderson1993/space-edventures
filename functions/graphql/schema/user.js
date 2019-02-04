const { gql, AuthenticationError } = require("apollo-server-express");
let User = require("../models/User");

module.exports.schema = gql`
  extend type Query {
    me: User
    user(id: ID!): User
  }

  extend type Mutation {
    userCreate: User
    userChangeProfilePicture(id: ID, picture: Upload!): User
      @auth(requires: [self, admin])
  }

  type Profile @auth(requires: [self, admin]) {
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
    registeredDate: Date

    # Badges, flight records, and flight and class hours will be added
    # as type extensions
    roles: [String]
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
    me: (_, __, context) => context.user,
    user: (_, { id }, context) => {
      return User.getUserById(id);
    }
  },
  Mutation: {
    userCreate: async (rootQuery, args, context) => {
      const { user } = context;
      // If there is a user in context, then the authentication user does exist
      if (!user)
        throw new AuthenticationError("Must be logged in to create a user.");
      const userObj = await User.getUserById(user.id);
      if (userObj) return userObj;
      // No user - create it.
      return User.createUser({
        id: user.id,
        displayName: user.email,
        email: user.email,
        name: user.email
      });
    },
    userChangeProfilePicture: (rootQuery, args, context) => {
      const { user } = context;
      console.log(args, context);
    }
  },
  Badge: {
    user: (badge, args, context) => {}
  },
  Center: {
    director: (center, args, context) => User.getUserById(center.directorId)
  },
  FlightRecord: {
    user: (flightRecord, args, context) => {}
  }
};
