import React, { useState, useEffect } from 'react';
import Navbar from "./components/navbar";
import { useParams } from 'react-router-dom';

const DashboardGeneral = () => {
  const [puitsData, setPuitsData] = useState([]);
  const [selectedPuits, setSelectedPuits] = useState(null);
  const { id } = useParams();
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetch(`http://localhost:8000/globaldash/${id}/details`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        return response.json();
      })
      .then((data) => {
        const transformed = data.map((projet) => ({
          id: projet.id,
          nom: projet.nom,
          coutPourcentage: calculPourcentage(projet.coutActuel, projet.coutPrevu),
          delaiPourcentage: calculPourcentage(projet.delaiEcoule, projet.delaiPrevu),
          hasIncident: projet.hasIncident,
          details: {
            localisation: projet.localisation,
            profondeur: projet.profondeur || "---",
            dateDebut: projet.dateDebut,
            coutPrevu: projet.coutPrevu,
            coutActuel: projet.coutActuel,
            delaiPrevu: projet.delaiPrevu,
            delaiEcoule: projet.delaiEcoule,
            statut: projet.closed ? "Terminé" : "En cours"
          }
        }));
        setPuitsData(transformed);
      })
      .catch((error) => {
        console.error("Erreur lors du fetch :", error);
      });
  }, []);

  function extractNumber(val) {
    if (!val) return 0;
    return parseFloat(val.toString().replace(/[^\d.]/g, ""));
  }

  function calculPourcentage(actuel, prevu) {
    const actuelNum = extractNumber(actuel);
    const prevuNum = extractNumber(prevu);
    if (!prevuNum || prevuNum === 0) return 0;
    return Math.round((actuelNum / prevuNum) * 100);
  }

  const ChartSection = ({ title, data, type }) => {
    const [selectedPuits, setSelectedPuits] = useState(null);

    const handlePuitsClick = (puits) => setSelectedPuits(puits);
    const closeModal = () => setSelectedPuits(null);

    const maxPourcentage = Math.max(...data.map(p => p[type] || 0), 0);
    const displayCeiling = [5, 10, 20, 30, 50, 75, 100, 150, 200].find(v => v > maxPourcentage) || 100;
    const barMaxHeight = 256;
    const step = displayCeiling <= 10 ? 2 : displayCeiling <= 30 ? 5 : displayCeiling <= 75 ? 10 : 20;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
            <div className="flex items-center text-[#EA5529]">
              <span className="text-2xl font-bold mr-2">%</span>
              <div className="text-sm">
                <div className="font-semibold">Pourcentage par</div>
                <div>rapport au coût total</div>
                <div>prévisionnel</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center mb-2">
              <span className="text-gray-600 font-semibold mr-1">Légende</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>

            <div className="flex flex-col space-y-1 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-4 bg-red-500 rounded"></div>
                <span>Présence d'incidents</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-4 bg-green-500 rounded"></div>
                <span>Aucun incident</span>
              </div>
            </div>
          </div>
        </div>

        {/* Graphe */}
        <div className="relative">
          {/* Grille */}
          <div className="absolute inset-0 pointer-events-none ml-10 h-64">
            {Array.from({ length: Math.floor(displayCeiling / step) + 1 }, (_, i) => {
              const value = i * step;
              return (
                <div
                  key={value}
                  className="absolute w-full border-t border-gray-300"
                  style={{ bottom: `${(value / displayCeiling) * barMaxHeight}px` }}
                >
                  <span className="absolute -left-12 -top-2 text-sm text-gray-500">
                    {value}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Barres */}
          <div className="flex flex-wrap gap-10 items-end h-64 pt-4 ml-10 mr-10 relative">
            {data.map((puits) => (
              <div key={puits.id} className="flex flex-col items-center justify-end h-full">
                <div
                  className={`w-12 rounded-t cursor-pointer ${puits.hasIncident ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                  style={{
                    height: `${(puits[type] / displayCeiling) * barMaxHeight}px`,
                  }}
                  onClick={() => handlePuitsClick(puits)}
                  title={`Cliquez pour voir les détails de ${puits.nom}`}
                ></div>
              </div>
            ))}
          </div>

          {/* Titres */}
          <div className="flex flex-wrap gap-10 ml-10 mr-10 mt-2">
            {data.map((puits) => (
              <div key={puits.id} className="w-12 text-xs text-gray-600 text-center">
                {puits.nom}
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {selectedPuits && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-lg w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Détails du Puits: {selectedPuits.nom}
                </h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">×</button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-gray-600">Localisation:</span>
                    <p className="text-gray-800">{selectedPuits.details.localisation}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Profondeur:</span>
                    <p className="text-gray-800">{selectedPuits.details.profondeur}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-gray-600">Date début:</span>
                    <p className="text-gray-800">{selectedPuits.details.dateDebut}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Statut:</span>
                    <p className={`font-semibold ${selectedPuits.hasIncident ? 'text-red-600' : 'text-green-600'}`}>
                      En cours
                    </p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <h4 className="font-semibold text-gray-700 mb-2">Coût</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Prévu:</span>
                      <p className="font-semibold">{selectedPuits.details.coutPrevu}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Actuel:</span>
                      <p className="font-semibold">{selectedPuits.details.coutActuel}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-600">Progression:</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 ml-2 inline-block">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${selectedPuits.coutPourcentage}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-semibold">{selectedPuits.coutPourcentage}%</span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <h4 className="font-semibold text-gray-700 mb-2">Délai</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Prévu:</span>
                      <p className="font-semibold">{selectedPuits.details.delaiPrevu}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Écoulé:</span>
                      <p className="font-semibold">{selectedPuits.details.delaiEcoule}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-600">Progression:</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 ml-2 inline-block">
                      <div
                        className="bg-[#EA5529] h-2 rounded-full"
                        style={{ width: `${selectedPuits.delaiPourcentage}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-semibold">{selectedPuits.delaiPourcentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar role={role} userid={userId} />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <ChartSection title="Coût" data={puitsData} type="coutPourcentage" />
          <ChartSection title="Délai" data={puitsData} type="delaiPourcentage" />
        </div>
      </div>
    </>
  );
};

export default DashboardGeneral;
