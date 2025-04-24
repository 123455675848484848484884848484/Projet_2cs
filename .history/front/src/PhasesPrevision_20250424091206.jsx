import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PhasesPrevision = () => {
  const [phases, setPhases] = useState([]);

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
    <div className="min-h-screen flex bg-[#f9f9f9] px-20 pt-10 pb-20">
      {/* Colonne de gauche */}
      <div className="w-[300px] pt-24">
        <h1 className="text-[54px] font-bold text-orange-600 leading-[60px] mb-20">
          Vos<br />prévisions
        </h1>
        <div className="flex flex-col items-start gap-6 ml-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-sm bg-gray-200 flex items-center justify-center text-xl font-bold border-2 border-orange-500 text-black">
              1
            </div>
            <span className="text-orange-600 font-semibold text-lg">Phases</span>
          </div>
          <div className="h-[60px] w-[2px] bg-orange-500 ml-5" />
          <div className="flex items-center gap-3 opacity-40">
            <div className="w-12 h-12 rounded-sm bg-gray-200 flex items-center justify-center text-xl font-bold">
              2
            </div>
            <span className="text-gray-400 font-semibold text-lg">Opérations</span>
          </div>
        </div>
      </div>

      {/* Contenu de droite */}
      <div className="flex-1 pl-10 flex flex-col justify-between">
        <div className="bg-[#f3f8fa] rounded-md overflow-hidden shadow-md">
          <table className="w-full text-left">
            <thead className="bg-white">
              <tr className="text-[16px]">
                <th className="p-4 font-semibold">Phase</th>
                <th className="p-4 font-semibold">Coût prévu</th>
                <th className="p-4 font-semibold">Délai</th>
                <th className="p-4 font-semibold">Profondeur</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((phase, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="p-4 text-[15px]">{phase.nom}</td>
                  <td className="p-4 text-[15px]">{phase.cout}</td>
                  <td className="p-4 text-[15px]">{phase.delai}</td>
                  <td className="p-4 text-[15px]">{phase.profondeur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-8">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-3 rounded-md font-semibold text-[16px]">
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhasesPrevision;
