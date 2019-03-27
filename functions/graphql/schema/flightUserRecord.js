const { gql } = require("apollo-server-express");
const { FlightUserRecord } = require("../models");

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
    # user: User # extended in user
    # simulator: Simulator # extended in simulator
    # flightRecord: FlightRecord # extended in flight record
    # badges: [Badge] # extended in flightRecord
  }

  extend type Query {
    flightUserRecord(token: String, id: ID): FlightUserRecord
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    async flightUserRecord(rootQuery, { token, id }) {
      if (token) {
        return FlightUserRecord.getByToken(token);
      }
      if (id) {
        // Remove sensitive information
        const { token, userId, ...record } = await FlightUserRecord.getById(id);
        return record;
      }
      return null;
    }
  }
};
