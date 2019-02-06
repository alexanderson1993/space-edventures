module.exports = function addSpaceCenters(db, directorIds) {
  // Stripe Customer ID's are hard-coded to the test values in the stripe online
  //
  const spaceCenters = [
    {
      name: "SpaceCenterA",
      registeredDate: new Date("10 October 2010"),
      description: "This is the description for Space Center A",
      directorId: directorIds[0],
      customerId: "cus_ESNNyIT4MXTBFt"
    },
    {
      name: "SpaceCenterB",
      registeredDate: new Date("10 October 2010"),
      description: "This is the description for Space Center B",
      directorId: directorIds[1],
      customerId: "cus_ESNOSrzJUK9fS9"
    }
  ];
  return Promise.all(
    spaceCenters.map(spaceCenter =>
      db.collection("spaceCenters").add(spaceCenter)
    )
  );
};
