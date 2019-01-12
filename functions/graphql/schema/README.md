# Schema

Other than `index.js`, each file (or folder) in this folder should correspond to
a specific feature or set of functionality. The more atomic, the better. Each
file (or folder) should export two things:

1. `schema`: The schema definition, covering all of the GraphQL types that are
   necessary for that piece of functionality. They should take advantage of
   GraphQL's `extend` keyword to extend existing GraphQL types.
2. `resolver`: An object with all the resolver functions necessary for that
   piece of functionality. This includes resolvers for any type that might have
   been extended. In the end, all of the resolvers will be deep merged, so it
   all works out in the end.

Whenever a new functionality file is added, it needs to be imported in the
`/schema/index.js` file and its schema and resolver should be inserted into the
correct spots in the executable schema generator.

Resolvers should be kept short and succinct, and provide the structure for three
things:

1. Authentication and authorization - Is the user who they say they are? Do they
   have permission to do what they are trying to do?
2. Validation - Make sure the data is correct. Is it formatted properly? Does it
   fit within the requirements?
3. Action - Perform the requested action.

As much of that functionality as possible should be offloaded to files in the
`/models` folder
