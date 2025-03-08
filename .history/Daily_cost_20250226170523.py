import pandas as pd

# Charger le fichier CSV en testant différents séparateurs
try:
    df = pd.read_csv("Donn_es_Marge_Table.csv", sep=",", encoding="utf-8")
except UnicodeDecodeError:
    df = pd.read_csv("Donn_es_Marge_Table.csv", sep=",", encoding="ISO-8859-1")

# Vérifier si le nombre de colonnes correspond à l'attendu (7 colonnes)
expected_columns = 7

if df.shape[1] != expected_columns:
    print(f"⚠️ Attention : Le fichier contient {df.shape[1]} colonnes, attendu {expected_columns}")
    print("Colonnes détectées :", list(df.columns))
    
    # Vérifier les 5 premières lignes pour inspection
    print("\nAperçu des premières lignes :")
    print(df.head())

    # Sélectionner uniquement les 7 premières colonnes si trop de colonnes
    if df.shape[1] > expected_columns:
        df = df.iloc[:, :expected_columns]
        print("\n🔧 Correction appliquée : seules les premières colonnes ont été conservées.")

# Afficher la structure finale après nettoyage
print("\n✅ Nettoyage terminé ! Aperçu des données après correction :")
print(df.head())

# Sauvegarder le fichier nettoyé
df.to_csv("Donn_es_Marge_Table_clean.csv", index=False, encoding="utf-8")
print("\n💾 Fichier nettoyé sauvegardé sous 'Donn_es_Marge_Table_clean.csv'")a