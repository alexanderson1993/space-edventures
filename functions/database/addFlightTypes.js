module.exports = function addFlightTypes(db, spaceCenterIds) {
  const flights = [
    {
      spaceCenterId: spaceCenterIds[0],
      name: "Flight Type A",
      flightHours: 3,
      classHours: 1
    },
    {
      spaceCenterId: spaceCenterIds[0],
      name: "Flight Type B",
      flightHours: 3,
      classHours: 1
    },
    {
      spaceCenterId: spaceCenterIds[1],
      name: "Flight Type A",
      flightHours: 3,
      classHours: 1
    },
    {
      spaceCenterId: spaceCenterIds[1],
      name: "Flight Type B",
      flightHours: 3,
      classHours: 1
    }
  ];

  return Promise.all(
    flights.map(flight => db.collection("flightTypes").add(flight))
  );
};
