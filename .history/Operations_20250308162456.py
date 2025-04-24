import pandas as pd

def extract_activities_and_operations(file_path, sheet_index=1):
    """
    Extrait les activités et leurs opérations sous forme de dictionnaire avec des listes d'opérations formatées.
    
    :param file_path: Chemin du fichier Excel.
    :param sheet_index: Index de la feuille contenant les données (par défaut la 2ème feuille).
    :return: Dictionnaire où chaque activité contient une liste d'opérations sous forme "Nom_ Coût".
    """
    # Charger le fichier Excel
    xls = pd.ExcelFile(file_path)

    # Charger la feuille spécifiée
    df = pd.read_excel(xls, sheet_name=sheet_index)

    # Nettoyer le DataFrame (supprimer lignes et colonnes vides)
    df = df.dropna(how='all', axis=1)
    df = df.dropna(how='all', axis=0)

    # Initialiser les variables
    activities = {}  # Dictionnaire pour stocker les activités et leurs opérations
    current_activity = None

    # Parcourir le DataFrame
    for i, row in df.iterrows():
        first_cell = str(row.iloc[0]).strip()  # Première colonne (nom de l'activité ou opération)
        
        # Détecter une activité (écrite en bleu, souvent en majuscules)
        if first_cell.isupper() and len(first_cell) > 3 and "ADDITIONAL SERVICES" not in first_cell:
            current_activity = first_cell
            activities[current_activity] = []  # Ajouter une nouvelle activité avec une liste vide

        # Détecter une opération associée (si une activité a été détectée)
        elif current_activity and first_cell and "ADDITIONAL CATERING" not in first_cell:
            lump_sum_cost = row.iloc[1] if len(row) > 1 else None  # Supposons que la 2ème colonne contient le coût
            cost_display = f"{lump_sum_cost:,.2f}".replace(",", " ") if pd.notna(lump_sum_cost) else "--"

            # Ajouter l'opération dans la liste de l'activité sous format "Nom_ Coût"
            activities[current_activity].append(f"{first_cell}_{cost_display}")

    # Affichage formaté pour vérifier les résultats
    for activity, operations in activities.items():
        print(f"\n🔹 {activity.upper()} 🔹")
        for op in operations:
            print(f"   {op}")

    return activities

# 📌 Exécuter le script
file_path = "1.xlsx"  # Remplace par le bon fichier
activities_data = extract_activities_and_operations(file_path)

# 📌 Exemple d'utilisation : Afficher les données sous format JSON pour debug
import json
print("\n📌 JSON Format :")
print(json.dumps(activities_data, indent=4, ensure_ascii=False))