const { firestore } = require("../connectors/firebase");
const DataLoader = require("dataloader");

const badgeLoader = new DataLoader(async ids => {
  const documentRefs = ids.map(id => firestore().doc(`badges/${id}`));
  const documents = await firestore()
    .getAll(documentRefs)
    .then(docs =>
      ids.map(id => {
        const doc = docs.find(d => d.id === id);
        if (!doc || !doc.exists) return null;
        return { ...doc.data(), id: doc.id };
      })
    );
  return documents;
});

module.exports = badgeLoader;
