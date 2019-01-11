import React, { Component, Suspense } from "react";
import { Loading } from "@arwes/arwes";
import { ApolloProvider } from "react-apollo";
import gql from "graphql-tag";
import ErrorBoundary from "./helpers/errorBoundary";
import Routes from "./routes";
import Layout from "./layout";
import UserContext from "./helpers/userContext";
import graphqlClient from "./helpers/graphqlClient";
import "./styles.css";

// TODO: Replace with the appropriate data structure
const userObj = {
  email: "test@spaceedventures.org",
  profile: require("./assets/avatar.jpeg"),
  rank: "Captain",
  name: "Alex",
  displayName: "Starblayze",
  classHours: 23,
  flightHours: 32,
  history: [
    {
      date: new Date("June 25,2018"),
      center: "CMSC",
      simulator: "Odyssey",
      station: "Flight Control",
      mission: "Fallout"
    },
    {
      date: new Date("July 15,2018"),
      center: "RSA",
      simulator: "Voyager",
      station: "Security",
      mission: "Intolerance"
    },
    {
      date: new Date("September 4,2018"),
      center: "TLGC",
      simulator: "Artemis",
      station: "Science",
      mission: "Quarantine"
    },
    {
      date: new Date("June 25,2018"),
      center: "CMSC",
      simulator: "Odyssey",
      station: "Flight Control",
      mission: "Fallout"
    },
    {
      date: new Date("July 15,2018"),
      center: "RSA",
      simulator: "Voyager",
      station: "Security",
      mission: "Intolerance"
    },
    {
      date: new Date("September 4,2018"),
      center: "TLGC",
      simulator: "Artemis",
      station: "Science",
      mission: "Quarantine"
    },
    {
      date: new Date("June 25,2018"),
      center: "CMSC",
      simulator: "Odyssey",
      station: "Flight Control",
      mission: "Fallout"
    },
    {
      date: new Date("July 15,2018"),
      center: "RSA",
      simulator: "Voyager",
      station: "Security",
      mission: "Intolerance"
    },
    {
      date: new Date("September 4,2018"),
      center: "TLGC",
      simulator: "Artemis",
      station: "Science",
      mission: "Quarantine"
    }
  ]
};
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: localStorage.getItem("spaceEdventures_login") ? userObj : null,
      login: () => {
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
      <ApolloProvider client={graphqlClient}>
        <UserContext.Provider value={this.state}>
          <Layout>
            <ErrorBoundary>
              <Suspense fallback={<Loading animate />}>
                <Routes />
              </Suspense>
            </ErrorBoundary>
          </Layout>
        </UserContext.Provider>
      </ApolloProvider>
    );
  }
}
