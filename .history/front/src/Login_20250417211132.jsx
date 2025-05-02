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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="flex w-[900px] overflow-hidden shadow-md rounded-[30px] bg-white">
      {/* Image gauche */}
      <div className="w-1/2">
        <img
          src="/login.png"
          alt="worker"
          className="h-full w-full object-cover"
          id="login-image"
        />
      </div>
  
      {/* Formulaire */}
      <div className="w-1/2 flex flex-col justify-center px-10 py-12">
        <h2
          className="text-2xl font-bold text-orange-500 mb-8 text-center"
          id="login-title"
        >
          Connectez-vous
        </h2>
  
        <form className="space-y-6" onSubmit={handleSubmit} id="login-form">
          {/* Email */}
          <div>
            <label htmlFor="email-input" className="sr-only">Email</label>
            <input
              id="email-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1" id="email-error">
                {error}
              </p>
            )}
          </div>
  
          {/* Mot de passe */}
          <div className="relative">
            <label htmlFor="password-input" className="sr-only">Mot de passe</label>
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              defaultValue="password"
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <span
              id="toggle-password-visibility"
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
                  id="hidden-icon"
                />
              )}
            </span>
          </div>
  
          {/* Lien oublié */}
          <div className="text-right text-sm text-gray-500">
            <a href="#" className="hover:underline" id="forgot-password-link">
              Mot de passe oublié?
            </a>
          </div>
  
          {/* Bouton */}
          <button
            id="submit-login-button"
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