const stripe = require("../../../graphql/connectors/stripe");

describe("stripe", () => {
  test("has customers property", () => {
    expect(stripe.customers).toBeTruthy();
  });
  test("has products property", () => {
    expect(stripe.products).toBeTruthy();
  });
});
