const {
  schema: AuthSchema,
  schemaDirectives: AuthSchemaDirectives
} = require("./auth");
const { merge } = require("lodash");

module.exports = {
  schema: [].concat(AuthSchema),
  schemaDirectives: AuthSchemaDirectives
};
