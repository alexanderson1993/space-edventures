import React, { useState, useContext, useEffect } from "react";
import { Blockquote, Loading } from "@arwes/arwes";
import {
  Input,
  Words,
  Button,
  Navigator,
  DatePicker,
  Link
} from "../../components";
import AuthContext from "../../helpers/authContext";
import styled from "@emotion/styled";
import AnimateContext from "../../helpers/animateContext";
import validateEmail from "../../helpers/validateEmail";

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

const Login = ({
  to = (typeof window !== "undefined" &&
    window.localStorage.getItem("postLoginPath")) ||
    "/",
  location: propsLocation
}) => {
  const {
    login,
    signUp: signUpMethod, // Gets the signUp from the authContext and assigns it to a variable called signUpMethod
    magicLink,
    checkMagicLink = () => {
      return Promise.resolve();
    }
  } = useContext(AuthContext);
  const { hide, reveal } = useContext(AnimateContext);

  // const defaultSignUp =
  //   signingUp || (location && location.search === "?signUp");

  // const [signUp, setSignUp] = useState(defaultSignUp);

  // if (signUp !== defaultSignUp) {
  //   setSignUp(defaultSignUp);
  // }
  const signUp = propsLocation && propsLocation.search.includes("?signUp");

  const [email, setEmail] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [birthDate, setBirthDate] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [magicLinkAllowed, setMagicLinkAllowed] = useState(false);
  useEffect(() => {
    if (!magicLinkAllowed) {
      checkMagicLink(email).then(allowed => setMagicLinkAllowed(allowed));
    }
  }, [checkMagicLink, email, magicLinkAllowed]);
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
    if (!birthDate) {
      setError({
        field: "birthdate",
        message: "Birth date must be filled in."
      });
      return false;
    }
    if (
      !needsVerification &&
      new Date().getFullYear() - birthDate.getFullYear() < 13
    ) {
      // The user is under 13. Do additional verification.
      hide();
      setTimeout(() => {
        setNeedsVerification(true);
        reveal();
      }, 250);
      return false;
    }
    if (needsVerification && !parentEmail) {
      setError({ field: "parentEmail", message: "Email is a required field." });
      return false;
    }
    if (needsVerification && !validateEmail(parentEmail)) {
      setError({
        field: "parentEmail",
        message: "Please enter a valid email address."
      });
      return false;
    }
    return true;
  };
  const sendMagicLink = (e, navigate) => {
    e.preventDefault();
    if (checkError("magic")) {
      setLoading(true);
      typeof window !== "undefined" &&
        localStorage.setItem("postLoginPath", to);
      magicLink({ email })
        .then(() => navigate(`/accounts/sentMagicLink?email=${email}`))
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
      method({ email, password, birthDate, parentEmail })
        .then(() => {
          navigate(to);
          typeof window !== "undefined" &&
            window.localStorage.removeItem("postLoginPath");
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
          ) : needsVerification ? (
            <Form onSubmit={e => doLogin(e, navigate)}>
              <h2>
                <Words animate>Verification Needed</Words>
              </h2>
              <p>
                To use Space EdVentures, we need to collect parental approval
                verification. Please enter your parent's email address.
              </p>
              <div>
                <label htmlFor="parentEmail">Parent's Email: </label>
                <Input
                  id="parentEmail"
                  type="parentEmail"
                  value={parentEmail}
                  block
                  onChange={e => setParentEmail(e.target.value)}
                />
                {error && error.field === "parentEmail" && (
                  <Blockquote layer="alert">
                    <Words>{error.message}</Words>
                  </Blockquote>
                )}
              </div>
              <Button type="submit" block>
                Begin Verification
              </Button>
              {error && error.field === "none" && (
                <Blockquote layer="alert">
                  <Words>{error.message}</Words>
                </Blockquote>
              )}
            </Form>
          ) : (
            <Form onSubmit={e => doLogin(e, navigate)}>
              <h2>
                <Words animate>{signUp ? "Sign Up" : "Login"}</Words>
              </h2>
              <div>
                <label htmlFor="email">Email: </label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={email}
                  block
                  onBlur={e => setEmail(e.target.value)}
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
                <>
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
                  <div>
                    <label>
                      <Words>Birth Date: </Words>
                      <div>
                        <DatePicker value={birthDate} onChange={setBirthDate} />
                      </div>
                    </label>
                    {error && error.field === "birthdate" && (
                      <Blockquote layer="alert">
                        <Words>{error.message}</Words>
                      </Blockquote>
                    )}
                  </div>
                </>
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
                <Link to={"/accounts/login" + (signUp ? "" : "?signUp")}>
                  <Button
                    type="button"
                    block
                    css={{ marginBottom: "10px" }}
                    onClick={e => {
                      e.preventDefault();
                      // setSignUp(!signUp);
                      setError(null);
                    }}
                  >
                    {signUp ? "Login" : "Create Account"}
                  </Button>
                </Link>
                {magicLinkAllowed && (
                  <Button
                    type="button"
                    block
                    onClick={e => sendMagicLink(e, navigate)}
                  >
                    Send Magic Link
                  </Button>
                )}
              </ButtonContainer>
            </Form>
          )
        }
      </Navigator>
    </Container>
  );
};

export default Login;
