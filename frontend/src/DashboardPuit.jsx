import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import Navbar from "./components/navbar"; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPuit = () => {
  const [puit, setPuit] = useState({ nom: "", adresse: "" });
  const [delais, setDelais] = useState({ planned: "", expected: "", remaining: "" });
  const [couts, setCouts] = useState({ planned: 0, expected: 0, remaining: 0 });
  const [graphDelais, setGraphDelais] = useState({ prevision: [], reel: [] });
  const [graphCouts, setGraphCouts] = useState({ prevision: [], reel: [] });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/projets/107/dates")
      .then((res) => res.json())
      .then((data) => {
        setPuit({ nom: data.projet, adresse: data.adresse });
        setDelais({
          planned: data.date_prevue,
          expected: data.date_estimee,
          remaining: data.jours_restants,
        });
        setCouts({
          planned: data.cout_previsionnel,
          expected: data.cout_reel,
          remaining: data.montant_restant,
        });
      })
      .catch((err) => console.error("Erreur récupération infos projet :", err));

    fetch("http://127.0.0.1:8000/projets/107/prof_cout")
      .then((res) => res.json())
      .then((data) => {
        setGraphCouts((prev) => ({
          ...prev,
          prevision: data.map((item) => ({
            jour: item.profondeur,
            valeur: item.cout_cumule,
          })),
        }));
      })
      .catch((err) => console.error("Erreur récupération coûts :", err));

    fetch("http://127.0.0.1:8000/projets/107/prof_cout_realite")
      .then((res) => res.json())
      .then((data) => {
        setGraphCouts((real) => ({
          ...real,
          reel: data.map((item) => ({
            jour: item.profondeur,
            valeur: item.cout,
          })),
        }));
      })
      .catch((err) => console.error("Erreur récupération coûts réels :", err));

    fetch("http://127.0.0.1:8000/projets/107/prof_date_realite")
      .then((res) => res.json())
      .then((data) => {
        setGraphDelais((real) => ({
          ...real,
          reel: data.map((item) => ({
            jour: item.date,
            valeur: item.profondeur,
            incident: item.incident,
          })),
        }));
      })
      .catch((err) => console.error("Erreur récupération délais réels :", err));

    fetch("http://127.0.0.1:8000/projets/107/prof_date")
      .then((res) => res.json())
      .then((data) => {
        setGraphDelais((prev) => ({
          ...prev,
          prevision: data.map((item) => ({
            jour: item.date,
            valeur: item.profondeur,
          })),
        }));
      })
      .catch((err) => console.error("Erreur récupération prévisions délais :", err));
  }, []);

  const makeOptions = (titleY, titleX, titleChart, isDate = false) => ({
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: titleChart },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: titleY,
          color: "orangered",
          font: { size: 14 },
        },
      },
      x: {
        title: {
          display: true,
          text: titleX,
          color: "orangered",
          font: { size: 14 },
        },
        ticks: {
          callback: function (value, index, ticks) {
            const label = this.getLabelForValue(value);
            if (!isDate) return label;
            const date = new Date(label);
            return isNaN(date.getTime())
              ? label
              : date.toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
          },
        },
      },
    },
  });

  const makeChartData = (prevision, reel, useDates = false) => {
    const allX = [...new Set([...prevision.map((p) => p.jour), ...reel.map((r) => r.jour)])];
    const sortedX = allX.sort((a, b) =>
      useDates ? new Date(a) - new Date(b) : a - b
    );

    return {
      labels: sortedX,
      datasets: [
        {
          label: "Prévisionnel",
          data: prevision.map((p) => ({
            x: p.jour,
            y: p.valeur,
          })),
          borderColor: "green",
          backgroundColor: "green",
          borderWidth: 4,
          tension: 0.3,
          pointRadius: 0,
          fill: false,
        },
        {
          label: "Réalisé",
          data: reel.map((r) => ({ x: r.jour, y: r.valeur })),
          borderColor: "orange",
          backgroundColor: "orange",
          borderWidth: 3,
          tension: 0.3,
          pointBorderColor: reel.map((r) => (r.incident ? "red" : "orange")),
          pointRadius: reel.map((r) => (r.incident ? 8 : 0)),
          pointBackgroundColor: reel.map((r) => (r.incident ? "red" : "orange")),
          fill: false,
        },
        {
          label: "Incident",
          borderColor: "red",
          backgroundColor: "red",
          borderWidth: 3,
          tension: 0.3,
          fill: false,
        },
      ],
    };
  };

  return (
    <>
      <Navbar role="manager" />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-[#EA5529]">{puit.nom}</h1>
        <p className="text-gray-700 mb-4">{puit.adresse}</p>

        <div className="flex justify-center gap-20 mb-8">
          <button className="bg-[#EA5529] text-white px-4 py-2 rounded">
            Consulter les fichiers journaliers
          </button>
          <button className="bg-[#EA5529] text-white px-4 py-2 rounded">
            Consulter les prévisions
          </button>
        </div>

        {/* DÉLAIS */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#EA5529]">
            Visualisation <br />
            <span className="text-green-900">des délais</span>
          </h2>
          <div className="bg-white border p-4 rounded mt-4 shadow">
            <div className="flex flex-col items-end mb-4">
              <div className="border border-[#EA5529] rounded-md p-4 mb-2 w-fit text-sm text-gray-800">
                <p><strong>Date prévue :</strong> {delais.planned}</p>
                <p><strong>Date estimée :</strong> {delais.expected}</p>
              </div>
              {delais.expected !== delais.planned && (
                <p className="text-red-600 text-sm font-semibold mb-2">
                  Le projet est en retard
                </p>
              )}
              <div className="border border-[#EA5529] text-green-900 px-3 py-1 rounded text-sm font-semibold w-fit">
                Jours restants : {delais.remaining}
              </div>
            </div>
            <Line
              options={makeOptions("Profondeur (pieds)", "Date", "Progression (Profondeur en pieds) par rapport au temps", true)}
              data={makeChartData(graphDelais.prevision, graphDelais.reel, true)}
            />
          </div>
        </section>

        {/* COÛTS */}
        <section>
          <h2 className="text-3xl font-bold text-[#EA5529]">
            Visualisation <br />
            <span className="text-green-900">des coûts</span>
          </h2>
          <div className="bg-white border p-4 rounded mt-4 shadow">
            <div className="flex flex-col items-end mb-4">
              <div className="border border-[#EA5529] rounded-md p-4 mb-2 w-fit text-sm text-gray-800">
                <p><strong>Coût prévu :</strong> {couts.planned.toLocaleString()} DA</p>
                <p><strong>Coût estimé :</strong> {couts.expected.toLocaleString()} DA</p>
              </div>
              {couts.expected > couts.planned && (
                <p className="text-red-600 text-sm font-semibold mb-2">
                  Le dépassement est de {(couts.expected - couts.planned).toLocaleString()} DA
                </p>
              )}
              <div className="border border-[#EA5529] text-green-900 px-3 py-1 rounded text-sm font-semibold w-fit">
                Montant restant : {couts.remaining.toLocaleString()} DA
              </div>
            </div>
            <Line
              options={makeOptions("Coût cumulé (DA)", "Profondeur (pieds)", "Coûts du projet (DA) par rapport à la profondeur (pieds)", false)}
              data={makeChartData(graphCouts.prevision, graphCouts.reel, false)}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default DashboardPuit;
