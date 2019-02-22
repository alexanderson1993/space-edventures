const { gql, AuthenticationError } = require("apollo-server-express");
const { Center } = require("../models");

// Definition for Space Edventures Centers

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type Center {
    id: ID!
    name: String
    description: String
    imageUrl: String
    registeredDate: Date
    website: String
    email: String

    apiToken: String @auth(requires: [director])
  }

  # We can extend other graphQL types using the "extend" keyword.
  extend type Query {
    centers: [Center]
    center(id: ID): Center
  }

  extend type Mutation {
    centerCreate(
      name: String!
      website: String
      email: String!
      token: String!
      planId: String!
    ): Center @auth(requires: [authenticated])
    centerSetApiToken: Center
    centerUpdateName(centerId: ID!, name: String!): Center
      @auth(requires: [director])
    centerUpdateDescription(centerId: ID!, description: String!): Center
      @auth(requires: [director])
    centerUpdateWebsite(centerId: ID!, website: String!): Center
      @auth(requires: [director])
    centerUpdateImage(centerId: ID!, image: Upload!): Center
      @auth(requires: [director])
  }

  extend type FlightType {
    center: Center
  }

  extend type FlightRecord {
    center: Center
  }
  extend type User {
    center: Center
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    centers: (rootQuery, args, context) => Center.getCenters(),
    center: (rootQuery, { id }, context) =>
      id ? Center.getCenter(id) : context.center
  },
  Mutation: {
    centerCreate: (rootQuery, args, context) => {
      return Center.createCenter(context.user.id, args);
    },
    centerSetApiToken: (rootQuery, args, context) => {
      return Center.setApiToken(context.user.id);
    },
    centerUpdateName: (rootQuery, { centerId, name }, context) => {
      const center = new Center(Center.getCenter(centerId));
      center.updateName(name);
      return center;
    },
    centerUpdateDescription: (
      rootQuery,
      { centerId, description },
      context
    ) => {
      const center = new Center(Center.getCenter(centerId));
      center.updateDescription(description);
      return center;
    },
    centerUpdateWebsite: (rootQuery, { centerId, website }, context) => {
      const center = new Center(Center.getCenter(centerId));
      center.updateWebsite(website);
      return center;
    },
    centerUpdateImage: (rootQuery, { centerId, image }, context) => {
      const center = new Center(Center.getCenter(centerId));
      center.updateImage(image);
      return center;
    }
  },
  FlightType: {
    center: (flightType, args, context) => {}
  },
  FlightRecord: {
    center: (flightRecord, args, context) => {}
  },
  User: {
    center: (user, args, context) => {
      // Returns a center for which the user is a director
      return Center.getCenterForUserId(user.id);
    }
  }
};
