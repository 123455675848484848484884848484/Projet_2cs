import React, { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("Kr_guefaifia@esi.dz");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("L'adresse email doit contenir un '@'");
      return;
    }
    setError("");
    alert("Connexion réussie !");
  };

  return (
    <div className="h-screen w-screen flex bg-gray-100">
      {/* Image à gauche */}
      <div className="w-1/2 h-full">
        <img
          src="/login.png"
          alt="worker"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Formulaire arrondi */}
      <div className="w-1/2 h-full flex items-center justify-center">
      <div className="bg-white rounded-l-[100px] -ml-10 shadow-2xl px-16 py-20 w-full max-w-xl">
                  <h2 className="text-3xl font-bold text-orange-500 mb-8 text-center">
            Connectez-vous
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                defaultValue="password"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              >
                {showPassword ? (
                  <span className="text-gray-500 text-lg">👁️</span>
                ) : (
                  <img
                    src="/icon.png"
                    alt="hidden"
                    className="w-5 h-5"
                  />
                )}
              </span>
            </div>

            {/* Mot de passe oublié */}
            <div className="text-right text-sm text-gray-500">
              <a href="#" className="hover:underline">
                Mot de passe oublié?
              </a>
            </div>

            {/* Bouton */}
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