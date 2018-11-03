import React from "react";
import ReactDOM from "react-dom";
import Routes from './routes' 
import "./styles.css";

const App  = () => <Routes />

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
