# Models

Files in this folder should access the connectors and provide specific bits of
data and business logic necessary for the resolvers. This is where caching (if
any) happens. This is also where complicated business logic should be stored.
Anything that is used in multiple resolvers should also be abstracted to a file
in this folder.
