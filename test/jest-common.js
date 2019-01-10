const path = require("path");

module.exports = {
  rootDir: path.join(__dirname, ".."),
  moduleDirectories: [
    "node_modules",
    path.join(__dirname, "../src"),
    "shared",
    __dirname
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/",
    "__server_tests__/"
  ],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
    "jest-watch-select-projects"
  ]
};
