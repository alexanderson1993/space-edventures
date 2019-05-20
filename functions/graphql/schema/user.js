const {
  gql,
  AuthenticationError,
  ForbiddenError,
  UserInputError
} = require("apollo-server-express");
let User = require("../models/User");
const randomName = require("random-ship-names");

module.exports.schema = gql`
  extend type Query {
    me(id: ID!): User
    user(id: ID, email: String): User @auth(requires: [self, admin, director])

    userGetRank(id: String!, centerId: ID!): User
      @auth(requires: [staff, director])

    userByToken(token: String): User @auth(requires: [center])
    users: [User]
  }

  extend type Mutation {
    userCreate(birthDate: Date!, parentEmail: String): User
    userDelete: Boolean
    """
    Makes a user into a staff member at a center
    """
    userSetStaff(email: String!, centerId: ID!): User
      @auth(requires: [director])
    userRevokeStaff(userId: ID!, centerId: ID!): User
      @auth(requires: [director])
    profileEdit(name: String, displayName: String): User
    userChangeProfilePicture(id: ID, picture: Upload!): User
    userUpdateToken(token: String!): User
  }

  type Profile @auth(requires: [self, staff, director, admin]) {
    age: Int
    name: String @auth(requires: [self, director, authenticated, center])
    # rank: String
    displayName: String @auth(requires: [authenticated, center])
    profilePicture: String
    # flightHours: Float # added in flight record schema
    # classHours: Float # added in flight record schema
  }

  type User {
    id: ID!
    email: String
    username: String @auth(requires: [self])
    profile(centerId: ID): Profile
    registeredDate: Date
    locked: Boolean
    token: String
    parentEmail(centerId: ID): String @auth(requires: [staff, director])
    # Badges, flight records, and flight and class hours will be added
    # as type extensions
    # flights
    roles(centerId: ID): String
  }

  extend type Badge {
    user: User
  }

  extend type Center {
    director: User @auth(requires: [director])
    users: [User] @auth(requires: [director])
  }

  extend type FlightRecord {
    user: User
  }
  extend type FlightUserRecord {
    user: User
  }
`;

function validateEmail(email) {
  // eslint-disable-next-line no-useless-escape
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

module.exports.resolver = {
  User: {
    roles: (user, { centerId }) => {
      const { roles = [] } = user;
      let role = roles[centerId] || "";
      if (user.isAdmin) role = "admin";
      return role;
    },
    profile: (user, { centerId }) => {
      return { birthDate: user.birthDate, ...user.profile, centerId };
    }
  },
  Query: {
    me: (_, { id }, context) =>
      context.user && context.user.id === id ? context.user : null,
    user: (_, { id }, context) => {
      return User.getUserById(id);
    },
    users: () => {
      return User.getAllUsers();
    },
    userGetRank: async (_, { id, centerId }, context) => {
      // We should filter the result we get from the user
      // so it is only relevant information. id could be an
      // email address
      const user = validateEmail(id)
        ? new User(await User.getUserByEmail(id))
        : new User(await User.getUserByToken(id));
      const {
        id: userId,
        profile,
        email,
        birthDate,
        registeredDate,
        parentEmail
      } = user;
      return {
        id: userId,
        profile,
        email,
        birthDate,
        registeredDate,
        parentEmail
      };
    },
    async userByToken(_, { token }, context) {
      return new User(await User.getUserByToken(token));
    }
  },
  // Needs to pass in parent of profile so that value can be checked
  Profile: {
    age: (profile, args, context) => {
      let theDate = profile.birthDate
        ? new Date(profile.birthDate._seconds * 1000)
        : new Date();
      return new Date().getFullYear() - theDate.getFullYear();
    }
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
      const name = randomName.civilian;
      // No user - create it.
      return User.createUser({
        id: user.id,
        birthDate,
        email: user.email,
        displayName: name,
        name: name,
        parentEmail,
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
      if (user.isAdmin && args.id) {
        const setUser = User.getUserById(args.id);
        return setUser.changeProfilePicture(args.picture);
      }
      if (args.id && args.id !== user.id) {
        throw new ForbiddenError(
          "Not allowed to alter other profile pictures."
        );
      }
      return user.changeProfilePicture(args.picture);
    },
    userUpdateToken(rootQuery, { token }, context) {
      const { user } = context;
      if (!user)
        throw new AuthenticationError(
          "Must be logged in to change officer token."
        );
      return user.changeToken(token);
    },
    async userSetStaff(rootQuery, { email, centerId }) {
      const user = new User(await User.getUserByEmail(email));
      user && (await user.setRole({ centerId, role: "staff" }));
    },
    async userRevokeStaff(rootQuery, { userId, centerId }) {
      const user = new User(await User.getUserById(userId));
      user && (await user.removeRole({ centerId, role: "staff" }));
    }
  },
  Badge: {
    user: (badge, args, context) => {}
  },
  Center: {
    director: (center, args, context) => User.getUserById(center.directorId),
    users: (center, args, context) => User.getUsersForCenterId(center.id)
  },
  FlightRecord: {
    user: (flightRecord, args, context) => {}
  },
  FlightUserRecord: {
    user(rec) {
      return User.getUserById(rec.userId);
    }
  }
};
