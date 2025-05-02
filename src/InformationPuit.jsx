import React, { useState } from "react";
import { useNavigate  , useLocation} from "react-router-dom";
const InformationPuit = () => {
  const [formData, setFormData] = useState({
    wilaya: "",
    adresse: "",
    duree: "",
    budget: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { dateDebut } = location.state || {};
  const userid = localStorage.getItem('user_id');
  
  
   

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data for the POST request
    const dataToSend = {
      lieu: formData.adresse, // Mapping form data fields to your API structure
      duree_prevue: formData.duree,
      adresse: formData.adresse,
      budget_total: parseFloat(formData.budget),
      date_debut: dateDebut, // From location.state
      created_by: userid, // Example: this could be dynamically retrieved if necessary
      wilaya: formData.wilaya,
      closed: "False" // Assuming "False" is a string; adjust as necessary
    };
  
    try {
      const response = await fetch(" http://127.0.0.1:8001/projets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la création du projet");
      }

      const data = await response.json();
      
      const projetId = data.id; // ID du projet créé

      // Redirection vers la page des phases en passant l'ID du projet via le state
      navigate("/phasepre", { state: { id: projetId } }); // Envoie l'ID dans le state
    } catch (error) {
      console.error("Erreur :", error);
    }
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
      <div className="w-1/2 pr-10 h-full flex flex-col justify-center">
  <h1 className="text-[48px] font-bold leading-[56px] text-orange-600 mb-6">
    Information sur <br /> le puit
    <p>{userid} </p>
  </h1>
  <p className="text-[16px] text-gray-700 leading-[24px]">
    For marketplace sellers looking to grow their business, metaverse offers the best platform.
  </p>
</div>

      {/* Colonne droite : formulaire */}
      <form onSubmit={handleSubmit} className="w-1/2 flex flex-col gap-6 max-w-[480px]">
       {/* Wilaya */}
<div>
  <label htmlFor="wilaya" className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-1">
    <img src="/lieu.png" alt="lieu" className="w-5 h-5" />
    Wilaya
  </label>
  <select
    id="wilaya"
    name="wilaya"
    value={formData.wilaya}
    onChange={handleChange}
    className="w-full h-[52px] border-2 border-gray-800 rounded-md px-4 text-[16px] text-gray-900 focus:outline-none focus:border-orange-600 focus:ring-0 focus:text-orange-600"
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
  <label htmlFor="adresse" className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-1">
    <img src="/lieu.png" alt="lieu" className="w-5 h-5" />
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
  <label htmlFor="duree" className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-1">
    <img src="/timer.png" alt="durée" className="w-5 h-5" />
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
  <label htmlFor="budget" className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-1">
    <img src="/cout.png" alt="budget" className="w-5 h-5" />
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
