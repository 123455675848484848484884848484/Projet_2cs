import pandas as pd

def clean_daily_cost(file_path):
    # Charger le fichier CSV (vérifie le séparateur, peut-être ";" ou ",")
    df = pd.read_csv(file_path, skiprows=2)

    # Afficher les noms de colonnes actuels pour déboguer
    print("Colonnes détectées :", df.columns.tolist())

    # Vérifier le nombre de colonnes
    num_cols = len(df.columns)
    expected_cols = ["Service", "Rate", "Unit", "Discount", "Other", "Qty", "Daily Cost"]

    if num_cols != len(expected_cols):
        print(f"⚠️ Attention : Le fichier contient {num_cols} colonnes, attendu {len(expected_cols)}")
        print("Aperçu des premières lignes :\n", df.head())

        # Essayer de détecter les bonnes colonnes automatiquement
        return df  # Retourne les données brutes pour analyse

    # Renommer les colonnes uniquement si le nombre est correct
    df.columns = expected_cols

    # Supprimer les lignes complètement vides
    df = df.dropna(subset=["Service", "Daily Cost"], how="all")

    # Convertir la colonne "Daily Cost" en numérique
    df["Daily Cost"] = pd.to_numeric(df["Daily Cost"], errors="coerce")

    # Supprimer les lignes où "Daily Cost" est encore NaN
    df = df.dropna(subset=["Daily Cost"])

    # Réinitialiser l'index
    df = df.reset_index(drop=True)

    return df

# Exemple d'utilisation
file_path = "/Users/mayarial/Desktop/Clean_data_innovis/Donn_es_Marge_Table.csv"
df_cleaned = clean_daily_cost(file_path)

# Sauvegarder le fichier nettoyé
df_cleaned.to_csv("/Users/mayarial/Desktop/Clean_data_innovis/daily_cost_cleaned.csv", index=False)

print("Nettoyage terminé !")