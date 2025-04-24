import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PhasesPrevision = () => {
  const [phases, setPhases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchedPhases = [
      { nom: "26' ", cout: '', delai: '', profondeur: '' },
      { nom: "24' ", cout: '', delai: '', profondeur: '' },
      { nom: "12' ", cout: '', delai: '', profondeur: '' },
      { nom: "8' ", cout: '', delai: '', profondeur: '' },
    ];
    setPhases(fetchedPhases);
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedPhases = [...phases];
    updatedPhases[index][field] = value;
    setPhases(updatedPhases);
  };

  const handleValider = () => {
    console.log("Prévisions soumises :", phases);
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
  {/* Étape 1 : Phases */}
  <Link to="/phasepre" className="flex items-center gap-4">
    <div className={`w-16 h-16 rounded-sm flex items-center justify-center text-2xl font-bold border-2 ${
      location.pathname === "/phasepre" ? "bg-gray-200 border-orange-500 text-black" : "bg-gray-100 text-gray-400 border-gray-300"
    }`}>
      1
    </div>
    <span className={`font-semibold text-2xl ${
      location.pathname === "/phasepre" ? "text-orange-600" : "text-gray-400"
    }`}>
      Phases
    </span>
  </Link>

  <div className="h-[60px] w-[2px] bg-orange-500 ml-8" />

  {/* Étape 2 : Opérations */}
  <Link to="/operations" className="flex items-center gap-4">
    <div className={`w-16 h-16 rounded-sm flex items-center justify-center text-2xl font-bold border-2 ${
      location.pathname === "/operations" ? "bg-gray-200 border-orange-500 text-black" : "bg-gray-100 text-gray-400 border-gray-300"
    }`}>
      2
    </div>
    <span className={`font-semibold text-2xl ${
      location.pathname === "/operations" ? "text-orange-600" : "text-gray-400"
    }`}>
      Opérations
    </span>
  </Link>
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
                    <td className="p-4">
                      <input
                        type="number"
                        value={phase.cout}
                        onChange={(e) => handleInputChange(index, "cout", e.target.value)}
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-0"
                        placeholder="DA"
                        required
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={phase.delai}
                        onChange={(e) => handleInputChange(index, "delai", e.target.value)}
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-0"
                        placeholder="jours"
                        required
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={phase.profondeur}
                        onChange={(e) => handleInputChange(index, "profondeur", e.target.value)}
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-0"
                        placeholder="mètres"
                        required
                      />
                    </td>
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
