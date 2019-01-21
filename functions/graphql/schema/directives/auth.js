const { gql, ForbiddenError } = require("apollo-server-express");
const { SchemaDirectiveVisitor } = require("graphql-tools");
const { defaultFieldResolver, GraphQLString } = require("graphql");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  directive @auth(requires: [ROLE] = [admin]) on OBJECT | FIELD_DEFINITION

  enum ROLE {
    admin
    staff
    director
    authenticated
    # For accessing information about
    # the currently logged in person
    self
  }
`;

// Adapted from https://www.apollographql.com/docs/graphql-tools/schema-directives.html#Enforcing-access-permissions
class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredAuthRoles = this.args.requires;
  }
  // Visitor methods for nested types like fields and arguments
  // also receive a details object that provides information about
  // the parent and grandparent types.
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requiredAuthRoles = this.args.requires;
  }

  ensureFieldsWrapped(objectType) {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();
    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;

      // Override the field's resolver function so it checks permissions before resolving.
      field.resolve = async function(...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        const requiredRoles =
          field._requiredAuthRoles || objectType._requiredAuthRoles;

        if (!requiredRoles) {
          return resolve.apply(this, args);
        }

        // Grab the user off of context
        const context = args[2];
        const { user } = context;

        // Provide different error messages based on whether it is a field
        // or object that is being denied.
        if (
          field._requiredAuthRoles &&
          !user.hasOneOfRoles(field._requiredAuthRoles)
        ) {
          throw new ForbiddenError(
            `Insufficient permissions to access field "${fieldName}"`
          );
        }

        if (
          objectType._requiredAuthRoles &&
          !user.hasOneOfRoles(objectType._requiredAuthRoles)
        ) {
          throw new ForbiddenError(
            `Insufficient permissions to access object "${objectType.name}"`
          );
        }

        return resolve.apply(this, args);
      };
    });
  }
}

// We define all of the resolvers necessary for
// the functionality in this file. These will be
// deep merged with the other resolvers.
module.exports.schemaDirectives = {
  auth: AuthDirective
};
