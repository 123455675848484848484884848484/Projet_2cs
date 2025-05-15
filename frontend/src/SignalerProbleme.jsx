import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar"; 

const SignalerProbleme = () => {
  const [problems, setProblems] = useState([
    { puit: "", probleme: "", date: "", resolu: "", file: null },
  ]);
  const [autresProblemes, setAutresProblemes] = useState("");
  const [puits, setPuits] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/projets/12")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setPuits(data))
      .catch((err) =>
        console.error("Erreur lors du chargement des projets", err)
      );
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...problems];
    updated[index][field] = value;
    setProblems(updated);
  };

  const handleAddRow = () => {
    setProblems([
      ...problems,
      { puit: "", probleme: "", date: "", resolu: "", file: null },
    ]);
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
    <>
      <Navbar role="agent" />
    <div className="min-h-screen px-24 py-12 bg-[#f4f4f4]">
      <h1 className="text-[54px] font-bold text-[#EA5529] leading-[60px] mb-2">
        Signaler un incident
      </h1>
      <p className="text-gray-700 mb-8">
        For marketplace sellers looking to grow their business, metaverse offers the best platform.
      </p>

      <h2 className="text-xl font-semibold mb-4">Indiquer un incident</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-200 text-sm text-gray-700">
              <th className="px-4 py-2">Nom du puit</th>
              <th className="px-4 py-2">Quel est l'incident détecté ?</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Résolu ?</th>
              <th className="px-4 py-2">Pièce jointe</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((row, index) => (
              <tr key={index} className="bg-white rounded-md">
                <td className="px-4 py-2 align-top">
                  <div className="relative">
                    <select
                      value={row.puit || ""}
                      onChange={(e) => handleChange(index, "puit", e.target.value)}
                      className="appearance-none w-full border border-gray-300 bg-white text-gray-700 py-2 pl-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EA5529] focus:border-[#EA5529]"
                    >
                      <option value="">Sélectionner un puit</option>
                      {puits.map((puit) => (
                        <option key={puit.id} value={puit.name}>
                          {puit.name}
                        </option>
                      ))}
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                        <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                      </svg>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-2 align-top">
                  <input
                    type="text"
                    value={row.probleme}
                    onChange={(e) =>
                      handleChange(index, "probleme", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EA5529] focus:border-[#EA5529]"
                    placeholder="Décrivez le problème"
                  />
                </td>

                <td className="px-4 py-2 align-top">
                  <input
                    type="date"
                    value={row.date}
                    onChange={(e) =>
                      handleChange(index, "date", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EA5529] focus:border-[#EA5529]"
                  />
                </td>

                <td className="px-4 py-2 align-top">
                  <div className="relative">
  <select
    value={row.resolu}
    onChange={(e) => handleChange(index, "resolu", e.target.value)}
    className="appearance-none w-full border border-gray-300 bg-white text-gray-700 py-2 pl-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EA5529] focus:border-[#EA5529]"
  >
    <option value="">Choisir</option>
    <option value="oui">Oui</option>
    <option value="non">Non</option>
  </select>
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
      <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
    </svg>
  </div>
</div>
                </td>

                <td className="px-4 py-2 align-top">
                  <label className="cursor-pointer bg-[#2f5744] text-white px-4 py-2 rounded-md text-sm font-semibold inline-block">
                    + Ajouter
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(index, e.target.files[0])
                      }
                    />
                  </label>
                  {row.file && (
                    <p className="mt-1 text-sm text-gray-700">
                      {row.file.name}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleAddRow}
        className="bg-[#2f5744] text-white font-semibold px-6 py-2 rounded-md mb-8 hover:bg-[#234736] transition"
      >
        + Ajouter
      </button>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="bg-[#EA5529] hover:bg-[#EA5529] text-white font-semibold text-[16px] px-10 py-3 rounded-md transition"
        >
          Valider
        </button>
      </div>
    </div>
    </>
  );
};

export default SignalerProbleme;
