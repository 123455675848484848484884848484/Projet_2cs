import pandas as pd

# Charger le fichier Excel
file_path = "1.xlsx"  # Remplacez par votre fichier

# Charger la deuxième feuille uniquement
xls = pd.ExcelFile(file_path)
if len(xls.sheet_names) > 1:  # hna je verifie il ymad f fichier plusierus feuilles 
    sheet_name = xls.sheet_names[1]  # Sélectionner la 2ème feuille
    df = pd.read_excel(xls, sheet_name=sheet_name)

    # Supprimer les colonnes et lignes vides
    df_cleaned = df.dropna(axis=1, how='all').dropna(how='all')

    # Renommer les colonnes sans nom
    df_cleaned.columns = [
        col if "Unnamed" not in col else f"Column_{i}" 
        for i, col in enumerate(df_cleaned.columns)
    ]

    # 📌 Afficher les résultats directement dans le terminal
    print("\n📊 **Aperçu des données nettoyées :**")
    print(df_cleaned.to_string(index=False))  # Afficher toutes les lignes sans l'index

    print("\n📝 **Noms des colonnes après nettoyage :**")
    print(list(df_cleaned.columns))  # Afficher les noms des colonnes

    print(f"\n✅ **Total : {df_cleaned.shape[0]} lignes et {df_cleaned.shape[1]} colonnes.**")
else:
    print("❌ Le fichier ne contient pas assez de feuilles.")