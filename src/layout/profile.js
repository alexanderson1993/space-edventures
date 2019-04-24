import React, { useEffect, useState, useContext, useRef } from "react";
import { css } from "@emotion/core";
import AuthContext from "../helpers/authContext";
import ProfileContext from "../helpers/profileContext";
import { Appear, Button as ArwesButton, Loading } from "@arwes/arwes";
import { Words, Button, Link, ProfilePicture } from "../components";
import { subscribe } from "../helpers/pubsub";
import "./profile.scss";

function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = event => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}

const Profile = () => {
  const dropdownRef = useRef();
  const [open, setOpen] = useState(false);
  useEffect(() =>
    subscribe("routeChanged", () => {
      setOpen(false);
    })
  );
  useOnClickOutside(dropdownRef, () => setOpen(false));

  const { user: authUser, loading, logout } = useContext(AuthContext);
  const { user } = useContext(ProfileContext);
  if (loading || user.loading) return <Loading animate small />;
  if (authUser && user)
    return (
      <div className="profile-container">
        <div className="profile" onClick={() => setOpen(!open)}>
          <div className="profile-info">
            <p className="profile-rank">
              <Words>
                {user.profile && user.profile.rank
                  ? user.profile.rank.name
                  : ""}
              </Words>
            </p>
            <div className="profile-hours">
              <p>Flight: {user.profile && user.profile.flightHours}</p>
              <p>Class: {user.profile && user.profile.classHours}</p>
            </div>
          </div>
          <ProfilePicture
            css={css`
              width: 60px;
              height: 60px;
              object-fit: contain;
              margin: 0;
            `}
          />
        </div>
        <div
          className="profile-extra-frame"
          ref={dropdownRef}
          css={{ pointerEvents: open ? null : "none" }}
        >
          <Appear animate show={open} css={{ width: "100%" }}>
            <div className="profile-extra">
              <div>
                <Link to="/">
                  <ArwesButton animate show={open} css={{ width: "100%" }}>
                    Dashboard
                  </ArwesButton>
                </Link>
              </div>
              <Link to="/user/profile">
                <ArwesButton animate show={open} css={{ width: "100%" }}>
                  Profile
                </ArwesButton>
              </Link>
              {user && user.centers && user.centers.length > 0 && (
                <div>
                  <Link to="/director">
                    <ArwesButton animate show={open} css={{ width: "100%" }}>
                      Director Panel
                    </ArwesButton>
                  </Link>
                </div>
              )}
              <ArwesButton
                animate
                show={open}
                css={{ width: "100%" }}
                onClick={logout}
              >
                Logout
              </ArwesButton>
            </div>
          </Appear>
        </div>
      </div>
    );
  return (
    <div css={{ display: "flex" }}>
      <Link to="/accounts/login">
        <Button size="sm">Login</Button>
      </Link>{" "}
      <span css={{ margin: "0 10px" }}>or</span>{" "}
      <Link to="/accounts/login?signUp">
        <Button size="sm">Sign Up</Button>
      </Link>
    </div>
  );
};
export default Profile;
