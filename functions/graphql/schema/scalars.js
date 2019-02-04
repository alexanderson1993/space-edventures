const { gql } = require("apollo-server-express");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const GraphQLJSON = require("graphql-type-json");
const { GraphQLUpload } = require("graphql-upload");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  scalar JSON
  scalar Date
  scalar Upload
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.

module.exports.resolver = {
  JSON: GraphQLJSON,
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      // Parse firestore dates
      if (value.toDate) return value.toDate().getTime();
      if (typeof value === "number") return value;
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    }
  }),
  Upload: GraphQLUpload
};
