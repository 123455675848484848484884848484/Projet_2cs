import React from "react";
import logo from './logo.png';
import { useNavigate } from "react-router-dom";

const Navbar = ({ role, userid }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // Redirection après déconnexion
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Left - Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-12 w-auto" />
      </div>

      {/* Right - Navigation + Button */}
      <div className="flex items-center space-x-6">
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium items-center">
          <li
            className="hover:text-[#EA5529] cursor-pointer"
            onClick={() => {
              if (role === "Decideur") {
                navigate("/manager");
              }
              if (role === "Agent") {
                navigate("/agent");
              }
            }}
          >
            Accueil
          </li>

          {role === "Decideur" && (
            <>
           
            <li
                className="hover:text-[#EA5529] cursor-pointer"
                onClick={() => navigate("/mespuits")}
              >
                Puits
              </li>
              <li
                className="hover:text-[#EA5529] cursor-pointer"
                onClick={() => navigate(`/dashg/${userid}`)}
              >
                Dashboard global
              </li>
            </>
          )}

          {role === "Admin" && (
            <>
              <li
                className="hover:text-[#EA5529] cursor-pointer"
                onClick={() => navigate("/mescomptes")}
              >
                Utilisateurs
              </li>
              <li
                className="hover:text-[#EA5529] cursor-pointer"
                onClick={() => navigate("/mespuits")}
              >
                Puits
              </li>
              <li
                className="hover:text-[#EA5529] cursor-pointer"
                onClick={() => navigate(`/dashg/${userid}`)}
              >
                Dashboard global
              </li>
            </>
          )}

          {/* 🔓 Li de déconnexion pour tous les rôles sauf guest */}
          {role !== "guest" && (
            <>
            <li
              className="hover:text-[#EA5529] cursor-pointer"
              onClick={() => navigate(`/moncompte/${userid}`)}
            >
              Mon compte
            </li>
            
            <li
              className="hover:text-red-500 cursor-pointer"
              onClick={handleLogout}
            >
              Se déconnecter
            </li>
            <li
              className="hover:text-[#EA5529] cursor-pointer"
              onClick={() => navigate(`/moncompte/${userid}`)}
            >
              Mon compte
            </li>
            </>
          )}
        </ul>

        {/* Role-based Button */}
        {role === "Decideur" && (
          <>
          <button
            onClick={() => navigate("/mespuits")}
            className="bg-[#EA5529] text-white px-4 py-2 rounded-lg hover:bg-[#d1441f] transition"
          >
            Consulter Mes puits
          </button>
          <li
              className="hover:text-[#EA5529] cursor-pointer"
              onClick={() => navigate(`/moncompte/${userid}`)}
            >
              Mon compte
            </li>
            </>
        )}

        {role === "guest" && (
          <button
            onClick={() => navigate("/login")}
            className="bg-[#EA5529] text-white px-4 py-2 rounded-lg hover:bg-[#d1441f] transition"
          >
            Se connecter
          </button>


        )}

        {role === "Agent" && (
          
          <button
            onClick={() => navigate("/file")}
            className="bg-[#EA5529] text-white px-4 py-2 rounded-lg hover:bg-[#d1441f] transition"
          >
            Insérer fichier journalier
          </button>
          
        )}

        {role === "Admin" && (
          <button
            onClick={() => navigate("/creeruser")}
            className="bg-[#EA5529] text-white px-4 py-2 rounded-lg hover:bg-[#d1441f] transition"
          >
            Ajouter un utilisateur
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
