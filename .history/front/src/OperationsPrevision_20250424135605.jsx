import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OperationsPrevision = () => {
  const navigate = useNavigate();
  const [operations, setOperations] = useState([
    { nom: "Drilling", cout: "", delai: "" },
    { nom: "Cementing", cout: "", delai: "" },
    { nom: "Rig Move", cout: "", delai: "" },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...operations];
    updated[index][field] = value;
    setOperations(updated);
  };

  const handleValider = () => {
    console.log("Données des opérations :", operations);
    navigate("/mespuits"); // Redirection vers la page MesPuits
  };

  return (
    <div className="min-h-screen px-24 py-12 bg-[#f9f9f9]">
      <h1 className="text-[54px] font-bold text-orange-600 leading-[60px] mb-2">
        Opérations prévisionnelles
      </h1>
      <p className="text-gray-700 mb-8">
        Indiquez les détails prévus pour chaque opération.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-200 text-sm text-gray-700">
              <th className="px-4 py-2">Opération</th>
              <th className="px-4 py-2">Coût</th>
              <th className="px-4 py-2">Délai</th>
            </tr>
          </thead>
          <tbody>
            {operations.map((op, index) => (
              <tr key={index} className="bg-white rounded-md">
                <td className="px-4 py-2 align-top">{op.nom}</td>
                <td className="px-4 py-2 align-top">
                  <input
                    type="number"
                    value={op.cout}
                    onChange={(e) => handleChange(index, "cout", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-0 focus:border-orange-600 focus:text-orange-600"
                  />
                </td>
                <td className="px-4 py-2 align-top">
                  <input
                    type="number"
                    value={op.delai}
                    onChange={(e) => handleChange(index, "delai", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-0 focus:border-orange-600 focus:text-orange-600"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleValider}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-[16px] px-10 py-3 rounded-md"
        >
          Valider
        </button>
      </div>
    </div>
  );
};

export default OperationsPrevision;
