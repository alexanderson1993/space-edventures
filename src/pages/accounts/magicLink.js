import React, { useContext, useState, useEffect, useRef } from "react";
import AuthContext from "../../helpers/authContext";
import { Blockquote, Loading } from "@arwes/arwes";
import { Words, Link, Navigator, Content } from "../../components";

const MagicLink = props => {
  const { completeSignin, href } = props;
  useEffect(() => {
    completeSignin(href);
  }, [completeSignin, href]);
  return (
    <Content>
      <h1>
        <Words animate>Logging In...</Words>
      </h1>
      <Loading animate />
    </Content>
  );
};

const NavComp = ({ navigate, location, ...props }) => {
  const context = useContext(AuthContext);
  const { completeMagicLinkSignin } = context;
  const [error, setError] = useState(null);
  const to =
    (typeof window !== "undefined" &&
      window.localStorage.getItem("postLoginPath")) ||
    "/";
  const completeSignin = useRef(href => {
    completeMagicLinkSignin(href)
      .then(() => navigate(to))
      .catch(error => setError(error));
  });
  return error ? (
    <Blockquote layer="alert">
      <Words>{error.message}</Words>
      <p>
        Try <Link to="/accounts/login">logging in</Link> again.
      </p>
    </Blockquote>
  ) : (
    <MagicLink href={location.href} completeSignin={completeSignin.current} />
  );
};
const MagicLinkWithNavigator = props => {
  return (
    <Navigator>
      {navigate => <NavComp navigate={navigate} {...props} />}
    </Navigator>
  );
};
export default MagicLinkWithNavigator;
