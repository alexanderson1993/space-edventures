# Tarron's Notes

## Questions

## TODO

- [ ] Double check permissions on everything (since front-end can't do any secure permission checking)

- [ ] Figure out how to hide errors on GraphQL (for production)
- [ ] Delete locked users after 30 days line 439 Model/User.Js

- [ ] Officer log

## Working on

- [ ] Double check graphql permissions

  - [x] Badge schema
  - [x] Center Schema
  - [x] Coppa Verify
  - [x] Flight records
  - [x] Flight Types
    - Make sure badge flight type matches the type of the flight record being assigned to the badge
      badge { flight type }
  - [x] Flight user records
  - [ ] user
  - [ ] stripe
  - [ ] simulators
  - [ ] Ranks
  - [ ] Officer Log
  - [ ] Messages

    - Can users view their own flight records?

- [ ] Test front-end

## Backlog

## Notes on how to use Firebase Functions

### Notes

- Remember to be in the "functions" folder before running commands

### Commands

- firebase serve
- firebase deploy --only functions

## GraphQL Queries

```graphql

<!-- ----------------------------------------------------------------------- -->
<!-- Centers -->
<!-- ----------------------------------------------------------------------- -->
mutation {
  centerCreate(
    name: "Tarron's Test Space Center"
    website: "https://www.Example.com"
    email: "tarronlane@gmail.com"
    token: "123456789012345678901234567890123456"
    planId: "plan_EOHo5AwhQNNvGE"
  ) {
    id
  }
}

<!-- ======================================================================= -->
<!-- Badges -->
<!-- ======================================================================= -->

mutation {
  badgeCreate(
    badge :{
        # id: ""
        name: "TarronTest"
        type: badge
        description: "Test badge created by Tarron"
        flightTypeId: "rV0TVOnZNEMH36Ypv8ne"
    }
    centerId: "qcjMy8SGBPuvQ3ufN9cl_"
  ){
		id
  }
}

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

<!-- ----------------------------------------------------------------------- -->
<!-- Flight Types -->
<!-- ----------------------------------------------------------------------- -->

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
	flightRecord(id:"ey46TG6Jm6v6ZfIJvIXN", centerId:"qcjMy8SGBPuvQ3ufN9cl") {
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
