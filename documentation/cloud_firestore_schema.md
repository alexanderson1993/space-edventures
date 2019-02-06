# Firestore Objects

## Questions

## Current Structure

### Users

- email
- firstName
- lastName
- registerDate
- displayName _(fake name for directors to see)_
- rankId
- List: Badges _(list of ids)_
- birthDate
- profilePicture
- **REMOVED** _Collection : [Badges] # So that we have the historical view of the mission when they took it_
- **REMOVED** _Collection : [FlightRecord] ### Should we remove this, since we have the same information on flight record?_
- **REMOVED** _flightHours (REMOVED)_
- **REMOVED** _classHours (REMOVED)_

### Badges - Assigned to a user at arbitary times

- name
- description
- image/logo
- spaceCenterId
- flightId
- date

### Flight Type - A type of flight that can be experienced by a participant

- spaceCenterId
- name
- flightHours
- classHours

### Flight Record - When a particpant goes on a flight

- flight type id
- participant id
- simulator id
- station id
- date

### Mission

_(stored as a badge)_

### Simulator

- Id
- Name

### SpaceCenter

- DirectorId
- Name
- registeredDate
- description
- customerId

### Rank

- Name
- Description
- Order

Message

- From
- list: user ids who the message is to
- list: users who have opened and read the message
- content
- SentDate
