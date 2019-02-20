const { gql, UserInputError } = require("apollo-server-express");
const { FlightType, Center } = require("../models");
const getCenter = require("../helpers/getCenter");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type FlightType {
    id: ID!
    name: String
    flightHours: Float
    classHours: Float
  }

  # We can extend other graphQL types using the "extend" keyword.
  extend type Query {
    flightType(id: ID!): FlightType
    flightTypes(centerId: ID): [FlightType]
  }

  extend type FlightRecord {
    flightType: FlightType
  }

  extend type Center {
    flightTypes: [FlightType] @auth(requires: [director, center])
  }

  extend type Mutation {
    flightTypeCreate(data: FlightTypeInput!): FlightType
      @auth(requires: [director])
    flightTypeDelete(id: ID!): Boolean @auth(requires: [director])
    flightTypeEdit(id: ID!, data: FlightTypeInput!): Boolean
      @auth(requires: [director])
  }

  input FlightTypeInput {
    name: String
    flightHours: Int
    classHours: Int
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    flightType: (rootObj, { id }, context) => FlightType.getFlightType(id),
    flightTypes: async (rootObj, { centerId }, context) => {
      let centerIdValue = centerId;
      if (!centerIdValue) {
        try {
          const center = await getCenter(context.user);
          if (!center) {
            throw new UserInputError('"centerId" is a required parameter.');
          }
          centerIdValue = center.id;
        } catch (err) {
          null;
        }
      }
      FlightType.getFlightTypes(centerIdValue);
    }
  },
  FlightRecord: {
    // flightType: (flightRecord, args, context) => FlightType.getFlightType(flightRecord.flightTypeId)
    flightType: (flightRecord, args, context) => {
      const flightType = FlightType.getFlightType(flightRecord.flightTypeId);
      return flightType;
    }
  },
  Center: {
    flightTypes: (center, args, context) => {
      return FlightType.getFlightTypes(center.id);
    }
  },
  Mutation: {
    flightTypeCreate: async (rootObj, { data }, context) => {
      let center = await Center.getCenterByDirector(context.user.id);
      let existingFlightTypes = await FlightType.getFlightTypes(center.id);

      existingFlightTypes.forEach(obj => {
        if (obj.name === data.name) {
          throw new UserInputError(
            "Flight type already exists for this space center. Flight type id: " +
              obj.id
          );
        }
      });

      let flightType = await FlightType.createFlightType({
        ...data,
        spaceCenterId: center.id
      });
      return flightType;
    },
    flightTypeDelete: async (rootObj, { id }, context) => {
      let flightType = await FlightType.getFlightType(id);
      return flightType.delete();
    },
    flightTypeEdit: async (rootObj, { id, data }, context) => {
      let flightType = await FlightType.getFlightType(id);
      if (!flightType) {
        throw new UserInputError("Invalid Flight Type Id.");
      }
      return flightType.editFlightType(data);
    }
  }
};
