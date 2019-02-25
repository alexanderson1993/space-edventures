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
  ApolloError
} = require("apollo-server-express");
const Stripe = require("./Stripe");
const uploadFile = require("../helpers/uploadFile");
const emailTransport = require("../helpers/email");
const parentVerify = require("../emails/parentVerify");
const parentConsent = require("../emails/parentConsent");
const childConsent = require("../emails/childConsent");
const parentReverify = require("../emails/parentReverify");

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

    // TODO: Add a process to delete locked users after 30 days
    if (parentEmail) {
      // Handle sending emails for parental permission.
      const message = await emailTransport.sendMail({
        from: `"Space EdVentures" hello@spaceedventures.org`,
        to: parentEmail,
        subject: "Your Child Registered at SpaceEdVentures.org",
        html: parentVerify({ id, email })
      });
    }

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
