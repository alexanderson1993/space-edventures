// require all dependencies to set up server
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const schema = require("./schema");

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
    tracing: process.env.NODE_ENV !== "production"
  });

  // now we take our newly instantiated ApolloServer and apply the
  // previously configured express application
  server.applyMiddleware({ app });

  // finally return the application
  return app;
}

module.exports = configureServer;
