const { firestore } = require("../connectors/firebase");
const DataLoader = require("dataloader");

const flightTypeLoader = new DataLoader(async ids => {
  const documentRefs = ids.map(id => firestore().doc(`flightTypes/${id}`));
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

module.exports = flightTypeLoader;
