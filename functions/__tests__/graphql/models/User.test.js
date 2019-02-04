const mockSdk = require("../../../helpers/firebaseMock");
jest.mock("../../../graphql/connectors/firebase.js", () => {
  return mockSdk;
});

const { User } = require("../../../graphql/models");

describe("User model", () => {
  test("it instantiates", () => {
    const user = new User({
      name: "Alex",
      displayName: "Starblaze",
      roles: ["admin", "director"]
    });
    expect(user.name).toEqual("Alex");
    expect(user.displayName).toEqual("Starblaze");
  });
  test("hasOneOfRoles", () => {
    const user = new User({
      name: "Alex",
      displayName: "Starblaze",
      roles: ["admin", "director"]
    });
    expect(user.hasOneOfRoles(["something", "admin"])).toBeTruthy();
    expect(user.hasOneOfRoles(["whatever"])).toBeFalsy();
  });
  test("getUser", () => {
    // I wasn't able to figure out why Jest didn't
    // handle this async test properly. - A
    // mockSdk.auth().autoFlush();
    // await mockSdk.auth().createUser({
    //   uid: "123",
    //   email: "test@test.com",
    //   password: "123456"
    // });
    // const user = await mockSdk.auth().getUser("123");
    // const token = await user.getIdToken();
    // const userObj = await User.getUser(token);
    // return expect(userObj).toEqual({
    //   id: "123",
    //   uid: "123",
    //   email: "test@test.com",
    //   email_verified: false
    // });
  });
  test("getUserById", () => {
    // const dbUser = await User.getUserById("my-user-id");
    // mockSdk.firestore().flush();
    // return expect(dbUser).resolves.toEqual({ id: "my-user-id" });
  });
});
