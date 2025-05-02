import React, { useState } from "react";

const InformationPuit = () => {
  const [formData, setFormData] = useState({
    wilaya: "",
    adresse: "",
    duree: "",
    budget: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire envoyé :", formData);
  };

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
            className="w-full h-[52px] border-2 border-orange-500 rounded-md px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="">-- Choisir une wilaya --</option>
            <option value="Alger">Alger</option>
            <option value="Oran">Oran</option>
            <option value="Constantine">Constantine</option>
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
            className="w-full h-[52px] border-2 border-gray-700 rounded-md px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-700"
            required
          />
        </div>

        {/* Durée */}
        <div>
          <label htmlFor="duree" className="block text-sm font-medium text-gray-900 mb-1">
            Durée prévue
          </label>
          <input
            type="text"
            id="duree"
            name="duree"
            value={formData.duree}
            onChange={handleChange}
            className="w-full h-[52px] border-2 border-gray-700 rounded-md px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-700"
            required
          />
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-900 mb-1">
            Budget total
          </label>
          <input
            type="text"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full h-[52px] border-2 border-gray-700 rounded-md px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-700"
            required
          />
        </div>
      </form>
    </div>
  );
};

export default InformationPuit;
