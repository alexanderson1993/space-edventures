import React from "react";
import { render } from "react-testing-library";
import SentMagicLink from "../../../pages/accounts/sentMagicLink";
import { ErrorProvider } from "../../../helpers/errorContext";

test("sentMagicLink", () => {
  const { container } = render(
    <ErrorProvider>
      <SentMagicLink />
    </ErrorProvider>
  );
  expect(container).toMatchSnapshot();
});
