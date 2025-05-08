import React from "react";
import { useNavigate } from "react-router-dom";

export default function Homemanager() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-white">
      {/* Partie gauche */}
      <div className="w-1/2 flex flex-col justify-center items-start px-16">
        <img src="/corex.png" alt="Corex Logo" className="w-32 mb-8" />

        <h1 className="text-5xl font-bold text-orange-600 mb-2">Bienvenue a</h1>
        <h1 className="text-5xl font-bold text-green-900 mb-6">Corex 360°</h1>

        <p className="text-lg text-gray-700 mb-10 max-w-md">
          For marketplace sellers looking to grow their business, metaverse offers the best platform.
        </p>

        <div className="flex flex-col space-y-4 w-full max-w-sm">
          <button
            className="bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-orange-700 transition"
            onClick={() => navigate("/mespuits")}
          >
            Consulter les Puits
          </button>
        </div>
      </div>

      <div className="w-1/2 h-full">
        <img src="/firstp.png" alt="Usine" className="object-cover w-full h-full" />
      </div>
    </div>
  );
}