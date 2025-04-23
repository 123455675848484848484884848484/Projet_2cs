import './App.css';
import React from "react";
import LancerPuit from './LancerPuit';
import InformationPuit from './InformationPuit';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MesPuits from './MesPuits'; 

function App() {
  return (
   <Router>
     <Routes>
       <Route path="/" element={<LancerPuit />} />
       <Route path="/info-puit" element={<InformationPuit />} />
   </Routes>
    </Router> 
 //< MesPuits />
  );
}

export default App;