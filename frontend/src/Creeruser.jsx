import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";

const CreerUser = () => {
  const [name, setNom] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setMotDePasse] = useState("");
  const [puits, setPuits] = useState([""]);

  const [puitsDisponibles, setPuitsDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/projets")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des puits");
        }
        return response.json();
      })
      .then((data) => {
        setPuitsDisponibles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !role || !email || !pwd) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      // 1. Création utilisateur
      const userData = { name, email, role, pwd };

      const response = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création de l'utilisateur");
      }

      const createdUser = await response.json();
      const userId = createdUser.id;

      // 2. Préparer les couples id_utilisateur, id_projet
      const userProjetsData = puits
        .filter(p => p)
        .map(id => ({
          id_projet: parseInt(id, 10),
          id_utilisateur: userId,
        }));

      // 3. Envoyer un POST par affectation
      for (const userProjet of userProjetsData) {
        const resUserProjet = await fetch("http://127.0.0.1:8000/projets/affecter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userProjet),
        });

        if (!resUserProjet.ok) {
          const errorData = await resUserProjet.json();
          throw new Error(errorData.message || "Erreur lors de l'affectation d'un puits");
        }
      }

      alert("Utilisateur créé et puits affectés avec succès !");
      navigate("/info-puit");

    } catch (error) {
      alert("Erreur : " + error.message);
    }
  };



  const handlePuitChange = (index, value) => {
    const newPuits = [...puits];
    newPuits[index] = value;
    setPuits(newPuits);
  };

  const addPuitField = (e) => {
    e.preventDefault();
    setPuits([...puits, ""]);
  };

  const removePuitField = (index) => {
    if (puits.length <= 1) return;
    const newPuits = [...puits];
    newPuits.splice(index, 1);
    setPuits(newPuits);
  };

  if (loading) return <p>Chargement des puits...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <>
      <Navbar role="admin" />
      <div className="w-full flex">
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
                  value={name}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Entrez votre nom"
                  className="w-full border-b-2 border-[#EA5529] focus:outline-none py-2 bg-transparent"
                />
              </div>

              <div>
                <label className="text-sm text-green-800 font-semibold">Rôle</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border-b-2 border-[#EA5529] focus:outline-none py-2 bg-transparent"
                >
                  <option value="">-- Choisir un rôle --</option>
                  <option value="Admin">Admin</option>
                  <option value="Decideur">Decideur</option>
                  <option value="Agent">Agent</option>
                </select>
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
                  value={pwd}
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
                  <select
                    value={puit}
                    onChange={(e) => handlePuitChange(index, e.target.value)}
                    className="w-64 border border-gray-300 rounded px-3 py-2 bg-white"
                  >
                    <option value="">-- Choisir un puits --</option>
                    {puitsDisponibles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  {index === puits.length - 1 ? (
                    <button
                      onClick={addPuitField}
                      className="p-1 text-gray-600 hover:text-gray-800"
                      type="button"
                    >
                      <img src="/Add.png" alt="Ajouter un puits" className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removePuitField(index);
                      }}
                      className="p-1 text-gray-600 hover:text-gray-800"
                      type="button"
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

        <div className="w-3/4 h-screen">
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

export default CreerUser;
