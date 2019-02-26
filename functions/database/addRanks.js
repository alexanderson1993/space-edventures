module.exports = function addRanks(db) {
  const ranks = [
    {
      name: "Cadet",
      description: "You're just starting out",
      flightHours: 0,
      classHours: 0
    },
    {
      name: "Padawan",
      description: "You started a while ago",
      flightHours: 2,
      classHours: 2
    },
    {
      name: "Acolyte",
      description: "You've learned magic too, Yay",
      flightHours: 4,
      classHours: 4
    },
    {
      name: "Graduate",
      description: "You're ready for actual combat",
      flightHours: 8,
      classHours: 8
    },
    {
      name: "Ensign",
      description:
        "You can now be trusted with a weapon, but you still only get a red shirt",
      flightHours: 12,
      classHours: 10
    },
    {
      name: "Admiral",
      description: "Seems like you've made it to the top",
      flightHours: 20,
      classHours: 15
    }
  ];
  return Promise.all(ranks.map(rank => db.collection("ranks").add(rank)));
};
