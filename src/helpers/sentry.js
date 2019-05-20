import * as Sentry from "@sentry/browser";
import { version } from "../../package.json";

Sentry.init({
  release: `space-edventures@${version}`,
  dsn: "https://bf8bbfe476144a699b7ef746a9978773@sentry.io/1463530"
});
