import React from "react";
import { render } from "../../../helpers/testRender";
import MagicLinkPage from "../../../pages/accounts/magicLinkPage";

test("magicLinkPage", () => {
  const { container } = render(<MagicLinkPage location={{ href: "/" }} />);
  expect(container).toMatchSnapshot();
});
