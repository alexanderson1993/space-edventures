# Space EdVentures

Space Edventures is a point tracking system for participants of the Space
Edventures centers, primarily located in Utah.

The App is built with a [React](https://reactjs.org)
([create-react-app](https://facebook.github.io/create-react-app/)) frontend and
a [Firebase](https://firebase.google.com) backend.

## Running Locally

```
git clone https://github.com/alexanderson1993/space-edventures.git
cd space-edventures

npm install
npm start
```

## Frontend

There are several other packages used on the frontend:

- [`arwes`](https://arwesjs.org) design system
- [`emotion`](https://emotion.sh) for styling
- [`@reach/router`](https://reach.tech/router) for routing

The Layout is handled by several components in the Layout folder. Generic
helpers that are used throughout the app are stored in the `/src/helpers`
folder. Generic components that are used in multiple places in the app are
stored in the `/src/components` folder, and exported in the `index.js` file,
making them easily accessible. Generic styled components created with `emotion`
are also included in this folder.

Main routes are configured in the `/src/routes.js` file. Sub-routes are
configured in the `/src/pages/index.js` file.

## CI/CD

It uses several different packages for CI/CD:

- [`jest`](https://jestjs.io) for testing
- [`eslint`](https://eslint.org) for linting
- [`prettier`](https://prettier.io) for automatic formatting
- [Travis CI](https://travis-ci.org) for the build process

The app is deployed on [Firebase](https://firebase.google.com). DNS and
additional services are provided by [Cloudflare](https://www.cloudflare.com).

The CI process runs for every commit and pull request, to validate that the
tests are passing and the code meets standards. In addition, an automated
process validates the code locally whenever there is a commit.

When changes are merged into the master branch, CI automatically validates, and
then deploys both the app and the Firebase functions.
