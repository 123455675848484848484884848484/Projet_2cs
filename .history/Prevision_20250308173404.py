import pandas as pd

# Charger le fichier Excel
file_path = "Prevision_operations.xlsx"  # Remplace par le chemin correct de ton fichier
df = pd.read_excel(file_path)

# Identifier les colonnes pertinentes
operation_col = "OPERATIONS"
amount_col = "AMOUNT"
days_col = "Days"
activity_col = "Activité"

# Filtrer les lignes pour exclure la ligne "TOTAL"
df_filtered = df[~df[operation_col].astype(str).str.upper().str.contains("TOTAL", na=False)]

# Extraire l'activité (supposée être en une seule ligne)
activity = df_filtered[activity_col].dropna().iloc[0] if not df_filtered[activity_col].dropna().empty else "Unknown Activity"

# Construire la liste des opérations avec leurs coûts et jours prévisionnels
operations_list = [
    {"operation": row[operation_col], "cost": row[amount_col], "days": row[days_col]}
    for _, row in df_filtered.iterrows() if pd.notna(row[operation_col])
]

# Affichage des résultats
print(f"\n🔹 Activité : {activity}\n")
print("🔹 Liste des opérations :")
for op in operations_list:
    print(f"   ➤ {op['operation']} - {op['cost']:,} USD - {op['days']} jours")

# Retourner les résultats sous forme de variables exploitables
activity, operations_list