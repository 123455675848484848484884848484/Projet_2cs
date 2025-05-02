import React, { useState } from "react";

const FichierJournalier = () => {
  const [problems, setProblems] = useState([
    { operation: [], probleme: "", solution: "", file: null },
  ]);
  const [autresProblemes, setAutresProblemes] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [openRows, setOpenRows] = useState([false]);

  const handleChange = (index, field, value) => {
    const updated = [...problems];
    updated[index][field] = value;
    setProblems(updated);
  };

  const handleAddRow = () => {
    setProblems([...problems, { operation: [], probleme: "", solution: "", file: null }]);
    setOpenRows([...openRows, false]);
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

  const operationsGroups = [
    {
      label: "Preparation & Infrastructure",
      items: ["Civil Work", "Water Supply", "Environmental", "Supervision"],
    },
    {
      label: "Logging, Completion & Post-Drill",
      items: [
        "Coring",
        "Mud Logging",
        "Wire Line Logging",
        "Completion",
        "Fracturation",
      ],
    },
    {
      label: "Drilling Operations & Equipment",
      items: [
        "Drilling Mud",
        "Cementing",
        "Well Head",
        "Csg, Tubing, Liner",
        "DHT, Csg access, run Casing",
        "Drilling Bits",
      ],
    },
    {
      label: "Non principales",
      items: ["Transport", "Security", "Telecom", "Rig Move", "Drilling", "DST"],
    },
  ];

  return (
    <div className="min-h-screen px-24 py-12 bg-[#f4f4f4]">
      <h1 className="text-[54px] font-bold text-orange-600 leading-[60px] mb-2">
        Fichier journalier
      </h1>
      <p className="text-gray-700 mb-8">
        For marketplace sellers looking to grow their business, metaverse offers the best platform.
      </p>

      <label className="bg-[#2f5744] cursor-pointer text-white text-center text-[20px] font-semibold py-5 rounded-md flex justify-center items-center gap-4 mb-10">
        <img src="/file.png" alt="icon" className="w-6 h-6" />
        Importer le fichier journalier
        <input type="file" className="hidden" onChange={(e) => setSelectedFiles([...selectedFiles, e.target.files[0]])} />
      </label>

      <h2 className="text-xl font-semibold mb-4">Indiquer un problème</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-200 text-sm text-gray-700">
              <th className="px-4 py-2">Opération</th>
              <th className="px-4 py-2">Quel est le problème détecté ?</th>
              <th className="px-4 py-2">Quelle solution a été proposée ou appliquée ?</th>
              <th className="px-4 py-2">Pièce jointe</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((row, index) => (
              <tr key={index} className="bg-white rounded-md">
                <td className="px-4 py-2 align-top">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => {
                      const newOpenRows = [...openRows];
                      newOpenRows[index] = !newOpenRows[index];
                      setOpenRows(newOpenRows);
                    }}
                  >
                    <span className="text-gray-800">
                      {row.operation.length > 0 ? row.operation[0] : "Sélectionner une opération"}
                    </span>
                    <span className="text-xl">{openRows[index] ? "▲" : "▼"}</span>
                  </div>
                  {openRows[index] && (
                    <div className="grid grid-cols-4 gap-6 mt-4">
                      {operationsGroups.map((group) => (
                        <div key={group.label}>
                          <h4 className="text-xs text-orange-600 font-semibold mb-2">
                            {group.label}
                          </h4>
                          {group.items.map((item) => (
                            <label key={item} className="block text-sm text-gray-800">
                              <input
                                type="radio"
                                name={`operation-${index}`}
                                value={item}
                                checked={row.operation.includes(item)}
                                onChange={(e) => handleChange(index, "operation", [e.target.value])}
                                className="mr-2"
                              />
                              {item}
                            </label>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 align-top">
                  <input
                    type="text"
                    value={row.probleme}
                    onChange={(e) => handleChange(index, "probleme", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-0 focus:border-orange-600"                  />
                </td>
                <td className="px-4 py-2 align-top">
                  <input
                    type="text"
                    value={row.solution}
                    onChange={(e) => handleChange(index, "solution", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-0 focus:border-orange-600"                  />
                </td>
                <td className="px-4 py-2 align-top">
  {!row.file ? (
    <label className="cursor-pointer bg-[#2f5744] text-white px-4 py-2 rounded-md text-sm font-semibold inline-block">
      + Ajouter
      <input
        type="file"
        className="hidden"
        onChange={(e) => handleFileUpload(index, e.target.files[0])}
      />
    </label>
  ) : (
    <p className="text-sm text-gray-700">{row.file.name}</p>
  )}
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