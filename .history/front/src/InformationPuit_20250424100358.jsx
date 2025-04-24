import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const InformationPuit = () => {
  const [formData, setFormData] = useState({
    wilaya: "",
    adresse: "",
    duree: "",
    budget: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire envoyé :", formData);
    navigate("/phasepre"); // redirige vers la page PhasePrevision
  };
  const wilayas = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar",
    "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger",
    "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
    "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "El Bayadh",
    "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
    "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma",
    "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
    "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet",
    "El M'Ghair", "El Meniaa"
  ];

  return (
    <div className="flex h-screen px-20 bg-[#f9f9f9] items-center">
      {/* Colonne gauche : texte */}
      <div className="w-1/2 pr-10">
        <h1 className="text-[48px] font-bold leading-[56px] text-orange-600 mb-6">
          Information sur <br /> le puit
        </h1>
        <p className="text-[16px] text-gray-700 leading-[24px]">
          For marketplace sellers looking to grow their business, metaverse offers the best platform.
        </p>
      </div>

      {/* Colonne droite : formulaire */}
      <form onSubmit={handleSubmit} className="w-1/2 flex flex-col gap-6 max-w-[480px]">
        {/* Wilaya */}
        <div>
          <label htmlFor="wilaya" className="block text-sm font-medium text-gray-900 mb-1">
            Wilaya
          </label>
          <select
            id="wilaya"
            name="wilaya"
            value={formData.wilaya}
            onChange={handleChange}
            className="w-full h-[52px] border-2 border-orange-500 rounded-md px-4 text-[16px] text-gray-900 focus:outline-none focus:border-orange-600 focus:ring-0 focus:text-orange-600"
            required
          >
            <option value="">-- Choisir une wilaya --</option>
            {wilayas.map((wilaya) => (
              <option key={wilaya} value={wilaya}>{wilaya}</option>
            ))}
          </select>
        </div>

        {/* Adresse */}
        <div>
          <label htmlFor="adresse" className="block text-sm font-medium text-gray-900 mb-1">
            Adresse complète
          </label>
          <input
            type="text"
            id="adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            className="w-full h-[52px] border-2 border-gray-800 rounded-md px-4 text-[16px] text-gray-900 focus:outline-none focus:border-orange-600 focus:ring-0 focus:text-orange-600"
            required
          />
        </div>

        {/* Durée */}
        <div>
          <label htmlFor="duree" className="block text-sm font-medium text-gray-900 mb-1">
            Durée prévue (en jours)
          </label>
          <input
            type="number"
            id="duree"
            name="duree"
            value={formData.duree}
            onChange={handleChange}
            className="w-full h-[52px] border-2 border-gray-800 rounded-md px-4 text-[16px] text-gray-900 focus:outline-none focus:border-orange-600 focus:ring-0 focus:text-orange-600"
            required
          />
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-900 mb-1">
            Budget total (en DZD)
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full h-[52px] border-2 border-gray-800 rounded-md px-4 text-[16px] text-gray-900 focus:outline-none focus:border-orange-600 focus:ring-0 focus:text-orange-600"
            required
          />
        </div>
        {/* Bouton Valider */}
<div className="text-right">
  <button
    type="submit"
    className="w-[150px] h-[52px] bg-orange-600 hover:bg-orange-700 text-white text-[16px] font-semibold rounded-md transition"
  >
    Valider
  </button>
</div>
      </form>
    </div>
  );
};

export default InformationPuit;
