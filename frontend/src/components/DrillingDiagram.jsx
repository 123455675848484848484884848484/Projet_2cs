import React from "react";

export function DrillingDiagram({ phase }) {
  // 1. Convertit le nom de la phase en index de progression (1 à 4)
  const linesToColor = (value) => {
    if (!value) return 0;

    const n = Number(
      typeof value === "string"
        ? value.replace(/phase\s*/i, "").trim().split(" ")[0]
        : value
    );

    if (n >= 1 && n <= 4) return n;

    if (value.includes?.("26'")) return 1;
    if (value.includes?.("16'")) return 2;
    if (value.includes?.("12'1/4'")) return 3;
    if (value.includes?.("8'1/2'")) return 4;

    return 0;
  };

  const count = linesToColor(phase); // 0 à 4
  const ORANGE = "#EA5529"; // terminé
  const GREEN = "#166534";  // en cours (vert foncé)

  const groups = [
    { ids: ["26L", "26R"] }, // index 0
    { ids: ["20L", "20R"] }, // index 1
    { ids: ["13L", "13R"] }, // index 2
    { ids: ["9"] },          // index 3 (centre)
  ];

  const colorForGroup = (gIdx) => {
    if (gIdx < count - 1) return ORANGE;
    if (gIdx === count - 1) return GREEN;
    return "white";
  };

  const getColorForSection = (id) => {
    const gIdx = groups.findIndex((g) => g.ids.includes(id));
    return colorForGroup(gIdx);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        width="60%"
        height="60%"
        viewBox="0 0 300 500"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 26" */}
        <rect
          x="50"
          y="50"
          width="20"
          height="80"
          fill={getColorForSection("26L")}
          stroke="black"
        />
        <rect
          x="180"
          y="50"
          width="20"
          height="80"
          fill={getColorForSection("26R")}
          stroke="black"
        />

        {/* 20" */}
        <rect
          x="70"
          y="50"
          width="20"
          height="150"
          fill={getColorForSection("20L")}
          stroke="black"
        />
        <rect
          x="160"
          y="50"
          width="20"
          height="150"
          fill={getColorForSection("20R")}
          stroke="black"
        />

        {/* 13" */}
        <rect
          x="90"
          y="50"
          width="20"
          height="250"
          fill={getColorForSection("13L")}
          stroke="black"
        />
        <rect
          x="140"
          y="50"
          width="20"
          height="250"
          fill={getColorForSection("13R")}
          stroke="black"
        />

        {/* 9" */}
        <rect
          x="110"
          y="50"
          width="30"
          height="350"
          fill={getColorForSection("9")}
          stroke="black"
        />

        {/* Légendes */}
        <text x="10" y="90" fontSize="14" fontWeight="bold">26'</text>
        <text x="10" y="180" fontSize="14" fontWeight="bold">16'</text>
        <text x="10" y="250" fontSize="14" fontWeight="bold">12'1/4'</text>
        <text x="10" y="320" fontSize="14" fontWeight="bold">8'1/2'</text>
      </svg>
    </div>
  );
}
