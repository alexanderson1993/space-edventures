# Tarron's Notes

## Questions

## TODO

- [ ] Limit centers' permissions on objects that don't directly have the center's ID on the object
  - Existing resolvers might need to have this check added on them

## Working on

- [x] Modify the generate script so that it will tie users to actual firebase users
- [x] Add Stripe CustomerID on space center?
- [x] Make User schema up-to-date
- [x] Add CRUD for users
- [x] Add ability to assign multiple badges at once
- [x] Need to add centerId to badge assignments so that permissions can be checked appropriately
  - [x] Add secondary checks for access to objects that don't have the space center id on the object
- [x] Check to see if valid badge before badge assign
- [x] Delete the badge assignment after successful claiming
- [x] Make successful claimBadge return the badge
- [ ] Flight Assignment and flight records
  - [x] Build flight type model and graphql schema

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
    badgeClaim(token:"lgg8plx96z") {
        isSuccess
    badgeId
        failureType
    }
}

mutation {
  badgeAssign (badges: [
    {badgeId:"2gFkOq4Suoir03olyLm6", flightId:"0LFSd9S3fkbAhRvDHmFV"},    
    {badgeId:"s1xrzMK1vrq9IUDUIFXO", flightId:"0LFSd9S3fkbAhRvDHmFV"}
  ]) {
    id
    type
  }
}

{
	center(id:"iapR2ol0OgMDDBW1IvVf"){
		badges {
      id
    }
  }
}


mutation {
  flightTypeCreate(data:{
    name:"Tarron's Test Flight"
    flightHours:10
    classHours:20
  }){
    id
  }
}


mutation {
  flightTypeDelete(id:"6a3FKK8JF0j9AaboE2fG")
}

mutation {
  flightTypeEdit(id:"", data: {

  })
}

```