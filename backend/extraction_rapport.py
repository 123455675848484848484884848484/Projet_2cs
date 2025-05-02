import pandas as pd
import re
import psycopg2
from datetime import datetime
from io import BytesIO
from fastapi import FastAPI, File, UploadFile, Depends

def clean_numeric_value(value):
    """ Nettoie et convertit une valeur en float en supprimant les espaces et la devise. """
    if isinstance(value, str):
        value = value.replace("\xa0", "").replace("\u202f", "").replace(" ", "").replace("US$", "").strip()  
        value = value.replace(",", ".")
        try:
            return float(value)
        except ValueError:
            return None  
    return None

def extract_data(content) -> dict:
    try:
        df = pd.read_excel(BytesIO(content), sheet_name=0, header=None, dtype=str, keep_default_na=False)

        df.dropna(how='all', inplace=True)
        df.dropna(axis=1, how='all', inplace=True)
        df.reset_index(drop=True, inplace=True)

        date_value = None
        daily_cost_value = None
        cumulative_cost_value = None
        depth_value = None
        bit_size_value = None

        for row_idx, row in df.iterrows():
            for col_idx, cell in enumerate(row):
                if isinstance(cell, str) and re.search(r"\d{2}/\d{2}/\d{4}", cell):
                    date_value = re.search(r"\d{2}/\d{2}/\d{4}", cell).group()
                    break
            if date_value:
                break

        for row_idx, row in df.iterrows():
            for col_idx, cell in enumerate(row):
                if isinstance(cell, str) and re.search(r"depth\s*@\s*24h", cell, re.IGNORECASE):
                    for shift in range(1, 10):
                        if col_idx + shift < df.shape[1]:
                            temp_value = df.iloc[row_idx, col_idx + shift]
                            if isinstance(temp_value, str) and temp_value.strip():
                                depth_value = temp_value
                                break
                    break
            if depth_value:
                break

        for row_idx in range(df.shape[0] - 2):  
            for col_idx, cell in enumerate(df.iloc[row_idx]):
                if isinstance(cell, str) and "BIT" in cell.upper():
                    if isinstance(df.iloc[row_idx + 1, col_idx], str) and "SIZE" in df.iloc[row_idx + 1, col_idx].upper():
                        temp_value = df.iloc[row_idx + 2, col_idx]
                        if isinstance(temp_value, str) and temp_value.strip():
                            bit_size_value = temp_value
                            break
            if bit_size_value:
                break

        for row_idx, row in df.iterrows():
            for col_idx, cell in enumerate(row):
                if isinstance(cell, str) and "Daily Cost" in cell:
                    raw_value = None
                    for shift in range(1, 20):
                        if col_idx + shift < df.shape[1]:
                            temp_value = df.iloc[row_idx, col_idx + shift]
                            if temp_value.strip():
                                raw_value = temp_value
                                break
                    if raw_value:
                        daily_cost_value = clean_numeric_value(raw_value)

        try:
            cumulative_cost_value = clean_numeric_value(df.iloc[58, 87])
        except:
            pass

        return {
            "Date": date_value,
            "Depth @ 24h": depth_value,
            "BIT SIZE": bit_size_value,
            "Daily Cost": daily_cost_value,
            "Cumulative Cost": cumulative_cost_value
        }
    
    except Exception as e:
        print(f"Erreur lors du traitement du fichier : {e}")
        return None


