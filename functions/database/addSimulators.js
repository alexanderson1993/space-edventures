module.exports = function addSimulators(db) {
  const sims = [
    {
      name: "USS Enterprise"
    },
    {
      name: "Backyard Flying Saucer"
    },
    {
      name: "Trumps Space Force Flagship"
    }
  ];
  return Promise.all(sims.map(sim => db.collection("simulators").add(sim)));
};
