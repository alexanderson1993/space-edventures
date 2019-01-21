const { gql } = require("apollo-server-express");
const { SchemaDirectiveVisitor } = require("graphql-tools");
const formatDate = require("dateformat");
const { defaultFieldResolver, GraphQLString } = require("graphql");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  directive @date(defaultFormat: String = "mmmm d, yyyy") on FIELD_DEFINITION
`;

class FormattableDateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { defaultFormat } = this.args;

    field.args.push({
      name: "format",
      type: GraphQLString
    });

    field.resolve = async function(
      source,
      { format, ...otherArgs },
      context,
      info
    ) {
      const date = await resolve.call(this, source, otherArgs, context, info);
      // If a format argument was not provided, default to the optional
      // defaultFormat argument taken by the @date directive:
      return formatDate(date, format || defaultFormat);
    };

    field.type = GraphQLString;
  }
}

module.exports.schemaDirectives = {
  date: FormattableDateDirective
};
