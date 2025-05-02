import './App.css';
import React from "react";
import LancerPuit from './LancerPuit';
import InformationPuit from './InformationPuit';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MesPuits from './MesPuits'; 
import PhasesPrevision from './PhasesPrevision';
import OperationsPrevision from "./OperationsPrevision";

function App() {
  return (
   <Router>
   <Routes>
     <Route path="/" element={<LancerPuit />} />
     <Route path="/info-puit" element={<InformationPuit />} />
     <Route path="/mespuits" element={<MesPuits />} />
     <Route path="/phasepre" element={<PhasesPrevision />} />
     <Route path="/operations" element={<OperationsPrevision />} />
     <Route path="/login" element={<Login />} />


  </Routes>
    </Router> 
 
  );
}

export default App;