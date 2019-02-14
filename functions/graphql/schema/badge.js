const {
  gql,
  ForbiddenError,
  UserInputError
} = require("apollo-server-express");
const getCenter = require("../helpers/getCenter");
const { Badge, User, BadgeAssignment } = require("../models");
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
    badges(type: BADGE_TYPE, centerId: ID): [Badge]
    badge(id: ID!): Badge
  }
  extend type Mutation {
    # Used to create assignable badges and assign badges to users
    badgeCreate(badge: BadgeInput): Badge
    badgeRemove(badgeId: ID!): Badge
    badgeRename(badgeId: ID!, name: String!): Badge
    badgeChangeDescription(badgeId: ID!, description: String!): Badge
    badgeChangeImage(badgeId: ID!, image: Upload!): Badge
    badgeAssign(badges: [BadgeAssignInput!]!): [Badge]
      @auth(requires: [center, director])
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
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    badges: async (rootQuery, { type, centerId }, context) => {
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
      return Badge.getBadges(type, centerIdValue);
    },
    badge: (rootQuery, { id }, context) => {
      return Badge.getBadge(id);
    }
  },
  Mutation: {
    badgeCreate: async (rootQuery, { badge }, context) => {
      const center = await getCenter(context.user);
      return Badge.createBadge(badge, center.id);
    },
    badgeRemove: async (rootQuery, { badgeId }, context) => {
      const center = await getCenter(context.user);
      const badge = await Badge.getBadge(badgeId);
      if (badge.centerId !== center.id)
        throw new ForbiddenError("Cannot delete a badge you do not own.");
      return badge.delete();
    },
    badgeRename: async (rootQuery, { badgeId, name }, context) => {
      const center = await getCenter(context.user);
      const badge = await Badge.getBadge(badgeId);
      if (badge.centerId !== center.id)
        throw new ForbiddenError("Cannot edit a badge you do not own.");
      return badge.rename(name);
    },
    badgeChangeDescription: async (
      rootQuery,
      { badgeId, description },
      context
    ) => {
      const center = await getCenter(context.user);
      const badge = await Badge.getBadge(badgeId);
      if (badge.centerId !== center.id)
        throw new ForbiddenError("Cannot edit a badge you do not own.");
      return badge.changeDescription(description);
    },
    badgeChangeImage: async (rootQuery, { badgeId, image }, context) => {
      const center = await getCenter(context.user);
      const badge = await Badge.getBadge(badgeId);
      if (badge.centerId !== center.id)
        throw new ForbiddenError("Cannot edit a badge you do not own.");
      return badge.changeImage(image);
    },
    /**
     * Supports batch assignment of badges to users
     */
    badgeAssign: async (rootQuery, { badges }, context) => {
      // Either assign the badge directly, or create an assignment object

      return badges.map(async ({ badgeId, flightId, userId }) => {
        let user = null;
        let badge = await Badge.getBadge(badgeId);
        // Check to see if this is a valid badge
        
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
      Object.keys(badgeAssignment).map((key) => key !== 'id' ? badgeMeta[key] = badgeAssignment[key] : undefined);
      let { isSuccess, failureType = undefined, badgeId = undefined } = await User.assignBadge(
        context.user.id,
        badgeMeta
      );
      
      // Delete the badge assignment if it was successful
      await badgeAssignment.delete();

      return {
        isSuccess: isSuccess,
        badgeId, badgeId,
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
    }
  }
};
