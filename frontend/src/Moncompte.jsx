import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar"; 


const Moncompte = () => {
  const [userData, setUserData] = useState({
    nom: "Guefaifia",
    prenom: "Rania",
    email: "kr_guefaifia@esi.dz",
    motDePasse: "••••••••"
  });

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const nomInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && nomInputRef.current) {
      nomInputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation for empty fields
    if (!userData.nom || !userData.prenom || !userData.email || !userData.motDePasse) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    // Optional: prevent submitting masked password
    if (userData.motDePasse === "••••••••") {
      alert("Veuillez entrer un nouveau mot de passe.");
      return;
    }

    console.log("Informations mises à jour :", userData);
    setIsEditing(false);

    // Optionally, navigate or do something else here
    // navigate("/somewhere");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleEdit = () => {
    setIsEditing(true);
    // Optional: clear the password field on edit
    if (userData.motDePasse === "••••••••") {
      setUserData(prev => ({ ...prev, motDePasse: "" }));
    }
  };

  return (
    <>
    <Navbar role="manager" />
    <div className="w-full flex">
      {/* Left Column */}
      <div className="w-9/12 p-8 bg-[#f9f9f9] flex items-start justify-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-[36px] font-bold text-[#EA5529] mb-6">
            Mon Profil
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm text-green-800 font-semibold">Nom</label>
              <input
                type="text"
                name="nom"
                value={userData.nom}
                onChange={handleChange}
                placeholder="Entrez votre nom"
                className="w-full border-b-2 border-[#EA5529] focus:outline-none py-2 bg-transparent"
                readOnly={!isEditing}
                ref={nomInputRef}
              />
            </div>

            <div>
              <label className="text-sm text-green-800 font-semibold">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={userData.prenom}
                onChange={handleChange}
                placeholder="Entrez votre prénom"
                className="w-full border-b-2 border-[#EA5529] focus:outline-none py-2 bg-transparent"
                readOnly={!isEditing}
              />
            </div>

            <div>
              <label className="text-sm text-green-800 font-semibold">Adresse mail</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Entrez votre adresse mail"
                className="w-full border-b-2 border-[#EA5529] focus:outline-none py-2 bg-transparent"
                readOnly={!isEditing}
              />
            </div>

            <div>
              <label className="text-sm text-green-800 font-semibold">Mot de passe</label>
              <input
                type={isEditing ? "text" : "password"}
                name="motDePasse"
                value={userData.motDePasse}
                onChange={handleChange}
                placeholder={isEditing ? "Entrez un mot de passe" : ""}
                className="w-full border-b-2 border-[#EA5529] focus:outline-none py-2 bg-transparent"
                readOnly={!isEditing}
              />
            </div>

            <div className="mt-5">
              {isEditing ? (
                <button
                  type="submit"
                  className="bg-[#EA5529] text-white py-2 px-6 rounded-md font-semibold hover:bg-[#d04420] transition"
                >
                  Valider
                </button>
              ) : (
                <button
                  type="button"
                  onClick={e => { e.preventDefault(); toggleEdit(); }}
                  className="bg-[#EA5529] text-white py-2 px-6 rounded-md font-semibold hover:bg-[#d04420] transition"
                >
                  Modifier mes informations
                </button>
              )}
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
    </>
  );
};

export default Moncompte;
