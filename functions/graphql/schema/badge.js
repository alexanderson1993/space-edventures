const {
  gql,
  ForbiddenError,
  UserInputError
} = require("apollo-server-express");
const { Badge, User, BadgeAssignment, Center } = require("../models");
const { badgeLoader } = require("../loaders");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type Badge {
    id: ID!
    name: String
    type: BADGE_TYPE
    description: String
    image: String
  }

  input BadgeInput {
    id: ID
    name: String
    type: BADGE_TYPE
    description: String
    image: Upload
    flightTypeId: ID
  }

  # Different types of badges, for categorization
  enum BADGE_TYPE {
    badge
    mission
  }

  # We can extend other graphQL types using the "extend" keyword.
  extend type Query {
    badges(type: BADGE_TYPE, centerId: ID!): [Badge]
    badge(id: ID!): Badge
  }

  extend type Mutation {
    # Used to create assignable badges and assign badges to users
    badgeCreate(badge: BadgeInput, centerId: ID!): Badge
      @auth(requires: [director])

    badgeRemove(badgeId: ID!, centerId: ID!): Badge @auth(requires: [director])

    badgeRename(badgeId: ID!, name: String!, centerId: ID!): Badge
      @auth(requires: [director])

    badgeChangeDescription(
      badgeId: ID!
      description: String!
      centerId: ID!
    ): Badge @auth(requires: [director])

    badgeChangeImage(badgeId: ID!, image: Upload!, centerId: ID!): Badge
      @auth(requires: [director])

    badgeAssign(badges: [BadgeAssignInput!]!): [Badge]
      @auth(requires: [center, director, staff])

    badgeClaim(token: String!): ClaimResult @auth(requires: [authenticated])
  }

  input BadgeAssignInput {
    badgeId: ID!
    flightId: ID!
    userId: ID
  }

  type ClaimResult {
    isSuccess: Boolean
    badgeId: ID
    failureType: CLAIM_FAILURE
  }

  enum CLAIM_FAILURE {
    ALREADY_CLAIMED_BY_USER
  }

  extend type User {
    badges(type: BADGE_TYPE): [Badge]
  }

  extend type Center {
    badges(type: BADGE_TYPE): [Badge]
    missionCount: Int
    badgeCount: Int
  }

  extend type Station {
    badges: [Badge]
  }

  extend type FlightUserRecord {
    badges: [Badge]
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    // Anyone should be able to see any badge
    badges: async (rootQuery, { type, centerId }, context) => {
      return Badge.getBadges(type, centerId);
    },
    // Anyone should be able to see any badge
    badge: (rootQuery, { id }, context) => {
      return Badge.getBadge(id);
    }
  },
  Mutation: {
    // You should only be able to create a badge for a center that you own
    badgeCreate: async (rootQuery, { badge, centerId }, context) => {
      console.log(context.user);
      return false;
      return Badge.createBadge(badge, centerId);
    },
    badgeRemove: async (rootQuery, { badgeId, centerId }, context) => {
      const badge = await Badge.getBadge(badgeId);
      if (badge.centerId !== centerId)
        throw new ForbiddenError("Cannot delete a badge you do not own.");
      return badge.delete();
    },
    badgeRename: async (rootQuery, { badgeId, name, centerId }, context) => {
      const badge = await Badge.getBadge(badgeId);
      if (badge.centerId !== centerId)
        throw new ForbiddenError("Cannot edit a badge you do not own.");
      return badge.rename(name);
    },
    badgeChangeDescription: async (
      rootQuery,
      { badgeId, description, centerId },
      context
    ) => {
      const badge = await Badge.getBadge(badgeId);
      if (badge.centerId !== centerId)
        throw new ForbiddenError("Cannot edit a badge you do not own.");
      return badge.changeDescription(description);
    },
    badgeChangeImage: async (
      rootQuery,
      { badgeId, image, centerId },
      context
    ) => {
      const badge = await Badge.getBadge(badgeId);
      if (badge.centerId !== centerId)
        throw new ForbiddenError("Cannot edit a badge you do not own.");
      return badge.changeImage(image);
    },
    /**
     * Supports batch assignment of badges to users
     */
    badgeAssign: async (rootQuery, { badges, centerId }, context) => {
      // Either assign the badge directly, or create an assignment object

      return badges.map(async ({ badgeId, flightId, userId }) => {
        let user = null;
        let badge = await Badge.getBadge(badgeId);

        // Check to see if this is a valid badge
        if (!badge) {
          throw new UserInputError("Invalid Badge Id");
        }

        // Check to see if this center has permissions on this badge/flight
        if (badge.spaceCenterId !== context.center.id) {
          throw new ForbiddenError(
            "You do not have access to assign this badge"
          );
        }

        if (typeof userId !== "undefined") {
          user = await User.getUserById(userId);
        }

        if (user === null) {
          // If user does not exist, create assignment object
          await BadgeAssignment.createAssignment(badgeId, flightId);
        } else {
          // If user does exist, append to that user's badges array
          await User.assignBadge(user.id, badgeMeta);
        }
        return badge;
      });
    },
    /**
     * Assign a Badge Assignment object from the database to a user, then remove
     * the badge assignment from the database
     */
    badgeClaim: async (rootQuery, { token }, context) => {
      let badgeAssignment = await BadgeAssignment.getAssignment(token);
      let badgeMeta = {};
      // Remove the badge assignment id from the meta data, since we don't need to save that to the user's badge array
      Object.keys(badgeAssignment).map(key =>
        key !== "id" ? (badgeMeta[key] = badgeAssignment[key]) : undefined
      );
      let {
        isSuccess,
        failureType = undefined,
        badgeId = undefined
      } = await User.assignBadge(context.user.id, badgeMeta);

      // Delete the badge assignment if it was successful
      await badgeAssignment.delete();

      return {
        isSuccess: isSuccess,
        badgeId,
        failureType: failureType
      };
    }
  },
  User: {
    badges: (user, { type }, context) => {
      return Promise.all(
        user.badges.map(badgeMeta => Badge.getBadge(badgeMeta.badgeId))
      ).then(badges => {
        return badges.filter(
          badge =>
            badge.type === (typeof type !== "undefined" ? type : badge.type)
        ); // If type was submitted, only return badges matching the type
      });
    }
  },
  /**
   * Get the badges for a specific center, optionally limited by badge type
   */
  Center: {
    badges: async (center, { type }, context) => {
      return await Badge.getBadges(type, center.id);
    },
    missionCount: center => {
      return Badge.badgeCount(center.id, "mission");
    },
    badgeCount: center => {
      return Badge.badgeCount(center.id, "badge");
    }
  },
  Station: {
    badges: async station => {
      return station.badges && badgeLoader.loadMany(station.badges);
    }
  },
  FlightUserRecord: {
    badges: async rec => {
      return rec.badges && badgeLoader.loadMany(rec.badges);
    }
  }
};
