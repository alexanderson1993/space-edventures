module.exports = function addFlightRecords(
  db,
  flightTypeIds,
  userIds,
  simulatorIds
) {
  const flights = [
    {
      flightTypeId: flightTypeIds[0],
      participantId: userIds[0],
      simulatorId: simulatorIds[0],
      stationId: "NO STATION ID",
      date: new Date("10 Oct 2010")
    },
    {
      flightTypeId: flightTypeIds[1],
      participantId: userIds[1],
      simulatorId: simulatorIds[0],
      stationId: "NO STATION ID",
      date: new Date("10 Oct 2010")
    },
    {
      flightTypeId: flightTypeIds[2],
      participantId: userIds[2],
      simulatorId: simulatorIds[1],
      stationId: "NO STATION ID",
      date: new Date("10 Oct 2010")
    },
    {
      flightTypeId: flightTypeIds[3],
      participantId: userIds[3],
      simulatorId: simulatorIds[1],
      stationId: "NO STATION ID",
      date: new Date("10 Oct 2010")
    },
    {
      flightTypeId: flightTypeIds[1],
      participantId: userIds[4],
      simulatorId: simulatorIds[1],
      stationId: "NO STATION ID",
      date: new Date("10 Oct 2010")
    },
    {
      flightTypeId: flightTypeIds[1],
      participantId: userIds[3],
      simulatorId: simulatorIds[2],
      stationId: "NO STATION ID",
      date: new Date("10 Oct 2010")
    },
    {
      flightTypeId: flightTypeIds[3],
      participantId: userIds[2],
      simulatorId: simulatorIds[2],
      stationId: "NO STATION ID",
      date: new Date("10 Oct 2010")
    },
    {
      flightTypeId: flightTypeIds[3],
      participantId: userIds[1],
      simulatorId: simulatorIds[2],
      stationId: "NO STATION ID",
      date: new Date("10 Oct 2010")
    }
  ];
  return Promise.all(
    flights.map(flight => db.collection("flightRecords").add(flight))
  );
};
