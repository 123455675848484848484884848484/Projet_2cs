import React, { useState } from "react";

const FichierJournalier = () => {
  const [problems, setProblems] = useState([
    { operation: "", probleme: "", solution: "" },
  ]);
  const [autresProblemes, setAutresProblemes] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [openRows, setOpenRows] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...problems];
    updated[index][field] = value;
    setProblems(updated);
  };

  const handleAddRow = () => {
    setProblems([...problems, { operation: "", probleme: "", solution: "" }]);
  };

  const handleSubmit = () => {
    console.log("Problèmes:", problems);
    console.log("Autres:", autresProblemes);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const toggleOperationDropdown = (index) => {
    setOpenRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
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
        <input type="file" className="hidden" onChange={handleFileChange} />
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
              <React.Fragment key={index}>
                <tr className="bg-white rounded-md">
                  <td className="px-4 py-2">
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full text-left border border-gray-300 rounded px-2 py-1 focus:outline-none"
                        onClick={() => toggleOperationDropdown(index)}
                      >
                        {row.operation || "Sélectionner une opération"}{" "}
                        <span className="float-right">
                          {openRows.includes(index) ? "▲" : "▼"}
                        </span>
                      </button>
                      {openRows.includes(index) && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded shadow-lg w-full mt-1 max-h-60 overflow-y-auto">
                          {operationsGroups.map((group) => (
                            <div key={group.label} className="px-2 py-1">
                              <h4 className="text-xs text-orange-600 font-semibold mb-1">
                                {group.label}
                              </h4>
                              {group.items.map((item) => (
                                <div
                                  key={item}
                                  className="text-sm text-gray-800 hover:bg-gray-100 px-2 py-1 cursor-pointer"
                                  onClick={() => {
                                    handleChange(index, "operation", item);
                                    toggleOperationDropdown(index);
                                  }}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
              </React.Fragment>
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
