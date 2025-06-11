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
import DashboardPuit from './DashboardPuit';
import ConsulterFichiersJournalier from './ConsulterFichiersJournalier';
import ConsulterIncident from './ConsulterIncident';
import ConsulterPrevisionPhase from './ConsulterPrevisionPhase';
import ConsulterPrevisionOperation from './ConsulterPrevisionOperation';
import CreerUser from './Creeruser';
import Moncompte from './Moncompte';
import Mescomptes from './Mescomptes';
import Solution from './solution';
import DashboardGeneral from './DashboardGeneral';
function App() {
  return (
   <Router>
   <Routes>
     <Route path="/" element={<LancerPuit />} />
     <Route path="/creeruser" element={<CreerUser />} />
     <Route path="/moncompte" element={<Moncompte />} />
     <Route path="/info-puit" element={<InformationPuit />} />
     <Route path="/mespuits" element={<MesPuits />} />
     <Route path="/mescomptes" element={<Mescomptes />} />
     <Route path="/solution" element={<Solution />} />
     <Route path="/phasepre" element={<PhasesPrevision />} />
     <Route path="/operations" element={<OperationsPrevision />} />
     <Route path="/login" element={<Login />} />
     <Route path="/file" element={<FichierJournalier />} />
     <Route path="/signal" element={<SignalerProbleme />} />
     <Route path="/agent" element={<Homeagent />} />
     <Route path="/manager" element={<Homemanager />} />
     <Route path="/dashp/:id" element={<DashboardPuit />} />
     <Route path="/afficherfichierjouralier/:id" element={<ConsulterFichiersJournalier />} />
     <Route path="/afficherincident/:id" element={<ConsulterIncident />} />
    <Route path="/afficherphase/:id" element={<ConsulterPrevisionPhase />} />
    <Route path="/afficheroperations/:id" element={<ConsulterPrevisionOperation />} />
    <Route path="/dashg" element={<DashboardGeneral />} />
  </Routes>
    </Router> 
 
  );
}

export default App;