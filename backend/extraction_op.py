import pandas as pd
from io import BytesIO
from fastapi import UploadFile
import pandas as pd
from io import BytesIO
from fastapi import UploadFile

def extract_costs_and_operations(content) -> dict:
    try:
        df = pd.read_excel(BytesIO(content), sheet_name=1, engine="openpyxl",header=None, dtype=str, keep_default_na=False)
        df.dropna(how='all', inplace=True)
        df.dropna(axis=1, how='all', inplace=True)
        df.reset_index(drop=True, inplace=True)

        totals = df[df.astype(str).apply(lambda x: x.str.contains("TOTAL", case=False, na=False)).any(axis=1)]

        total_values = totals.dropna(axis=1, how='all')
        total_values = total_values.applymap(lambda x: ' '.join(word for word in str(x).split() if word.upper() not in ["TOTAL", "COST"]))

        operations_costs = {}
        for _, row in total_values.iterrows():
            operation = str(row.iloc[0]).strip() 
            cost = row.iloc[-1] if len(row) > 1 else None  

            if pd.notna(cost):
                try:
                    cost = float(cost)
                    cost_display = f"{cost:,.2f}".replace(",", " ")  
                except ValueError:
                    cost_display = "--"  
            else:
                cost_display = "--"

            operations_costs[operation] = cost_display

        for operation, cost in operations_costs.items():
            print(f"   ➤ {operation} - {cost}")

        return operations_costs

    except Exception as e:
        print(f"❌ Erreur lors du traitement du fichier Excel : {e}")
        return None
