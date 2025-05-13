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
    fetch("/api/puit/1")
      .then((res) => res.json())
      .then((data) => {
        setPuit({ nom: data.nom, adresse: data.adresse });
        setDelais({
          planned: data.date_planned,
          expected: data.date_expected,
          remaining: data.remaining_days,
        });
        setCouts({
          planned: data.cost_planned,
          expected: data.cost_expected,
          remaining: data.remaining_money,
        });
        setGraphDelais({
          prevision: data.graphDelaisPrevision,
          reel: data.graphDelaisReel,
        });
        setGraphCouts({
          prevision: data.graphCoutsPrevision,
          reel: data.graphCoutsReel,
        });
      })
      .catch((err) => console.error("Erreur de récupération des données :", err));
  }, []);

  const makeOptions = (titleY, titleChart) => ({
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: titleChart,
      },
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
          text: "Temps (jours)",
          color: "orangered",
          font: { size: 14 },
        },
      },
    },
  });

  const makeChartData = (prevision, reel) => ({
    labels: prevision.map((p) => p.jour),
    datasets: [
      {
        label: "Prévision",
        data: prevision.map((p) => p.valeur),
        borderColor: "green",
        backgroundColor: "green",
        borderWidth: 4,
        tension: 0.3,
        pointRadius: 0,
        fill: false,
      },
      {
        label: "Réalité",
        data: reel.map((p) => p.valeur),
        borderColor: "orange",
        backgroundColor: "orange",
        borderWidth: 3,
        tension: 0.3,
        pointRadius: 3,
        fill: false,
      },
      {
        label: "Incident",
        data: reel.map((p, i, arr) =>
          i === 0 ? null : p.valeur <= arr[i - 1].valeur ? p.valeur : null
        ),
        borderColor: "red",
        backgroundColor: "red",
        borderWidth: 5,
        tension: 0.3,
        pointRadius: 4,
        fill: false,
      },
    ],
  });

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-orange-600">{puit.nom}</h1>
      <p className="text-gray-700 mb-4">{puit.adresse}</p>

      <div className="flex justify-center gap-20 mb-8">
        <button className="bg-orange-500 text-white px-4 py-2 rounded">
          Consulter les fichiers journaliers
        </button>
        <button className="bg-orange-500 text-white px-4 py-2 rounded">
          Consulter les prévisions
        </button>
      </div>

      {/* SECTION DÉLAIS */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-orange-600">
          Visualisation <br />
          <span className="text-green-900">des délais</span>
        </h2>
        <div className="bg-white border p-4 rounded mt-4 shadow">
          <div className="flex flex-col items-end mb-4">
            <div className="border border-orange-500 rounded-md p-4 mb-2 w-fit text-sm text-gray-800">
              <p><strong>Date prévue :</strong> {delais.planned}</p>
              <p><strong>Date estimée :</strong> {delais.expected}</p>
            </div>
            <p className="text-red-600 text-sm font-semibold mb-2">
              Le projet est en retard de 1 mois et 1 jour
            </p>
            <div className="border border-orange-500 text-green-900 px-3 py-1 rounded text-sm font-semibold w-fit">
              Jours restants : {delais.remaining}
            </div>
          </div>
          <Line
            options={makeOptions("Profondeur (pieds)", "Progression (Profondeur en pieds) par rapport au temps")}
            data={makeChartData(graphDelais.prevision, graphDelais.reel)}
          />
        </div>
      </section>

      {/* SECTION COÛTS */}
      <section>
        <h2 className="text-3xl font-bold text-orange-600">
          Visualisation <br />
          <span className="text-green-900">des coûts</span>
        </h2>
        <div className="bg-white border p-4 rounded mt-4 shadow">
          <div className="flex flex-col items-end mb-4">
            <div className="border border-orange-500 rounded-md p-4 mb-2 w-fit text-sm text-gray-800">
              <p><strong>Coût prévu :</strong> {couts.planned.toLocaleString()} DA</p>
              <p><strong>Coût estimé :</strong> {couts.expected.toLocaleString()} DA</p>
            </div>
            <p className="text-red-600 text-sm font-semibold mb-2">
              Le dépassement est de {(couts.expected - couts.planned).toLocaleString()} DA
            </p>
            <div className="border border-orange-500 text-green-900 px-3 py-1 rounded text-sm font-semibold w-fit">
              Montant restant : {couts.remaining.toLocaleString()} DA
            </div>
          </div>
          <Line
            options={makeOptions("Coût (DA)", "Coûts du projet (DA) par rapport au temps")}
            data={makeChartData(graphCouts.prevision, graphCouts.reel)}
          />
        </div>
      </section>
    </div>
  );
};

export default DashboardPuit;