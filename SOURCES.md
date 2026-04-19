# 📊 EcoTextil Data Provenance

This document lists the official sources of the data used for the training and grounding of the **EcoTextil** AI system at the Monastir Hackathon 2026.

## 🛰️ Visual Intelligence (YOLOv11)
- **Source**: [Copernicus Sci-Hub](https://scihub.copernicus.eu/dhus/)
- **Instrument**: Sentinel-3 OLCI (Ocean and Land Colour Instrument)
- **Purpose**: Trained to detect pollution plumes, industrial discharge, and seawater discoloration in the Gulf of Monastir.
- **Data License**: Sentinel Data Policy (Free for use).

## 💨 Air Quality Intelligence (XGBoost)
- **Source**: [Prathamesh282 / Pollution-data-](https://github.com/Prathamesh282/Pollution-data-)
- **Purpose**: Multi-pollutant analysis (PM2.5, NO2, SO2, CO) for industrial monitoring in Monastir and Mahdia.
- **License**: Open Source / Creative Commons.

## 🌱 Soil & Agricultural Health (XGBoost)
- **Source 1**: [Global soil pollution by toxic metals (Dryad, 2025)](https://doi.org/10.5061/dryad.83bk3jb2z)
- **Source 2**: [Soil Pollution and Health Impacts (Kaggle)](https://www.kaggle.com/datasets/khushikyad001/soil-pollution-and-associated-health-impacts)
- **Source 3**: [Agricultural Lands around Dyeing/Textile Industries (Bangladesh Proxy)](https://banglajol.info/index.php/JESNR/article/view/9999)
- **Source 4**: [Heavy metal contamination from textile wastewater (Scientific Reports)](https://www.nature.com/articles/s41598-024-13357-w)
- **Purpose**: Derived soil heavy metal concentrations (Pb, Cd) specific to textile dye runoff. Used to calibrate the AI risk matrix for Tunisian agricultural zones bordering Monastir's industrial parks.
- **Purpose**: Used for multi-parameter risk classification (pH, Conductivity, Organic Carbon).
- **Secondary Source**: [Plotly Datasets - Water Quality](https://raw.githubusercontent.com/plotly/datasets/master/water_quality.csv)
- **Integration**: Trained on a hybrid dataset combining global metrics with local simulation scenarios.

## 🤖 Action Plan Grounding (Groq AI)
- **Source**: [National Portal of Open Data Tunisia](http://www.data.gov.tn/)
- **Document**: *Inventaire des points de rejet industriels et qualité des eaux (2023)*.
- **Secondary Source**: [WHO/WHO - Tunisia Health & Water Statistics](https://api.worldbank.org/v2/en/indicator/EG.ELC.ACCS.ZS?downloadformat=csv&country=TN)
- **Grounding Layer**: Used to provide technically accurate and legally compliant advice for Tunisian textile regulations.

---
*EcoTextil — For a cleaner, smarter Monastir.*
