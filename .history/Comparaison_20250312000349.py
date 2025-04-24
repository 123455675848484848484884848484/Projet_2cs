def comparer_cout_phase(cout_reel: float, cout_planifie: float):
    """
    Compare le coût réel d'une phase avec le coût planifié et analyse l'écart.

    :param cout_reel: Le coût réel de la phase.
    :param cout_planifie: Le coût planifié de la phase.
    :return: Un dictionnaire contenant l'analyse des écarts.
    """
    if cout_planifie == 0:
        raise ValueError("Le coût planifié ne peut pas être zéro.")

    # Calcul de l'écart
    ecart_valeur = cout_reel - cout_planifie
    ecart_pourcentage = (ecart_valeur / cout_planifie) * 100

    # Analyse de l'écart
    if ecart_valeur > 0:
        interpretation = "Dépassement du budget (coût plus élevé que prévu)"
    elif ecart_valeur < 0:
        interpretation = "Sous-utilisation du budget (coût inférieur au prévu)"
    else:
        interpretation = "Coût conforme au plan"

    # Résultat sous forme de dictionnaire
    resultat = {
        "Coût planifié": cout_planifie,
        "Coût réel": cout_reel,
        "Écart en valeur": ecart_valeur,
        "Écart en pourcentage": round(ecart_pourcentage, 2),
        "Interprétation": interpretation
    }

    return resultat

# Exemple d'utilisation :
resultat = comparer_cout_phase(12000, 10000)
print(resultat)