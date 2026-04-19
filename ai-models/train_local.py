import pandas as pd
import xgboost as xgb
import os

print("\n--- 🚀 EcoTextil XGBoost Trainer ---")
dataset_path = "../datasets/tabular/EcoTextil_XGBoost_Cleaned.csv"

if not os.path.exists(dataset_path):
    print(f"❌ Error: Dataset {dataset_path} not found.")
    print("Ensure the CSV is generated in the correct folder.")
    exit(1)

print(f"✅ Loading dataset from {dataset_path}...")
df = pd.read_csv(dataset_path)

# Separate features (X) and target (y)
X = df.drop(columns=['Risk_Target', 'Domain']).fillna(0)
y = df['Risk_Target']

print(f"⚙️  Training XGBClassifier on {len(df)} samples...")
print(f"📊 Features used: {list(X.columns)}")

# Using multi:softprob to output independent probabilities per class (Safe/Warning/Danger)
clf = xgb.XGBClassifier(
    objective="multi:softprob", 
    eval_metric="mlogloss", 
    max_depth=5, 
    n_estimators=150,
    learning_rate=0.1
)
clf.fit(X, y)

accuracy = clf.score(X, y) * 100
print(f"🎯 Final Training Accuracy: {accuracy:.2f}%")

model_path = "xgboost_ecotextil.json"
clf.save_model(model_path)

print(f"💾 Model architecture and weights successfully saved to: {model_path}\n")
