# Tarron's Notes

## Questions

## TODO

- [ ] Limit centers' permissions on objects that don't directly have the center's ID on the object
  - Existing resolvers might need to have this check added on them

## Working on

- [ ] Flight Assignment and flight records
  - [ ] From user, get flight records
    - [ ] In order for this to be more straight forward, I am thinking of storing the link on the user object

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
  badgeClaim(token: "lgg8plx96z") {
    isSuccess
    badgeId
    failureType
  }
}

mutation {
  badgeAssign(
    badges: [
      { badgeId: "2gFkOq4Suoir03olyLm6", flightId: "0LFSd9S3fkbAhRvDHmFV" }
      { badgeId: "s1xrzMK1vrq9IUDUIFXO", flightId: "0LFSd9S3fkbAhRvDHmFV" }
    ]
  ) {
    id
    type
  }
}

{
  center(id: "iapR2ol0OgMDDBW1IvVf") {
    badges {
      id
    }
  }
}

mutation {
  flightTypeCreate(
    data: { name: "Tarron's Test Flight", flightHours: 10, classHours: 20 }
  ) {
    id
  }
}

mutation {
  flightTypeDelete(id: "6a3FKK8JF0j9AaboE2fG")
}

mutation {
  flightTypeEdit(id: "", data: {})
}

mutation {
  flightRecordCreate(
    thoriumFlightId: "tarrontest"
    flightTypeId: "B34b963R6IOUdREeglqQ"
    simulators: [
      {
        id: "4sQ4jMVAXR0ZpjxTGrLN"
        stations: [
          {
            name: "Weapons"
            badges: ["2gFkOq4Suoir03olyLm6"]
            userId: "he isn't real"
          }
        ]
      }
    ]
  ) {
    id
  }
}

{
  flightRecords(centerId: "iapR2ol0OgMDDBW1IvVf") {
    id
  }
}
```
