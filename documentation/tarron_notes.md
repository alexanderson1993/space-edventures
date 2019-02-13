# Tarron's Notes

## Questions

## TODO

- [ ] Make successful claimBadge return the badge
- [ ] Delete the badge assignment after successful claiming
- [ ] Limit centers' permissions on objects that don't directly have the center's ID on the object

## Working on

- [x] Modify the generate script so that it will tie users to actual firebase users
- [x] Add Stripe CustomerID on space center?
- [x] Make User schema up-to-date
- [x] Add CRUD for users
- [x]
- [ ] Flight Assignment and flight records
- [ ] Need to add centerId to badge assignments so that permissions can be checked appropriately

## Backlog

## Notes on how to use Firebase Functions

### Notes

- Remember to be in the "functions" folder before running commands

### Commands

- firebase serve
- firebase deploy --only functions

## GraphQL Queries
```graphql
mutation {
	badgeClaim(token:"dgrszwtzew") {
		isSuccess
    badge {
			id
    }
    failureType
  }
}

```