import React from "react";
import ReactDOM from "react-dom";
import Routes from "./routes";
import Layout from "./layout";
import "./variables.scss";
import "./bootstrap.scss";
import "./styles.css";

const App = () => (
  <Layout>
    <Routes />
  </Layout>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
