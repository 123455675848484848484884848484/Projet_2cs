import React, { useState } from "react";

const FichierJournalier = () => {
  const [problems, setProblems] = useState([
    { operation: "", probleme: "", solution: "" },
  ]);
  const [autresProblemes, setAutresProblemes] = useState("");

  const handleChange = (index, field, value) => {
    const updated = [...problems];
    updated[index][field] = value;
    setProblems(updated);
  };

  const handleAddRow = () => {
    setProblems([...problems, { operation: "", probleme: "", solution: "" }]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Fichier importé:", file.name);
    }
  };

  const handleSubmit = () => {
    console.log("Problèmes:", problems);
    console.log("Autres:", autresProblemes);
  };

  return (
    <div className="min-h-screen px-24 py-12 bg-[#f4f4f4]">
      <h1 className="text-[54px] font-bold text-orange-600 leading-[60px] mb-2">
        Fichier journalier
      </h1>
      <p className="text-gray-700 mb-8">
        For marketplace sellers looking to grow their business, metaverse offers the best platform.
      </p>

      <label htmlFor="fileInput" className="cursor-pointer bg-[#2f5744] text-white text-center text-[20px] font-semibold py-5 rounded-md flex justify-center items-center gap-4 mb-10">
        <img src="/file.png" alt="icon" className="w-6 h-6" />
        Importer le fichier journalier
        <input type="file" id="fileInput" onChange={handleFileChange} className="hidden" />
      </label>

      <h2 className="text-xl font-semibold mb-4">Indiquer un problème</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-200 text-sm text-gray-700">
              <th className="px-4 py-2">Opération</th>
              <th className="px-4 py-2">Quel est le problème détecté ?</th>
              <th className="px-4 py-2">Quelle solution a été proposée ou appliquée ?</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((row, index) => (
              <tr key={index} className="bg-white rounded-md">
                <td className="px-4 py-2">
                  <select
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    value={row.operation}
                    onChange={(e) => handleChange(index, "operation", e.target.value)}
                  >
                    <option value="">Sélectionner une opération</option>
                    <option value="Drilling">Drilling</option>
                    <option value="Cementing">Cementing</option>
                    <option value="Security">Security</option>
                    <option value="Rig Move">Rig Move</option>
                    <option value="DST">DST</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.probleme}
                    onChange={(e) => handleChange(index, "probleme", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.solution}
                    onChange={(e) => handleChange(index, "solution", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
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
        className="w-full h-24 border border-gray-300 rounded-md p-3 mb-8"
        placeholder=""
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

export default FichierJournalier;
