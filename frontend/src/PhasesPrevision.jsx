import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";



const PhasesPrevision = () => {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const { cout } = location.state || {};
  const { delai } = location.state || {};
  const userId = localStorage.getItem("user_id");
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
        navigate('/');
      }
    };

    verifyToken();
  }, [navigate]);


  useEffect(() => {
    fetch("http://127.0.0.1:8000/phase")
      .then((response) => response.json())
      .then((data) => {
        const fetchedPhases = data.map((item) => ({
          id: item.id,
          nom: item.designation,
          cout: "",
          delai: "",
          profondeur: "",
        }));
        setPhases(fetchedPhases);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des phases:", error);
        alert("Une erreur s'est produite lors du chargement des phases. Veuillez réessayer.");
        setLoading(false);
      });
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedPhases = [...phases];
    updatedPhases[index][field] = value;
    setPhases(updatedPhases);
  };

  const handleValider = () => {


    const tousChampsRemplis = phases.every(
      (phase) => phase.cout && phase.delai && phase.profondeur
    );

    if (!tousChampsRemplis) {
      alert("Veuillez remplir tous les champs pour chaque phase.");
      return;
    }

    // Conversion + Somme
    const totalCout = phases.reduce((sum, p) => sum + parseFloat(p.cout || 0), 0);
    const totalDelai = phases.reduce((sum, p) => sum + parseInt(p.delai || 0), 0);

    // Vérification d'égalité stricte
    if (parseFloat(totalCout) !== parseFloat(cout)) {
      alert(`La somme des coûts (${totalCout}) doit être égale au coût total (${cout})`);
      return;
    }

    if (parseInt(totalDelai) !== parseInt(delai)) {
      alert(`La somme des délais (${totalDelai}) doit être égale au délai total (${delai})`);
      return;
    }

    for (let i = 1; i < phases.length; i++) {
      const prev = parseFloat(phases[i - 1].profondeur);
      const current = parseFloat(phases[i].profondeur);
      if (current <= prev) {
        alert(`La profondeur de la phase ${i + 1} (${current} m) doit être supérieure à celle de la phase ${i} (${prev} m).`);
        return;
      }
    }

    if (tousChampsRemplis) {
      const phasesToSend = phases.map((phase) => ({

        id_phase: phase.id,
        cout_prevu: parseFloat(phase.cout),
        delais: parseInt(phase.delai),
        profondeur: parseFloat(phase.profondeur)
      }));
      console.log(phasesToSend)
      fetch(`http://127.0.0.1:8000/previsions/phases/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(phasesToSend),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Réponse de l'API:", data);
          navigate("/operations", { state: { projetid: id, cout, delai } })
        })
        .catch((error) => {
          console.error("Erreur lors de l'envoi des données:", error);
          alert("Une erreur s'est produite lors de l'envoi des prévisions. Veuillez réessayer.");
        });
    } else {
      alert("Veuillez remplir tous les champs pour chaque phase.");
    }
  };





  return (
    <>
       <Navbar role={role} userid={userId} />

      <div className="min-h-screen bg-[#f9f9f9] px-28 pt-12 pb-20">
        <h1 className="text-[54px] font-bold text-[#EA5529] leading-[60px] mb-12">
          Vos prévisions
          

        </h1>

        <div className="flex items-start gap-16">
          <div className="flex flex-col items-start gap-6">
            <Link to="/phasepre" className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-sm flex items-center justify-center text-2xl font-bold border-2 ${location.pathname === "/phasepre"
                  ? "bg-gray-200 border-[#EA5529] text-black"
                  : "bg-gray-100 text-gray-400 border-gray-300"
                  }`}
              >
                1
              </div>
              <span
                className={`font-semibold text-2xl ${location.pathname === "/phasepre" ? "text-[#EA5529]" : "text-gray-400"
                  }`}
              >
                Phases
              </span>
            </Link>

            <div className="h-[60px] w-[2px] bg-[#EA5529] ml-8" />

            <Link to="/operations" className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-sm flex items-center justify-center text-2xl font-bold border-2 ${location.pathname === "/operations"
                  ? "bg-gray-200 border-[#EA5529] text-black"
                  : "bg-gray-100 text-gray-400 border-gray-300"
                  }`}
              >
                2
              </div>
              <span
                className={`font-semibold text-2xl ${location.pathname === "/operations" ? "text-[#EA5529]" : "text-gray-400"
                  }`}
              >
                Opérations
              </span>
            </Link>
          </div>

          <div className="flex-1">
            <div className="bg-[#f3f8fa] rounded-md shadow-md overflow-hidden">
              <table className="w-full text-left text-[16px]">
                <thead className="bg-white">
                  <tr className="text-gray-800">
                    <th className="p-4 font-semibold">Phase</th>
                    <th className="p-4 font-semibold">Coût prévu</th>
                    <th className="p-4 font-semibold">Délai</th>
                    <th className="p-4 font-semibold">Profondeur</th>
                  </tr>
                </thead>
                <tbody>
                  {phases.map((phase, index) => (
                    <tr key={index} className="border-t border-gray-300">
                      <td className="p-4">{phase.nom}</td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={phase.cout}
                          onChange={(e) => handleInputChange(index, "cout", e.target.value)}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-0"
                          placeholder="DA"
                          required
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={phase.delai}
                          onChange={(e) => handleInputChange(index, "delai", e.target.value)}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-0"
                          placeholder="jours"
                          required
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={phase.profondeur}
                          onChange={(e) => handleInputChange(index, "profondeur", e.target.value)}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-0"
                          placeholder="mètres"
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleValider}
                className="bg-[#EA5529] hover:bg-[#EA5529] text-white px-10 py-3 rounded-md font-semibold text-[16px]"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PhasesPrevision;
