import { publish, subscribe } from "./pubsub";

describe("pubsub", () => {
  test("should successfully create a subscription", () => {
    const sub = subscribe("myTopic", () => {});
    expect(sub).toBeInstanceOf(Function);
    sub();
  });
  test("should publish without errors", () => {
    publish("myTopic", "blah");
  });
  test("should publish to a topic", done => {
    const expected = "blah";
    const sub = subscribe("myTopic", data => {
      expect(data).toEqual(expected);
      done();
    });
    publish("myTopic", "blah");
    sub();
  });
});
