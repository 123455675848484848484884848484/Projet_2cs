import './App.css';
import React from "react";
import LancerPuit from './LancerPuit';
import InformationPuit from './InformationPuit';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MesPuits from './MesPuits'; 
import PhasesPrevision from './PhasesPrevision';

function App() {
  return (
   <Router>
   <Routes>
     <Route path="/" element={<LancerPuit />} />
     <Route path="/1" element={<InformationPuit />} />
     <Route path="/2" element={<MesPuits />} />
     <Route path="/3" element={<PhasesPrevision />} />
  </Routes>
    </Router> 
 
  );
}

export default App;