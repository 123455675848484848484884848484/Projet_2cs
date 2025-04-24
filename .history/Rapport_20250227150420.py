import pandas as pd
import re

def extract_cost_data(file_path):
    try:
        # Charger le fichier Excel (première feuille)
        df = pd.read_excel(file_path, sheet_name=0, header=None, dtype=str)  # Chargement en texte pour éviter des erreurs de type
        
        # Supprimer les lignes/colonnes vides
        df.dropna(how='all', inplace=True)
        df.dropna(axis=1, how='all', inplace=True)
        df.reset_index(drop=True, inplace=True)  # Réinitialiser les index après suppression
        
        # Vérification de la taille du dataframe
        print(f"Taille du DataFrame : {df.shape}")
        
        # Initialisation des valeurs
        date_value = None
        daily_cost_value = None
        cumulative_cost_value = None

        # Recherche de la date
        for row_idx, row in df.iterrows():
            for col_idx, cell in enumerate(row):
                if isinstance(cell, str) and "Date" in cell:
                    match = re.search(r'\d{2}/\d{2}/\d{4}', cell)
                    if match:
                        date_value = match.group(0)
                        print(f"Date trouvée: {date_value} à la ligne {row_idx}, colonne {col_idx}")
                    elif col_idx + 1 < df.shape[1] and isinstance(row[col_idx + 1], str):
                        match = re.search(r'\d{2}/\d{2}/\d{4}', row[col_idx + 1])
                        if match:
                            date_value = match.group(0)
                            print(f"Date trouvée dans la cellule suivante : {date_value}")
                    break
            if date_value:
                break
        
        # Recherche des valeurs Daily Cost et Cumulative Cost
        for row_idx, row in df.iterrows():
            for col_idx, cell in enumerate(row):
                if isinstance(cell, str):
                    cell = cell.strip()  # Nettoyer les espaces
                    if "Daily Cost" in cell and col_idx + 1 < df.shape[1]:
                        try:
                            daily_cost_value = float(df.iloc[row_idx, col_idx + 1])
                            print(f"Daily Cost trouvé : {daily_cost_value} à la ligne {row_idx}, colonne {col_idx+1}")
                        except ValueError:
                            print(f"Valeur non numérique pour Daily Cost à la ligne {row_idx}, colonne {col_idx+1}")
                    if "Cumulative Cost" in cell and col_idx + 1 < df.shape[1]:
                        try:
                            cumulative_cost_value = float(df.iloc[row_idx, col_idx + 1])
                            print(f"Cumulative Cost trouvé : {cumulative_cost_value} à la ligne {row_idx}, colonne {col_idx+1}")
                        except ValueError:
                            print(f"Valeur non numérique pour Cumulative Cost à la ligne {row_idx}, colonne {col_idx+1}")
        
        # Vérifier si les valeurs sont bien extraites
        if not date_value:
            print("⚠️ Aucune date trouvée dans le fichier.")
        if not daily_cost_value:
            print("⚠️ Aucune valeur de Daily Cost trouvée.")
        if not cumulative_cost_value:
            print("⚠️ Aucune valeur de Cumulative Cost trouvée.")
        
        return {
            "Date": date_value,
            "Daily Cost": daily_cost_value,
            "Cumulative Cost": cumulative_cost_value
        }
    
    except Exception as e:
        print(f"❌ Erreur lors du traitement du fichier : {e}")
        return None

# Exemple d'utilisation
file_path = "1.xlsx"  # Remplace avec le bon chemin
data = extract_cost_data(file_path)
print("Données extraites :", data)