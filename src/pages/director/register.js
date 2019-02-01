import React, { useReducer, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { Mutation, Query } from "react-apollo";
import CREATE_CENTER from "./createCenter.graphql";
import STRIPE_PLANS from "./stripePlans.graphql";
import { Loading, Blockquote } from "@arwes/arwes";
import graphQLHelper from "../../helpers/graphQLHelper";
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
const Error = ({ message }) => (
  <Blockquote layer="alert">
    <Words>{message}</Words>
  </Blockquote>
);

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
    token: null,
    planId: null
  });
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const runDispatch = e => {
    if (error && e.target.name === error.field) setError(null);
    dispatch({ name: e.target.name, value: e.target.value });
  };

  const handleRegister = (action, navigate) => e => {
    e.preventDefault();
    if (!state.name)
      return setError({ field: "name", message: "Name is a required field." });
    if (!state.email)
      return setError({
        field: "email",
        message: "Email is a required field."
      });
    if (!state.token)
      return setError({
        field: "token",
        message: "Valid credit card information is required."
      });
    if (!validateEmail(state.email))
      return setError({
        field: "email",
        message: "Please enter a valid email address."
      });
    setRegistering(true);
    action({ variables: { ...state, token: state.token.id } })
      .then(() => {
        navigate("./dashboard");
      })
      .catch(() => {
        setRegistering(false);
      });
  };
  if (registering)
    return (
      <Container>
        <Loading animate />
      </Container>
    );
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
              {error && error.field === "name" && <Error {...error} />}
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
              {error && error.field === "email" && <Error {...error} />}
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
              {error && error.field === "token" && <Error {...error} />}
            </Spacer>
            <Spacer>
              <Query query={STRIPE_PLANS}>
                {graphQLHelper(({ stripe: { plans } }) => {
                  if (plans.length === 1) {
                    if (state.planId !== plans[0].id) {
                      dispatch({ name: "planId", value: plans[0].id });
                    }
                    return (
                      <p>
                        You will be subscribed to the {plans[0].nickname} plan,
                        billed ${plans[0].amount / 100} every{" "}
                        {plans[0].interval_count === 1
                          ? ""
                          : `${plans[0].interval_count} `}
                        {plans[0].interval} with a {plans[0].trial_period_days}{" "}
                        day trial.
                      </p>
                    );
                  }
                  return <div />;
                })}
              </Query>
            </Spacer>
            <Spacer>
              <Mutation mutation={CREATE_CENTER}>
                {(action, { loading, error }) =>
                  loading ? (
                    <Loading animate />
                  ) : error ? (
                    <Blockquote>
                      {(() => {
                        const message = `Error: ${error.message}`;
                        return <Words>{message}</Words>;
                      })()}
                    </Blockquote>
                  ) : (
                    <Button
                      block
                      type="button"
                      disabled={!state.name || !state.email || !state.token}
                      onClick={handleRegister(action, navigate)}
                    >
                      Register
                    </Button>
                  )
                }
              </Mutation>
            </Spacer>
          </Form>
        )}
      </Navigator>
    </Container>
  );
};
export default Register;
