import React, { useState } from "react";

const LancerPuit = () => {
  const [dateDebut, setDateDebut] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Date de début sélectionnée : ${dateDebut}`);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Partie gauche : formulaire */}
      <div className="w-full md:w-1/2 bg-gray-50 flex flex-col justify-center px-8 py-16">
        <h1 className="text-4xl font-bold text-orange-600 mb-2">Lancer un</h1>
        <h1 className="text-4xl font-bold text-orange-600 mb-6">Puit</h1>
        <p className="text-gray-600 mb-8">
          For marketplace sellers looking to grow their business, metaverse offers the best platform.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="dateDebut" className="text-gray-700 font-medium">
            Date début
          </label>
          <input
            id="dateDebut"
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            className="border border-orange-500 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <button
            type="submit"
            className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition"
          >
            Suivant
          </button>
        </form>
      </div>

      {/* Partie droite : image */}
      <div className="w-full md:w-1/2">
        <img
          src="/lancerp.png"
          alt="Travailleurs sur le site"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LancerPuit;