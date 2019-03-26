const {
  gql,
  ForbiddenError,
  UserInputError
} = require("apollo-server-express");
const { Simulator, FlightUserRecord } = require("../models");
const { flightRecordUserLoader } = require("../loaders");
// We define a schema that encompasses all of the types
// necessary for the functionality in this file.

module.exports.schema = gql`
  type OfficerLog {
    id: ID!
    date: Date
    log: String
    flight: FlightUserRecord
  }

  input OfficerLogInput {
    id: ID!
    date: Date!
    log: String!
  }
  # We can extend other graphQL types using the "extend" keyword.
  # extend type Query {

  # }
  # extend type Mutation {

  # }
  extend type User {
    logs: [OfficerLog]
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  User: {
    async logs(user) {
      const records = await flightRecordUserLoader.load(user.id);
      return records
        .reduce(
          (prev, next) =>
            prev.concat(
              next.logs
                ? next.logs.map(l => ({ ...l, flightUserRecordId: next.id }))
                : []
            ),
          []
        )
        .filter(Boolean);
    }
  },
  OfficerLog: {
    flight({ flightUserRecordId }) {
      if (flightUserRecordId)
        return FlightUserRecord.getById(flightUserRecordId);
      return null;
    }
  },
  Query: {},
  Mutation: {}
};
