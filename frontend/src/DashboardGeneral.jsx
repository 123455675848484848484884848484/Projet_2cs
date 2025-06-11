import React, { useState } from 'react';
import Navbar from "./components/navbar"; 

const DashboardGeneral = () => {
  const [selectedPuits, setSelectedPuits] = useState(null);

  // Données mockées pour test 
  const puitsData = [
    { 
      id: 1, 
      nom: 'Saïd Hamdine', 
      coutPourcentage: 30, 
      delaiPourcentage: 30, 
      hasIncident: false,
      details: {
        localisation: 'Zone A-1',
        profondeur: '2500m',
        dateDebut: '15/03/2024',
        coutPrevu: '500,000 DA',
        coutActuel: '150,000 DA',
        delaiPrevu: '45 jours',
        delaiEcoule: '13 jours',
        statut: 'En cours'
      }
    },
    { 
      id: 2, 
      nom: 'Saïd Hamdine', 
      coutPourcentage: 50, 
      delaiPourcentage: 50, 
      hasIncident: false,
      details: {
        localisation: 'Zone B-2',
        profondeur: '3200m',
        dateDebut: '20/02/2024',
        coutPrevu: '750,000 DA',
        coutActuel: '375,000 DA',
        delaiPrevu: '60 jours',
        delaiEcoule: '30 jours',
        statut: 'En cours'
      }
    },
    { 
      id: 3, 
      nom: 'Saïd Hamdine', 
      coutPourcentage: 80, 
      delaiPourcentage: 80, 
      hasIncident: true,
      details: {
        localisation: 'Zone C-3',
        profondeur: '2800m',
        dateDebut: '10/01/2024',
        coutPrevu: '600,000 DA',
        coutActuel: '480,000 DA',
        delaiPrevu: '50 jours',
        delaiEcoule: '40 jours',
        statut: 'Incident signalé',
        incidents: ['Problème de forage', 'Retard équipement']
      }
    },
    { 
      id: 4, 
      nom: 'Saïd Hamdine', 
      coutPourcentage: 90, 
      delaiPourcentage: 90, 
      hasIncident: false,
      details: {
        localisation: 'Zone D-4',
        profondeur: '4000m',
        dateDebut: '05/12/2023',
        coutPrevu: '800,000 DA',
        coutActuel: '720,000 DA',
        delaiPrevu: '70 jours',
        delaiEcoule: '63 jours',
        statut: 'Presque terminé'
      }
    }
  ];

  const handlePuitsClick = (puits) => {
    setSelectedPuits(puits);
  };

  const closeModal = () => {
    setSelectedPuits(null);
  };

  const ChartSection = ({ title, data, type }) => (
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
        
        <div className="flex flex-col items-end">
          <div className="flex items-center mb-2">
            <span className="text-gray-600 mr-2">Alertes</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="w-48 h-3 bg-red-500 rounded"></div>
            <div className="w-32 h-3 bg-[#EA5529] rounded"></div>
          </div>
        </div>

        {/* Modal d'informations du puits */}
        {selectedPuits && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-lg w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Détails du Puits: {selectedPuits.nom}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
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
                      {selectedPuits.details.statut}
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
                    <div className="w-full bg-gray-200 rounded-full h-2 ml-2 inline-block" style={{width: '60%'}}>
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${selectedPuits.coutPourcentage}%`}}
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
                    <div className="w-full bg-gray-200 rounded-full h-2 ml-2 inline-block" style={{width: '60%'}}>
                      <div 
                        className="bg-[#EA5529] h-2 rounded-full" 
                        style={{width: `${selectedPuits.delaiPourcentage}%`}}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-semibold">{selectedPuits.delaiPourcentage}%</span>
                  </div>
                </div>

                {selectedPuits.hasIncident && selectedPuits.details.incidents && (
                  <div className="border-t pt-3">
                    <h4 className="font-semibold text-red-600 mb-2">Incidents signalés</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {selectedPuits.details.incidents.map((incident, index) => (
                        <li key={index}>{incident}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Grille de fond */}
        <div className="absolute inset-0 pointer-events-none ml-10">
          {[30, 50, 80, 90].map((value) => (
            <div
              key={value}
              className="absolute w-full border-t border-gray-300"
              style={{ bottom: `${(value / 100) * 250}px` }}
            >
              <span className="absolute -left-10 -top-2 text-sm text-gray-500">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Graphique à barres */}
        <div className="flex items-end justify-between h-64 pt-4 ml-10 mr-16">
          {data.map((puits, index) => (
            <div key={puits.id} className="flex flex-col items-center">
              <div
                className={`w-12 rounded-t cursor-pointer ${
                  puits.hasIncident ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
                style={{
                  height: `${(puits[type] / 100) * 250}px`,
                  minHeight: '15px'
                }}
                onClick={() => handlePuitsClick(puits)}
                title={`Cliquez pour voir les détails de ${puits.nom}`}
              ></div>
              <div className="mt-3 text-xs text-gray-600 text-center leading-tight w-16">
                {puits.nom}
              </div>
            </div>
          ))}
        </div>

        {/* Label Puits */}
        <div className="flex justify-end mt-4">
          <span className="text-[#EA5529] font-semibold text-lg">Puits</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
    <Navbar role="manager" />
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Coût */}
        <ChartSection 
          title="Coût" 
          data={puitsData} 
          type="coutPourcentage"
        />

        {/* Section Délai */}
        <ChartSection 
          title="Délai" 
          data={puitsData} 
          type="delaiPourcentage"
        />

        {/* Légende */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Légende</h3>
          <div className="flex space-x-8">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Puits sans incident</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Puits avec incidents signalés</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DashboardGeneral;