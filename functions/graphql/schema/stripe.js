const { gql } = require("apollo-server-express");
const { Stripe } = require("../models");
const { firestore } = require("../connectors/firebase");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type StripeQuery {
    plans: [StripePlan]
  }

  type StripeMutation {
    # Subscribe based on the center which
    # The user is the director of, if any.
    # No arguments are necessary.
    subscribe(planId: String!): Boolean

    # Unsubscribe based on the center which
    # The user is the director of, if any.
    # No arguments are necessary.
    unsubscribe: Boolean

    updatePayment(token: String!): Boolean
  }

  type StripePlan {
    id: ID
    amount: Int
    interval: String
    interval_count: Int
    nickname: String
    trial_period_days: Int
  }

  type StripeCustomer {
    id: ID
    created: Date
    email: String
    subscription: StripeSubscription
  }
  type StripeSubscription {
    id: ID
    created: Date
    current_period_start: Date
    current_period_end: Date
    status: String
  }

  # We can extend other graphQL types using the "extend" keyword.
  extend type Query {
    stripe: StripeQuery
  }
  extend type Mutation {
    stripe: StripeMutation
  }
  extend type Center {
    stripeCustomer: StripeCustomer @auth(requires: [director])
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    // This should just return an empty object so the rest
    // of the resolvers will work.
    stripe: (rootQuery, args, context) => ({})
  },
  StripeQuery: {
    plans: (rootQuery, args, context) => Stripe.getPlans()
  },
  StripeMutation: {
    subscribe: (rootQuery, { planId }, context) => ({}),
    unsubscribe: (rootQuery, args, context) => ({}),
    updatePayment: (rootQuery, { token }, context) => ({})
  },
  Center: {
    /* TODO: Add checks to make sure only the director can view this, including if the auth directive works */
    stripeCustomer: (center, args, context) =>
      Stripe.getCustomer(center.customerId)
  }
};
