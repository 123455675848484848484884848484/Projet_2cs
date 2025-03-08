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


def extract_operations_only(file_path, sheet_index=1):
    """
    Extrait uniquement les opérations sous 'ADDITIONAL SERVICES' sans inclure le titre et le total.
    :param file_path: Chemin du fichier Excel.
    :param sheet_index: Index de la feuille contenant les données (par défaut la 2ème feuille).
    :return: Affiche les opérations et leurs coûts (même si certains sont manquants).
    """
    # Charger le fichier Excel
    xls = pd.ExcelFile(file_path)
    
    # Charger la deuxième feuille
    df = pd.read_excel(xls, sheet_name=sheet_index)

    # Supprimer les colonnes et lignes vides
    df = df.dropna(how='all', axis=1)  
    df = df.dropna(how='all', axis=0)  

    # Trouver la ligne où commence "ADDITIONAL SERVICES"
    start_index = None
    for i, row in df.iterrows():
        if isinstance(row.iloc[0], str) and "ADDITIONAL SERVICES" in row.iloc[0].upper():
            start_index = i
            break

    if start_index is None:
        print("❌ Section 'ADDITIONAL SERVICES' non trouvée.")
        return None

    # Extraire les opérations sous "ADDITIONAL SERVICES" (sans inclure le titre)
    operations_df = df.iloc[start_index + 1:].copy()

    # Identifier les colonnes des opérations et des coûts
    operation_col = 0  # Première colonne
    cost_col = -1  # Dernière colonne

    # Extraire uniquement les opérations et leurs coûts
    operations_df = operations_df.loc[:, [df.columns[operation_col], df.columns[cost_col]]]
    operations_df.columns = ["Opération", "Coût"]

    # Convertir la colonne de coût en numérique, mais garder NaN si vide
    operations_df["Coût"] = pd.to_numeric(operations_df["Coût"], errors='coerce')

    # Affichage formaté
    print("\n🔹 **Opérations** 🔹\n")
    for index, row in operations_df.iterrows():
        operation = row["Opération"]
        cost = f"{row['Coût']:,.2f}".replace(",", " ") if not pd.isna(row["Coût"]) else "--"
        print(f"{operation:<40} {cost}")

    return operations_df

file_path = "2.xlsx" 
#data = extract_data(file_path)
print("Données extraites :", extract_data(file_path))
extract_operations_only(file_path)