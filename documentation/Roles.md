# Roles

_Unauthenticated_

- Create Account

_Self_

- Change Email Address
- Change Name
- Change Display Name
- Change Profile Picture

_Authenticated_

- Read Badge
- Read Mission
- Read Simulator

_Staff_

- View Participants
- List Participants
- Assign Badge
- Revoke Badge
- Add Flight Record
- Remove Flight Record
- Edit Flight Record

_Director_

- Create Badge
- Edit Badge
- Delete Badge
- Create Mission
- Edit Badge
- Delete Mission
- Create Simulator
- Delete Simulator
- Edit Simulator
- Create Flight Type
- Edit Flight Type
- Remove Flight Type

_Administrator_ **All Permissions**

## Implementation

On the backend, roles are enforced using a
[custom directive](https://www.apollographql.com/docs/apollo-server/features/authentication.html#directives-auth).

On the frontend, roles are enforced using a custom component.
