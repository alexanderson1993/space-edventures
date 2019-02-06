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
          email: email,
          profile: {
            firstName: firstName,
            lastName: lastName,
            displayName: displayName,
            birthDate: new Date("10 Oct 2010"),
            profilePicture: "path/to/my/picture"
          },
          rankId: rankId,
          badges: badges
        })
        .then(() => {
          return uid;
        });
    })
  );
};
