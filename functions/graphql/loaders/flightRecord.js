const { firestore } = require("../connectors/firebase");
const DataLoader = require("dataloader");

const flightRecordLoader = new DataLoader(async ids => {
  const documentRefs = ids.map(id => firestore().doc(`flightRecords/${id}`));
  const documents = await firestore().getAll(documentRefs);
  return documents.map(d => ({ ...d.data(), id: d.id }));
});

module.exports = flightRecordLoader;
