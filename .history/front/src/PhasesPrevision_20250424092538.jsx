import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PhasesPrevision = () => {
  const [phases, setPhases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchedPhases = [
      { nom: "Basic", cout: 10000, delai: 12000, profondeur: 12000 },
      { nom: "DA", cout: 1000, delai: 2000, profondeur: 2000 },
      { nom: "Allowance", cout: 5000, delai: 5500, profondeur: 5500 },
      { nom: "DA", cout: 1000, delai: 2000, profondeur: 2000 },
    ];
    setPhases(fetchedPhases);
  }, []);

  const handleValider = () => {
    navigate("/operations");
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] px-28 pt-12 pb-20">
      {/* Titre en haut */}
      <h1 className="text-[54px] font-bold text-orange-600 leading-[60px] mb-12">
        Vos prévisions
      </h1>

      <div className="flex items-start gap-16">
        {/* Étapes à gauche */}
        <div className="flex flex-col items-start gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-sm bg-gray-200 flex items-center justify-center text-2xl font-bold border-2 border-orange-500 text-black">
              1
            </div>
            <span className="text-orange-600 font-semibold text-2xl">Phases</span>
          </div>
          <div className="h-[60px] w-[2px] bg-orange-500 ml-8" />
          <div className="flex items-center gap-4 opacity-40">
            <div className="w-16 h-16 rounded-sm bg-gray-200 flex items-center justify-center text-2xl font-bold">
              2
            </div>
            <span className="text-gray-400 font-semibold text-2xl">Opérations</span>
          </div>
        </div>

        {/* Tableau à droite */}
        <div className="flex-1">
          <div className="bg-[#f3f8fa] rounded-md shadow-md overflow-hidden">
            <table className="w-full text-left text-[16px]">
              <thead className="bg-white">
                <tr className="text-gray-800">
                  <th className="p-4 font-semibold">Phase</th>
                  <th className="p-4 font-semibold">Coût prévu</th>
                  <th className="p-4 font-semibold">Délai</th>
                  <th className="p-4 font-semibold">Profondeur</th>
                </tr>
              </thead>
              <tbody>
                {phases.map((phase, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="p-4">{phase.nom}</td>
                    <td className="p-4">{phase.cout}</td>
                    <td className="p-4">{phase.delai}</td>
                    <td className="p-4">{phase.profondeur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={handleValider}
              className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-3 rounded-md font-semibold text-[16px]"
            >
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhasesPrevision;