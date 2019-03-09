const { firestore } = require("../connectors/firebase");
const DataLoader = require("dataloader");

const flightRecordLoader = new DataLoader(async ids => {
  const documentRefs = ids.map(id => firestore().doc(`flightRecords/${id}`));
  const documents = await firestore()
    .getAll(documentRefs)
    .then(docs =>
      ids.map(id => {
        const doc = docs.find(d => d.id === id);
        if (!doc.exists) return null;
        return { ...doc.data(), id: doc.id };
      })
    );

  return documents;
});

const flightRecordUserLoader = new DataLoader(async userIds => {
  return Promise.all(
    userIds.map(userId =>
      firestore()
        .collection("flightUserRecord")
        .where("userId", "==", userId)
        .get()
        .then(ref => ref.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    )
  );
});

const flightRecordUserLoaderByBadge = new DataLoader(async badgeIds => {
  return Promise.all(
    badgeIds.map(badgeId => {
      return firestore()
        .collection("flightUserRecord")
        .where("badges", "array-contains", badgeId)
        .get()
        .then(ref => ref.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    })
  );
});

module.exports.flightRecordLoader = flightRecordLoader;
module.exports.flightRecordUserLoader = flightRecordUserLoader;
module.exports.flightRecordUserLoaderByBadge = flightRecordUserLoaderByBadge;
