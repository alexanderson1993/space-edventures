module.exports = {
  ...require("./test/jest-common"),
  collectCoverageFrom: ["**/src/**/*.js"],
  coverageThreshold: {
    global: {
      statements: 17,
      branches: 4,
      functions: 20,
      lines: 17
    }
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/",
    "__server_tests__/"
  ],
  projects: ["./test/jest.lint.js", "./test/jest.client.js"]
};
