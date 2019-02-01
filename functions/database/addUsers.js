module.exports = function addUsers(db, participants, badgeIds, rankIds) {
  return Promise.all(
    participants.map(({ uid, firstName, lastName, displayName, email }) => {
      // Defaults
      let rankId = rankIds[0];
      let badges = [];

      // Here is where you can set properties for specific users
      if (email.includes("participanta")) {
        badges = [badgeIds[0], badgeIds[1]];
      }

      return db
        .collection("users")
        .doc(uid)
        .set({
          firstName: firstName,
          lastName: lastName,
          email: email,
          displayName: displayName,
          rankId: rankId,
          badges: badges
        })
        .then(() => {
          return uid;
        });
    })
  );
};
