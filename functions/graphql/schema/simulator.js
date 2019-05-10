const {
  gql,
  ForbiddenError,
  UserInputError
} = require("apollo-server-express");
const { Simulator } = require("../models");
// We define a schema that encompasses all of the types
// necessary for the functionality in this file.

module.exports.schema = gql`
  type Simulator {
    id: ID!
    name: String
    stations: [Station!]
  }

  type Station {
    name: String!
    userId: ID @auth(requires: [director])
    token: String @auth(requires: [director, center])
  }

  # We can extend other graphQL types using the "extend" keyword.
  extend type Query {
    simulator(id: ID!): Simulator
    simulators(centerId: ID!): [Simulator]
  }
  extend type Mutation {
    # Director role is authenticated in the resolver
    simulatorCreate(name: String!, centerId: ID!): Simulator
      @auth(requires: [director])
    simulatorRename(id: ID!, name: String!, centerId: ID!): Simulator
      @auth(requires: [director])
    simulatorDelete(id: ID!, centerId: ID!): Boolean @auth(requires: [director])
  }
  extend type Center {
    simulators: [Simulator]
    simulatorCount: Int
  }
  extend type FlightRecord {
    simulators: [Simulator]
  }
  extend type FlightUserRecord {
    simulator: Simulator
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
      return Simulator.getSimulators(centerId);
    }
  },
  Mutation: {
    simulatorCreate: async (rootQuery, { name, centerId }, context) => {
      return Simulator.createSimulator(name, centerId);
    },
    simulatorRename: async (rootQuery, { id, name, centerId }, context) => {
      // Get the center to check for proper permissions
      const simulator = await Simulator.getSimulator(id);
      if (simulator.centerId !== centerId)
        throw new ForbiddenError("Cannot rename a simulator you do not own.");
      return simulator.rename(name);
    },
    simulatorDelete: async (rootQuery, { id, centerId }, context) => {
      // Get the center to check for proper permissions
      const simulator = await Simulator.getSimulator(id);
      if (simulator.centerId !== centerID)
        throw new ForbiddenError("Cannot delete a simulator you do not own.");
      return simulator.delete(id);
    }
  },
  FlightRecord: {
    // Add the name and stations to the simulator object
    simulators: (flightRecord, args, context) => {
      return flightRecord.simulators.map(async sim => {
        // Provide the simulatorId, which is a reference to the
        // Space EdVentures simulator.
        // Pull out the ID so it doesn't affect the id from the flight record.
        // This is for Apollo Client caching.
        let { id, ...simulator } = await Simulator.getSimulator(
          sim.simulatorId
        );
        return {
          ...sim,
          // We have to add the centerId to the stations so we
          // can properly auth them for director one level up.
          ...simulator,
          stations: sim.stations.map(s => ({
            ...s,
            centerId: flightRecord.spaceCenterId
          }))
        };
      });
    }
  },
  FlightUserRecord: {
    async simulator(rec) {
      const sim = await Simulator.getSimulator(rec.simulatorId);
      return sim;
    }
  },
  Badge: {
    async simulators(rec) {
      if (!rec.simulatorIds) return [];
      const sim = await Promise.all(
        rec.simulatorIds.map(s => Simulator.getSimulator(s))
      );
      return sim;
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
