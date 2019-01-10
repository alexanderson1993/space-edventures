import React, { useEffect, useState, useContext } from "react";
import UserContext from "../helpers/userContext";
import { Appear, Button as ArwesButton } from "@arwes/arwes";
import { Words, Button, Link, Image } from "../components";
import { subscribe } from "../helpers/pubsub";
import "./profile.scss";

const Profile = () => {
  const [open, setOpen] = useState(false);
  useEffect(() =>
    subscribe("routeChanged", () => {
      setOpen(false);
    })
  );
  const { user, logout } = useContext(UserContext);
  return user ? (
    <div className="profile-container">
      <div className="profile" onClick={() => setOpen(!open)}>
        <div className="profile-info">
          <p className="profile-rank">
            <Words>{user.rank}</Words>
          </p>
          <div className="profile-hours">
            <p>Flight: {user.flightHours}</p>
            <p>Class: {user.classHours}</p>
          </div>
        </div>
        <Image className="profile-image" src={user.profile} alt="Profile" />
      </div>
      <div
        className="profile-extra-frame"
        style={{ pointerEvents: open ? null : "none" }}
      >
        <Appear animate show={open} style={{ width: "100%" }}>
          <div className="profile-extra">
            <Link to="/profile">
              <ArwesButton animate show={open} style={{ width: "100%" }}>
                Profile
              </ArwesButton>
            </Link>
            <ArwesButton
              animate
              show={open}
              style={{ width: "100%" }}
              onClick={logout}
            >
              Logout
            </ArwesButton>
          </div>
        </Appear>
      </div>
    </div>
  ) : (
    <div style={{ display: "flex" }}>
      <Link to="/login">
        <Button size="sm">Login</Button>
      </Link>{" "}
      <span style={{ margin: "0 10px" }}>or</span>{" "}
      <Link to="/login">
        <Button size="sm">Sign Up</Button>
      </Link>
    </div>
  );
};
export default Profile;
