module.exports = function addRanks(db) {
  const ranks = [
    {
      name: "Cadet",
      description: "You're just starting out",
      order: 1
    },
    {
      name: "Padawan",
      description: "You started a while ago",
      order: 2
    },
    {
      name: "Acolyte",
      description: "You've learned magic too, Yay",
      order: 3
    },
    {
      name: "Graduate",
      description: "You're ready for actual combat",
      order: 4
    },
    {
      name: "Ensign",
      description:
        "You can now be trusted with a weapon, but you still only get a red shirt",
      order: 5
    },
    {
      name: "Admiral",
      description: "Seems like you've made it to the top",
      order: 6
    }
  ];
  return Promise.all(ranks.map(rank => db.collection("ranks").add(rank)));
};
