const {
  gql,
  ForbiddenError,
  UserInputError
} = require("apollo-server-express");
const { Simulator } = require("../models");
// We define a schema that encompasses all of the types
// necessary for the functionality in this file.

module.exports.schema = gql`
  type OfficerLog {
    id: ID!
    date: Date
    log: String
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
  Query: {},
  Mutation: {}
};
