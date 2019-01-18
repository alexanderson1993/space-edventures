import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../helpers/authContext";
import { Blockquote, Loading } from "@arwes/arwes";
import { Words, Link, Navigator } from "../../components";

const MagicLink = ({ location, navigate }) => {
  const context = useContext(AuthContext);
  const { completeMagicLinkSignin } = context;
  const [error, setError] = useState(null);
  useEffect(
    () => {
      completeMagicLinkSignin(location.href)
        .then(() => navigate("/"))
        .catch(error => setError(error));
    },
    [location.href]
  );
  return error ? (
    <Blockquote layer="alert">
      <Words>{error.message}</Words>
      <p>
        Try <Link to="/login">logging in</Link> again.
      </p>
    </Blockquote>
  ) : (
    <div>
      <h1>
        <Words animate>Logging In...</Words>
      </h1>
      <Loading animate />
    </div>
  );
};

const MagicLinkWithNavigator = props => (
  <Navigator>
    {navigate => <MagicLink navigate={navigate} {...props} />}
  </Navigator>
);
export default MagicLinkWithNavigator;
