// src/DrillingOverview.jsx
import React, { useEffect, useState } from "react";
import {DrillingDiagram }from "./components/DrillingDiagram";
import {DrillingInfoTable }from "./components/DrillingInfoTable";

export default function DrillingOverview({projetid}) {
  const [data, setData] = useState({
    phase: null,
    depth: null,
    cost: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abort = new AbortController();

    (async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/projets/dernieres_phases/${projetid}`, { signal: abort.signal });
        if (!res.ok) throw new Error(`Erreur ${res.status}`);

        const { phase, profondeur, cout_phase } = await res.json();

        setData({
          phase,
          depth: Number(profondeur),       // <- Decimal → number
          cost:  Number(cout_phase),       // <- Decimal → number
        });
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    })();

    return () => abort.abort();
  }, []);

  if (loading) return <p>Chargement…</p>;
  if (error)   return <p style={{ color: "red" }}>Erreur : {error}</p>;

  return (
  <div style={{ display: "flex", gap: "1rem", alignItems: "center", height: "100%" }}>
    <div style={{ flex: 1, minWidth: 0, marginTop: "70px" }}>
      <DrillingDiagram phase={data.phase} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <DrillingInfoTable
        phase={data.phase}
        depth={data.depth}
        cost={data.cost}
      />
    </div>
    
  </div>
);
}
