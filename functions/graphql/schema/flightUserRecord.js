const {
  gql,
  AuthenticationError,
  UserInputError
} = require("apollo-server-express");
const {
  FlightUserRecord,
  FlightRecord,
  Simulator,
  User
} = require("../models");
const getCenter = require("../helpers/getCenter");

/**
 * This schema doesn't really expose any endpoints to the graphql user. Rather it provides the data structre that allows the flight record data to be mirrored in a way
 * that makes it easier to query later on (through the same flight record endpoints)
 */
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
  extend type Query {
    flightUserRecord(token: String): FlightUserRecord
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    flightUserRecord(rootQuery, { token }) {
      return FlightUserRecord.getByToken(token);
    }
  }
  // TODO FIX THESE (JUST COPIED FOR NOW)
  // Profile: {
  //   flightHours: async (profile, args, context) => {
  //     return hoursLoader.load({
  //       userId: profile.userId,
  //       hourType: "flightHours"
  //     });
  //   },
  //   classHours: async (profile, args, context) => {
  //     return hoursLoader.load({
  //       userId: profile.userId,
  //       hourType: "classHours"
  //     });
  //   }
  // }
};
