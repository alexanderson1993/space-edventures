const { typeDefs } = require("./server");
const fs = require("fs");

fs.writeFileSync("typeDefs.json", JSON.stringify(typeDefs));
