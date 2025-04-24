import pandas as pd

def clean_daily_cost(file_path):
    # Charger le fichier CSV (car le fichier n'est pas un Excel)
    df = pd.read_csv(file_path, skiprows=2)  # Sauter les 2 premières lignes inutiles

    # Renommer les colonnes pour plus de clarté
    df.columns = ["Service", "Rate", "Unit", "Discount", "Other", "Qty", "Daily Cost"]

    # Supprimer les lignes complètement vides
    df = df.dropna(subset=["Service", "Daily Cost"], how="all")

    # Convertir la colonne "Daily Cost" en numérique
    df["Daily Cost"] = pd.to_numeric(df["Daily Cost"], errors="coerce")

    # Supprimer les lignes où "Daily Cost" est encore NaN
    df = df.dropna(subset=["Daily Cost"])

    # Réinitialiser l'index
    df = df.reset_index(drop=True)

    return df

# Exemple d'utilisation avec le chemin correct
file_path = "/Users/mayarial/Desktop/Donn_es_Marge_Table.csv"  # Mets ton vrai chemin ici
df_cleaned = clean_daily_cost(file_path)

# Sauvegarder le fichier nettoyé
df_cleaned.to_csv("/Users/mayarial/Desktop/daily_cost_cleaned.csv", index=False)

print("Nettoyage terminé !")