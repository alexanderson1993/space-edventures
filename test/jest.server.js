module.exports = {
  ...require("./jest-common"),
  displayName: "server",
  testEnvironment: "jest-environment-node",
  testMatch: ["**/functions/__tests__/**/*.js"],
  collectCoverageFrom: [
    "functions/**/*.{js,jsx,ts,tsx}",
    "!functions/**/*.d.ts"
  ]
};
