const { gql } = require("apollo-server-express");

module.exports.schema = gql`
  extend type Query {
    me: User
    user(id: ID!): User
  }

  type Profile {
    age: Int!
    name: String!
    profilePicture: String!
  }

  type User {
    id: ID!
    email: String!
    username: String!
    profile: Profile!
  }
`;
module.exports.resolver = {
  Query: {
    me: (_, __, context) => {},
    user: (_, { id }, context) => {}
  }
};
