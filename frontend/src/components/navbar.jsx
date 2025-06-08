import React from "react";
import logo from './logo.png';
import { useNavigate } from "react-router-dom";

const Navbar = ({ role }) => {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      
      {/* Left - Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-12 w-auto" />
      </div>

      {/* Right - Navigation + Button */}
      <div className="flex items-center space-x-6">
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium items-center">
          <li className="hover:text-[#EA5529] cursor-pointer">Accueil</li>

          {role === "manager" && (
            <li className="hover:text-[#EA5529] cursor-pointer">Mon compte</li>
          )}

          {role === "admin" && (
            <>
              <li 
                className="hover:text-[#EA5529] cursor-pointer"
                onClick={() => navigate("/creeruser")}
              >
                Consulter les comptes
              </li>
              <li 
                className="hover:text-[#EA5529] cursor-pointer"
                onClick={() => navigate("/alerts")}
              >
                Alertes
              </li>
            </>
          )}
        </ul>

        {/* Role-based Button */}
        {role === "manager" && (
          <button className="bg-[#EA5529] text-white px-4 py-2 rounded-lg hover:bg-[#d1441f] transition">
            Consulter Mes puits
          </button>
        )}
        {role === "guest" && (
          <button className="bg-[#EA5529] text-white px-4 py-2 rounded-lg hover:bg-[#d1441f] transition">
            Se connecter
          </button>
        )}
        {role === "agent" && (
          <button
            onClick={() => navigate("/file")}
            className="bg-[#EA5529] text-white px-4 py-2 rounded-lg hover:bg-[#d1441f] transition"
          >
            Insérer fichier journalier
          </button>
        )}
        {role === "admin" && (
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