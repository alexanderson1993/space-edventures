const {
  gql,
  ForbiddenError,
  UserInputError
} = require("apollo-server-express");
const { Simulator } = require("../models");
const getCenter = require("../helpers/getCenter");
// We define a schema that encompasses all of the types
// necessary for the functionality in this file.

module.exports.schema = gql`
  type Simulator {
    id: ID!
    name: String
    stations: [Station!]
  }

  type Station {
    badges: [ID]
    name: String!
    userId: ID
  }

  # We can extend other graphQL types using the "extend" keyword.
  extend type Query {
    simulator(id: ID!): Simulator
    simulators(centerId: ID): [Simulator]
  }
  extend type Mutation {
    # Director role is authenticated in the resolver
    simulatorCreate(name: String!): Simulator
    simulatorRename(id: ID!, name: String!): Simulator
    simulatorDelete(id: ID!): Boolean
  }
  extend type Center {
    simulators: [Simulator]
    simulatorCount: Int
  }
  extend type FlightRecord {
    simulators: [Simulator]
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    simulator: (rootQuery, { id }, context) => {
      return Simulator.getSimulator(id);
    },
    simulators: async (rootQuery, { centerId }, context) => {
      let centerIdValue = centerId;
      if (!centerIdValue) {
        const center = await getCenter(context.user);
        if (!center) {
          throw new UserInputError('"centerId" is a required parameter.');
        }
        centerIdValue = center.id;
      }
      return Simulator.getSimulators(centerIdValue);
    }
  },
  Mutation: {
    simulatorCreate: async (rootQuery, { name }, context) => {
      const center = await getCenter(context.user);
      return Simulator.createSimulator(name, center.id);
    },
    simulatorRename: async (rootQuery, { id, name }, context) => {
      // Get the center to check for proper permissions
      const center = await getCenter(context.user);
      const simulator = await Simulator.getSimulator(id);
      if (simulator.centerId !== center.id)
        throw new ForbiddenError("Cannot rename a simulator you do not own.");
      return simulator.rename(name);
    },
    simulatorDelete: async (rootQuery, { id }, context) => {
      // Get the center to check for proper permissions
      const center = await getCenter(context.user);
      const simulator = await Simulator.getSimulator(id);
      if (simulator.centerId !== center.id)
        throw new ForbiddenError("Cannot delete a simulator you do not own.");
      return simulator.delete(id);
    }
  },
  FlightRecord: {
    // Add the name and stations to the simulator object
    simulators: (flightRecord, args, context) => {
      return flightRecord.simulators.map(async sim => {
        let simulator = await Simulator.getSimulator(sim.id);
        return {
          ...sim,
          ...simulator
        };
      });
    }
  },
  Center: {
    simulators: (center, args, context) => {
      return Simulator.getSimulators(center.id);
    },
    simulatorCount: center => {
      return Simulator.centerCount(center.id);
    }
  }
};
