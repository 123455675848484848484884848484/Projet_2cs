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

        print(f"📊 Taille du DataFrame : {df.shape}")

        # Initialisation des valeurs
        daily_cost_value = None
        cumulative_cost_value = None

        # Recherche des valeurs Daily Cost et Cumulative Cost
        for row_idx, row in df.iterrows():
            for col_idx, cell in enumerate(row):
                if isinstance(cell, str):
                    cell_clean = cell.strip()
                    
                    if "Daily Cost" in cell_clean:
                        print(f"🔍 Daily Cost trouvé en ligne {row_idx}, colonne {col_idx}. Recherche des valeurs...")
                        raw_value = None
                        for shift in range(1, 16):  # Recherche jusqu'à 15 colonnes après
                            if col_idx + shift < df.shape[1]:
                                temp_value = df.iloc[row_idx, col_idx + shift]
                                if temp_value.strip():
                                    raw_value = temp_value
                                    break

                        if raw_value:
                            print(f"✅ Valeur Daily Cost détectée : {repr(raw_value)}")
                            daily_cost_value = clean_numeric_value(raw_value)
                        else:
                            print(f"⚠️ Aucune valeur trouvée pour Daily Cost à la ligne {row_idx}")

                    if "Cumulative Cost" in cell_clean:
                        print(f"🔍 Cumulative Cost trouvé en ligne {row_idx}, colonne {col_idx}. Recherche des valeurs...")
                        raw_value = None
                        for shift in range(1, 16):  # Recherche jusqu'à 15 colonnes après
                            if col_idx + shift < df.shape[1]:
                                temp_value = df.iloc[row_idx, col_idx + shift]
                                if temp_value.strip():
                                    raw_value = temp_value
                                    break

                        if raw_value:
                            print(f"✅ Valeur Cumulative Cost détectée : {repr(raw_value)}")
                            cumulative_cost_value = clean_numeric_value(raw_value)
                        else:
                            print(f"⚠️ Aucune valeur trouvée pour Cumulative Cost à la ligne {row_idx}")

        # Vérification des valeurs extraites
        if daily_cost_value is None:
            print("⚠️ Aucune valeur de Daily Cost trouvée.")
        if cumulative_cost_value is None:
            print("⚠️ Aucune valeur de Cumulative Cost trouvée.")

        return {
            "Daily Cost": daily_cost_value,
            "Cumulative Cost": cumulative_cost_value
        }
    
    except Exception as e:
        print(f"❌ Erreur lors du traitement du fichier : {e}")
        return None

# Exemple d'utilisation
file_path = "/mnt/data/1.xlsx"  # Remplace avec le bon fichier
data = extract_cost_data(file_path)
print("📊 Données extraites :", data)