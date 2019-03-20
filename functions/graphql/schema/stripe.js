const { gql } = require("apollo-server-express");
const { Stripe, Center } = require("../models");

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
    subscribe(planId: String!, centerId: ID!): Boolean
      @auth(requires: [director])

    # Unsubscribe based on the center which
    # The user is the director of, if any.
    # No arguments are necessary.
    unsubscribe(centerId: ID!): Boolean @auth(requires: [director])

    updatePayment(token: String!, centerId: ID!): Boolean
      @auth(requires: [director])
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
    subscriptions: [StripeSubscription]
    sources: [StripeSource]
  }
  type StripeSubscription {
    id: ID
    created: Date
    current_period_start: Date
    current_period_end: Date
    status: String
    plan: StripePlan
  }
  type StripeSource {
    id: ID
    brand: String
    exp_month: String
    exp_year: String
    last4: String
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
  // This is basically a stub that allows the mutations down the line to work
  Mutation: {
    stripe: (rootQuery, args, context) => ({})
  },
  StripeQuery: {
    plans: (rootQuery, args, context) => Stripe.getPlans()
  },
  StripeMutation: {
    subscribe: async (rootQuery, { planId, centerId }, context) => {
      const center = await Center.getCenter(centerId);
      return Boolean(await Stripe.subscribe(center.stripeCustomer, planId));
    },
    unsubscribe: async (rootQuery, { centerId }, context) => {
      const center = await Center.getCenter(centerId);
      return Boolean(await Stripe.unsubscribe(center.stripeCustomer));
    },
    updatePayment: async (rootQuery, { token, centerId }, context) => {
      const center = await Center.getCenter(centerId);
      return Boolean(await Stripe.updatePayment(center.stripeCustomer, token));
    }
  },
  Center: {
    /* TODO: Add checks to make sure only the director can view this, including if the auth directive works */
    stripeCustomer: (center, args, context) => {
      return Stripe.getCustomer(center.stripeCustomer);
    }
  },
  StripeCustomer: {
    subscriptions: (customer, args, context) => {
      return customer.subscriptions.data;
    },
    sources: (customer, args, context) => {
      return customer.sources.data;
    }
  }
  //  StripeSubscription:
};
