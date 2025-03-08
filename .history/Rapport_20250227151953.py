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
        # 🔹 Charger le fichier Excel en forçant le texte et en gardant les cellules vides comme ''
        df = pd.read_excel(file_path, sheet_name=0, header=None, dtype=str, keep_default_na=False)

        # Supprimer les lignes/colonnes vides
        df.dropna(how='all', inplace=True)
        df.dropna(axis=1, how='all', inplace=True)
        df.reset_index(drop=True, inplace=True)

        print(f"📊 Taille du DataFrame : {df.shape}")

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
                    break
            if date_value:
                break

        # Recherche des valeurs Daily Cost et Cumulative Cost
        for row_idx, row in df.iterrows():
            for col_idx, cell in enumerate(row):
                if isinstance(cell, str):
                    cell_clean = cell.strip()
                    
                    if "Daily Cost" in cell_clean and col_idx + 1 < df.shape[1]:
                        print(f"🔍 Vérification des valeurs environnantes de Daily Cost (ligne {row_idx}):")
                        print(df.iloc[row_idx, col_idx:col_idx+5].to_list())  # Affiche les 5 colonnes après

                        # Essaye plusieurs colonnes à droite pour éviter un éventuel décalage
                        for shift in range(1, 4):  # Vérifie jusqu'à 3 colonnes à droite
                            if col_idx + shift < df.shape[1]:
                                raw_value = df.iloc[row_idx, col_idx + shift]
                                if raw_value.strip():  # Vérifie si la valeur n'est pas vide
                                    break
                        else:
                            raw_value = None

                        if raw_value:
                            print(f"🔍 Valeur brute Daily Cost : {repr(raw_value)}")
                            daily_cost_value = clean_numeric_value(raw_value)
                            print(f"✅ Daily Cost extrait : {daily_cost_value}")
                        else:
                            print(f"⚠️ Aucune valeur détectée pour Daily Cost à la ligne {row_idx}")

                    if "Cumulative Cost" in cell_clean and col_idx + 1 < df.shape[1]:
                        for shift in range(1, 4):
                            if col_idx + shift < df.shape[1]:
                                raw_value = df.iloc[row_idx, col_idx + shift]
                                if raw_value.strip():
                                    break
                        else:
                            raw_value = None

                        if raw_value:
                            print(f"🔍 Valeur brute Cumulative Cost : {repr(raw_value)}")
                            cumulative_cost_value = clean_numeric_value(raw_value)
                            print(f"✅ Cumulative Cost extrait : {cumulative_cost_value}")
                        else:
                            print(f"⚠️ Aucune valeur détectée pour Cumulative Cost à la ligne {row_idx}")

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