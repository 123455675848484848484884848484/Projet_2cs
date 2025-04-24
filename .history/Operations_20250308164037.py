import pandas as pd

def extract_activities_and_operations(file_path, sheet_index=1):
    """
    Extrait les activités et leurs opérations sous forme d'une liste organisée.
    
    :param file_path: Chemin du fichier Excel.
    :param sheet_index: Index de la feuille contenant les données.
    :return: Dictionnaire des activités avec leurs opérations sous format "Nom - Coût".
    """
    # Charger le fichier Excel
    xls = pd.ExcelFile(file_path)
    df = pd.read_excel(xls, sheet_name=sheet_index)

    # Nettoyer le DataFrame (supprimer lignes et colonnes vides)
    df = df.dropna(how='all', axis=1)
    df = df.dropna(how='all', axis=0)

    # Initialiser les variables
    activities = {}  # Dictionnaire contenant les activités et leurs opérations
    current_activity = None

    # Parcourir le DataFrame
    for i, row in df.iterrows():
        first_cell = str(row.iloc[0]).strip()  # Première colonne

        # Filtrer les sections à ignorer
        if any(word in first_cell.upper() for word in ["TOTAL COST", "ADDITIONAL SERVICES", "nan", "ADDITIONAL CATERING"]):
            continue  # On ignore ces lignes

        # Détecter une activité (souvent écrite en bleu et en majuscules)
        if first_cell.isupper() and len(first_cell) > 3:
            current_activity = first_cell
            activities[current_activity] = []  # Initialiser la liste des opérations

        # Détecter une opération associée (éviter les sections sans activité)
        elif current_activity and first_cell:
            lump_sum_cost = row.iloc[1] if len(row) > 1 else None  # Supposons que la 2ème colonne contient le coût
            cost_display = f"{lump_sum_cost:,.2f}".replace(",", " ") if pd.notna(lump_sum_cost) else "--"

            # Ajouter l'opération sous format "Nom - Coût"
            activities[current_activity].append(f"{first_cell} - {cost_display}")

    # 📌 Affichage formaté
    for activity, operations in activities.items():
        print(f"\n🔹 {activity} 🔹")
        for op in operations:
            print(f"   ➤ {op}")

    return activities

# 📌 Exécuter le script
file_path = "2.xlsx"  # Remplace par ton fichier
activities_data = extract_activities_and_operations(file_path)