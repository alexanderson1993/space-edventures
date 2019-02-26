const {
  gql,
  AuthenticationError,
  ForbiddenError,
  UserInputError
} = require("apollo-server-express");
let User = require("../models/User");

module.exports.schema = gql`
  extend type Query {
    me: User
    user(id: ID!): User @auth(requires: [self, admin, director])
  }

  extend type Mutation {
    userCreate(birthDate: Date!, parentEmail: String): User
    userDelete: Boolean
    profileEdit(name: String, displayName: String): User
    userChangeProfilePicture(id: ID, picture: Upload!): User
  }

  type Profile @auth(requires: [self, admin]) {
    age: Int
    name: String
    # rank: String
    displayName: String
    profilePicture: String
    # flightHours: Float # added in flight record schema
    # classHours: Float # added in flight record schema
  }

  type User {
    id: ID!
    email: String
    username: String @auth(requires: [self])
    profile: Profile
    registeredDate: Date
    locked: Boolean
    # Badges, flight records, and flight and class hours will be added
    # as type extensions
    # flights
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
  // Needs to pass in parent of profile so that value can be checked
  Profile: {
    age: (profile, args, context) => {
      let theDate = profile.birthDate
        ? new Date(profile.birthDate._seconds * 1000)
        : new Date();
      return new Date().getFullYear() - theDate.getFullYear();
    },
    flightHours: (profile, args, context) => {},
    classHours: (profile, args, context) => {}
  },
  Mutation: {
    /**
     * Create a user in the firestore database for the current GraphQL user
     * If user already exists, just override the information about that user
     */
    userCreate: async (rootQuery, { birthDate, parentEmail }, context) => {
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
        name: user.email,
        parentEmail,
        birthDate,
        locked: Boolean(parentEmail)
      });
    },
    profileEdit: async (rootQuery, args, context) => {
      const { user } = context;
      if (!user)
        throw new AuthenticationError(
          "Must be logged in to edit your profile."
        );
      const userObj = new User(await User.getUserById(user.id));
      console.log(userObj);
      if (!userObj)
        throw new UserInputError(
          "Unable to update user profile: profile cannot be found."
        );
      return userObj.update(args);
    },
    userDelete: async (rootQuery, args, context) => {
      const { user } = context;

      if (!user)
        throw new AuthenticationError("Must be logged in to delete your user.");

      const userObj = await User.getUserById(user.id);
      if (!userObj) return true;
      return User.deleteUser(user.id);
    },
    userChangeProfilePicture: (rootQuery, args, context) => {
      const { user } = context;
      if (!user)
        throw new AuthenticationError(
          "Must be logged in to change profile picture."
        );
      if (user.roles && user.roles.includes("admin") && args.id) {
        const setUser = User.getUserById(args.id);
        return setUser.changeProfilePicture(args.picture);
      }
      if (args.id && args.id !== user.id) {
        throw new ForbiddenError(
          "Not allowed to alter other profile pictures."
        );
      }
      return user.changeProfilePicture(args.picture);
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
