import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";

const Mescomptes = () => {
  const [comptes, setComptes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();

  const sampleData = [
    { id: 1, name: "Fadel Nesrine", role: "Manager", adresse: "ln_fadel@esi.dz" },
    { id: 2, name: "Guefaifia Rania", role: "Manager", adresse: "kr_guefaifia@esi.dz" },
  ];

  const fetchComptes = (motCle = "") => {
    const filtered = sampleData.filter((c) =>
      c.name.toLowerCase().includes(motCle.toLowerCase())
    );
    setComptes(filtered.length > 0 ? filtered : sampleData);
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) {
      setComptes((prev) => prev.filter((compte) => compte.id !== id));
    }
  };

  const handleEdit = (compte) => {
    setEditingId(compte.id);
    setEditedData({ ...compte });
  };

  const handleValidate = () => {
    setComptes((prev) =>
      prev.map((compte) =>
        compte.id === editingId ? { ...editedData } : compte
      )
    );
    setEditingId(null);
    setEditedData({});
  };

  useEffect(() => {
    fetchComptes();
  }, []);

  return (
    <>
       

      <div className="min-h-screen bg-[#f9f9f9] px-20 py-12">
        <h1 className="text-[48px] font-bold text-[#EA5529] leading-[56px] mb-4">
          Mes Comptes
        </h1>
        <p className="text-[16px] text-gray-700 mb-10 max-w-xl">
          Gérer les comptes des managers associés à vos projets.
        </p>

        <div className="flex justify-end mb-6 space-x-2">
          <input
            type="text"
            placeholder="Nom du compte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px] px-4 py-2 border rounded-full focus:outline-none"
          />
          <button
            onClick={() => fetchComptes(searchTerm.trim())}
            className="bg-[#EA5529] text-white px-6 py-2 rounded-full hover:brightness-90"
          >
            Rechercher
          </button>
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
                        value={editedData.adresse}
                        onChange={(e) =>
                          setEditedData({ ...editedData, adresse: e.target.value })
                        }
                      />
                    ) : (
                      compte.adresse
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {editingId === compte.id ? (
                        <button
                          className="bg-green-800 text-white px-4 py-2 rounded-md font-semibold hover:brightness-90"
                          onClick={handleValidate}
                        >
                          Valider
                        </button>
                      ) : (
                        <button
                          className="bg-green-800 text-white px-4 py-2 rounded-md font-semibold hover:brightness-90"
                          onClick={() => handleEdit(compte)}
                        >
                          Modifier
                        </button>
                      )}
                      <button
                        className="bg-[#EA5529] text-white px-4 py-2 rounded-md font-semibold "
                        onClick={() => handleDelete(compte.id)}
                      >
                        Supprimer
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
