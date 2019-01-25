const { auth, firestore } = require("../connectors/firebase");
const { AuthenticationError } = require("apollo-server-express");

module.exports = class User {
  constructor(params) {
    Object.entries(params).forEach(([key, value]) => (this[key] = value));
    this.profile = { ...(this.profile || {}), userId: this.id };
  }
  static async getUser(token) {
    try {
      const user = await auth().verifyIdToken(token);

      const dbUser = await firestore()
        .collection("Users")
        .doc(user.uid)
        .get()
        .then(user => ({ ...user.data(), id: user.id }));

      return { ...user, ...dbUser };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  }
  hasOneOfRoles(roles) {
    return roles.reduce(
      (prev, next) => prev || (this.roles && this.roles.indexOf(next) > -1),
      false
    );
  }
};
