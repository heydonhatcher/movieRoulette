import React from "react";
import "./App.css";
import { Toolbar, AppBar } from "@material-ui/core";
//import logo from "./img/logo.png";
//import Main from "./components/Main";
import MatchButton from "./components/MatchButton";
import InfoCard from "./components/InfoCard";

function App() {
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>Movie Roulette</Toolbar>
      </AppBar>
      <InfoCard />
      <MatchButton />
    </div>
  );
}

export default App;
