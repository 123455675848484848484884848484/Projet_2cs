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
      <div className="w-1/2 flex items-center justify-center bg-gray-50 px-16">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-orange-600 mb-4">
            Lancer un <br /> Puit
          </h1>
          <p className="text-base text-gray-700 mb-8">
            For marketplace sellers looking to grow their business, metaverse offers the best platform.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Label */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <label htmlFor="dateDebut" className="text-base font-medium">
                Date début
              </label>
            </div>
            
            {/* Champ de date */}
            <input
              type="text"
              id="dateDebut"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              placeholder="jj/mm/aaaa"
              className="w-full h-12 border border-gray-300 rounded px-4 mb-4 focus:outline-none focus:border-orange-500"
            />
            
            {/* Bouton Suivant adapté selon Figma */}
            <button
              type="submit"
              className="w-full h-12 bg-orange-600 text-white text-base font-medium rounded transition-colors hover:bg-orange-700 mt-2"
            >
              Suivant
            </button>
          </form>
        </div>
      </div>
      
      {/* Colonne droite (image) */}
      <div className="w-1/2">
        <img
          src="/api/placeholder/800/600"
          alt="Site industriel avec travailleurs"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LancerPuit;