# 🌍 EcoTextil Monastir: Système Hybride d'Audit Environnemental

**Projet Hackathon IA & Environnement** - *Surveillance multi-domaine (Eau, Air, Sol) pour le corridor textile Monastir-Mahdia.*

EcoTextil est une plateforme intégrée conçue pour résoudre la crise environnementale liée à l'industrie textile en Tunisie. Ce projet combine une **IA Hybride (XGBoost + YOLOv11)** pour l'évaluation des risques et un LLM souverain (**Groq**) pour la génération de plans d'action basés sur la norme tunisienne NT 106.02.

## 🚀 Fonctionnalités Clés

- **🧪 Audit Multi-Domaine** : Analyse de données tabulaires sur la qualité de l'eau, de l'air (PM2.5, NO2) et du sol (Plomb, Cadmium) via **XGBoost**.
- **👁️ Vision Multispectrale** : Analyse d'images satellites (Sentinel-3) avec **YOLOv11** pour la détection de panaches de pollution et le déversement de colorants.
- **🧠 Expert Réglementaire (Groq)** : Génération de recommandations et de plans d'actions ancrés dans les directives de l'ANPE et de l'ONAS.
- **📊 Design "Clean-Eco"** : Interface de contrôle épurée avec vue 3D intégrée.

## 🏗️ Architecture du Système

- **Frontend** : Next.js (React), rendu 3D (React Three Fiber)
- **Backend / IA** : FastAPI (Python), XGBoost, OpenCV, Ultralytics YOLOv11
- **Données** : Datasets fusionnés depuis *Copernicus*, *Dryad*, *UCI* et *FAO* (Voir `SOURCES.md`)
- **Orchestration** : Docker & Docker Compose

## 📦 Installation et Lancement

### 1. Prérequis
- Docker & Docker Compose
- Node.js & npm (pour le developpement Frontend)

### 2. Démarrer l'infrastructure
L'intégralité du système (Base de données, Frontend, et le conteneur IA) se lance via Docker Compose :
```powershell
docker-compose up -d --build
```

### 3. Entraînement Initial de l'IA (Auto-ML)
La plateforme intègre une fonctionnalité d'entraînement dynamique. Pour que l'IA XGBoost apprenne les spécificités du sol, de l'air et de l'eau de Monastir, exécutez la commande suivante (ou utilisez le bouton "Train" du Dashboard) :
```powershell
Invoke-RestMethod -Uri http://localhost:8000/train-xgboost -Method Post
```
*Cette action demandera au **ai-service** de lire les données unifiées, de générer le modèle `xgboost_ecotextil.json` et de le charger en direct.*

## 🧪 Tester l'IA Hybride

Pour évaluer un risque environnemental en envoyant des mesures de capteurs :
```powershell
Invoke-RestMethod -Uri http://localhost:8000/predict-hybrid -Method Post -ContentType "application/json" -Body '{"tabular_data": {"pH": 9.5, "Lead_Pb": 120, "PM2.5": 85}, "image_b64": ""}'
```

---
*Développé pour protéger le corridor textile de Monastir-Mahdia.*