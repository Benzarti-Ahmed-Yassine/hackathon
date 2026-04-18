const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { ethers } = require('ethers');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- GLOBAL STATE ---
let systemAccount = null;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://ai-service:8000';

// SAEG Formula Constants
const CO2_WEIGHT = 0.25;
const WATER_WEIGHT = 0.50;
const WASTE_WEIGHT = 0.25;

// --- FIREBASE INITIALIZATION ---
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './config/firebase-service-account.json';

try {
  if (fs.existsSync(serviceAccountPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(require(path.resolve(serviceAccountPath)))
    });
    console.log('✅ Firebase Admin initialized successfully');
  } else {
    console.warn('⚠️ Firebase service account file not found. Firestore features will be disabled.');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase:', error.message);
}

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
    firebase: !!admin.apps.length,
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
    // In real use, we would call saegContract.updateIPT(companyWallet, iptScore * 100)
    console.log(`[Blockchain] Recording IPT ${iptScore} for company ${company_id}`);

    res.json({
      status: 'SUCCESS',
      ipt_score: iptScore,
      classification,
      db_record: dbResult.rows[0]
    });
  } catch (error) {
    console.error('Audit Error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Calls the AI Service for risk prediction
 */
app.post('/api/saeg/predict', async (req, res) => {
  const { history, sensor_type } = req.body;

  try {
    // Call the AI Service (FastAPI)
    const response = await fetch(`${AI_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, sensor_type })
    });

    const prediction = await response.json();
    res.json(prediction);
  } catch (error) {
    console.error('AI Prediction Error:', error);
    res.status(500).json({ error: 'AI Service Unreachable' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
