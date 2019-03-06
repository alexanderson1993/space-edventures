module.exports = {
  flightTypeLoader: require("./flightType"),
  ...require("./flightRecord"),
  hoursLoader: require("./hoursLoader"),
  badgeLoader: require("./badgeLoader")
};
