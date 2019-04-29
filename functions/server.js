const app = require("./graphql/index")();
console.log(process.env.FIREBASE_CONFIG);

app.listen(5000);
