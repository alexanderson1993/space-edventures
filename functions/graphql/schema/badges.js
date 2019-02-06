const { gql } = require("apollo-server-express");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type Badge {
    id: ID!
    name: String
    type: BADGE_TYPE
    description: String
    image: String
    dateAwarded: Date
  }

  input BadgeInput {
    id: ID!
    name: String
    type: BADGE_TYPE
    description: String
    image: String
    flightId: ID
    userId: ID
  }

  # Different types of badges, for categorization
  enum BADGE_TYPE {
    badge
    mission
  }

  # We can extend other graphQL types using the "extend" keyword.
  extend type Query {
    badges(type: BADGE_TYPE): [Badge]
    badge(id: ID!): Badge
  }
  extend type Mutation {
    # Used to create assignable badges and assign badges to users
    badgeCreate(badge: BadgeInput): Badge
    badgeRemove(badgeId: ID!): Badge
    badgeRename(badgeId: ID!, name: String!): Badge
    badgeChangeDescription(badgeId: ID!, description: String!): Badge
    badgeChangeImage(badgeId: ID!, image: Upload!): Badge
    badgeAssign(badgeId: ID!, flightId: ID!, userId: ID): Badge
  }

  extend type User {
    badges(type: BADGE_TYPE): [Badge]
  }

  extend type Center {
    badges(type: BADGE_TYPE): [Badge]
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    badges: (rootQuery, { type }, context) => {},
    badge: (rootQuery, { type }, context) => {}
  },
  Mutation: {
    badgeCreate: (rootQuery, { badge }, context) => {},
    badgeRemove: (rootQuery, { badgeId }, context) => {},
    badgeRename: (rootQuery, { badgeId, name }, context) => {},
    badgeChangeDescription: (
      rootQuery,
      { badgeId, description },
      context
    ) => {},
    badgeChangeImage: (rootQuery, { badgeId, image }, context) => {},
    badgeAssign: (rootQuery, { badgeId, flightId, userId }, context) => {
      // Either assign the badge directly, or create an assignment object
    }
  },
  User: {
    badges: (user, { type }, context) => {}
  },
  Center: {
    badges: (user, { type }, context) => {}
  }
};
