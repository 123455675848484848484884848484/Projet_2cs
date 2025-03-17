import pandas as pd

file_path = "1.xlsx"  
df_sheet2 = pd.read_excel(file_path, sheet_name=1)  # Charger la 2ème feuille

# Identifier les lignes contenant "TOTAL", "COST" dans n'importe quelle colonne
totals = df_sheet2[df_sheet2.astype(str).apply(lambda x: x.str.contains("TOTAL", case=False, na=False)).any(axis=1)]

# Supprimer les colonnes vides
total_values = totals.dropna(axis=1, how='all')  

# Supprimer "TOTAL", "COST" des libellés dans les colonnes de texte
total_values = total_values.applymap(lambda x: ' '.join(word for word in str(x).split() if word.upper() not in ["TOTAL", "COST"]))

print("🔹Cout total pour chaque operation:")
print(total_values)