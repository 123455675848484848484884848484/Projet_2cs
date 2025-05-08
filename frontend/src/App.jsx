import './App.css';
import React from "react";
import LancerPuit from './LancerPuit';
import InformationPuit from './InformationPuit';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Login'; 
import MesPuits from './MesPuits'; 
import PhasesPrevision from './PhasesPrevision';
import OperationsPrevision from "./OperationsPrevision";
import FichierJournalier from './FichierJournalier';
import SignalerProbleme from './SignalerProbleme';
import Homeagent from './Homeagent';
import Homemanager from './Homemanager';

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
     <Route path="/file" element={<FichierJournalier />} />
     <Route path="/signal" element={<SignalerProbleme />} />
     <Route path="/agent" element={<Homeagent />} />
     <Route path="/manager" element={<Homemanager />} />
  </Routes>
    </Router> 
 
  );
}

export default App;