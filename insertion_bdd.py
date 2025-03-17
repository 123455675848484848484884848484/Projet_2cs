import pandas as pd
import re
import psycopg2
from datetime import datetime
from Cout_total_op import extract_costs_and_operations
from Daily_info import extract_data


file_path = "2.xlsx" 

#fonction pour l'insertion dans la table rapport_journalier + operation_journaliere
def process_and_insert_data(user_id, file_path, projet_id):
    # Connexion à la base de données
    conn = psycopg2.connect(
        host="localhost",
        database="Projet_Forage", 
        user="postgres",   
        password="root"  
    )
    cur = conn.cursor()
    cur.execute("SET datestyle TO 'MDY';")
    
    data = extract_data(file_path)

    with open(file_path, 'rb') as file:
        file_data = file.read() 

        #requete pour l'insertion du rapport journalier
        query = """
        INSERT INTO rapport_journalier (id_projet,date,daily_cost,profondeur,fichier_excel,userid)
        VALUES (%s, %s, %s,%s, %s, %s) RETURNING id;
        """
        cur.execute(query, (projet_id,data["Date"],data["Daily Cost"],data["Depth @ 24h"],file_data,user_id))
        rapport_journalier_id = cur.fetchone()[0]
        print(f"Fichier inséré avec succès ! ID du rapport journalier: {rapport_journalier_id}")

    #insertion des operations du rapport journalier
    operations = extract_costs_and_operations(file_path)

    # Parcourir chaque opération et coût, puis insérer dans la base de données
    for operation, cost in operations.items():
        # Vérifier et formater le coût
        if cost != "--":
            cost = float(cost.replace(" ", "").replace(",", ""))  # Conversion du coût en float sans espace insécable et virgules
        else:
            cost = None  # Si le coût est "--", le mettre à None

        # Insérer dans la base de données
        try:
            query = """
                INSERT INTO operation_journaliere (id_rapport, description, cout)
                VALUES (%s, %s, %s);
            """
            cur.execute(query, (rapport_journalier_id, operation, cost))
        except Exception as e:
            print(f"Erreur lors de l'insertion : {e}")

    conn.commit()
    cur.close()
    conn.close()

    print("Opérations insérées avec succès !")
    

process_and_insert_data(1,file_path,1) # test

#fonction pour la recuperation du fichier excel a partir de la bdd
def recuperer_fichier_binaire(report_id, output_filename="recovered_file.xlsx"):
    conn = psycopg2.connect(
        host="localhost",     
        database="Projet_Forage", 
        user="postgres",  
        password="root"  
    )

    cur = conn.cursor()
    try:
        cur.execute("SELECT fichier_excel FROM rapport_journalier WHERE id = %s;", (report_id,))

        # Récupérer le fichier binaire
        file_data = cur.fetchone()

        if file_data is not None:
            file_data = file_data[0]  # Extraire le contenu binaire

            # Sauvegarder le fichier binaire dans un fichier local
            with open(output_filename, 'wb') as f:
                f.write(file_data)

            print(f"Fichier récupéré et sauvegardé sous '{output_filename}'.")
        else:
            print(f"Aucun fichier trouvé pour le rapport avec l'ID {report_id}.")
    
    except Exception as e:
        print(f"Une erreur est survenue : {e}")
    
    cur.close()
    conn.close()


report_id = 9  
recuperer_fichier_binaire(report_id) #test

