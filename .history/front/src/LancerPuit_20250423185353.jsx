import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LancerPuit = () => {
    const [dateDebut, setDateDebut] = useState("");
    const navigate = useNavigate(); // ✅ déplacer ici
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (dateDebut) {
        navigate("/info-puit"); // ✅ navigation OK
      } else {
        alert("Veuillez sélectionner une date !");
      }
    };
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Colonne gauche */}
      <div className="w-1/2 bg-[#f9f9f9] flex items-center justify-center px-[80px]">
        <div className="w-full max-w-[400px]">
          <h1 className="text-[48px] font-bold leading-[56px] text-orange-600">
            Lancer un <br /> Puit
          </h1>

          <p className="text-[16px] text-gray-600 mt-6 mb-10 leading-[24px]">
            For marketplace sellers looking to grow their business, metaverse offers the best platform.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <img src="/date.png" alt="date icon" className="w-5 h-5" />
                <label htmlFor="dateDebut" className="text-[16px] font-medium text-gray-800">
                  Date début
                </label>
              </div>

              <input
                type="date"
                id="dateDebut"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-full h-[52px] text-[16px] px-4 border-2 border-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                required
              />
            </div>

            <div className="text-right">
  <button
    type="submit"
    className="w-[150px] h-[52px] bg-orange-600 hover:bg-orange-700 text-white text-[16px] font-semibold rounded-md transition"
  >
    Suivant
  </button>
</div>
          </form>
        </div>
      </div>

      {/* Colonne droite */}
      <div className="w-1/2 h-full">
        <img
          src="/lancerp.png"
          alt="Site industriel"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LancerPuit;