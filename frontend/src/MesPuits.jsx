import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";

const MesPuits = () => {
  const [puits, setPuits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/auth/verify_token/${token}`);
        if (!response.ok) throw new Error("Token invalide");
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  const fetchPuits = async (motCle = "_") => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      console.error("Utilisateur non connecté");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/projets/recherche/${userId}/${motCle}`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des puits");

      const data = await response.json();

      const formattedData = data.map((projet) => ({
        id: projet.id,
        name: projet.name,
        dateDebut: projet.date_debut,
        wilaya: projet.wilaya,
        adresse: projet.adresse,
        duree: projet.duree_prevue,
        budget: `${parseFloat(projet.budget_total || 0).toLocaleString()} DZD`,
      }));

      setPuits(formattedData);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    fetchPuits(); // Charge tous les projets de l'utilisateur au départ
  }, []);

  return (
    <>
      <Navbar role="manager" />
      <div className="min-h-screen bg-[#f9f9f9] px-20 py-12">
        <h1 className="text-[48px] font-bold text-[#EA5529] leading-[56px] mb-4">
          Mes Puits
        </h1>
        <p className="text-[16px] text-gray-700 mb-10 max-w-xl">
          For marketplace sellers looking to grow their business, metaverse offers the best platform.
        </p>

        <div className="flex justify-end mb-4 space-x-2">
          <input
            type="text"
            placeholder="Nom du projet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px] px-4 py-2 border rounded-full focus:outline-none"
          />
          <button
            onClick={() => fetchPuits(searchTerm.trim() !== "" ? searchTerm : "_")}
            className="bg-[#EA5529] text-white px-4 py-2 rounded-full hover:bg-orange-600"
          >
            Rechercher
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr className="text-gray-700">
                <th className="p-4">Nom</th>
                <th className="p-4">ID</th>
                <th className="p-4">Date début</th>
                <th className="p-4">Wilaya</th>
                <th className="p-4">Adresse</th>
                <th className="p-4">Durée prévue</th>
                <th className="p-4">Coût total</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {puits.map((puit, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="p-4">› {puit.name}</td>
                  <td className="p-4">› {puit.id}</td>
                  <td className="p-4">{puit.dateDebut}</td>
                  <td className="p-4">{puit.wilaya}</td>
                  <td className="p-4">{puit.adresse}</td>
                  <td className="p-4">{puit.duree} jours</td>
                  <td className="p-4">{puit.budget}</td>
                  <td className="p-4">
                    <button
                      className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-md font-semibold"
                      onClick={() => navigate(`/dashp/${puit.id}`)}
                    >
                      Consulter
                    </button>
                  </td>
                </tr>
              ))}
              {puits.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-gray-500 py-6">
                    Aucun puit enregistré pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MesPuits;
