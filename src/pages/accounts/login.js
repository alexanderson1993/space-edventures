import React from "react";

import { Input, Button, Navigator } from "../../components";

const Login = ({ signUp, to = "/" }) => {
  return (
    <div style={{ maxWidth: "540px" }}>
      <Navigator>
        {navigate => (
          <form
            onSubmit={e => {
              e.preventDefault();
              navigate(to);
            }}
          >
            <div>
              <label>Email: </label>
              <Input type="email" />
            </div>
            <div>
              <label>Password: </label>
              <Input type="password" />
            </div>
            {signUp && (
              <div>
                <label>Confirm Password: </label>
                <Input type="password" />
              </div>
            )}
            <div>
              <Button type="submit">
                {signUp ? "Create Account" : "Login"}
              </Button>
            </div>
          </form>
        )}
      </Navigator>
    </div>
  );
};
export default Login;
