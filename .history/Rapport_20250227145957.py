import pandas as pd
import re

def extract_cost_data(file_path):
    # Charger le fichier Excel (première feuille)
    df = pd.read_excel(file_path, sheet_name=0, header=None)
    
    # Supprimer les lignes/colonnes vides
    df.dropna(how='all', inplace=True)
    df.dropna(axis=1, how='all', inplace=True)
    
    # Initialisation des valeurs
    date_value = None
    daily_cost_value = None
    cumulative_cost_value = None
    
    # Recherche de la date
    for row in df.itertuples():
        for cell in row:
            if isinstance(cell, str) and "Date" in cell:
                match = re.search(r'\d{2}/\d{2}/\d{4}', cell)
                if match:
                    date_value = match.group(0)
                break
        if date_value:
            break
    
    # Recherche des valeurs Daily Cost et Cumulative Cost
    for row_idx, row in df.iterrows():
        for col_idx, cell in enumerate(row):
            if isinstance(cell, str):
                if "Daily Cost" in cell:
                    daily_cost_value = df.iloc[row_idx, col_idx + 1] if col_idx + 1 < df.shape[1] else None
                if "Cumulative Cost" in cell:
                    cumulative_cost_value = df.iloc[row_idx, col_idx + 1] if col_idx + 1 < df.shape[1] else None
        
    return {
        "Date": date_value,
        "Daily Cost": daily_cost_value,
        "Cumulative Cost": cumulative_cost_value
    }

# Exemple d'utilisation
file_path = "1.xlsx"  # Remplace avec le bon chemin
data = extract_cost_data(file_path)
print(data)
