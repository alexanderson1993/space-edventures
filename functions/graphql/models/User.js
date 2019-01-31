const { auth, firestore, clientSideApp } = require("../connectors/firebase");
const { AuthenticationError } = require("apollo-server-express");

module.exports = class User {
  /**
   * Param: params (dictionary)
   *   {
   *     id: 'theId',
   *     roles: ['role1', 'role2']
   *   }
   * Add the params (dictionary) as attributes to the User object, and
   * additionally add the user id to the object's profile attribute
   */
  constructor(params) {
    Object.entries(params).forEach(([key, value]) => (this[key] = value));
    this.profile = { ...(this.profile || {}), userId: this.id };
  }

  /**
   * Params: token (string)
   * Verifies the token, then returns the authenticated user's data combined
   * with the firestore user data matching the id of the authenticated user
   */
  static async getUser(token) {
    try {
      const user = await auth().verifyIdToken(token);

      const dbUser = await firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then(user => ({ ...user.data(), id: user.id }));

      return { ...user, ...dbUser };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  }

  /**
   * Gets a token for a user: TESTING PURPOSES - Uses the Firebase Client-Side methods
   */
  static getToken(email, password) {
    return clientSideApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(data => {
        return data.user.getIdToken().then(token => token);
      });
  }

  /**
   * Param: roles (array)
   * Returns true if user has any of the roles
   */
  hasOneOfRoles(roles) {
    return roles.reduce(
      (prev, next) => prev || (this.roles && this.roles.indexOf(next) > -1),
      false
    );
  }

  /**
   * Param: uid (string)
   * Returns the firestore user
   */
  static async getUserById(uid) {
    const dbUser = await firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then(user => {
        return { ...user.data(), id: uid };
      })
      .catch(err => {
        throw new AuthenticationError(err.message);
      });

    return dbUser;
  }
};
