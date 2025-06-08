import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import { useParams } from "react-router-dom";
import { FaDownload } from "react-icons/fa"; // si tu utilises react-icons


const ConsulterIncident = () => {
  const [incidents, setIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams(); // ce ci c'est l'id du projet by nesrine 

  const fetchIncidents = async (projectId = "_") => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/incident/projet/${id}`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    setIncidents(data);
    console.log(data)
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
                  <td className="p-4">› {incident.description}</td>
                  <td className="p-4">{incident.date_incident}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full font-medium ${
                        incident.resolu === "Y"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      
                    >
                      {incident.resolu === "Y" ? "Résolu" : "Non résolu"}
                    </span>


                  </td>
                  <td className="p-4 text-center">
  {incident.fichier_joint ? (
    <a
      href={`http://127.0.0.1:8000/incident/download/${incident.id}`}
      title="Télécharger la pièce jointe"
      className="inline-block"
    >
      <img
        src="/file.png"
        alt="Télécharger"
        className="w-5 h-5 cursor-pointer"
      />
    </a>
  ) : (
    <span className="text-gray-400">—</span>
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