
import './App.css';
// App.jsx
import React from "react";
import Login from "./Login"; 
import LancerPuit from './LancerPuit';
import InformationPuit from './InformationPuit';
import MesPuits from "./MesPuits";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<LancerPuit />} />
  <Route path="/info-puit" element={<InformationPuit />} />
  <Route path="/mes-puits" element={<MesPuits />} /> {/* ✅ ajout temporaire */}
</Routes>
    </Router>
  );
}

export default App;
