import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";

const SignalerProbleme = () => {
  const [probleme, setProbleme] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log("Problème soumis :", probleme);
  };

  return (
    <>
      <Navbar role="manager" />
      <div className="min-h-screen bg-[#f4f4f4] px-24 py-12">
        <h1 className="text-[42px] font-bold text-[#EA5529] mb-4">
          Trouvez des solutions à vos incidents de forage
        </h1>
        <p className="text-gray-700 mb-8 text-lg max-w-3xl">
  Décrivez un incident technique rencontré lors du forage afin de faciliter son analyse
  et d'accélérer la résolution. Plus votre description est précise, plus les solutions seront adaptées.
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
      </div>
    </>
  );
};

export default SignalerProbleme;
