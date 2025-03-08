import pandas as pd

# Charger le fichier Excel
file_path = "Prevision_operations.xlsx"  # Remplace par ton chemin correct
df = pd.read_excel(file_path)

# Identifier les colonnes pertinentes
operation_col = "OPERATIONS"
amount_col = "AMOUNT"
days_col = "Days"
activity_col = "Activité"

# Nettoyer et convertir les montants en nombres
df[amount_col] = df[amount_col].astype(str).str.replace(",", "").str.replace(" ", "").str.strip()
df[amount_col] = pd.to_numeric(df[amount_col], errors="coerce")  # Convertir en float

# Filtrer les lignes pour exclure la ligne "TOTAL"
df_filtered = df[~df[operation_col].astype(str).str.upper().str.contains("TOTAL", na=False)]

# Extraire l'activité (première valeur non vide)
activity = df_filtered[activity_col].dropna().iloc[0] if not df_filtered[activity_col].dropna().empty else "Unknown Activity"

# Construire la liste des opérations avec leurs coûts et jours prévisionnels
operations_list = []
for _, row in df_filtered.iterrows():
    operation = row[operation_col]
    cost = row[amount_col] if pd.notna(row[amount_col]) else 0  # Remplacer NaN par 0
    days = row[days_col] if pd.notna(row[days_col]) else "--"  # Remplacer NaN par "--"

    # Ajouter l'opération formatée à la liste
    operations_list.append({
        "operation": operation,
        "cost": f"{int(cost):,}" if isinstance(cost, (int, float)) else "--",
        "days": days
    })

# Affichage des résultats
print(f"\n🔹 Activité : {activity}\n")
print("🔹 Liste des opérations :")
for op in operations_list:
    print(f"   ➤ {op['operation']} - {op['cost']} USD - {op['days']} jours")

# Retourner les résultats sous forme de variables exploitables
activity, operations_list