# Tarron's Notes

## Questions

- [ ] In the following code, it looks like each badge will have a "user" property that will return a user. Since we decided to just have one badge and we'll tie that to all the users that have earned it, should we get rid of this?
- [ ] Since our Functions code doesn't have access to create/delete users, will all that have to be done on the front end? For the firebase user only, not the firestore user.
- [ ] Profiles don't have the user id on them, making them fail the "self" check in auth.js

##### functions\graphql\schema\user.js

```javascript
extend type Badge {
    user: User
}

  .
  .
  .

Badge: {
    user: (badge, args, context) => {}
},
```

## Working on

- [x] Modify the generate script so that it will tie users to actual firebase users
- [ ] Add Stripe CustomerID on space center?
- [x] Make User schema up-to-date
- [ ] Add CRUD for users
- [ ]

## Backlog

## Notes on how to use Firebase Functions

### Notes

- Remember to be in the "functions" folder before running commands

### Commands

- firebase serve
- firebase deploy --only functions
