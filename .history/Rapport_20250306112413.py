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

        # Recherche de Depth @ 24h
        for row_idx, row in df.iterrows():
            for col_idx, cell in enumerate(row):
                if isinstance(cell, str) and re.search(r"depth\s*@\s*24h", cell, re.IGNORECASE):
                    depth_value = df.iloc[row_idx, col_idx + 1] if col_idx + 1 < df.shape[1] else None
                    break
            if depth_value:
                break

        # Recherche de BIT SIZE
        for row_idx, row in df.iterrows():
            for col_idx, cell in enumerate(row):
                if isinstance(cell, str) and re.search(r"bit\s*size", cell, re.IGNORECASE):
                    bit_size_value = df.iloc[row_idx + 1, col_idx] if row_idx + 1 < df.shape[0] else None
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
        print(f"\u274c Erreur lors du traitement du fichier : {e}")
        return None

# Exemple d'utilisation
file_path = "2.xlsx"  # Remplace avec le bon fichier
data = extract_cost_data(file_path)
print("\ud83d\udcca Données extraites :", data)
