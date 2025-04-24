import pandas as pd
import re

def clean_numeric_value(value):
    """ Nettoie et convertit une valeur en float en supprimant les espaces et la devise. """
    if isinstance(value, str):
        value = value.replace("\xa0", "").replace("\u202f", "").replace(" ", "").replace("US$", "").strip()  # Supprime les espaces spéciaux
        value = value.replace(",", ".")  # Convertit la virgule en point pour float
        try:
            return float(value)
        except ValueError:
            return None  # Retourne None si la conversion échoue
    return None

def extract_cost_data(file_path):
    try:
        # Charger le fichier Excel en lisant tout en texte
        df = pd.read_excel(file_path, sheet_name=0, header=None, dtype=str, keep_default_na=False)

        # Supprimer les lignes/colonnes vides
        df.dropna(how='all', inplace=True)
        df.dropna(axis=1, how='all', inplace=True)
        df.reset_index(drop=True, inplace=True)

        # Initialisation des valeurs
        date_value = None
        daily_cost_value = None
        cumulative_cost_value = None
        depth_value = None
        bit_size_value = None

        # Recherche de la date
        for row_idx, row in df.iterrows():
            for col_idx, cell in enumerate(row):
                if isinstance(cell, str) and re.search(r"\d{2}/\d{2}/\d{4}", cell):
                    date_value = re.search(r"\d{2}/\d{2}/\d{4}", cell).group()
                    break
            if date_value:
                break

        # Recherche de Depth @ 24h avec exploration plus large
        for row_idx, row in df.iterrows():
            for col_idx, cell in enumerate(row):
                if isinstance(cell, str) and re.search(r"depth\s*@\s*24h", cell, re.IGNORECASE):
                    for shift in range(1, 10):  # Vérifier jusqu'à 10 colonnes après
                        if col_idx + shift < df.shape[1]:
                            temp_value = df.iloc[row_idx, col_idx + shift]
                            if isinstance(temp_value, str) and temp_value.strip():
                                depth_value = temp_value
                                break
                    break
            if depth_value:
                break

        # Recherche de BIT SIZE avec exploration plus large
        for row_idx, row in df.iterrows():
            for col_idx, cell in enumerate(row):
                if isinstance(cell, str) and re.search(r"\bBIT\b", cell, re.IGNORECASE):
                    if col_idx + 1 < df.shape[1] and isinstance(row[col_idx + 1], str) and "SIZE" in row[col_idx + 1]:
                        for shift in range(1, 5):  # Vérifier jusqu'à 5 lignes après
                            if row_idx + shift < df.shape[0]:
                                temp_value = df.iloc[row_idx + shift, col_idx]
                                if isinstance(temp_value, str) and temp_value.strip():
                                    bit_size_value = temp_value
                                    break
                        break
            if bit_size_value:
                break

        # Recherche de Daily Cost
        for row_idx, row in df.iterrows():
            for col_idx, cell in enumerate(row):
                if isinstance(cell, str) and "Daily Cost" in cell:
                    raw_value = None
                    for shift in range(1, 20):
                        if col_idx + shift < df.shape[1]:
                            temp_value = df.iloc[row_idx, col_idx + shift]
                            if temp_value.strip():
                                raw_value = temp_value
                                break
                    if raw_value:
                        daily_cost_value = clean_numeric_value(raw_value)

        # Extraction de Cumulative Cost
        try:
            cumulative_cost_value = clean_numeric_value(df.iloc[58, 87])
        except:
            pass

        return {
            "Date": date_value,
            "Depth @ 24h": depth_value,
            "BIT SIZE": bit_size_value,
            "Daily Cost": daily_cost_value,
            "Cumulative Cost": cumulative_cost_value
        }
    
    except Exception as e:
        print("Erreur lors du traitement du fichier : {e}")
        return None

# Exemple d'utilisation
file_path = "2.xlsx"  # Remplace avec le bon fichier
data = extract_cost_data(file_path)
print("Données extraites :", data)
