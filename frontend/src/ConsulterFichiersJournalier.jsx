import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import { useParams } from "react-router-dom";

const ConsulterFichiersJournalier = () => {
  const [fichiers, setFichiers] = useState([]);
  const { id } = useParams(); // id du projet

  useEffect(() => {
    const fetchFichiers = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/rapports/${id}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération");
        const data = await response.json();
        setFichiers(data);
        console.log(data);
      } catch (error) {
        console.error("Erreur de chargement :", error);
        alert("Impossible de charger les fichiers.");
      }
    };

    fetchFichiers();
  }, [id]);

  const handleDownload = async (rapportId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/rapports/recuperer/${rapportId}`, {
        method: "GET",
      });

      if (!response.ok) throw new Error("Erreur lors du téléchargement");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `fichier-journalier-${rapportId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Erreur :", error);
      alert("Échec du téléchargement.");
    }
  };

  return (
    <>
      <Navbar role="manager" />
      <div className="px-20 py-10 bg-[#f9f9f9] min-h-screen">
        <h1 className="text-[32px] font-bold text-[#EA5529] mb-6">Fichiers Journaliers</h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          {fichiers.length === 0 ? (
            <p className="text-gray-600">Aucun fichier disponible.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm">
                  <th className="p-3">Date</th>
                  <th className="p-3">Utilisateur</th>
                  <th className="p-3">Profondeur</th>
                  <th className="p-3">Coût Journalier</th>
                  <th className="p-3">Fichier</th>
                </tr>
              </thead>
              <tbody>
                {fichiers.map((fichier, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-800">{fichier.date_rapport}</td>
                    <td className="p-3 text-gray-800">{fichier.utilisateur}</td>
                    <td className="p-3 text-gray-800">{fichier.profondeur ?? "-"}</td>
                    <td className="p-3 text-gray-800">{fichier.daily_cost ?? "-"}</td>
                    <td className="p-3">
                      <img
                        src="/file.png"
                        alt="Télécharger"
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => handleDownload(fichier.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default ConsulterFichiersJournalier;
