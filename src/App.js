import React from "react";
import { Route, Switch } from "react-router-dom";
import "./css/App.css";
import Board from "./pages/Board";

const App = () => {
  return (
    <>
      <Route exact path="/" component={Board} />
    </>
  );
};

export default App;
