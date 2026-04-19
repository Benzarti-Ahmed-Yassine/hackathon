import pandas as pd
import numpy as np
import os

print("Starting Dataset Cleaning and Unified XGBoost Preparation...")

# 1. Load AIR Dataset
air_df = pd.read_csv('datasets/tabular/Pollution_MultiDomain.csv')
# Keep relevant air columns
air_cols = ['PM2.5', 'NO2', 'Air Quality']
if all(c in air_df.columns for c in air_cols):
    air_clean = air_df[air_cols].copy()
    # Map labels: Good -> 0, Moderate/Poor -> 1, Hazardous/Severe -> 2
    def map_air_risk(val):
        val = str(val).lower()
        if 'good' in val or 'satisfactory' in val: return 0
        if 'hazardous' in val or 'severe' in val or 'poor' in val: return 2
        return 1
    air_clean['Risk_Target'] = air_clean['Air Quality'].apply(map_air_risk)
    air_clean['Domain'] = 'AIR'
    air_clean = air_clean.drop(columns=['Air Quality'])
else:
    air_clean = pd.DataFrame()

# 2. Load WATER Dataset
water_df = pd.read_csv('datasets/tabular/Water_Potability_Kaggle.csv')
water_cols = ['ph', 'Conductivity', 'Organic_carbon', 'Potability']
if all(c in water_df.columns for c in water_cols):
    water_clean = water_df[water_cols].copy()
    # Potability: 1 = Potable (Risk 0), 0 = Not Potable (Risk 2)
    water_clean['Risk_Target'] = water_clean['Potability'].apply(lambda x: 0 if x == 1 else 2)
    water_clean['Domain'] = 'WATER'
    water_clean = water_clean.drop(columns=['Potability'])
    water_clean = water_clean.rename(columns={'ph': 'pH', 'Organic_carbon': 'DCO_proxy'})
else:
    water_clean = pd.DataFrame()

# 3. Load SOIL Dataset (Our synthetic Hackathon Tunisia data)
soil_df = pd.read_csv('datasets/tabular/Textile_Soil_Pollution_TN.csv')
soil_cols = ['Lead_Pb_mg_kg', 'Cadmium_Cd_mg_kg', 'Pollution_Risk_Level']
if all(c in soil_df.columns for c in soil_cols):
    soil_clean = soil_df[soil_cols].copy()
    def map_soil_risk(val):
        if val == 'High': return 2
        if val == 'Moderate': return 1
        return 0
    soil_clean['Risk_Target'] = soil_clean['Pollution_Risk_Level'].apply(map_soil_risk)
    soil_clean['Domain'] = 'SOIL'
    soil_clean = soil_clean.drop(columns=['Pollution_Risk_Level'])
else:
    soil_clean = pd.DataFrame()

# 4. Merge into a Unified Super-Dataset for XGBoost
# XGBoost inherently handles missing values (NaNs) very well, so keeping empty columns per domain is perfect.
merged_df = pd.concat([air_clean, water_clean, soil_clean], ignore_index=True)

# 5. One-Hot Encode the Domain categorical feature (WATER, AIR, SOIL)
merged_df = pd.get_dummies(merged_df, columns=['Domain'], prefix='', prefix_sep='')

# Shuffle the dataset
merged_df = merged_df.sample(frac=1, random_state=42).reset_index(drop=True)

output_path = 'datasets/tabular/EcoTextil_XGBoost_Cleaned.csv'
merged_df.to_csv(output_path, index=False)

print(f"Data Cleaning Complete! Unified dataset saved to: {output_path}")
print(f"Total Rows: {len(merged_df)}")
print("Columns ready for XGBoost Training:")
print(list(merged_df.columns))
