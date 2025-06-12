
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";


const LancerPuit = () => {
  const [dateDebut, setDateDebut] = useState("");
  const navigate = useNavigate();
  const userid = localStorage.getItem('user_id');
   
   const role = localStorage.getItem("role");

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      console.log(token)
      try {
        const response = await fetch(`http://127.0.0.1:8000/auth/verify_token/${token}`);

        if (!response.ok) {
          throw new Error('Token verification failed');
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    verifyToken();
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dateDebut) {
      navigate("/info-puit", { state: { dateDebut } });
    } else {
      alert("Veuillez sélectionner une date !");
    }
  };
  return (
    <>
      <Navbar role={role} userid={userid} />

      <div className="flex h-screen overflow-hidden">
        <div className="w-1/2 bg-[#f9f9f9] flex items-center justify-center px-[80px]">
          <div className="w-full max-w-[400px]">
            <h1 className="text-[48px] font-bold leading-[56px] text-[#EA5529]">
              Lancer un <br /> Puit
            </h1>

            <p className="text-[16px] text-gray-600 mt-6 mb-10 leading-[24px]">
              For marketplace sellers looking to grow their business, metaverse offers the best platform.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <img src="/date.png" alt="date icon" className="w-5 h-5" />
                  <label htmlFor="dateDebut" className="text-[16px] font-medium text-gray-800">
                    Date début
                  </label>
                </div>

                <input
                  type="date"
                  id="dateDebut"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  className="w-full h-[52px] text-[16px] px-4 border-2 border-[#EA5529] rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA5529]"
                  required
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="w-[150px] h-[52px] bg-[#EA5529] hover:bg-[#EA5529] text-white text-[16px] font-semibold rounded-md transition"
                >
                  Suivant
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="w-1/2 h-full">
          <img
            src="/lancerp.png"
            alt="Site industriel"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default LancerPuit;