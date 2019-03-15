const { gql } = require("apollo-server-express");
let { User, Stripe } = require("../models");

module.exports.schema = gql`
  extend type Query {
    # When verifying an underage user, that user's information can be collected
    # by the parent by providing the ID, birthDate, and parent's email.
    userToVerify(id: ID!, birthDate: Date!, parentEmail: String!): User
    usersVerified: [User] @auth(requires: [admin])
  }

  extend type Mutation {
    verifyWithStripeToken(userId: ID!, token: String!): User
    verifyWithPhotos(userId: ID!, parentPhoto: Upload!, idPhoto: Upload!): User
    verifyConfirm(userId: ID!): User

    # Administrator action to make sure the photos are correct and the credit
    # card information is accurate. Deletes all validation information when complete.
    verifyValidation(userId: ID!, validated: Boolean!): User
      @auth(requires: [admin])
  }

  extend type User {
    verification: UserVerification
  }

  type UserVerification {
    # COPPA Compliance allows for capturing payment details
    # to prove that a person is the parent.
    stripeCustomerId: ID

    # COPPA Compliance allows for capturing photos of a person
    # and their photo ID to prove that a person is the parent.
    parentPhotoUrl: String
    idPhotoUrl: String
  }
`;
module.exports.resolver = {
  Query: {
    // Used by parents to get the child user as long as they have the required identifying information
    userToVerify: async (
      _,
      { id, birthDate = new Date(), parentEmail },
      context
    ) => {
      const user = await User.getUserById(id);

      // Uf the birthdate or parent email don't match, don't return the user
      if (
        user.parentEmail.toLowerCase() !== parentEmail.toLowerCase() ||
        user.birthDate.toDate().getTime() !== birthDate.getTime() ||
        user.locked === false // Also don't let them get a user unless it needs verification (prevents any getting the user if they know the birthDate, even after verification)
      )
        return null;
      return user;
    },

    // Used by admins to get the list of users who aren't verified by the admin
    // but have been "unlocked" by the parent granting permission
    usersVerified: async () => {
      return User.getUnverifiedUsers();
    }
  },

  Mutation: {
    // Used by a parent after filling out credit card information and interfacing with stripe
    // Adds a stripe verification to the verification list
    verifyWithStripeToken: async (rootQuery, { userId, token }, context) => {
      const user = new User(await User.getUserById(userId));
      const customer = await Stripe.createCustomer({
        name: `${user.email} Parent Verification`,
        email: user.parentEmail,
        token
      });
      return user.updateVerification({ stripeCustomerId: customer.id });
    },
    // Adds a photo to the verification list
    verifyWithPhotos: async (
      rootQuery,
      { userId, parentPhoto, idPhoto },
      context
    ) => {
      const user = new User(await User.getUserById(userId));
      return user.addVerificationPhotos(parentPhoto, idPhoto);
    },
    // Used by a parent after uploading the data we need to collect from them
    // Marks the child as not locked, but also not approved
    verifyConfirm: async (rootQuery, { userId }, context) => {
      const user = new User(await User.getUserById(userId));
      return user.confirmVerification();
    },

    // Removes the information we have stored about the parent and marks them as "approved"
    verifyValidation: async (rootQuery, { userId, validated }, context) => {
      const user = new User(await User.getUserById(userId));
      return user.verifyValidation(validated);
    }
  }
};
