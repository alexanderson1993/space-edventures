// require all dependencies to set up server
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const schema = require("./schema");
const { User, Center } = require("./models");
const admin = require("./connectors/firebase");
const fileMiddleware = require("express-multipart-file-parser");
const { merge } = require("lodash");
// cors allows our server to accept requests from different origins
const cors = require("cors");
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://1b8a0bb621ae486a96c6d26ea5a4ce20@sentry.io/1463538"
});

function configureServer() {
  // invoke express to create our server
  const app = express();
  app.use(Sentry.Handlers.requestHandler());

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
      const mapped = filePaths.reduce((prev, [paths, file]) => {
        const reducedPaths = paths.reduce(
          (p, path) => ({
            ...p,
            ...path
              .split(".")
              .reverse()
              .reduce((pp, next) => ({ [next]: pp }), file)
          }),
          {}
        );
        return merge(prev, reducedPaths);
      }, {});
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
    engine: { apiKey: process.env.ENGINE_API_KEY },
    tracing: process.env.NODE_ENV !== "production",
    uploads: false,
    introspection: true,
    context: async ({ req }) => {
      // PRODUCTION VERSION
      const token = (req.headers.authorization || "").replace("Bearer ", "");

      // If you need to test a specific user's graphQL abilities
      // FOR DEBUGGING, COMMENT OUT IN PRODUCTION
      // USER
      // const token = await User.getToken('participantd@example.com', 'Test1234');
      // CENTER
      // const token = "123456789012345678901234567890123456"; // Must be a 36 long string that matches the apiToken object on a center
      // DIRECTOR
      // const token = await User.getToken("directora@example.com", "Test1234"); // user id: ykR3TSwRYAXcvqgYGaNR2G3Px2w2 // His center: iapR2ol0OgMDDBW1IvVf

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
      } catch (error) {
        console.error(error);
        return {};
      }
    }
  });

  // now we take our newly instantiated ApolloServer and apply the
  // previously configured express application
  server.applyMiddleware({ app });
  app.use(Sentry.Handlers.errorHandler());

  // Optional fallthrough error handler
  app.use((err, req, res, next) => {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    console.error("There was an error");
    console.error(err);
    console.error(res.sentry);

    res.statusCode = 500;
    res.end(res.sentry + "\n");
  });

  // finally return the application
  return app;
}

module.exports = configureServer;
