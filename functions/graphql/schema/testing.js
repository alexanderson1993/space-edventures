const {
  gql,
  AuthenticationError,
  UserInputError
} = require("apollo-server-express");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  # We can extend other graphQL types using the "extend" keyword.
  extend type Query {
    loading: String
    authenticationError: String
    userInputError: String
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    loading: (rootQuery, args, context) => {
      return new Promise(resolve => setTimeout(() => resolve("Loaded"), 2000));
    },
    authenticationError: () => {
      throw new AuthenticationError("This is a test error.");
    },
    userInputError: () => {
      throw new UserInputError("Test error");
    }
  }
};
