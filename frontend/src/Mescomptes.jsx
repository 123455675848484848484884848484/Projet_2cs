import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import { FaPlus } from "react-icons/fa";


const Mescomptes = () => {
  const [comptes, setComptes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
   const userId = localStorage.getItem("user_id");
   const role = localStorage.getItem("role");

  const navigate = useNavigate();

  const apiBase = "http://localhost:8000/utilisateur";

  const fetchComptes = async (motCle = "") => {
    try {
      const response = await axios.get(`${apiBase}/search`, {
        params: { keyword: motCle },
      });
      setComptes(response.data);
    } catch (error) {
      console.error("Erreur lors du fetch des comptes :", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) {
      try {
        await axios.delete(`${apiBase}/${id}`);
        setComptes((prev) => prev.filter((compte) => compte.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  const handleEdit = (compte) => {
    setEditingId(compte.id);
    setEditedData({ ...compte });
  };

  const handleValidate = async () => {
    try {
      await axios.put(`${apiBase}/${editingId}`, {
        name: editedData.name,
        email: editedData.email,
        pwd: "dummy",
        role: editedData.role,
      });
      setComptes((prev) =>
        prev.map((compte) =>
          compte.id === editingId ? { ...editedData } : compte
        )
      );
      setEditingId(null);
      setEditedData({});
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  useEffect(() => {
    fetchComptes();
  }, []);

  return (
    <>
      <Navbar role={role} userid={userId} />
      <div className="min-h-screen bg-[#f9f9f9] px-20 py-12">
        <h1 className="text-[48px] font-bold text-[#EA5529] leading-[56px] mb-4">
          Gestion des comptes
        </h1>
        <p className="text-[16px] text-gray-700 mb-10 max-w-xl">
          Gérer les comptes des managers associés à vos projets.
        </p>

        <div className="flex mb-6 items-center justify-between w-full">
          <div >
            <button
              onClick={() => navigate("/creeruser")}
              className="bg-[#EA5529] text-white px-6 py-2 rounded-full hover:bg-orange-600"
            >
              Ajouter un nouveau utilisateur
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Nom du compte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[250px] px-4 py-2 border rounded-full focus:outline-none"
            />
            <button
              onClick={() => fetchComptes(searchTerm.trim())}
              className="bg-[#EA5529] text-white px-6 py-2 rounded-full hover:bg-orange-600"
            >
              Rechercher
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr className="text-gray-700">
                <th className="p-4">Nom complet</th>
                <th className="p-4">Rôle</th>
                <th className="p-4">Adresse mail</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comptes.map((compte) => (
                <tr key={compte.id} className="border-t border-gray-200">
                  <td className="p-4">
                    {editingId === compte.id ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={editedData.name}
                        onChange={(e) =>
                          setEditedData({ ...editedData, name: e.target.value })
                        }
                      />
                    ) : (
                      <>› {compte.name}</>
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === compte.id ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={editedData.role}
                        onChange={(e) =>
                          setEditedData({ ...editedData, role: e.target.value })
                        }
                      />
                    ) : (
                      compte.role
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === compte.id ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={editedData.email}
                        onChange={(e) =>
                          setEditedData({ ...editedData, email: e.target.value })
                        }

                      />
                    ) : (
                      compte.email
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {editingId === compte.id ? (
                        <button
                          className="bg-[#EA5529] hover:bg-[#EA5529] text-white px-4 py-2 rounded-md font-semibold"
                          onClick={handleValidate}
                        >
                          Valider
                        </button>
                      ) : (
                        <button
                          className="bg-green-800 hover:bg-green-800 text-white px-4 py-2 rounded-md font-semibold"
                          onClick={() => handleEdit(compte)}
                        >
                          Modifier
                        </button>
                      )}
                      <button
                        className="bg-[#EA5529] hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold"
                        onClick={() => handleDelete(compte.id)}
                      >
                        Supprimer
                      </button>
                     <button 
                     onClick={() => navigate(`/moncompte/${compte.id}`)}
                     className="flex items-center justify-center w-10 h-10 bg-transparent rounded text-orange-500 hover:bg-orange-600 transition-all">
  <FaPlus />
</button>
                     
                    
            
                    </div>
                  </td>
                </tr>
              ))}
              {comptes.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-6">
                    Aucun compte trouvé.
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

export default Mescomptes;
