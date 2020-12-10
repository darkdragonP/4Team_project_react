import React from "react";
import { Route } from "react-router-dom";
import "./css/App.css";
import Board from "./pages/Board";
import Detail from "./pages/Detail";

const App = () => {
  return (
    <>
      <Route exact path="/" component={Board} />

      <Route exact path="/Detail/1" component={Detail} />
    </>
  );
};

export default App;
