import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar"; 


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
        setError('Email and password are required');
        return false;
    }
    setError(''); 
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
  
    const formDetails = new URLSearchParams();
    formDetails.append('username', email);
    formDetails.append('password', password);
  
    try {
      const response = await fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDetails,
      });
  
      setLoading(false);
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('role', data.role);
        const userid = localStorage.getItem('user_id');
        const role = localStorage.getItem('role');
        console.log(data.user_id);
        console.log(data.role);
        navigate('/manager');
      } else {
        const errorData = await response.json();
        // Si errorData est un objet, on le convertit en une chaîne de caractères
        const errorMessage = typeof errorData === 'object' 
          ? JSON.stringify(errorData) // Convertir en chaîne si c'est un objet
          : errorData.detail || 'Authentication failed!';
        setError(errorMessage);
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred. Please try again later.');
    }
  };
  
  return (
    <>
    
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-[900px] overflow-hidden shadow-md rounded-[30px] bg-white">
        {/* Left image */}
        <div className="w-1/2">
          <img
            src="/login.png"
            alt="worker"
            className="h-full w-full object-cover"
            id="login-image"
          />
        </div>
  
        {/* Form */}
        <div className="w-1/2 flex flex-col justify-center px-10 py-12">
          <h2 className="text-2xl font-bold text-[#EA5529] mb-8 text-center">
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
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA5529]"
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">
                  {error}
                </p>
              )}
            </div>
  
            {/* Password */}
            <div className="relative">
              <label htmlFor="password-input" className="sr-only">Mot de passe</label>
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA5529]"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
  
            {/* Forgot password */}
            <div className="text-right text-sm text-gray-500">
              <a href="#" className="hover:underline">Mot de passe oublié?</a>
            </div>
  
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#EA5529] hover:bg-[#EA5529] text-white font-medium py-3 rounded-md transition"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
