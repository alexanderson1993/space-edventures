# Flight and Badge Assignment

Flights and badges are assigned to participants in two ways:

1. Through the API
2. Using the Director or staff's UI

There is a problem - what if the participant's user object doesn't exist before the flight or badge is assigned? There are, then, two ways that a badge can be assigned:

1. The user does exist, and the badge is directly assigned to the user.
2. The user does not exist. A intermediary object must be created to store the information about the flight or badge until the intermediary object is created.

This intermediary object will exist in it's own collection. It will have all the necessary information, such as the date received, space center, and the badge ID or flight type, simulator, and station. A `token` property will be used to populate QR codes which can be used to look up the intermediary object. This token property will be different from the ID, and will be an easy to type in code which can easily be looked up.

The QR code will link to a page which automatically assigns the flight or badge to the currently logged in user. Another page will generate the QR code and also include the URL and token which must be typed in to collect the badge.
