import React, { useState } from "react";

const LancerPuit = () => {
  const [dateDebut, setDateDebut] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Date de début sélectionnée : ${dateDebut}`);
  };

  return (
    <div className="flex h-screen">
      {/* Colonne gauche */}
      <div className="w-1/2 flex items-center justify-center bg-[#f9f9f9] px-24">
        <div className="w-full max-w-[480px]">
          <h1 className="text-[48px] leading-[56px] font-bold text-orange-600 mb-6">
            Lancer un <br /> Puit
          </h1>

          <p className="text-[16px] text-gray-600 mb-10 leading-[24px]">
            For marketplace sellers looking to grow their business, metaverse offers the best platform.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Label avec icône */}
            <div className="flex items-center gap-2">
              <img src="/date.png" alt="date icon" className="w-5 h-5" />
              <label htmlFor="dateDebut" className="text-[16px] font-medium text-gray-800">
                Date début
              </label>
            </div>

            {/* Champ de date */}
            <input
              type="date"
              id="dateDebut"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              placeholder="jj/mm/aaaa"
              className="w-full h-[56px] border border-orange-500 rounded-md px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-orange-600"
              required
            />

            {/* Bouton */}
            <button
              type="submit"
              className="w-full h-[56px] bg-orange-600 hover:bg-orange-700 text-white text-[16px] font-semibold rounded-md"
            >
              Suivant
            </button>
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
