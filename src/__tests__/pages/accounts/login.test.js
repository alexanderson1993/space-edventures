import React from "react";
import { render } from "../../../helpers/testRender";
import Login from "../../../pages/accounts/login";
import { ErrorProvider } from "../../../helpers/errorContext";

describe("login", () => {
  test("snapshot", () => {
    const { container } = render(
      <ErrorProvider>
        <Login />
      </ErrorProvider>
    );
    expect(container).toMatchSnapshot();
  });
  test("signup error", () => {});
  test("magic link error", () => {});
  test("create account switch", () => {});
});
