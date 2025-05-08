import React, { useState, useEffect } from "react";

const SignalerProbleme = () => {
  const [problems, setProblems] = useState([
    { puit: "", probleme: "", solution: "", file: null },
  ]);
  const [autresProblemes, setAutresProblemes] = useState("");
  const [puits, setPuits] = useState([]);

  useEffect(() => {
    fetch("/api/puits") // Remplace cette URL par ton endpoint réel
      .then((res) => res.json())
      .then((data) => setPuits(data))
      .catch((err) => console.error("Erreur lors du chargement des puits", err));
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...problems];
    updated[index][field] = value;
    setProblems(updated);
  };

  const handleAddRow = () => {
    setProblems([...problems, { operation: [], probleme: "", solution: "", file: null }]);
  };

  const handleSubmit = () => {
    console.log("Problèmes:", problems);
    console.log("Autres:", autresProblemes);
  };

  const handleFileUpload = (index, file) => {
    const updated = [...problems];
    updated[index].file = file;
    setProblems(updated);
  };

  return (
    <div className="min-h-screen px-24 py-12 bg-[#f4f4f4]">
      <h1 className="text-[54px] font-bold text-orange-600 leading-[60px] mb-2">
        Signaler un problème
      </h1>
      <p className="text-gray-700 mb-8">
        For marketplace sellers looking to grow their business, metaverse offers the best platform.
      </p>

      <h2 className="text-xl font-semibold mb-4">Indiquer un problème</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-200 text-sm text-gray-700">
              <th className="px-4 py-2">Nom du puit</th>
              <th className="px-4 py-2">Quel est le problème détecté ?</th>
              <th className="px-4 py-2">Quelle solution a été proposée ou appliquée ?</th>
              <th className="px-4 py-2">Pièce jointe</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((row, index) => (
              <tr key={index} className="bg-white rounded-md">
                <td className="px-4 py-2 align-top">
                  <select
                    value={row.operation[0] || ""}
                    onChange={(e) => handleChange(index, "operation", [e.target.value])}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-orange-600"
                  >
                    <option value="">Sélectionner un puit</option>
                    {puits.map((puit) => (
                      <option key={puit.id} value={puit.nom}>
                        {puit.nom}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 align-top">
                  <input
                    type="text"
                    value={row.probleme}
                    onChange={(e) => handleChange(index, "probleme", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-0 focus:border-orange-600"
                  />
                </td>
                <td className="px-4 py-2 align-top">
                  <input
                    type="text"
                    value={row.solution}
                    onChange={(e) => handleChange(index, "solution", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-0 focus:border-orange-600"
                  />
                </td>
                <td className="px-4 py-2 align-top">
                  <label className="cursor-pointer bg-[#2f5744] text-white px-4 py-2 rounded-md text-sm font-semibold inline-block">
                    + Ajouter
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(index, e.target.files[0])}
                    />
                  </label>
                  {row.file && <p className="mt-1 text-sm text-gray-700">{row.file.name}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleAddRow}
        className="bg-[#2f5744] text-white font-semibold px-6 py-2 rounded-md mb-8"
      >
        + Ajouter
      </button>

      <h2 className="text-xl font-semibold mb-2">Autres problèmes</h2>
      <textarea
        className="w-full h-24 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-0 focus:border-orange-600"
        value={autresProblemes}
        onChange={(e) => setAutresProblemes(e.target.value)}
      ></textarea>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-[16px] px-10 py-3 rounded-md"
        >
          Valider
        </button>
      </div>
    </div>
  );
};

export default SignalerProbleme;