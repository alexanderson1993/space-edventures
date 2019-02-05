// require all dependencies to set up server
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const schema = require("./schema");
const { User, Center } = require("./models");
const admin = require("./connectors/firebase");

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

  const server = new ApolloServer({
    schema,
    engine: process.env.ENGINE_API_KEY,
    tracing: process.env.NODE_ENV !== "production",
    uploads: {
      maxFileSize: 10000000, // 10 MB
      maxFiles: 20
    },
    context: async ({ req }) => {
      const token = (req.headers.authorization || "").replace("Bearer ", "");
      // If you need to test a specific user's graphQL abilities
      //   const token = await User.getToken('participantd@example.com', 'Test1234');

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
