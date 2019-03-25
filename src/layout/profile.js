import React, { useEffect, useState, useContext } from "react";
import { css } from "@emotion/core";
import AuthContext from "../helpers/authContext";
import ProfileContext from "../helpers/profileContext";
import { Appear, Button as ArwesButton, Loading } from "@arwes/arwes";
import { Words, Button, Link, ProfilePicture } from "../components";
import { subscribe } from "../helpers/pubsub";
import "./profile.scss";

const Profile = () => {
  const [open, setOpen] = useState(false);
  useEffect(() =>
    subscribe("routeChanged", () => {
      setOpen(false);
    })
  );
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
