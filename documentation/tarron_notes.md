# Tarron's Notes

## Questions

## TODO

- [x] Limit centers' permissions on objects that don't directly have the center's ID on the object
  - Existing resolvers might need to have this check added on them
- [ ] flight type from record
  - center
- [x] User profile get flight hours and class hours (parse badges)
- [x] Messages
- [ ] Double check permissions on everything (since front-end can't do any secure permission checking)

- [ ] Change token generator to a random space phrase generator

## Working on

- [x] Edit flight record
- [x] Question: what should the stations resolver do on the simulator object? Should it query all flight records with that simulator id and see what stations it's been associated with?

- [ ] Flight record generate token (need to use transactions)

- [ ] flightRecordUser
  - [ ] flightUserRecordCreate - stopped in the middle of this, need to build out model
  - [ ] Test
- [ ] Test all of Flight Record GraphQL
- [ ] Any queries that edit flight records have to also edit flight user records

- [ ] Badge -> users query (found in flightRecord)

## Recently Finished

- [x] Flight Assignment and flight records
- [x] From user, get flight records
- [x] User getFlights will only return stations/simulators that the user is on

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

<!-- ======================================================================= -->
<!-- Flight Records -->
<!-- ======================================================================= -->
mutation {
  flightRecordCreate(
    thoriumFlightId: "tarrontest"
    flightTypeId: "B34b963R6IOUdREeglqQ"
    simulators: [
      {
        id: "80t27YsR51aqNHriulJL"
        stations: [
          {
            name: "gunner"
            badges: ["2gFkOq4Suoir03olyLm6"]
            userId: "Vt9VfgbVxUOCfURwVBlTGheqp9j2"
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

mutation {
  flightEdit (
  # flightRecordCreate (
    id: "SqMwTXSdYO2Drs6NDTYV"
    thoriumFlightId: "tarrontest1"
    flightTypeId: "B34b963R6IOUdREeglqQ"
    simulators: [
      {
        id: "80t27YsR51aqNHriulJL"
        stations: [
          {
            name: "gunner"
            badges: ["2gFkOq4Suoir03olyLm6"]
            #userId: "Vt9VfgbVxUOCfURwVBlTGheqp9j2"
          }
        ]
      }
    ]
  ) {
    id
  }
}



<!-- ======================================================================= -->
<!-- Simulators -->
<!-- ======================================================================= -->
mutation {
  simulatorCreate (name:"DragonShip",stations:["gunner","captain"]) {
		id
  }
}

<!-- ======================================================================= -->
<!-- Flight user Records -->
<!-- ======================================================================= -->
<!-- Participant D: Vt9VfgbVxUOCfURwVBlTGheqp9j2 -->
<!-- Simulator 80t27YsR51aqNHriulJL -->
<!-- TMmKm4fMSDjWNNyHbKX0 -->

mutation {
  flightUserRecordCreate(
    flightRecordId: "TMmKm4fMSDjWNNyHbKX0"
    stationName: "gunner"
    simulatorId: "80t27YsR51aqNHriulJL"
    userId: "Vt9VfgbVxUOCfURwVBlTGheqp9j2"
  ) {
    id
  }
}

<!-- ======================================================================= -->
<!-- Messages -->
<!-- ======================================================================= -->

# mutation {
#   messageCreate(
#     subject:"test message"
#     message:"I just thought you ought to know"
#     recipients:["personA", "personB"]
#   ) {
#     id
#   }
# }

# {
# 	message (id:"IfLMRzqw2Z9Oo6h0GOG7") {
# 		id
#     recipients
#     date
#   }
# }

# {
#   messages {
#     id
#     recipients
#     date
#   }
# }

mutation {
  messageMarkRead(messageId:"IfLMRzqw2Z9Oo6h0GOG7") {
    id
  }
}

```
