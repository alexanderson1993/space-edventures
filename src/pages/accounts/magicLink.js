import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";
import AuthContext from "../../helpers/authContext";
import { Blockquote, Loading } from "@arwes/arwes";
import { Words, Link, Navigator, Content } from "../../components";

// Hook
function useWhyDidYouUpdate(name, props) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = useRef();

  useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // Use this object to keep track of changed props
      const changesObj = {};
      // Iterate through keys
      allKeys.forEach(key => {
        // If previous is different from current
        if (previousProps.current[key] !== props[key]) {
          // Add to changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key]
          };
        }
      });

      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log("[why-did-you-update]", name, changesObj);
      }
    }

    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
}

const MagicLink = props => {
  const { completeSignin, href } = props;
  useWhyDidYouUpdate("MagicLink", props);
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
  const to = localStorage.getItem("postLoginPath") || "/";
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
