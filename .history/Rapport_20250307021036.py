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

def extract_data(file_path):
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

        # Recherche améliorée de BIT SIZE sur plusieurs lignes
        for row_idx in range(df.shape[0] - 2):  # S'assurer qu'on peut lire 2 lignes après
            for col_idx, cell in enumerate(df.iloc[row_idx]):
                if isinstance(cell, str) and "BIT" in cell.upper():
                    if isinstance(df.iloc[row_idx + 1, col_idx], str) and "SIZE" in df.iloc[row_idx + 1, col_idx].upper():
                        # Chercher la valeur une ligne plus bas
                        temp_value = df.iloc[row_idx + 2, col_idx]
                        if isinstance(temp_value, str) and temp_value.strip():
                            bit_size_value = temp_value
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
        print(f"Erreur lors du traitement du fichier : {e}")
        return None


def extract_blue_operations(file_path, sheet_index=1):
    """
    Extrait les opérations en bleu et calcule leur total à partir d'un fichier Excel.
    :param file_path: Chemin du fichier Excel.
    :param sheet_index: Index de la feuille à analyser (par défaut la 2ème feuille).
    :return: DataFrame des opérations extraites et total des coûts.
    """
    # Charger le fichier Excel
    xls = pd.ExcelFile(file_path)
    
    # Vérifier le nombre de feuilles
    if len(xls.sheet_names) <= sheet_index:
        raise ValueError(f"Le fichier ne contient pas {sheet_index+1} feuilles.")

    # Charger la deuxième feuille
    df = pd.read_excel(xls, sheet_name=sheet_index)

    # Nettoyer le DataFrame
    df = df.dropna(how='all', axis=1)  # Supprime les colonnes vides
    df = df.dropna(how='all', axis=0)  # Supprime les lignes vides

    # Identifier les lignes contenant des opérations
    filtered_operations = df[df.iloc[:, 0].notna()]  # Supposons que la première colonne contient des noms d'opérations

    # Extraire les coûts (dernière colonne supposée contenir les coûts)
    cost_column_index = -1  # Dernière colonne
    filtered_operations['Cost'] = pd.to_numeric(filtered_operations.iloc[:, cost_column_index], errors='coerce')

    # Calculer le total des coûts
    total_cost = filtered_operations['Cost'].sum()

    return filtered_operations, total_cost


file_path = "2.xlsx" 
operations_df, total_cost = extract_blue_operations(file_path) 
#data = extract_data(file_path)
print("Données extraites :", extract_data(file_path))
print("Opérations extraites :")
print(operations_df)
print(f"\nTotal des coûts des opérations en bleu : {total_cost}")
