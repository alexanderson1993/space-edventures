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
    userToVerify: async (
      _,
      { id, birthDate = new Date(), parentEmail },
      context
    ) => {
      const user = await User.getUserById(id);
      if (
        user.parentEmail.toLowerCase() !== parentEmail.toLowerCase() ||
        user.birthDate.toDate().getTime() !== birthDate.getTime()
      )
        return null;
      return user;
    },
    usersVerified: async () => {
      return User.getUnverifiedUsers();
    }
  },

  Mutation: {
    verifyWithStripeToken: async (rootQuery, { userId, token }, context) => {
      const user = new User(await User.getUserById(userId));
      const customer = await Stripe.createCustomer({
        name: `${user.email} Parent Verification`,
        email: user.parentEmail,
        token
      });
      return user.updateVerification({ stripeCustomerId: customer.id });
    },
    verifyWithPhotos: async (
      rootQuery,
      { userId, parentPhoto, idPhoto },
      context
    ) => {
      const user = new User(await User.getUserById(userId));
      return user.addVerificationPhotos(parentPhoto, idPhoto);
    },
    verifyConfirm: async (rootQuery, { userId }, context) => {
      const user = new User(await User.getUserById(userId));
      return user.confirmVerification();
    },
    verifyValidation: async (rootQuery, { userId, validated }, context) => {
      const user = new User(await User.getUserById(userId));
      return user.verifyValidation(validated);
    }
  }
};
