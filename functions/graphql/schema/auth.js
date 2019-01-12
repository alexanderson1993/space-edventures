const { gql } = require("apollo-server-express");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  # We can extend other graphQL types using the "extend" keyword.
  extend type Mutation {
    login(email: String!, password: String!): User
    signUp(email: String!, password: String!): User
    logout: User
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Mutation: {
    login: (_, { email, password }, context) => {},
    signUp: (_, { email, password }, context) => {},
    logout: (_, __, context) => {}
  }
};
