const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { ethers } = require('ethers');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- GLOBAL STATE ---
let systemAccount = null;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const GANACHE_URL = process.env.GANACHE_URL || 'http://localhost:8545';

// SAEG Formula Constants
const CO2_WEIGHT = 0.25;
const WATER_WEIGHT = 0.50;
const WASTE_WEIGHT = 0.25;

// --- IOT SIMULATOR (Capstone) ---
const IoTSimulator = require('./iotSimulator');
const ioTDamemon = new IoTSimulator(GANACHE_URL, AI_SERVICE_URL);

// Start the 5-sec simulation loop for Hackathon Demo
ioTDamemon.start();

// --- DATABASE INITIALIZATION with RETRY ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const connectWithRetry = (attempts = 5) => {
  pool.connect((err, client, release) => {
    if (err) {
      if (attempts > 0) {
        console.log(`⏳ Waiting for PostgreSQL... (${attempts} attempts left)`);
        setTimeout(() => connectWithRetry(attempts - 1), 5000);
      } else {
        console.error('❌ Could not connect to PostgreSQL:', err.stack);
      }
    } else {
      console.log('✅ Connected to PostgreSQL successfully');
      release();
    }
  });
};

connectWithRetry();

// --- BLOCKCHAIN INITIALIZATION & DISCOVERY ---
const provider = new ethers.JsonRpcProvider(process.env.GANACHE_URL || 'http://localhost:8545');

const discoveryWithRetry = async (attempts = 5) => {
  try {
    const accounts = await provider.listAccounts();
    if (accounts.length > 0) {
      systemAccount = accounts[0].address;
      const blockNumber = await provider.getBlockNumber();
      console.log(`✅ Connected to Ganache. Block: ${blockNumber}`);
      console.log(`🔑 System Account Discovery: ${systemAccount}`);
    } else {
      throw new Error('No accounts found in Ganache');
    }
  } catch (error) {
    if (attempts > 0) {
      console.log(`⏳ Waiting for Ganache... (${attempts} attempts left)`);
      setTimeout(() => discoveryWithRetry(attempts - 1), 5000);
    } else {
      console.error("❌ Failed to connect to Ganache:", error.message);
    }
  }
};

discoveryWithRetry();

// --- API ENDPOINTS ---

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    blockchain: !!systemAccount 
  });
});

app.get('/api/blockchain/info', async (req, res) => {
  try {
    const blockNumber = await provider.getBlockNumber();
    const network = await provider.getNetwork();
    res.json({ 
      blockNumber, 
      chainId: network.chainId.toString(),
      systemAccount: systemAccount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint serving the live IoT Map data
app.get('/api/factories', (req, res) => {
  res.json(ioTDamemon.FACTORY_STATES || ioTDamemon.FACTORES_STATUS || ioTDamemon.getFactoresStatus());
});

// --- SAEG SPECIFIC ENDPOINTS ---

/**
 * Calculates IPT and records it in Postgres & Blockchain
 */
app.post('/api/saeg/audit', async (req, res) => {
  const { company_id, co2, water_vol, toxicity, waste } = req.body;

  try {
    // 1. Calculate IPT Score
    // Formula: IPT = (CO2 * 0.25) + (WaterVolume * Toxicity * 0.50) + (Waste * 0.25)
    const iptScore = (co2 * CO2_WEIGHT) + (water_vol * toxicity * WATER_WEIGHT) + (waste * WASTE_WEIGHT);
    
    // 2. Map to Classification
    let classification = 'VERT';
    if (iptScore > 150) classification = 'NOIR';
    else if (iptScore > 100) classification = 'ROUGE';
    else if (iptScore > 50) classification = 'ORANGE';

    // 3. Save to Database
    const dbResult = await pool.query(
      `INSERT INTO ipt_records (company_id, score, co2_val, water_val, toxicity_ind, waste_val) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [company_id, iptScore, co2, water_vol, toxicity, waste]
    );

    // 4. Record on Blockchain (Mocking for now, as address needs to be deployed)
    console.log(`[Blockchain] Recording IPT ${iptScore} for company ${company_id}`);

    // 5. Generate AI Action Plan via Ollama
    let actionPlan = "Génération du plan en cours...";
    try {
      const aiResponse = await fetch(`${AI_SERVICE_URL}/action-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ipt_score: iptScore,
          classification,
          anomaly_risk: classification === 'ROUGE' || classification === 'NOIR', // Simplified logic
          sensor_type: 'Audit Global',
          recent_trend: [iptScore]
        })
      });
      const aiData = await aiResponse.json();
      actionPlan = aiData.action_plan || "Désolé, l'IA n'a pas pu générer de plan.";
    } catch (e) {
      console.warn("Ollama Action Plan failed:", e.message);
      actionPlan = "Service Ollama indisponible pour le moment.";
    }

    res.json({
      status: 'SUCCESS',
      ipt_score: iptScore,
      classification,
      action_plan: actionPlan,
      db_record: dbResult.rows[0]
    });
  } catch (error) {
    console.error('Audit Error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Triggers the Satellite Vision Audit
 */
app.post('/api/saeg/satellite', async (req, res) => {
  const { image_name } = req.body;

  try {
    const response = await fetch(`${AI_SERVICE_URL}/analyze-satellite?image_name=${image_name || ''}`, {
      method: 'GET'
    });

    const analysis = await response.json();
    res.json(analysis);
  } catch (error) {
    console.error('Satellite AI Error:', error);
    res.status(500).json({ error: 'AI Satellite Service Unreachable' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
