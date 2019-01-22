import React, { useReducer } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import {
  Input,
  Button,
  Navigator,
  PaymentEntry,
  Words
} from "../../components";

const Container = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Form = styled("div")`
  width: 540px;
  max-width: 80%;
`;
const Spacer = styled("div")`
  margin: 20px 0;
`;
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
const formReducer = (state, { name, value }) => {
  return { ...state, [name]: value };
};

const Register = () => {
  const [state, dispatch] = useReducer(formReducer, {
    name: "",
    email: "",
    website: "",
    token: null
  });
  const runDispatch = e =>
    dispatch({ name: e.target.name, value: e.target.value });
  return (
    <Container>
      <h2>Before continuing, you must register your Space Center.</h2>
      <Navigator>
        {navigate => (
          <Form>
            <Spacer>
              <label>Name of Space Center: </label>
              <Input
                block
                required
                type="text"
                name={"name"}
                value={state.name}
                onChange={runDispatch}
              />
            </Spacer>
            <Spacer>
              <label>Website: </label>
              <Input
                block
                required
                type="url"
                name={"website"}
                value={state.website}
                onChange={runDispatch}
              />
            </Spacer>
            <Spacer>
              <label>Contact Email: </label>
              <Input
                block
                required
                type="email"
                name={"email"}
                value={state.email}
                onChange={runDispatch}
              />
            </Spacer>
            <Spacer>
              <label>Payment Method: </label>

              {state.token ? (
                <div>
                  <h4
                    css={css`
                      text-align: center;
                    `}
                  >
                    <Words>Payment Method Accepted</Words>
                  </h4>
                  <Button
                    block
                    onClick={() => dispatch({ name: "token", value: null })}
                  >
                    Enter Different Payment
                  </Button>
                </div>
              ) : (
                <PaymentEntry
                  setToken={({ token }) =>
                    dispatch({ name: "token", value: token })
                  }
                />
              )}
            </Spacer>
            <Spacer>
              <Button
                block
                type="button"
                disabled={
                  !state.name || !state.email || !state.website || !state.token
                }
                onClick={e => {
                  e.preventDefault();
                  navigate("./dashboard");
                }}
              >
                Register
              </Button>
            </Spacer>
          </Form>
        )}
      </Navigator>
    </Container>
  );
};
export default Register;
