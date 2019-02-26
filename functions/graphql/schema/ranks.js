const { gql } = require("apollo-server-express");
const { Rank } = require("../models");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type Rank {
    id: ID
    name: String
    description: String
    flightHours: Float
    classHours: Float
  }

  # We can extend other graphQL types using the "extend" keyword.
  extend type Query {
    rank(id: ID!): Rank
    ranks: [Rank]
  }

  extend type Mutation {
    rankCreate(
      name: String!
      description: String
      flightHours: Float!
      classHours: Float!
    ): Rank @auth(requires: [admin])
    rankUpdate(
      id: ID!
      name: String
      description: String
      flightHours: Float
      classHours: Float
    ): Rank @auth(requires: [admin])
    rankDelete(id: ID!): Boolean @auth(requires: [admin])
  }

  extend type Profile {
    rank: Rank
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    rank: (rootQuery, { id }, context) => {
      return Rank.getRank(id);
    },
    ranks: (rootQuery, args, context) => {
      return Rank.getRanks();
    }
  },
  Mutation: {
    rankCreate: (
      rootQuery,
      { name, description, flightHours, classHours },
      context
    ) => {
      return Rank.create({ name, description, flightHours, classHours });
    },
    rankUpdate: async (
      rootQuery,
      { id, name, description, flightHours, classHours },
      context
    ) => {
      const rank = await Rank.getRank(id);
      return rank.edit({ name, description, flightHours, classHours });
    },
    rankDelete: async (rootQuery, { id }, context) => {
      const rank = await Rank.getRank(id);
      return rank.delete();
    }
  },
  Profile: {
    rank: (profile, args, context) => {}
  }
};
