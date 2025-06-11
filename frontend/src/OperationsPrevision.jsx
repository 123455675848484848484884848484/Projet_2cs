import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";



const OperationsPrevision = () => {
  const [operations, setOperations] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { projetid } = location.state || {};
  const { cout } = location.state || {};
  const { delai } = location.state || {};


  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const response = await fetch(" http://127.0.0.1:8000/operation");
        const data = await response.json();
        console.log(data);
        setOperations(data);
      } catch (error) {
        console.error("Erreur de récupération des opérations:", error);
      }
    };

    fetchOperations();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedOperations = [...operations];
    updatedOperations[index][field] = value;
    setOperations(updatedOperations);
  };

  const handleSave = async () => {
    const tousChampsRemplis = operations.every((op) => op.cout && op.delai);
    const coutTotal = operations.reduce((sum, op) => sum + parseFloat(op.cout || 0), 0);
    const delaiTotal = operations.reduce((sum, op) => sum + parseInt(op.delai || 0), 0);

    if (!tousChampsRemplis) {
      alert("Veuillez remplir tous les champs pour chaque opération.");
      return;
    }

    if (coutTotal !== parseFloat(cout)) {
      alert(`Le coût total doit être exactement égal à ${cout} DA. Coût actuel : ${coutTotal} DA`);
      return;
    }

    if (delaiTotal !== parseInt(delai)) {
      alert(`Le délai total doit être exactement égal à ${delai} jours. Délai actuel : ${delaiTotal} jours`);
      return;
    }

    const operationsData = operations.map((op) => ({
      id_operation: op.id,
      cout_prevu: parseFloat(op.cout),
      delais: parseInt(op.delai),
    }));

    try {
      const response = await fetch(`http://127.0.0.1:8000/previsions/operations/${projetid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(operationsData),


      });
      console.log(JSON.stringify(operationsData));
      const result = await response.json();
      console.log("Opérations enregistrées:", result);
      navigate("/mespuits");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des opérations:", error);
    }
  };


  return (
    <>
      <Navbar role="manager" />
      <div className="min-h-screen bg-[#f9f9f9] px-28 pt-12 pb-20">
        <h1 className="text-[54px] font-bold text-[#EA5529] leading-[60px] mb-12">
          Vos prévisions
        </h1>

        <div className="flex items-start gap-16">
          <div className="flex flex-col items-start gap-6">
            <Link to="/phasepre" className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-sm flex items-center justify-center text-2xl font-bold border-2 ${location.pathname === "/phasepre"
                ? "bg-gray-200 border-[#EA5529] text-black"
                : "bg-gray-100 text-gray-400 border-gray-300"
                }`}>
                1
              </div>
              <span className={`font-semibold text-2xl ${location.pathname === "/phasepre"
                ? "text-[#EA5529]"
                : "text-gray-400"
                }`}>
                Phases
              </span>
            </Link>

            <div className="h-[60px] w-[2px] bg-[#EA5529] ml-8" />

            <Link to="/operations" className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-sm flex items-center justify-center text-2xl font-bold border-2 ${location.pathname === "/operations"
                ? "bg-gray-200 border-[#EA5529] text-black"
                : "bg-gray-100 text-gray-400 border-gray-300"
                }`}>
                2
              </div>
              <span className={`font-semibold text-2xl ${location.pathname === "/operations"
                ? "text-[#EA5529]"
                : "text-gray-400"
                }`}>
                Opérations
              </span>
            </Link>
          </div>

          <div className="flex-1">
            <div className="bg-[#f3f8fa] rounded-md shadow-md overflow-hidden">
              <table className="w-full text-left text-[16px]">
                <thead className="bg-white">
                  <tr className="text-gray-800">
                    <th className="p-4 font-semibold">Opération</th>
                    <th className="p-4 font-semibold">Coût prévu</th>
                    <th className="p-4 font-semibold">Délai</th>
                  </tr>
                </thead>
                <tbody>
                  {operations.map((op, index) => (
                    <tr key={index} className="border-t border-gray-300">
                      <td className="p-4">{op.designation}</td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={op.cout}
                          onChange={(e) => handleInputChange(index, "cout", e.target.value)}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-0"
                          placeholder="DA"
                          required
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={op.delai}
                          onChange={(e) => handleInputChange(index, "delai", e.target.value)}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-0"
                          placeholder="jours"
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
                onClick={() => {
                  const tousChampsRemplis = operations.every(
                    (op) => op.cout && op.delai
                  );
                  if (tousChampsRemplis) {
                    handleSave();

                  } else {
                    alert("Veuillez remplir tous les champs pour chaque opération.");
                  }
                }}
                className="bg-[#EA5529] hover:bg-[#EA5529] text-white font-semibold text-[16px] px-10 py-3 rounded-md"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OperationsPrevision;