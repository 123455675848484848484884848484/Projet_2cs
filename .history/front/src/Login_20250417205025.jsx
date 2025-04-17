// Login.jsx
import React, { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl overflow-hidden shadow-md flex w-[900px]">
        {/* Image à gauche */}
        <div className="w-1/2">
          <img
            src="/login.png"
            alt="worker"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Formulaire à droite */}
        <div className="w-1/2 flex flex-col justify-center px-10 py-12">
          <h2 className="text-2xl font-bold text-orange-500 mb-8 text-center">
            Connectez-vous
          </h2>

          <form className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              defaultValue="Kr_guefaifia@esi.dz"
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                defaultValue="password"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <div className="text-right text-sm text-gray-500">
              <a href="#" className="hover:underline">
                Mot de passe oublié?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-md transition"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;