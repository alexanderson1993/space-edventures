import "react-testing-library/cleanup-after-each";
import React from "react";
import { render } from "react-testing-library";
import App from "../App";

test("renders the application", () => {
  render(<App />);
});
