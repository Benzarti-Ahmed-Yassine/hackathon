const { ethers } = require('ethers');

// Mock Data for Monastir / Mahdia Factories
const FACTORIES = [
    { id: 'F001', name: 'SITEX Ksar Hellal', lat: 35.6333, lng: 10.8833, status: 'VERT', lastReading: null, history: [], txHash: null },
    { id: 'F002', name: 'WashPlant Sayada', lat: 35.6667, lng: 10.8500, status: 'VERT', lastReading: null, history: [], txHash: null },
    { id: 'F003', name: 'Teinture Mahdia', lat: 35.5047, lng: 11.0622, status: 'VERT', lastReading: null, history: [], txHash: null }
];

class IoTSimulator {
    constructor(providerUrl, aiServiceUrl) {
        this.provider = new ethers.JsonRpcProvider(providerUrl);
        this.aiServiceUrl = aiServiceUrl;
        
        // Use a dummy funded wallet for Hackathon demonstrations
        this.wallet = new ethers.Wallet("0x1111111111111111111111111111111111111111111111111111111111111111", this.provider);
        console.log(`[IoT Daemon] Initialized with simulator wallet: ${this.wallet.address}`);
    }

    start() {
        console.log("[IoT Daemon] Starting 5-second sensor emission cycle...");
        setInterval(() => this.pollSensors(), 5000);
    }

    async pollSensors() {
        for (let factory of FACTORIES) {
            // Generate realistic random noise for the sensors
            const reading = {
                pH: (Math.random() * (9.5 - 5.0) + 5.0).toFixed(2),
                Lead_Pb: (Math.random() * 150).toFixed(2),
                PM25: (Math.random() * 80).toFixed(2),
                CO2: (Math.random() * 50).toFixed(2),
                timestamp: Date.now()
            };

            // 1. Compute IPT (Indice Pollution Textile) locally
            const ipt = (reading.CO2 * 0.25) + (reading.Lead_Pb * 0.50) + (Math.abs(7 - reading.pH) * 10);
            
            // 2. Call AI Service via FastAPI
            try {
                const aiRes = await fetch(`${this.aiServiceUrl}/predict-hybrid`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tabular_data: reading,
                        image_b64: ""
                    })
                });
                
                if (aiRes.ok) {
                    const aiData = await aiRes.json();
                    factory.status = this.mapRiskToColor(aiData.tabular_prediction.risk_index);
                    factory.aiReport = aiData.action_plan.plan;
                } else {
                    factory.status = ipt > 100 ? 'ROUGE' : (ipt > 50 ? 'ORANGE' : 'VERT');
                    factory.aiReport = "Connexion AI perdue.";
                }
            } catch (e) {
                // Fallback deterministic logic if AI is down
                factory.status = ipt > 100 ? 'ROUGE' : (ipt > 50 ? 'ORANGE' : 'VERT');
                factory.aiReport = "Synthèse locale (AI injoignable).";
            }

            // 3. Register on Blockchain
            try {
                // Self-transaction to etch the IPT score hash on the Ganache block
                const tx = await this.wallet.sendTransaction({
                    to: this.wallet.address,
                    value: 0,
                    data: ethers.hexlify(ethers.toUtf8Bytes(`IPT:${ipt.toFixed(0)}|F:${factory.id}`))
                });
                factory.txHash = tx.hash;
            } catch (e) {
                factory.txHash = "0xGanacheNotRunning...";
            }

            factory.lastReading = { ...reading, ipt: parseFloat(ipt.toFixed(2)), ges: parseFloat((reading.CO2 * 1.5).toFixed(2)) };
            
            // Push to history for Evolution Charting (Max 20 readings to save memory)
            factory.history.push(factory.lastReading);
            if (factory.history.length > 20) {
                factory.history.shift();
            }

            console.log(`[IoT] Factory ${factory.id} polled -> Status: ${factory.status} | Hash: ${factory.txHash.substring(0,10)}... | Hist: ${factory.history.length}`);
        }
    }

    mapRiskToColor(riskIndex) {
        if (riskIndex === 2) return 'ROUGE';
        if (riskIndex === 1) return 'ORANGE';
        return 'VERT';
    }

    getFactoresStatus() {
        return FACTORIES;
    }
}

module.exports = IoTSimulator;
