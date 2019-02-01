module.exports = function addSpaceCenters(db, directorIds) {
  const spaceCenters = [
    {
      name: "SpaceCenterA",
      registeredDate: new Date("10 October 2010"),
      description: "This is the description for Space Center A",
      directorId: directorIds[0]
    },
    {
      name: "SpaceCenterB",
      registeredDate: new Date("10 October 2010"),
      description: "This is the description for Space Center B",
      directorId: directorIds[1]
    }
  ];
  return Promise.all(
    spaceCenters.map(spaceCenter =>
      db.collection("spaceCenters").add(spaceCenter)
    )
  );
};
