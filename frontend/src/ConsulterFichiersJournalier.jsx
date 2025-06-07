import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import { useParams } from "react-router-dom";


const ConsulterFichiersJournalier = () => {
  const [fichiers, setFichiers] = useState([]);
  const { id } = useParams(); // ce ci c'est l'id du projet by nesrine 
  useEffect(() => {
    // Exemple : on ne stocke que la date, pas d'URL
    const fichiersMock = [
      { date: "2025-06-07" },
      { date: "2025-06-06" },
    ];
    setFichiers(fichiersMock);
  }, []);

  const handleDownload = async (date) => {
    try {
      const response = await fetch(`/api/fichiers-journaliers/${date}`, {
        method: "GET",
      });

      if (!response.ok) throw new Error("Erreur lors du téléchargement");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `fichier-journalier-${date}.xlsx`;
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
                  <th className="p-3">Fichier</th>
                </tr>
              </thead>
              <tbody>
                {fichiers.map((fichier, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-800">{fichier.date}</td>
                    <td className="p-3">
                      <img
                        src="/file.png"
                        alt="Télécharger"
                        className="w-6 h-6 cursor-pointer"
                        onClick={() => handleDownload(fichier.date)}
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