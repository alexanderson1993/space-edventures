import React, { Component } from "react";
import UserContext from "../helpers/userContext";
import { Appear, Button as ArwesButton } from "@arwes/arwes";
import { Words, Button, Link, Image } from "../components";
import "./profile.scss";

class Profile extends Component {
  state = { open: false };
  render() {
    const { open } = this.state;
    return (
      <UserContext.Consumer>
        {({ user, logout }) =>
          user ? (
            <div className="profile-container">
              <div
                className="profile"
                onClick={() => this.setState(state => ({ open: !state.open }))}
              >
                <div className="profile-info">
                  <p className="profile-rank">
                    <Words>{user.rank}</Words>
                  </p>
                  <div className="profile-hours">
                    <p>Flight: {user.flightHours}</p>
                    <p>Class: {user.classHours}</p>
                  </div>
                </div>
                <Image
                  className="profile-image"
                  src={user.profile}
                  alt="Profile"
                />
              </div>
              <div
                className="profile-extra-frame"
                style={{ pointerEvents: open ? null : "none" }}
              >
                <Appear animate show={open} style={{ width: "100%" }}>
                  <div className="profile-extra">
                    <ArwesButton animate show={open} style={{ width: "100%" }}>
                      Hello
                    </ArwesButton>
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
          )
        }
      </UserContext.Consumer>
    );
  }
}
export default Profile;
