import pandas as pd
import re

def clean_numeric_value(value):
    """ Nettoie et convertit une valeur en float en supprimant les espaces et la devise. """
    if isinstance(value, str):
        value = value.replace(" ", "").replace("US$", "").strip()  # Supprime les espaces et la devise
        value = value.replace(",", ".")  # Convertit la virgule en point pour float
        try:
            return float(value)
        except ValueError:
            return None  # Retourne None si la conversion échoue
    return None

def extract_cost_data(file_path):
    try:
        # Charger le fichier Excel (première feuille)
        df = pd.read_excel(file_path, sheet_name=0, header=None, dtype=str)

        # Supprimer les lignes/colonnes vides
        df.dropna(how='all', inplace=True)
        df.dropna(axis=1, how='all', inplace=True)
        df.reset_index(drop=True, inplace=True)

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
                        print(f"✅ Date trouvée: {date_value} à la ligne {row_idx}, colonne {col_idx}")
                    elif col_idx + 1 < df.shape[1] and isinstance(row[col_idx + 1], str):
                        match = re.search(r'\d{2}/\d{2}/\d{4}', row[col_idx + 1])
                        if match:
                            date_value = match.group(0)
                            print(f"✅ Date trouvée dans la cellule suivante : {date_value}")
                    break
            if date_value:
                break

        # Recherche des valeurs Daily Cost et Cumulative Cost
        for row_idx, row in df.iterrows():
            for col_idx, cell in enumerate(row):
                if isinstance(cell, str):
                    cell_clean = cell.strip()
                    if "Daily Cost" in cell_clean and col_idx + 1 < df.shape[1]:
                        raw_value = df.iloc[row_idx, col_idx + 1]
                        daily_cost_value = clean_numeric_value(raw_value)
                        print(f"✅ Daily Cost trouvé : {daily_cost_value} ({raw_value}) à la ligne {row_idx}, colonne {col_idx+1}")

                    if "Cumulative Cost" in cell_clean and col_idx + 1 < df.shape[1]:
                        raw_value = df.iloc[row_idx, col_idx + 1]
                        cumulative_cost_value = clean_numeric_value(raw_value)
                        print(f"✅ Cumulative Cost trouvé : {cumulative_cost_value} ({raw_value}) à la ligne {row_idx}, colonne {col_idx+1}")

        # Vérification des valeurs extraites
        if daily_cost_value is None:
            print("⚠️ Aucune valeur de Daily Cost trouvée.")
        if cumulative_cost_value is None:
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
file_path = "1.xlsx"  # Remplace avec le bon fichier
data = extract_cost_data(file_path)
print("📊 Données extraites :", data)