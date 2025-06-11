import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "./components/navbar";
import { useParams } from "react-router-dom";

const ConsulterPrevisionOperation = () => {
  const [operations, setOperations] = useState([]);
  const location = useLocation();
  const { id } = useParams();
  useEffect(() => {
    const fetchPrevisions = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/previsions/prevision_operations/${id}`);
        const data = await response.json();
        setOperations(data);
      } catch (error) {
        console.error("Erreur lors du chargement des prévisions d'opérations :", error);
      }
    };

    fetchPrevisions();
  }, [id]);

  return (
    <>
      <Navbar role="manager" />
      <div className="min-h-screen bg-[#f9f9f9] px-28 pt-12 pb-20">
        <h1 className="text-[54px] font-bold text-[#EA5529] leading-[60px] mb-12">
          Prévisions des opérations
        </h1>

        <div className="flex items-start gap-16">
          <div className="flex flex-col items-start gap-6">
            <Link to={`/afficherphase/${id}`} className="flex items-center gap-4">

              <div className={`w-16 h-16 rounded-sm flex items-center justify-center text-2xl font-bold border-2 ${location.pathname === `/afficherphase/${id}`
                  ? "bg-gray-200 border-[#EA5529] text-black"
                  : "bg-gray-100 text-gray-400 border-gray-300"
                }`}>
                1
              </div>
              <span className={`font-semibold text-2xl ${location.pathname === "/afficherphase"
                  ? "text-[#EA5529]"
                  : "text-gray-400"
                }`}>
                Phases
              </span>
            </Link>

            <div className="h-[60px] w-[2px] bg-[#EA5529] ml-8" />

            <Link to={`/afficheroperations/${id}`} className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-sm flex items-center justify-center text-2xl font-bold border-2 ${location.pathname === `/afficheroperations/${id}`
                  ? "bg-gray-200 border-[#EA5529] text-black"
                  : "bg-gray-100 text-gray-400 border-gray-300"
                }`}>
                2
              </div>
              <span className={`font-semibold text-2xl ${location.pathname === `/afficheroperations/${id}`
                  ? "text-[#EA5529]"
                  : "text-gray-400"
                }`}>
                Opérations
              </span>
            </Link>
          </div>

          <div className="flex-1">
            <div className="bg-[#f3f8fa] rounded-md shadow-md overflow-hidden">
              <table className="w-full text-left text-[16px]">
                <thead className="bg-white">
                  <tr className="text-gray-800">
                    <th className="p-4 font-semibold">Opération</th>
                    <th className="p-4 font-semibold">Coût prévu (DA)</th>
                    <th className="p-4 font-semibold">Délai (jours)</th>
                  </tr>
                </thead>
                <tbody>
                  {operations.map((op, index) => (
                    <tr key={index} className="border-t border-gray-300">
                      <td className="p-4">{op.nom_operation}</td>
                      <td className="p-4">{op.cout_prevu}</td>
                      <td className="p-4">{op.delais}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsulterPrevisionOperation;