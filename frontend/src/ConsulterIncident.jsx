import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import { useParams } from "react-router-dom";


const ConsulterIncident = () => {
  const [incidents, setIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams(); // ce ci c'est l'id du projet by nesrine 

  const fetchIncidents = async (query = "_") => {
    try {
      const response = await fetch(`/api/incidents/${query}`);
      const data = await response.json();
      setIncidents(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des incidents :", error);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <>
      <Navbar role="manager" />
      <div className="min-h-screen bg-[#f9f9f9] px-20 py-12">
        <h1 className="text-[48px] font-bold text-[#EA5529] leading-[56px] mb-4">
          Incidents détectés
        </h1>
        <p className="text-[16px] text-gray-700 mb-10 max-w-xl">
          Liste des incidents signalés sur ce puit.
        </p>

        <div className="flex justify-end mb-4 space-x-2">
          <input
            type="text"
            placeholder="ID incident..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px] px-4 py-2 border rounded-full focus:outline-none"
          />
          <button
            onClick={() => fetchIncidents(searchTerm.trim() !== "" ? searchTerm : "_")}
            className="bg-[#EA5529] text-white px-4 py-2 rounded-full hover:bg-orange-600"
          >
            Rechercher
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr className="text-gray-700">
                <th className="p-4">Incident signalé</th>
                <th className="p-4">Date d'incident</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Pièce jointe</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="p-4">› {incident.id}</td>
                  <td className="p-4">{incident.dateIncident}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full font-medium ${
                        incident.resolu
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {incident.resolu ? "Résolu" : "Non résolu"}
                    </span>
                  </td>
                  <td className="p-4">
                    {incident.pieceJointe ? (
                      <a
                        href={incident.pieceJointe}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        Voir la pièce jointe
                      </a>
                    ) : (
                      <span className="text-gray-500">Aucune</span>
                    )}
                  </td>
                </tr>
              ))}
              {incidents.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-6">
                    Aucun incident signalé pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ConsulterIncident;