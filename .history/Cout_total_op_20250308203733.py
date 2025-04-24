import pandas as pd

# Charger le fichier Excel
file_path = "1.xlsx"  # Remplace par le chemin correct
df_sheet2 = pd.read_excel(file_path, sheet_name=1)  # Charger la 2ème feuille

# Identifier les lignes contenant "TOTAL"
totals = df_sheet2[df_sheet2.astype(str).apply(lambda x: x.str.contains("TOTAL", case=False, na=False)).any(axis=1)]

# Sélectionner les colonnes contenant les montants associés aux "TOTAL"
total_values = totals.dropna(axis=1, how='all')  # Supprimer les colonnes vides

# Afficher les résultats
print("🔹 Totaux extraits en jaune :")
print(total_values)

# Sauvegarder dans un fichier Excel si nécessaire
total_values.to_excel("totaux_extraits.xlsx", index=False)