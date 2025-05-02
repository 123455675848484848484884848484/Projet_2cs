import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PhasesPrevision = () => {
  const [phases, setPhases] = useState([]);

  // Simulation de récupération depuis une BDD ou API
  useEffect(() => {
    const fetchedPhases = [
      { nom: "26'", cout: 10000, delai: 12000, profondeur: 12000 },
      { nom: "24'", cout: 1000, delai: 2000, profondeur: 2000 },
      { nom: "12'", cout: 5000, delai: 5500, profondeur: 5500 },
      { nom: "8'", cout: 1000, delai: 2000, profondeur: 2000 },
    ];
    setPhases(fetchedPhases);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#f9f9f9] px-20 py-12">
      {/* Colonne de gauche : Navigation verticale */}
      <div className="w-[250px] flex flex-col items-center pt-20">
        <h1 className="text-[48px] font-bold text-orange-600 leading-tight mb-16 text-left w-full">
          Vos prévisions
        </h1>
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-sm bg-gray-200 flex items-center justify-center text-xl font-bold border-2 border-orange-500 text-black">
              1
            </div>
            <span className="text-orange-600 mt-2 font-semibold text-lg">Phases</span>
          </div>
          <div className="h-[60px] w-[2px] bg-orange-500" />
          <div className="flex flex-col items-center opacity-40">
            <div className="w-12 h-12 rounded-sm bg-gray-200 flex items-center justify-center text-xl font-bold">
              2
            </div>
            <Link to="/operations" className="mt-2 text-lg font-semibold text-gray-500">
              Opérations
            </Link>
          </div>
        </div>
      </div>

      {/* Contenu de droite : tableau */}
      <div className="flex-1 pl-20">
        <div className="bg-white rounded-md overflow-hidden shadow-md">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 font-semibold">Phase</th>
                <th className="p-4 font-semibold">Coût prévu</th>
                <th className="p-4 font-semibold">Délai</th>
                <th className="p-4 font-semibold">Profondeur</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((phase, index) => (
                <tr key={index} className="border-t">
                  <td className="p-4">{phase.nom}</td>
                  <td className="p-4">{phase.cout}</td>
                  <td className="p-4">{phase.delai}</td>
                  <td className="p-4">{phase.profondeur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bouton Valider */}
        <div className="flex justify-end mt-8">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md font-semibold text-[16px]">
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhasesPrevision;
