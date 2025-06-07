import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar";

const ConsulterFichiersJournalier = () => {
  const [fichiers, setFichiers] = useState([]);

  useEffect(() => {
    // ⚠️ Mock de données : remplacer l'appel API par un tableau local
    const fichiersMock = [
      {
        date: "2025-06-07",
        url: "https://example.com/fichier-journalier-2025-06-07.xlsx",
      },
      {
        date: "2025-06-06",
        url: "https://example.com/fichier-journalier-2025-06-06.xlsx",
      },
    ];
    setFichiers(fichiersMock);
  }, []);

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
                      <a
                        href={fichier.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#EA5529] hover:bg-[#d3471f] text-white py-2 px-4 rounded-md text-sm font-medium transition"
                      >
                        Voir le fichier
                      </a>
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