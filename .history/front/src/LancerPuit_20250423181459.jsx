import React, { useState } from "react";

const LancerPuit = () => {
  const [dateDebut, setDateDebut] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Date de début sélectionnée : ${dateDebut}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Partie gauche : formulaire */}
      <div className="w-1/2 bg-[#f9f9f9] flex flex-col justify-center px-20">
        <div className="w-full max-w-md">
          <h1 className="text-[48px] leading-tight font-bold text-orange-600">
            Lancer un <br /> Puit
          </h1>

          <p className="text-[16px] text-gray-600 mt-6 mb-10">
            For marketplace sellers looking to grow their business, metaverse offers the best platform.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Bloc label + input + bouton */}
            <div className="flex flex-col gap-4">
              {/* Label avec icône */}
              <div className="flex items-center gap-2">
                <img src="/date.png" alt="date icon" className="w-5 h-5" />
                <label htmlFor="dateDebut" className="text-[16px] text-gray-800 font-medium">
                  Date début
                </label>
              </div>

              {/* Champ input */}
              <input
                type="date"
                id="dateDebut"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-full border-2 border-orange-500 rounded-md px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600"
                required
              />

              {/* Bouton aligné à gauche */}
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white text-[16px] font-semibold py-3 px-10 rounded-[8px] transition"
              >
                Suivant
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Partie droite : image */}
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