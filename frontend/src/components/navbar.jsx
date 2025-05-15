import React from "react";
import logo from './logo.png';

const Navbar = ({ role }) => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/20 shadow-md px-6 py-4 flex items-center justify-between">
      
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
          <button className="bg-[#EA5529] text-white px-4 py-2 rounded-lg hover:bg-[#d1441f] transition">
            Insérer fichier journalier
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
