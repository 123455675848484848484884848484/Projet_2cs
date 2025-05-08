import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MesPuits = () => {
  const [puits, setPuits] = useState([]);
  const userid = localStorage.getItem('user_id');

  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
        console.log(token)
      try {
        const response = await fetch(`http://127.0.0.1:8000/auth/verify_token/${token}`);

        if (!response.ok) {
          throw new Error('Token verification failed');
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    verifyToken();
  }, [navigate]);

  // Simulation d'une récupération depuis une BDD / API
  useEffect(() => {
    // À remplacer par une vraie requête API si besoin
    const fakeData = [
      {
        id: "000369",
        dateDebut: "07/11/2023",
        wilaya: "Guelma",
        adresse: "Cité 150 logements",
        duree: "30",
        budget: "8750000 DZD",
      },
      {
        id: "000370",
        dateDebut: "01/02/2024",
        wilaya: "Alger",
        adresse: "Bir Mourad Rais",
        duree: "45",
        budget: "12500000 DZD",
      },
    ];

    setPuits(fakeData);
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9] px-20 py-12">
      {/* Titre */}
      <h1 className="text-[48px] font-bold text-orange-600 leading-[56px] mb-4">
        Mes Puits
      </h1>
      <p className="text-[16px] text-gray-700 mb-10 max-w-xl">
        For marketplace sellers looking to grow their business, metaverse offers the best platform.
      </p>

      {/* Barre de recherche */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Type here..."
          className="w-[250px] px-4 py-2 border rounded-full focus:outline-none"
        />
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100">
            <tr className="text-gray-700">
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
                <td className="p-4">› {puit.id}</td>
                <td className="p-4">{puit.dateDebut}</td>
                <td className="p-4">{puit.wilaya}</td>
                <td className="p-4">{puit.adresse}</td>
                <td className="p-4">{puit.duree} jours</td>
                <td className="p-4">{puit.budget}</td>
                <td className="p-4">
                  <button className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-md font-semibold">
                    Consulter
                  </button>
                </td>
              </tr>
            ))}
            {puits.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6">
                  Aucun puit enregistré pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
    </div>
  );
};

export default MesPuits;