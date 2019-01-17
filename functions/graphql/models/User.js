const { auth, firestore } = require("../connectors/firebase");
const { AuthenticationError } = require("apollo-server-express");

module.exports = class User {
  constructor(params) {
    Object.entries(params).forEach(([key, value]) => (this[key] = value));
  }
  static async getUser(token) {
    try {
      const { uid } = await auth().verifyIdToken(token);
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
    const [authUser, dbUser] = await Promise.all([
      auth().getUser(uid),
      firestore()
        .collection("Users")
        .doc(uid)
        .get()
        .then(user => ({ ...user.data(), id: user.uid }))
    ]);

    console.log(authUser, dbUser);
    return null;
  }
  static async createUser({ email, password, displayName }) {
    const userRecord = await auth().createUser({
      email,
      password,
      displayName
    });

    // Create the user object in the database
    const dbUser = await firestore()
      .collection("Users")
      .doc(userRecord.uid)
      .create({});
    const token = await auth().createCustomToken(userRecord.uid);
    console.log(userRecord, dbUser, token);
  }
  hasOneOfRoles(roles) {
    return roles.reduce(
      (prev, next) => prev || this.roles.indexOf(next) > -1,
      false
    );
  }
};
