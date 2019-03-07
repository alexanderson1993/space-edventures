import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../helpers/authContext";
import { Blockquote, Loading } from "@arwes/arwes";
import { Words, Link, Navigator, Content } from "../../components";

const MagicLink = ({ location, navigate }) => {
  const context = useContext(AuthContext);
  const { completeMagicLinkSignin } = context;
  const [error, setError] = useState(null);
  useEffect(() => {
    const to = localStorage.getItem("postLoginPath") || "/";

    completeMagicLinkSignin(location.href)
      .then(() => navigate(to))
      .catch(error => setError(error));
  }, [completeMagicLinkSignin, location.href, navigate]);
  return error ? (
    <Blockquote layer="alert">
      <Words>{error.message}</Words>
      <p>
        Try <Link to="/accounts/login">logging in</Link> again.
      </p>
    </Blockquote>
  ) : (
    <Content>
      <h1>
        <Words animate>Logging In...</Words>
      </h1>
      <Loading animate />
    </Content>
  );
};

const MagicLinkWithNavigator = props => (
  <Navigator>
    {navigate => <MagicLink navigate={navigate} {...props} />}
  </Navigator>
);
export default MagicLinkWithNavigator;
