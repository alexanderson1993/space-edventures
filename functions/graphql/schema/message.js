const { gql, UserInputError, AuthenticationError } = require("apollo-server-express");
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
    date: Date
  }

  # We can extend other graphQL types using the "extend" keyword.
  extend type Query {
    message(id: ID!): Message @auth(requires: [authenticated])
    messages: [Message]
  }

  extend type Mutation {
    messageCreate(
      subject: String!
      message: String!
      recipients: [ID]!
    ): Rank @auth(requires: [director])

    messageMarkRead(messageId: ID!): Message @auth(requires: [authenticated])
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

      const isSender = (message.senderId === context.user.id);
      const isRecipient = (Array.isArray(message.recipients) && message.recipients.includes(context.user.id));

      // Don't allow them to see the message if they aren't a sender or receiver
      if (!isSender && !isRecipient) {
        throw new AuthenticationError('You do not have permission to view this message');
      }

      // Hide full recipient list
      if (isRecipient) {
        message.recipients = [context.user.id]
        message.hasReadList = (
          (Array.isArray(message.hasReadList) &&
          message.hasReadList.includes(userId))
            ? [userId]
            : []
        );
      }

      return message;
    },
    messages: async (rootQuery, args, context) => {
      let messages = await Message.getMessagesByUserId(context.user.id);
      return messages;
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

    messageMarkRead: async (rootQuery, {messageId}, context) => {
      let message = await Message.getMessage(messageId);

      if (!message.recipients.includes(context.user.id)) {
        throw new AuthenticationError('You do not have access to this message, or are not a recipient.');
      }

      if (Array.isArray(message.hasReadList) && message.hasReadList.includes(context.user.id)) {
        throw new UserInputError('You have already marked this message as read.');
      }

      message.hasReadList = Array.isArray(message.hasReadList) 
        ? message.hasReadList.concat([context.user.id]) 
        : [context.user.id];

      return message.save();
    }
  }
};
