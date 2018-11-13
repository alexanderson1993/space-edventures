import React from "react";

import { Input, Button, Navigator } from "../../components";

const Register = () => {
  return (
    <div style={{ maxWidth: "540px" }}>
      <h1>Register a Space Center</h1>
      <Navigator>
        {navigate => (
          <form
            onSubmit={e => {
              e.preventDefault();
              navigate("./dashboard");
            }}
          >
            <div>
              <label>Name of Space Center: </label>
              <Input type="text" />
            </div>
            <div>
              <label>Address Line 1: </label>
              <Input type="text" />
            </div>
            <div>
              <label>Address Line 2: </label>
              <Input type="text" />
            </div>
            <div>
              <label>Phone Number: </label>
              <Input type="text" />
            </div>
            <div>
              <Button type="submit">Register</Button>
            </div>
          </form>
        )}
      </Navigator>
    </div>
  );
};
export default Register;
