import React from "react";
import { render } from "../../../helpers/testRender";
import MagicLinkPage from "../../../routes/accounts/magicLink";
import { ErrorProvider } from "../../../helpers/errorContext";

test("magicLinkPage", () => {
  const { container } = render(
    <ErrorProvider>
      <MagicLinkPage location={{ href: "/" }} />
    </ErrorProvider>
  );
  expect(container).toMatchSnapshot();
});
