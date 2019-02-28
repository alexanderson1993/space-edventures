const { gql, UserInputError } = require("apollo-server-express");
const { Message } = require("../models");
// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  type Message {
    id: ID
    subject: String
    message: String
    recipients: [ID]! @auth(requires: [director])
    hasRead: Boolean
  }

  # We can extend other graphQL types using the "extend" keyword.
  extend type Query {
    message(id: ID!): Message @auth(requires: [authenticated])
    messages(receiverId: ID, senderId: ID): [Message]
  }

  extend type Mutation {
    messageCreate(
      subject: String!
      message: String!
      recipients: [ID]!
    ): Rank @auth(requires: [director])

    messageMarkRead(id: ID!): Message
  }
`;

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.resolver = {
  Query: {
    message: async (rootQuery, { id }, context) => {
      // Make sure they are either a sender or receiver on this
      const message = await Message.getMessage(id);

      return message;
    },
    messages: (rootQuery, {receiverId, senderId}, context) => {
      if (typeof(receiverId) === 'undefined' && typeof(senderId) === 'undefined') {
        throw new UserInputError('Must specify sender id or receiver id');
      }

      return Message.getMessageByReceiver(userId);
    }
  },
  Mutation: {
    messageCreate: (
      rootQuery,
      { subject, message, recipients },
      context
    ) => {
      return Message.createMessage(subject, message, context.user.id, recipients);
    },

    messageMarkRead: () => {}
  }
};
