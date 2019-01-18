import React, { useState, useContext } from "react";
import { Blockquote, Loading } from "@arwes/arwes";
import { Input, Words, Button, Navigator } from "../../components";
import AuthContext from "../../helpers/authContext";
import styled from "@emotion/styled";

const Container = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Form = styled("form")`
  width: 360px;
  max-width: 80%;
`;
const ButtonContainer = styled("div")`
  margin-top: 20px;
`;
const Center = styled("div")`
  text-align: center;
`;

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const Login = ({ signingUp = false, to = "/" }) => {
  const { login, signUp: signUpMethod, magicLink } = useContext(AuthContext);
  const [signUp, setSignUp] = useState(signingUp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkError = type => {
    if (!email) {
      setError({ field: "email", message: "Email is a required field." });
      return false;
    }
    if (!validateEmail(email)) {
      setError({
        field: "email",
        message: "Please enter a valid email address."
      });
      return false;
    }
    if (type === "magic") return true;
    if (!password) {
      setError({ field: "password", message: "Please enter your password." });
      return false;
    }
    if (type === "login") return true;
    if (password !== confirm) {
      setError({ field: "confirm", message: "Both passwords must match." });
      return false;
    }
    return true;
  };
  const sendMagicLink = (e, navigate) => {
    e.preventDefault();
    if (checkError("magic")) {
      setLoading(true);
      magicLink({ email })
        .then(() => navigate(`/sentMagicLink?email=${email}`))
        .catch(error => {
          setError({
            field: "none",
            message: error.message || error
          });
          setLoading(false);
        });
    }
  };
  const doLogin = (e, navigate) => {
    e.preventDefault();
    if (checkError(signUp ? "signUp" : "login")) {
      const method = signUp ? signUpMethod : login;
      setLoading(true);
      method({ email, password })
        .then(() => {
          navigate(to);
        })
        .catch(error => {
          setError({
            field: "none",
            message: error.message || error
          });
          setLoading(false);
        });
    }
  };
  return (
    <Container>
      <Navigator>
        {navigate =>
          loading ? (
            <div>
              <h1>
                <Words animate>
                  {signUp ? "Signing Up..." : "Logging In..."}
                </Words>
              </h1>
              <Loading animate />
            </div>
          ) : (
            <Form onSubmit={e => doLogin(e, navigate)}>
              <h2>
                <Words animate>{signUp ? "Sign Up" : "Login"}</Words>
              </h2>
              <div>
                <label>Email: </label>
                <Input
                  type="email"
                  value={email}
                  block
                  onChange={e => setEmail(e.target.value)}
                />
                {error && error.field === "email" && (
                  <Blockquote layer="alert">
                    <Words>{error.message}</Words>
                  </Blockquote>
                )}
              </div>
              <div>
                <label>Password: </label>
                <Input
                  type="password"
                  value={password}
                  block
                  onChange={e => setPassword(e.target.value)}
                />
                {error && error.field === "password" && (
                  <Blockquote layer="alert">
                    <Words>{error.message}</Words>
                  </Blockquote>
                )}
              </div>
              {signUp && (
                <div>
                  <label>
                    <Words>Confirm Password: </Words>
                  </label>
                  <Input
                    type="password"
                    value={confirm}
                    block
                    onChange={e => setConfirm(e.target.value)}
                  />
                  {error && error.field === "confirm" && (
                    <Blockquote layer="alert">
                      <Words>{error.message}</Words>
                    </Blockquote>
                  )}
                </div>
              )}
              {error && error.field === "none" && (
                <Blockquote layer="alert">
                  <Words>{error.message}</Words>
                </Blockquote>
              )}

              <ButtonContainer>
                <Button type="submit" block>
                  {signUp ? "Create Account" : "Login"}
                </Button>
                <Center>
                  <small>‒ OR ‒</small>
                </Center>
                <Button
                  type="button"
                  block
                  css={{ marginBottom: "10px" }}
                  onClick={e => {
                    e.preventDefault();
                    setSignUp(!signUp);
                    setError(null);
                  }}
                >
                  {signUp ? "Login" : "Create Account"}
                </Button>
                <Button
                  type="button"
                  block
                  onClick={e => sendMagicLink(e, navigate)}
                >
                  Send Magic Link
                </Button>
              </ButtonContainer>
            </Form>
          )
        }
      </Navigator>
    </Container>
  );
};

export default Login;
