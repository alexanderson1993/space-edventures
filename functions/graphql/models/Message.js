// =============================================================================
// Class for CRUD operation on the Message collection
// CREATED 2019.02.25 (TarronLane)
// =============================================================================
const { firestore } = require("../connectors/firebase");

// =============================================================================
// Constants
// =============================================================================
const COLLECTION_NAME = "messages";

module.exports = class Message {
  constructor(id, {/*string*/subject, /*string*/message, /*string*/senderId, /*array[string]*/recipients, /*array[string]*/hasReadList}) {
    this.id = id;
    this.subject = subject;
    this.message = message;
    this.senderId = senderId;
    this.recipients = recipients;
    this.hasReadList = hasReadList;
  }

  // ===========================================================================
  // Staic Methods
  // ===========================================================================
  static async createMessage (subject, message, senderId, recipients) {
    let newId = await firestore().collection(COLLECTION_NAME).add({
      subject: subject,
      message: message,
      senderId: senderId,
      recipients: recipients
    });
    let newMessage = await firestore().collection(COLLECTION_NAME).doc(newId).get();
    return new Message({id: newMessage.Id, ...newMessage.data()});
  }

  static async getMessage (messageId) {
    let message = await firestore().collection(COLLECTION_NAME).doc(messageId).get();
    return new Message({id: message.id, ...message.data()});
  }

  // Should this remove the recipient list so that an end user can't see the other recipients on a message?
  static async getMessagesByReciver(recipientId) {
    let messages = await firestore().collection(COLLECTION_NAME).where('recipients', 'array_contains', recipientId);
    let hasReadList = (
      Array.isArray(message.hasReadList) && message.hasReadList.includes(recipientId)
      ? [recipientId]
      : []
    );
    return messages.map(message => new Message(message.id, {...message.data(), recipients: [recipientId], hasReadList: hasReadList}));
  }

  static async getMessagesBySender(senderId) {
    let messages = await firestore().collection(COLLECTION_NAME).where('senderId', '==', senderId).get();
    return messages.map(message => new Message(message.id, {...message.data()}));
  }

  // ===========================================================================
  // Non-Static methods
  // ===========================================================================
  async markAsRead(userId) {
    if (!Array.isArray(this.hasReadList)) {
      this.hasReadList = [userId];
    } 
    else if (!this.hasReadList.includes(userId)) {
      this.hasReadList.push(userId);
    }
    return this.save();
  }

  async save() {
    let result = await firestore().collection(COLLECTION_NAME).doc(this.id).set({
      ...this
    }, {merge: true});
    return result;
  };

  async delete() {
    let result = await firestore().collection(COLLECTION_NAME).doc(this.id).delete();
    return result;
  }
}