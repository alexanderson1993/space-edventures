const { typeDefs } = require("./server");
const fs = require("fs");
const { print } = require("graphql/language/printer");
fs.writeFileSync("typeDefs.graphql", print(typeDefs));
