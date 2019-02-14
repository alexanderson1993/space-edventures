const { auth, firestore, clientSideApp } = require("../connectors/firebase");
const {
  SyntaxError,
  AuthenticationError,
  ApolloError
} = require("apollo-server-express");
const uploadFile = require("../helpers/uploadFile");
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
    // Automatically has the authenticated role if it exists.
    return roles
      .concat("authenticated")
      .reduce(
        (prev, next) => prev || (this.roles && this.roles.indexOf(next) > -1),
        false
      );
  }

  async changeProfilePicture(picture) {
    const path = `${this.id}/profilePicture`;
    const file = await uploadFile(picture, path);
    const userRef = await firestore()
      .collection("users")
      .doc(this.id);

    const dbUser = await userRef
      .get()
      .then(user => ({ ...user.data(), id: user.id }));

    await userRef.update({
      profile: {
        ...dbUser.profile,
        profilePicture: file.metadata.mediaLink
      }
    });
    this.profile.profilePicture = file.metadata.mediaLink;
    return this;
  }

  /**
   * Should only be used in private circumstances.
   * Param: uid (string)
   * Returns the firestore user
   */
  static async getUserById(uid) {
    const dbUser = await firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then(user => {
        if (!user.exists) return null;
        let data = user.data();
        data.profile.id = uid; // Add the user's ID to the profile object, so that permissions can be checked on self
        return { ...data, id: uid };
      })
      .catch(err => {
        throw new SyntaxError(err.message);
      });
    return dbUser;
  }

  /**
   * Assign a badge to a user
   * @param {string} userId
   * Does not assign the badge if the user already had the badge Id assigned to them
   */
  static async assignBadge(userId, badgeMeta) {
    let { badgeId } = badgeMeta;
    // Specify required parameters
    if ([typeof userId, typeof badgeId].includes("undefined")) {
      throw new ApolloError(
        "Attempted to assign badge to user without required meta data"
      );
    }
    // Get user and check to make sure it's a valid user
    // Done in a transaction since we have to read and write all at once
    let userRef = firestore()
      .collection("users")
      .doc(userId);
    return await firestore().runTransaction(async transaction => {
      let currentBadges = await transaction
        .get(userRef)
        .then(user => user.data().badges);
      // If they don't already have the badge
      if (!currentBadges.map(badge => badge.badgeId).includes(badgeId)) {
        let trans = await transaction.set(
          userRef,
          {
            badges: currentBadges.concat([
              {
                badgeId,
                ...badgeMeta, // Include any other badge meta data
                dateAwarded: new Date()
              }
            ])
          },
          { merge: true }
        );

        return {
          isSuccess: true,
          badgeId: badgeId
        };
        // Otherwise return an error
      } else {
        return {
          isSuccess: false,
          failureType: "ALREADY_CLAIMED_BY_USER"
        };
      }
    });
  }

  /**
   * Create or Id a user
   */
  static async createUser({
    id,
    email,
    displayName,
    name,
    birthDate,
    parentEmail,
    locked
  }) {
    // TODO: Properly handle sending emails for parental permission.
    const user = await firestore()
      .collection("users")
      .doc(id)
      .set({
        email,
        parentEmail,
        locked,
        birthDate,
        displayName,
        name,
        registeredDate: new Date(),
        classHours: 0,
        flightHours: 0,
        badges: [],
        roles: []
      });

    return firestore()
      .collection("users")
      .doc(id)
      .get()
      .then(res => ({ ...res.data(), id: res.id }));
  }

  static async deleteUser(uid) {
    return firestore()
      .collection("users")
      .doc(uid)
      .delete()
      .then(() => true)
      .catch(error => {
        throw new FirebaseException("Unable to delete your user.");
      });
  }
};
