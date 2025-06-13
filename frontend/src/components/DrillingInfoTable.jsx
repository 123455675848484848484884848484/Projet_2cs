import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export function DrillingInfoTable({ phase, depth, cost }) {
  const tableStyle = {
    borderCollapse: "collapse",
    width: "85%", // légèrement augmenté
    border: "1px solid black",
    fontSize: "1.3rem", // légèrement agrandi
    backgroundColor: "#f9f9f9",
  };

  const cellStyle = {
    border: "1px solid black",
    padding: "15px",
    textAlign: "center",
  };

  const headerCellStyle = { ...cellStyle, backgroundColor: "#f2f2f2", fontWeight: "bold" };
  const leftColumnStyle = { ...cellStyle, backgroundColor: "#f2f2f2", fontWeight: "bold", width: "33%" };

  const money = (val) =>
    val != null ? `${val.toLocaleString("fr-DZ", { maximumFractionDigits: 0 })} DZD` : "---";

  return (
    <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <table style={tableStyle}>
        <tbody>
          <tr>
            <td style={leftColumnStyle} rowSpan="4">Forage en&nbsp;cours</td>
            <td style={headerCellStyle} colSpan="2">Opération</td>
          </tr>
          <tr>
            <td style={cellStyle}>Phase</td>
            <td style={cellStyle}>{phase || "---"}</td>
          </tr>
          <tr>
            <td style={cellStyle}>Profondeur</td>
            <td style={cellStyle}>{depth != null ? `${depth} m` : "---"}</td>
          </tr>
          <tr>
            <td style={cellStyle}>Coût</td>
            <td style={cellStyle}>{money(cost)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
