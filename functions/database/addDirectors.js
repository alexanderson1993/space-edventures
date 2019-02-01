module.exports = function addDirectors(db, firebaseUsers) {
  // Add the users to the database, then pass the returned Ids to create the space centers
  return Promise.all(
    firebaseUsers.map(
      ({ email, uid, firstName, lastName }) =>
        db
          .collection("users")
          .doc(uid)
          .set({
            email: email,
            firstName: firstName,
            lastName: lastName,
            registerDate: Date("10 Oct 2010")
          })
          .then(() => uid) // Return the uid for the directors
    )
  );
};
