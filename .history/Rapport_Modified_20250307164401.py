
import pandas as pd

def extract_activities_and_operations(file_path, sheet_index=1):
    """
    Extrait les activités (écrites en bleu) et leurs opérations associées avec le coût 'Lump Sum - Day Rate'.
    :param file_path: Chemin du fichier Excel.
    :param sheet_index: Index de la feuille contenant les données (par défaut la 2ème feuille).
    :return: Affiche les activités et leurs opérations formatées.
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
        
        # Détecter une activité (en bleu) -> Souvent écrite en majuscules et formatée différemment
        if first_cell.isupper() and len(first_cell) > 3 and "ADDITIONAL SERVICES" not in first_cell:
            current_activity = first_cell
            activities[current_activity] = []  # Ajouter une nouvelle activité

        # Détecter une opération associée (si une activité a été détectée)
        elif current_activity and first_cell and "ADDITIONAL CATERING" not in first_cell:
            lump_sum_cost = row.iloc[1] if len(row) > 1 else None  # Supposons que la 2ème colonne contient le coût

            # Ajouter l'opération même si elle n'a pas de coût
            activities[current_activity].append((first_cell, lump_sum_cost))

    # Création d'un DataFrame pour affichage
    extracted_data = []
    for activity, operations in activities.items():
        extracted_data.append({"Activité": activity, "Opération": "", "Daily Operation Cost": ""})
        for operation, cost in operations:
            cost_display = f"{cost:,.2f}".replace(",", " ") if pd.notna(cost) else "--"
            extracted_data.append({"Activité": "", "Opération": operation, "Daily Operation Cost": cost_display})

    result_df = pd.DataFrame(extracted_data)

    # Affichage des résultats
    import ace_tools as tools
    tools.display_dataframe_to_user(name="Activités et Opérations", dataframe=result_df)

    return result_df

# Exécuter le script
file_path = "/mnt/data/2.xlsx"
extract_activities_and_operations(file_path)
