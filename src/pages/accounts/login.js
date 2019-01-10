import React, { useState, useContext } from "react";

import { Input, Button, Navigator } from "../../components";
import UserContext from "../../helpers/userContext";
import styled from "@emotion/styled";

const Container = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Form = styled("form")`
  width: 540px;
  max-width: 80%;
`;
const Login = ({ signUp, to = "/" }) => {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <Container>
      <Navigator>
        {navigate => (
          <Form
            onSubmit={e => {
              e.preventDefault();
              login(this.state.email);
              navigate(to);
            }}
          >
            <h2>{signUp ? "Sign Up" : "Login"}</h2>
            <div>
              <label>Email: </label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Password: </label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {signUp && (
              <div>
                <label>Confirm Password: </label>
                <Input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                />
              </div>
            )}
            <div>
              <Button type="submit">
                {signUp ? "Create Account" : "Login"}
              </Button>
            </div>
          </Form>
        )}
      </Navigator>
    </Container>
  );
};

export default Login;
