const { makeExecutableSchema, gql } = require("apollo-server-express");
const { schema: AuthSchema, resolver: AuthResolver } = require("./auth");
const { schema: UserSchema, resolver: UserResolver } = require("./user");
const { merge } = require("lodash");

const MainSchema = gql`
  type Query {
    # Types cannot be empty. Since we extend this type elsewhere,
    # we must add something to this type here.
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

// This resolver object can be extended if properties are added
// to the Query and Mutation types above.
const MainResolver = {};

// We collect the schemas and resolvers from the different
// functionally-separated files, and merge them together into
// a single schema.
module.exports = makeExecutableSchema({
  typeDefs: [MainSchema, AuthSchema, UserSchema],
  resolvers: merge(MainResolver, AuthResolver, UserResolver)
});
