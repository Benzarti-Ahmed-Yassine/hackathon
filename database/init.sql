-- SQL Initialization for Hackathon Database
-- Used to securely store blockchain blocks and transactional metadata

CREATE TABLE IF NOT EXISTS blocks (
    block_number BIGINT PRIMARY KEY,
    block_hash TEXT UNIQUE NOT NULL,
    parent_hash TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    transactions_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS transactions (
    tx_hash TEXT PRIMARY KEY,
    block_number BIGINT REFERENCES blocks(block_number),
    from_address TEXT NOT NULL,
    to_address TEXT,
    value TEXT, -- Stored as string to handle high precision (Wei)
    gas_used BIGINT,
    method_name TEXT
);

-- SAEG Monastir Expansion
-- Tables for companies, IoT devices, and environmental monitoring

CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT, -- Coordinate or sector
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE, TUTELLE, CLOSED
    classification TEXT DEFAULT 'VERT', -- VERT, ORANGE, ROUGE, NOIR
    wallet_address TEXT UNIQUE -- Company ETH wallet for tax collection
);

CREATE TABLE IF NOT EXISTS sensor_definitions (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL, -- CO2, pH, BOD, Metal, WaterVolume
    unit TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sensors (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id),
    type_id INT REFERENCES sensor_definitions(id),
    last_reading FLOAT,
    last_reading_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ipt_records (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id),
    score FLOAT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    co2_val FLOAT,
    water_val FLOAT,
    toxicity_ind FLOAT,
    waste_val FLOAT
);

-- Initial Mock Data for SAEG
INSERT INTO sensor_definitions (type, unit) VALUES 
('CO2', 'kg/t'),
('pH', 'pH'),
('BOD', 'mg/l'),
('WaterVolume', 'm3'),
('Waste', 'kg')
ON CONFLICT DO NOTHING;

INSERT INTO companies (name, location, classification, wallet_address) VALUES 
('Monastir Textile SA', 'Skanes', 'VERT', '0x90F79bf6EB2c4f870365E785982E1f101E93b906'),
('Sahel Dyeing', 'Sidi Benour', 'ORANGE', '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65')
ON CONFLICT DO NOTHING;
