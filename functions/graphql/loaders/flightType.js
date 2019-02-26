const { firestore } = require("../connectors/firebase");
const DataLoader = require("dataloader");

const flightTypeLoader = new DataLoader(async ids => {
  const documentRefs = ids.map(id => firestore().doc(`flightTypes/${id}`));
  const documents = await firestore().getAll(documentRefs);
  return documents.map(d => ({ ...d.data(), id: d.id }));
});

module.exports = flightTypeLoader;
