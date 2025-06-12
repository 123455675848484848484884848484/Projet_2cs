import React, { useState, useEffect } from "react";
import { useNavigate  , useParams} from "react-router-dom";
import Navbar from "./components/navbar";

const CreerUser = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [affectations, setAffectations] = useState([]);
  const [puitsDisponibles, setPuitsDisponibles] = useState([]);
  const [puits, setPuits] = useState([""]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id_user } = useParams();

  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");

  const navigate = useNavigate();

  // Charger les infos utilisateur et les projets
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/utilisateur/${id_user}`);
        if (!res.ok) throw new Error("Erreur récupération utilisateur");
        const data = await res.json();
        setUserInfo(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchPuitsDisponibles = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/utilisateur/non_affectes/${id_user}`);
        if (!res.ok) throw new Error("Erreur récupération puits");
        const data = await res.json();
        setPuitsDisponibles(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchAffectations = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/utilisateur/${id_user}/projets`);
        if (!res.ok) throw new Error("Erreur récupération affectations");
        const data = await res.json();
        setAffectations(data);
      } catch (err) {
        setError(err.message);
      }
    };

    Promise.all([fetchUserInfo(), fetchPuitsDisponibles(), fetchAffectations()]).finally(() =>
      setLoading(false)
    );
  }, [id_user]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userProjetsData = puits
        .filter((p) => p)
        .map((id) => ({
          id_projet: parseInt(id, 10),
          id_utilisateur: parseInt(id_user),
        }));

      for (const userProjet of userProjetsData) {
        const resUserProjet = await fetch("http://127.0.0.1:8000/projets/affecter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userProjet),
        });

        if (!resUserProjet.ok) {
          const errorData = await resUserProjet.json();
          throw new Error(errorData.message || "Erreur affectation");
        }
      }

      alert("Puits affectés avec succès !");
      navigate("/mescomptes");
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <>
      <Navbar role={role} userid={userId} />
      <div className="w-full flex">
        <div className="w-2/5 p-8 bg-[#f9f9f9] flex items-start justify-center">
          <div className="w-full max-w-3xl">
            <h1 className="text-[36px] font-bold text-[#EA5529] mb-6">
              Informations du compte
            </h1>

            <div className="space-y-4 text-base text-gray-800">
              <p><strong>Nom :</strong> {userInfo?.name}</p>
              <p><strong>Email :</strong> {userInfo?.email}</p>
              <p><strong>Rôle :</strong> {userInfo?.role}</p>
            </div>

            <h2 className="text-[28px] font-bold text-[#EA5529] mt-6 mb-2">
              Projets affectés
            </h2>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              {affectations.length > 0 ? (
                affectations.map((p) => (
                  <li key={p.id}>{p.name || p.projet?.name || "Nom inconnu"}</li>
                ))
              ) : (
                <li>Aucun puits affecté.</li>
              )}
            </ul>

            {role === "Admin" && (
  <form onSubmit={handleSubmit} className="space-y-6">
    <h2 className="text-[22px] font-bold text-[#EA5529]">
      Affecter de nouveaux puits
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
        Affecter les puits
      </button>
    </div>
  </form> )}
          </div>
        </div>

        <div className="w-3/5 h-screen">
          <img
            src="/image.png"
            alt="Illustration industrielle"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default CreerUser;
