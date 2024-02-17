import React from "react";
import "./App.css";
import Characters from "./Components/Character/Character";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import CharacterDetails from "./Components/CharacterDetails/CharacterDetails";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Characters />} />
          <Route path="/characterDetails/:id" element={<CharacterDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
