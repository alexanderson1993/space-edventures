module.exports = {
  ...require("./jest-common"),
  displayName: "dom",
  testEnvironment: "jest-environment-jsdom",
  setupTestFrameworkScriptFile: require.resolve("./setupTests.js"),
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
  coverageThreshold: {
    // global: {
    //   statements: 70,
    //   branches: 70,
    //   lines: 70,
    //   functions: 70
    // }
  },
  resolver: "jest-pnp-resolver",
  setupFiles: ["react-app-polyfill/jsdom"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}"
  ],
  testURL: "http://localhost",
  transform: {
    "^.+setupTests\\.js$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "\\.(gql|graphql)$": "jest-transform-graphql",
    "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)":
      "<rootDir>/config/jest/fileTransform.js"
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
    "^.+\\.module\\.(css|sass|scss)$"
  ],
  moduleNameMapper: {
    "^react-native$": "react-native-web",
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy"
  },
  moduleFileExtensions: [
    "web.js",
    "js",
    "web.ts",
    "ts",
    "web.tsx",
    "tsx",
    "json",
    "web.jsx",
    "jsx",
    "node"
  ]
};
