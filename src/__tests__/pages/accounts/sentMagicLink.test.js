import React from "react";
import { render } from "react-testing-library";
import SentMagicLink from "../../../pages/accounts/sentMagicLink";

test("sentMagicLink", () => {
  const { container } = render(<SentMagicLink />);
  expect(container).toMatchSnapshot();
});
