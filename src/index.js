import React, { Component } from "react";
import ReactDOM from "react-dom";
import Routes from "./routes";
import Layout from "./layout";
import UserContext from "./helpers/userContext";
import "./variables.scss";
import "./bootstrap.scss";
import "./styles.css";

// TODO: Replace with the appropriate data structure
const userObj = {
  email: "test@spaceedventures.org",
  profile: require("./assets/avatar.jpeg"),
  rank: "Captain",
  displayName: "Starblayze",
  classHours: 23,
  flightHours: 32
};
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: localStorage.getItem("spaceEdventures_login") ? userObj : null,
      login: user => {
        this.setState({ user: userObj });
        localStorage.setItem("spaceEdventures_login", "true");
      },
      logout: () => {
        this.setState({ user: null });
        localStorage.removeItem("spaceEdventures_login");
      }
    };
  }
  render() {
    return (
      <UserContext.Provider value={this.state}>
        <Layout>
          <Routes />
        </Layout>
      </UserContext.Provider>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
