const { makeExecutableSchema, gql } = require("apollo-server-express");
const { schema: UserSchema, resolver: UserResolver } = require("./user");
const { schema: ScalarSchema, resolver: ScalarResolver } = require("./scalars");
const { schema: BadgesSchema, resolver: BadgesResolver } = require("./badge");
const { schema: CenterSchema, resolver: CenterResolver } = require("./center");
const {
  schema: FlightRecordSchema,
  resolver: FlightRecordResolver
} = require("./flightRecord");
const {
  schema: FlightTypeSchema,
  resolver: FlightTypeResolver
} = require("./flightType");
const {
  schema: SimulatorSchema,
  resolver: SimulatorResolver
} = require("./simulator");

const {
  schema: TestingSchema,
  resolver: TestingResolver
} = require("./testing");

const { schema: StripeSchema, resolver: StripeResolver } = require("./stripe");
const {
  schema: CoppaVerifySchema,
  resolver: CoppaVerifyResolver
} = require("./coppaVerify");

const { schema: directivesSchema, schemaDirectives } = require("./directives");

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
  typeDefs: [
    MainSchema,
    UserSchema,
    ScalarSchema,
    BadgesSchema,
    CenterSchema,
    FlightRecordSchema,
    FlightTypeSchema,
    SimulatorSchema,
    TestingSchema,
    StripeSchema,
    CoppaVerifySchema
  ].concat(directivesSchema),
  resolvers: merge(
    MainResolver,
    UserResolver,
    ScalarResolver,
    BadgesResolver,
    CenterResolver,
    FlightRecordResolver,
    FlightTypeResolver,
    SimulatorResolver,
    TestingResolver,
    StripeResolver,
    CoppaVerifyResolver
  ),
  schemaDirectives
});
