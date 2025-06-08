import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreerUser = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [puits, setPuits] = useState([""]); // Start with one dropdown

  const navigate = useNavigate();
  const puitsDisponibles = ["Puit A", "Puit B", "Puit C", "Puit D"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nom || !prenom || !email || !motDePasse) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    console.log("Nouvel utilisateur :", {
      nom,
      prenom,
      email,
      motDePasse,
      puits,
    });
    navigate("/info-puit");
  };

  const handlePuitChange = (index, value) => {
    const newPuits = [...puits];
    newPuits[index] = value;
    setPuits(newPuits);
  };

  const addPuitField = (e) => {
    e.preventDefault(); // Prevent form submit
    setPuits([...puits, ""]);
  };

  const removePuitField = (index) => {
    if (puits.length <= 1) return; // Don't remove the last field
    const newPuits = [...puits];
    newPuits.splice(index, 1);
    setPuits(newPuits);
  };

  return (
    <div className="w-full flex">
      {/* Left Column */}
      <div className="w-9/12 p-8 bg-[#f9f9f9] flex items-start justify-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-[36px] font-bold text-[#EA5529] mb-6">
            Créer un utilisateur
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm text-green-800 font-semibold">Nom</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Entrez votre nom"
                className="w-full border-b-2 border-[#EA5529] focus:outline-none py-2 bg-transparent"
              />
            </div>

            <div>
              <label className="text-sm text-green-800 font-semibold">Prénom</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Entrez votre prénom"
                className="w-full border-b-2 border-[#EA5529] focus:outline-none py-2 bg-transparent"
              />
            </div>

            <div>
              <label className="text-sm text-green-800 font-semibold">Adresse mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre adresse mail"
                className="w-full border-b-2 border-[#EA5529] focus:outline-none py-2 bg-transparent"
              />
            </div>

            <div>
              <label className="text-sm text-green-800 font-semibold">Mot de passe</label>
              <input
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="Entrez un mot de passe"
                className="w-full border-b-2 border-[#EA5529] focus:outline-none py-2 bg-transparent"
              />
            </div>

            <h2 className="text-[32px] font-bold text-[#EA5529] mt-3">
              Affecter l'utilisateur à des puits
            </h2>

            {puits.map((puit, index) => (
              <div key={index} className="flex items-center gap-2 mt-3">
                <div className="relative inline-flex items-center border border-gray-300 rounded px-3 py-2 w-64">
                  <span className="flex-1 text-gray-700">
                    {puit || "-- Choisir un puit --"}
                  </span>
                  <select
                    value={puit}
                    onChange={(e) => handlePuitChange(index, e.target.value)}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    <option value="">-- Choisir un puit --</option>
                    {puitsDisponibles.map((p, i) => (
                      <option key={i} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                
                {index === puits.length - 1 ? (
                  <button
                    onClick={addPuitField}
                    className="p-1 text-gray-600 hover:text-gray-800"
                  >
                    <img src="/Add.png" alt="Ajouter un puit" className="w-5 h-5" />
                  </button>
                ) : (
                  <button
  onClick={(e) => {
    e.preventDefault();
    removePuitField(index);
  }}
  className="p-1 text-gray-600 hover:text-gray-800"
>



                    <img src="/remove.png" alt="Supprimer" className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}

            <div className="mt-5">
              <button
                type="submit"
                className="bg-[#EA5529] text-white py-2 px-6 rounded-md font-semibold hover:bg-[#d04420] transition"
              >
                Créer utilisateur
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-1/3 h-screen">
        <img
          src="/lma9am.jpg"
          alt="Illustration industrielle"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default CreerUser;