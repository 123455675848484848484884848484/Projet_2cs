import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";


export default function Homeagent() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar role="agent" />
      <div className="flex h-screen bg-white">
        <div className="w-1/2 flex flex-col justify-center items-start px-16">
          <img src="/corex.png" alt="Corex Logo" className="w-32 mb-8" />

          <h1 className="text-5xl font-bold text-[#EA5529] mb-2">Bienvenue a</h1>
          <h1 className="text-5xl font-bold text-green-900 mb-6">Corex 360°</h1>

          <p className="text-lg text-gray-700 mb-10 max-w-md">
            For marketplace sellers looking to grow their business, metaverse offers the best platform.
          </p>

          <div className="flex flex-col space-y-4 w-full max-w-sm">
            <button
              className="bg-[#EA5529] text-white py-3 rounded-md font-semibold hover:bg-[#EA5529] transition"
              onClick={() => navigate("/file")}
            >
              Insirer le fichier journalier
            </button>
            <button
              className="bg-green-900 text-white py-3 rounded-md font-semibold hover:bg-green-800 transition"
              onClick={() => navigate("/signal")}
            >
              Signaler un incident
            </button>
          </div>
        </div>

        <div className="w-1/2 h-full">
          <img src="/firstp.png" alt="Usine" className="object-cover w-full h-full" />
        </div>
      </div>
    </>
  );
}