// =============================================================================
// Builds the Auth GraphQL Directive, which checks the required fields on the GraphQL type/field and compares
// it to the roles on the user's object
// =============================================================================
const {
  gql,
  ForbiddenError,
  AuthenticationError
} = require("apollo-server-express");
const { SchemaDirectiveVisitor } = require("graphql-tools");
const { defaultFieldResolver, GraphQLString } = require("graphql");

// We define a schema that encompasses all of the types
// necessary for the functionality in this file.
module.exports.schema = gql`
  directive @auth(requires: [ROLE] = [admin]) on OBJECT | FIELD_DEFINITION

  enum ROLE {
    admin
    staff
    authenticated

    # For space center API tokens
    center
    # For accessing information about
    # the currently logged in person
    self
    # For accessing information about
    # The center which a person is
    # A director of
    director
  }
`;

// Adapted from https://www.apollographql.com/docs/graphql-tools/schema-directives.html#Enforcing-access-permissions
// See also https://www.apollographql.com/docs/graphql-tools/schema-directives.html#Implementing-schema-directives
class AuthDirective extends SchemaDirectiveVisitor {
  // Logic to perform when the directive is used on a type
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredAuthRoles = this.args.requires;
  }

  // Logic to use when the directive is used on a field
  //  - Visitor methods for nested types like fields and arguments
  //    also receive a details object that provides information about
  //    the parent and grandparent types.
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requiredAuthRoles = this.args.requires; // this.args holds the values passed in the directive usage
  }

  /**
   * Wraps all the fields on the object type, overriding the resolver and making sure that permissions are checked first
   */
  ensureFieldsWrapped(objectType) {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    // Loop through all the fields on the object
    Object.keys(fields).forEach(fieldName => {
      // Get the field
      const field = fields[fieldName];

      // Destructure the field to get the resolve, but default to use defaultFieldResolver if no resolve is found
      const { resolve = defaultFieldResolver } = field;

      // Override the field's resolver function so it checks permissions before resolving.
      field.resolve = async function(...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        // Grab the user off of context
        const [data = {}, queryArgs, context] = args;
        const { user, center } = context;
        const requiredRoles =
          field._requiredAuthRoles || objectType._requiredAuthRoles;

        // If there are no required roles, just return back the same resolver
        if (!requiredRoles) {
          return resolve.apply(this, args);
        }
        if (!user && !center) {
          throw new AuthenticationError(
            `You must be logged in to access "${fieldName || objectType.name}"`
          );
        }

        if (requiredRoles.indexOf("authenticated") > -1 && user) {
          return resolve.apply(this, args);
        }

        // Limit centers to only performing actions that require the center role
        if (requiredRoles.indexOf("center") === -1 && center) {
          throw new AuthenticationError(
            `You do not have permission to access "${fieldName ||
              objectType.name}" using the API.`
          );
        }

        // Allow centers to see their own information
        if (
          requiredRoles.indexOf("center") > -1 &&
          (typeof center !== "undefined" &&
            // Only check if the object has a matching centerId if the object has data (not a mutation)
            // Will only only have to be done this way as long as we aren't assigning roles to centers
            ((typeof data.id === "undefined" &&
              typeof data.centerId === "undefined") || // Case = doesn't have either ID. Mutations only have {}, so they'll get caught in this check
              (center.id === data.centerId || center.id === data.id))) // Case = has one of the id's and it matches the center id from the token
        ) {
          return resolve.apply(this, args);
        }

        if (
          requiredRoles.indexOf("self") > -1 &&
          (user.id === data.userId || user.id === data.id)
        ) {
          // If the GraphQL data's user id matches the user id of the GraphQL context, don't check permissions and just
          // return the normal resolver
          return resolve.apply(this, args);
        }

        // =============================================================
        // Director Permissions
        // =============================================================
        if (
          requiredRoles.indexOf("director") > -1 &&
          typeof user !== "undefined" &&
          user !== null &&
          user.id === data.directorId
        ) {
          return resolve.apply(this, args);
        }

        if (
          // the field has required roles and the user does not have one of those roles
          field._requiredAuthRoles &&
          (!user || !user.hasOneOfRoles(field._requiredAuthRoles))
        ) {
          // Provide different error messages based on whether it is a field
          // or object that is being denied.
          throw new ForbiddenError(
            `Insufficient permissions to access field "${fieldName}"`
          );
        }

        if (
          // The object has required roles and the user does not have one of those roles
          objectType._requiredAuthRoles &&
          (!user || !user.hasOneOfRoles(objectType._requiredAuthRoles))
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
