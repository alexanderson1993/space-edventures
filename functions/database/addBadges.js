module.exports = function addBadges(db, paceCenterIds) {
  const badges = [
    {
      name: "BadgeA",
      description: "This is the description for Badge A",
      imagePath: "path/to/the/image.png",
      spaceCenterId: spaceCenterIds[0],
      date: new Date("10 Oct 2010")
    },
    {
      name: "BadgeB",
      description: "This is the description for Badge B",
      imagePath: "path/to/the/image.png",
      spaceCenterId: spaceCenterIds[0],
      date: new Date("10 Oct 2010")
    },
    {
      name: "BadgeC",
      description: "This is the description for Badge C",
      imagePath: "path/to/the/image.png",
      spaceCenterId: spaceCenterIds[1],
      date: new Date("10 Oct 2010")
    },
    {
      name: "BadgeD",
      description: "This is the description for Badge D",
      imagePath: "path/to/the/image.png",
      spaceCenterId: spaceCenterIds[1],
      date: new Date("10 Oct 2010")
    }
  ];
  return Promise.all(badges.map(badge => db.collection("badges").add(badge)));
};
