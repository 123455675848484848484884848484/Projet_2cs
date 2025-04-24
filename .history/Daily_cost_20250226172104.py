import pandas as pd

# Chemin du fichier source
file_path = "1.xlsx"  # Remplacez par votre fichier

# Charger le fichier Excel
xls = pd.ExcelFile(file_path)

# Vérifier qu'il y a bien une deuxième feuille
if len(xls.sheet_names) > 1:
    sheet_name = xls.sheet_names[1]  # Sélectionner la 2ème feuille
    df = pd.read_excel(xls, sheet_name=sheet_name)

    # Suppression des colonnes entièrement vides
    df_cleaned = df.dropna(axis=1, how='all')

    # Suppression des lignes entièrement vides
    df_cleaned = df_cleaned.dropna(how='all')

    # Renommage des colonnes "Unnamed"
    df_cleaned.columns = [
        col if "Unnamed" not in col else f"Column_{i}" 
        for i, col in enumerate(df_cleaned.columns)
    ]

    # Sauvegarde uniquement la deuxième feuille nettoyée
    cleaned_file_path = "cleaned_1.xlsx"  # Fichier de sortie
    with pd.ExcelWriter(cleaned_file_path, engine='xlsxwriter') as writer:
        df_cleaned.to_excel(writer, sheet_name=sheet_name, index=False)

    print(f"✅ Nettoyage terminé ! La 2ème feuille a été sauvegardée sous : {cleaned_file_path}")
else:
    print("❌ Le fichier ne contient pas assez de feuilles.")