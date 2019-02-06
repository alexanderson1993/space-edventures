# Versioning

To make sure we don't mess up data on the production server, there are three levels of versioning:

1. Development. Operates on the developers computer only. Uses the `space-edventures-beta` Firebase app and the test Stripe API. Signified by the `NODE_ENV` environment variable not being 'production' and the `REACT_APP_IS_LIVE` environment variable not being present.

2. Beta. Operates on Firebase and accessible at [beta.spaceedventures.org](https://beta.spaceedventures.org). Uses the `space-edventures-beta` Firebase app and the test Stripe API. Signified by the `NODE_ENV` environment variable being 'production' and the `REACT_APP_IS_LIVE` environment variable not being present.

3. Live/Production. Operates on Firebase and accessible at [spaceedventures.org](https://spaceedventures.org). Uses the `space-edventures` Firebase app and the live Stripe API. Signified by the `NODE_ENV` environment variable being 'production' and the `REACT_APP_IS_LIVE` environment variable being present.
