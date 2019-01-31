import React from "react";
import { render } from "../../../helpers/testRender";
import Login from "../../../pages/accounts/login";

describe("login", () => {
  test("snapshot", () => {
    const { container } = render(<Login />);
    expect(container).toMatchSnapshot();
  });
  test("signup error", () => {});
  test("magic link error", () => {});
  test("create account switch", () => {});
});
