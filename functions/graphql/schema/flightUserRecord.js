const { gql, AuthenticationError, UserInputError } = require("apollo-server-express");
const {FlightUserRecord, FlightRecord, Simulator, User} = require("../models");
const getCenter = require("../helpers/getCenter");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type FlightUserRecord {
    id: ID!
    stationName: String!
    date: Date!
    token: String # This is here so that space directors could manually give out tokens
    # user: User # extended in user // TODO: add to the other file
    # simulator: Simulator # extended in simulator // TODO: add to the other file
    # flightRecord: FlightRecord # extended in flight record // TODO: Add to other file
    # badges: [Badge] # extended in flightRecord // TODO: Add to other file
  }

  # Return the flight user records assigned to that logged in user
  extend type User {
    flightRecords: [FlightUserRecord]
  }
  
  # Allow user profiles to store total flight hours and class hours
  extend type Profile {
    flightHours: Float
    classHours: Float
  }

  # Mutations
  extend type Mutation {
    flightUserRecordCreate(flightRecordId: ID!, stationName: String!, simulatorId: ID!, userId: ID): FlightUserRecord @auth(requires: [center, director])
    flightUserRecordEdit(flightUserRecordId: ID!, flightRecordId: ID, stationName: String, simulatorId: ID, userId: ID): FlightUserRecord @auth(requires: [center, director])
    flightUserRecordDelete(flightUserRecordId: ID!): Boolean @auth(requires: [center, director])
    flightUserRecordClaim(token: String!): FlightUserRecord @auth(requires: [authenticated])
  }

`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  User: {
    flightRecords: (user, args, context) => {
      // Make sure this user matches the authenticated user
      if (user.id !== context.user.id) {
        throw new AuthenticationError('Insufficient permissions');
      }
      return FlightUserRecord.getFlightRecordsByUser(user.id);
    }
  },
  // TODO FIX THESE (JUST COPIED FOR NOW)
  Profile: {
    flightHours: async (profile, args, context) => {
      return hoursLoader.load({
        userId: profile.userId,
        hourType: "flightHours"
      });
    },
    classHours: async (profile, args, context) => {
      return hoursLoader.load({
        userId: profile.userId,
        hourType: "classHours"
      });
    }
  },
  Mutation: {
    flightUserRecordCreate: async (rootQuery, {flightRecordId, stationName, simulatorId, userId}, context) => {
      // Get the center this user has permissions for
      let centerId;
      if (typeof(context.center) !== "undefined") centerId = context.center.id;
      else centerId = (await getCenter(context.user)).id;
      
      // Make sure they have permissions on the flight record
      const flightRecord = await FlightRecord.getFlightRecord(flightRecordId);
      const checkFlightRecord = (typeof(flightRecord.id) !== "undefined" && flightRecord.spaceCenterId === centerId);

      // Make sure the space center has the simulator
      const simulator = await Simulator.getSimulator(simulatorId);
      const checkSimulator = (typeof(simulator.id) !== "undefined" && simulator.centerId === centerId);

      // Make sure the simulator has the station
      const checkStation = (Array.isArray(simulator.stations) && simulator.stations.includes(stationName))

      // Throw error if any of the checks failed
      if (!checkFlightRecord || !checkSimulator || !checkStation) {
        throw new UserInputError('Invalid input');
      }

      // Check to see if Valid user (replace with a token if that's the case)
      let generateToken = false;
      const user = await User.getUserById(userId);
      if (typeof(userId) === "undefined" || !user) {
        generateToken = true;
      }
      
      return FlightUserRecord.createFightUserRecord(arguments[1], generateToken);
    },

    /**
     * Assign a flight record to a user, based on the token. Assign to currently authentiated graphql user
     */
    flightUserRecordClaim: async (rootQuery, { token }, context) => {
      // User id of currently logged in user to claim the token
      // let flightRecord = await FlightRecord.getFlightRecordByToken(token);

      // if (!flightRecord) {
      //   throw new UserInputError(
      //     "No flight records were found for this token."
      //   );
      // }

      // return flightRecord.claim(context.user.id);
    }
  }
};
