import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";

const SignalerProbleme = () => {
  const [probleme, setProbleme] = useState("");
  const [solutions, setSolutions] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("Problème soumis :", probleme);
    try {
      const response = await fetch("http://127.0.0.1:8000/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: probleme,
          top_k: 3,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l’appel API");

      const data = await response.json();
      console.log("Solutions reçues :", data);
      setSolutions(data);
    } catch (err) {
      console.error("Erreur lors de la soumission :", err);
    }
  };

  return (
    <>
      <Navbar role="manager" />
      <div className="min-h-screen bg-[#f4f4f4] px-24 py-12">
        <h1 className="text-[42px] font-bold text-[#EA5529] mb-4">
          Trouvez des solutions à vos incidents de forage
        </h1>
        <p className="text-gray-700 mb-8 text-lg max-w-3xl">
          Décrivez un incident technique rencontré lors du forage afin de
          faciliter son analyse et d'accélérer la résolution. Plus votre
          description est précise, plus les solutions seront adaptées.
        </p>

        <textarea
          value={probleme}
          onChange={(e) => setProbleme(e.target.value)}
          placeholder="Exemple : Blocage de la tige de forage, infiltration d’eau, effondrement de parois..."
          className="w-full h-48 text-lg border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#EA5529] focus:border-[#EA5529]"
        />

        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-[#EA5529] text-white px-6 py-2 rounded-full hover:bg-orange-600"
          >
            Valider
          </button>
        </div>

        {solutions.length > 0 && (
          <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-[#EA5529] mb-4">
              Solutions suggérées
            </h2>
            <ul className="space-y-4">
              {solutions.map((sol, index) => (
                <li key={index} className="border-l-4 border-orange-500 pl-4">
                  <p className="font-semibold">Problème similaire :</p>
                  <p>{sol.probleme}</p>
                  <p className="font-semibold mt-2">Solution :</p>
                  <p>{sol.solution}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Similarité : {sol.similarite * 100} %
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default SignalerProbleme;
