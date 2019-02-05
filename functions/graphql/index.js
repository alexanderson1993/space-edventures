// require all dependencies to set up server
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const schema = require("./schema");
const { User, Center } = require("./models");
const admin = require("./connectors/firebase");
const fileMiddleware = require("express-multipart-file-parser");

function getUser(token) {
  return {
    id: 1,
    username: "Test User",
    profile: { profilePicture: "", age: 5 },
    roles: ["staff"]
  };
}

// cors allows our server to accept requests from different origins
const cors = require("cors");

function configureServer() {
  // invoke express to create our server
  const app = express();

  //use the cors middleware
  app.use(cors());

  // Set up for the file middleware
  app.use((req, res, next) => {
    if (req.body instanceof Buffer) {
      req.body = {};
    }
    next();
  });

  app.use(fileMiddleware);
  app.use((req, res, next) => {
    // Map the files onto the query.
    if (req.files) {
      const ops = JSON.parse(req.body.operations);
      const maps = JSON.parse(req.body.map);
      const filePaths = Object.entries(maps).reduce(
        (prev, [key, pathArr]) =>
          prev.concat([[pathArr, req.files.find(f => f.fieldname === key)]]),
        []
      );
      const mapped = filePaths.reduce(
        (prev, [paths, file]) => ({
          ...prev,
          ...paths.reduce(
            (p, path) => ({
              ...p,
              ...path
                .split(".")
                .reverse()
                .reduce((pp, next) => ({ [next]: pp }), file)
            }),
            {}
          )
        }),
        {}
      );
      //  "variables.picture"
      req.body = {
        ...ops,
        variables: { ...ops.variables, ...mapped.variables }
      };
    }
    next();
  });
  const server = new ApolloServer({
    schema,
    engine: process.env.ENGINE_API_KEY,
    tracing: process.env.NODE_ENV !== "production",
    uploads: false,
    context: async ({ req }) => {
      // get the user token from the headers
      const token = (req.headers.authorization || "").replace("Bearer ", "");

      // If you need to test a specific user's graphQL abilities
      //   let token = await User.getToken('tarronlane@hotmail.com', 'Test1234');

      if (!token) return { user: null };

      try {
        // A 36-character token is likely a space center API key;
        if (token.length === 36) {
          const center = await Center.getByApiToken(token);
          return { center, user: null };
        }

        // try to retrieve a user with the token
        const userData = await User.getUser(token);
        const user = new User(userData);
        // add the user to the context
        return { user };
      } catch (_) {
        return {};
      }
    }
  });

  // now we take our newly instantiated ApolloServer and apply the
  // previously configured express application
  server.applyMiddleware({ app });

  // finally return the application
  return app;
}

module.exports = configureServer;
