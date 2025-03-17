import pandas as pd

def extract_costs_and_operations(file_path, sheet_index=1):
    # Charger le fichier Excel
    df = pd.read_excel(file_path, sheet_name=sheet_index)  
    # Identifier les lignes contenant "TOTAL", "COST" dans n'importe quelle colonne
    totals = df[df.astype(str).apply(lambda x: x.str.contains("TOTAL", case=False, na=False)).any(axis=1)]
    # Supprimer les colonnes vides
    total_values = totals.dropna(axis=1, how='all')
    # Supprimer "TOTAL", "COST" des libellés dans les colonnes de texte
    total_values = total_values.applymap(lambda x: ' '.join(word for word in str(x).split() if word.upper() not in ["TOTAL", "COST"]))
    # Initialiser un dictionnaire pour les coûts par opération
    operations_costs = {}

    # Parcourir chaque ligne pour extraire les opérations et coûts
    for i, row in total_values.iterrows():
        operation = str(row.iloc[0]).strip()  # Première colonne : opération
        cost = row.iloc[-1] if len(row) > 1 else None  # Dernière colonne : coût

        # Vérifier si le coût est un nombre et le convertir
        if pd.notna(cost):
            try:
                cost = float(cost)  # Convertir le coût en float si possible
                # Formatage du coût
                cost_display = f"{cost:,.2f}".replace(",", " ")  # Remplacer la virgule par un espace insécable
            except ValueError:
                cost_display = "--"  # Si la conversion échoue, afficher "--"
        else:
            cost_display = "--"  # Si aucun coût n'est présent

        operations_costs[operation] = cost_display

    # Affichage sous le même format
    print("🔹 Coût total pour chaque opération :")
    for operation, cost in operations_costs.items():
        print(f"   ➤ {operation} - {cost}")

    return operations_costs

# Appel de la fonction avec le fichier "1.xlsx"
file_path = "1.xlsx"
operations_data = extract_costs_and_operations(file_path)
