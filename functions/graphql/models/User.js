const {
  auth,
  firestore,
  storage,
  clientSideApp
} = require("../connectors/firebase");
const {
  SyntaxError,
  AuthenticationError,
  ValidationError,
  ApolloError,
  UserInputError
} = require("apollo-server-express");
const Stripe = require("./Stripe");
const uploadFile = require("../helpers/uploadFile");
const emailTransport = require("../helpers/email");
const parentVerify = require("../emails/parentVerify");
const parentConsent = require("../emails/parentConsent");
const childConsent = require("../emails/childConsent");
const parentReverify = require("../emails/parentReverify");
const tokenGenerator = require("../helpers/tokenGenerator");
const randomName = require("random-ship-names");
const validateEmail = require("../helpers/validateEmail");
const collectionName = "users";
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
    this.id = params.id;
    this.profile = { ...params.profile, userId: params.id };
    this.roles = params.roles;
    this.email = params.email;
    this.parentEmail = params.parentEmail;
    this.locked = params.locked;
    this.registeredDate = params.registeredDate;
    this.birthDate = params.birthDate;
    this.token = params.token;
    this.isAdmin = params.isAdmin || false;
    this.verification = params.verification || {};
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
  static getUsersForCenterId(centerId) {
    return Promise.all([
      firestore()
        .collection("users")
        .where(`roles.${centerId}`, "==", "staff")
        .get(),
      firestore()
        .collection("users")
        .where(`roles.${centerId}`, "==", "director")
        .get()
    ])
      .then(([staff, director]) => staff.docs.concat(director.docs))
      .then(docs => docs.map(d => ({ ...d.data(), id: d.id })));
  }
  static async getUserByEmail(email) {
    const data = await firestore()
      .collection("users")
      .where("email", "==", email)
      .get();
    if (data.size === 0)
      throw new UserInputError(`No user exists with email ${email}.`);
    return { ...data.docs[0].data(), id: data.docs[0].id };
  }

  static async getUserByToken(token) {
    let data = await firestore()
      .collection("users")
      .where("token", "==", token.toLowerCase())
      .get();
    if (data.size === 0)
      data = await firestore()
        .collection("users")
        .where("email", "==", token.toLowerCase())
        .get();
    if (data.size === 0)
      throw new UserInputError(`No user exists with token ${token}.`);
    return { ...data.docs[0].data(), id: data.docs[0].id };
  }

  /**
   * Param: roles (array)
   * Returns true if user has any of the roles
   */
  hasOneOfRoles(roles, centerId = "") {
    const userRoles = ((this.roles && this.roles[centerId]) || []).concat(
      "authenticated"
    );
    // Automatically has the authenticated role if it exists.
    return roles.reduce(
      (prev, next) => prev || userRoles.indexOf(next) > -1,
      false
    );
  }

  async update({ name, displayName }) {
    const update = {};
    if (name) {
      this.profile.name = name;
    }
    if (displayName) {
      this.profile.displayName = displayName;
    }
    await firestore()
      .collection("users")
      .doc(this.id)
      .update({ profile: this.profile });
    return this;
  }

  async setRole({ centerId, role }) {
    // Authorization for this action should already have happened
    this.roles = { ...this.roles, [centerId]: role };
    await firestore()
      .collection("users")
      .doc(this.id)
      .update({ roles: this.roles });
  }
  async removeRole({ centerId, role }) {
    this.roles = { ...this.roles, [centerId]: "" };
    await firestore()
      .collection("users")
      .doc(this.id)
      .update({ roles: this.roles });
  }
  async changeProfilePicture(picture) {
    const path = `${this.id}/profilePicture`;
    const fileRef = uploadFile(picture, path);
    const userRef = firestore()
      .collection("users")
      .doc(this.id);

    const dbUserRef = userRef
      .get()
      .then(user => ({ ...user.data(), id: user.id }));

    const file = await fileRef;
    const dbUser = await dbUserRef;

    await userRef.update({
      profile: {
        ...dbUser.profile,
        profilePicture: file.metadata.mediaLink
      }
    });
    this.profile.profilePicture = file.metadata.mediaLink;
    return this;
  }
  async changeToken(token) {
    // See if there are other users with that token
    try {
      await User.getUserByToken(token);
    } catch (err) {
      // If it errors, then there is not a user with that token.
      const userRef = firestore()
        .collection("users")
        .doc(this.id);

      if (token.length > 12) {
        throw new ValidationError(
          "Token is too long. Please use less than 12 characters."
        );
      }

      await userRef.update({
        token
      });
      this.profile.token = token;
      return this;
    }
    throw new ValidationError("Token is already in use.");
  }
  async updateVerification(verification = {}) {
    const userRef = await firestore()
      .collection("users")
      .doc(this.id);

    const dbUser = await userRef
      .get()
      .then(user => ({ ...user.data(), id: user.id }));
    const oldVerification = dbUser.verification || {};
    const newVerification = { ...oldVerification, ...verification };

    await userRef.update({
      verification: newVerification
    });
    this.verification = newVerification;
    return this;
  }

  async addVerificationPhotos(parentPhoto, idPhoto) {
    const parentPhotoFileRef = uploadFile(
      parentPhoto,
      `${this.id}/parentPhoto`
    );
    const idPhotoFileRef = uploadFile(idPhoto, `${this.id}/idPhoto`);
    const userRef = firestore()
      .collection("users")
      .doc(this.id);

    const dbUserRef = userRef
      .get()
      .then(user => ({ ...user.data(), id: user.id }));

    // Concurrently await the items.
    const parentPhotoFile = await parentPhotoFileRef;
    const idPhotoFile = await idPhotoFileRef;
    const dbUser = await dbUserRef;

    const oldVerification = dbUser.verification || {};
    const newVerification = {
      ...oldVerification,
      parentPhotoUrl: parentPhotoFile.metadata.mediaLink,
      idPhotoUrl: idPhotoFile.metadata.mediaLink
    };

    await userRef.update({
      verification: newVerification
    });
    this.verification = newVerification;
    return this;
  }

  async confirmVerification() {
    if (
      !this.verification ||
      !this.verification.parentPhotoUrl ||
      !this.verification.idPhotoUrl ||
      !this.verification.stripeCustomerId
    )
      throw new ValidationError(
        "Verification steps are not complete. Please complete all verification steps before attempting to complete the verification process."
      );
    const userRef = firestore()
      .collection("users")
      .doc(this.id);

    // Unlock the user account
    userRef.update({ locked: false, approved: false });

    // Send an email to the parent informing them
    // that the verification process is complete.
    emailTransport.sendMail({
      from: `"Space EdVentures" hello@spaceedventures.org`,
      to: this.parentEmail,
      subject: "We have verified your consent",
      html: parentConsent()
    });

    // Send an email to the child telling them that
    // they can now use the service.
    emailTransport.sendMail({
      from: `"Space EdVentures" hello@spaceedventures.org`,
      to: this.email,
      subject: "We have verified your account",
      html: childConsent()
    });

    return this;
  }

  async verifyValidation(validated) {
    const userRef = firestore()
      .collection("users")
      .doc(this.id);

    // We should delete all of the information we have collected

    // Delete the files
    try {
      const parentPhotoFileRef = storage()
        .bucket()
        .file(`${this.id}/parentPhoto`)
        .delete();
      const idPhotoFileRef = storage()
        .bucket()
        .file(`${this.id}/idPhoto`)
        .delete();
      // Run these operations concurrently
      await parentPhotoFileRef;
      await idPhotoFileRef;
      await Stripe.deleteCustomer(this.verification.stripeCustomerId);
    } catch (_) {
      // Swallow the error - it probably is because the objects don't exist
    }

    if (validated) {
      await userRef.update({ locked: false, approved: true, verification: {} });
      this.locked = false;
      this.approved = true;
    } else {
      await userRef.update({ locked: true, approved: false, verification: {} });
      this.locked = true;
      this.approved = false;
      // Send an email to the parent informing them
      // that the verification process needs to be restarted.
      await emailTransport.sendMail({
        from: `"Space EdVentures" hello@spaceedventures.org`,
        to: this.parentEmail,
        subject: "There was a problem with verifying your consent",
        html: parentReverify()
      });
    }

    this.verification = {};

    return this;
  }
  async unlock() {
    const userRef = firestore()
      .collection("users")
      .doc(this.id);

    // We should delete all of the information we have collected

    // Delete the files
    try {
      const parentPhotoFileRef = storage()
        .bucket()
        .file(`${this.id}/parentPhoto`)
        .delete();
      const idPhotoFileRef = storage()
        .bucket()
        .file(`${this.id}/idPhoto`)
        .delete();
      // Run these operations concurrently
      await parentPhotoFileRef;
      await idPhotoFileRef;
      await Stripe.deleteCustomer(this.verification.stripeCustomerId);
    } catch (_) {
      // Swallow the error - it probably is because the objects don't exist
    }

    await userRef.update({ locked: false, approved: true, verification: {} });
    this.locked = false;
    this.approved = true;

    this.verification = {};

    return this;
  }

  static getAllUsers() {
    return firestore()
      .collection("users")
      .get()
      .then(res => res.docs.map(doc => ({ ...doc.data(), id: doc.id })));
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
        if (!user.exists) return false;
        let data = user.data();
        data.profile = data.profile || {};
        data.profile.id = uid; // Add the user's ID to the profile object, so that permissions can be checked on self
        return { ...data, id: uid };
      })
      .catch(err => {
        throw new SyntaxError(err.message);
      });
    return dbUser;
  }

  static async getUsersByIds(userIds) {
    return firestore()
      .getAll(
        userIds.map(id =>
          firestore()
            .collection(collectionName)
            .doc(id)
        )
      )
      .then(docs => docs.map(doc => new User({ id: doc.id, ...doc.data() })));
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
    displayName = randomName.civilian,
    name,
    birthDate,
    parentEmail
  }) {
    function diffYears(dt2, dt1) {
      var diff = (dt2.getTime() - dt1.getTime()) / 1000;
      diff /= 60 * 60 * 24;
      return Math.abs(Math.round(diff / 365.25));
    }
    const locked = diffYears(new Date(), new Date(birthDate)) < 13;
    if (locked) {
      // TODO: Add a process to delete locked users after 30 days
      if (parentEmail && validateEmail(parentEmail)) {
        // Handle sending emails for parental permission.
        const message = await emailTransport.sendMail({
          from: `"Space EdVentures" hello@spaceedventures.org`,
          to: parentEmail,
          subject: "Your Child Registered at SpaceEdVentures.org",
          html: parentVerify({ id, email })
        });
      }
    }
    const user = await firestore()
      .collection("users")
      .doc(id)
      .set({
        email,
        parentEmail,
        locked,
        profile: {
          birthDate,
          displayName,
          name,
          classHours: 0,
          flightHours: 0
        },
        registeredDate: new Date(),
        token: tokenGenerator(),
        badges: [],
        roles: []
      });

    // Assign any flightUserRecords which might belong to this user
    const flightUserRecords = await firestore()
      .collection("flightUserRecord")
      .where("email", "==", email)
      .get();

    await Promise.all(
      flightUserRecords.docs.map(record => {
        return record.ref.update({ userId: id });
      })
    );

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

  static async getUnverifiedUsers() {
    const lockedUsers = await firestore()
      .collection("users")
      .where("locked", "==", false)
      .where("approved", "==", false)
      .get();
    return lockedUsers.docs
      .map(d => ({ ...d.data(), id: d.id }))
      .filter(
        d =>
          d.verification &&
          d.verification.parentPhotoUrl &&
          d.verification.idPhotoUrl &&
          d.verification.stripeCustomerId
      );
  }
};
