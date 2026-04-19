'use client'

import React, { useState, useEffect } from 'react'

interface PanelProps {
  onClose: () => void
  activeNode: string | null
  activeFactory?: any
}

export default function Sidebar({ activeNode, activeFactory, onClose }: PanelProps) {
  if (!activeNode) return (
    <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-[40px] border-2 border-dashed border-slate-200">
      <div className="text-center">
        <span className="text-6xl bloc mb-4">🌍</span>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-4">Sélectionnez une usine sur la carte</p>
        <p className="text-slate-500 text-sm mt-2">pour afficher son Audit et son Bilan Légal</p>
      </div>
    </div>
  )

  return (
    <div className="w-full h-full bg-white rounded-[40px] shadow-2xl relative flex flex-col border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b flex justify-between items-center bg-emerald-50 text-emerald-900">
        <div className="flex items-center gap-3">
          <span className="text-3xl">
            {activeNode === 'account' && '🏢'}
            {activeNode === 'audit' && '🧪'}
            {activeNode === 'prediction' && '🤖'}
            {activeNode === 'chat' && '💬'}
            {activeNode === 'satellite' && '🛰️'}
          </span>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              {activeNode === 'account' && 'Compte Société'}
              {activeNode === 'audit' && 'Moteur d\'Audit IPT'}
              {activeNode === 'prediction' && 'Prédictions de Pollution'}
              {activeNode === 'chat' && 'Assistant EcoTextil'}
              {activeNode === 'factory_details' && 'Dossier Industriel Continu'}
              {activeNode === 'satellite' && 'Vision Satellite'}
            </h2>
            <p className="text-xs opacity-70">
              {activeNode === 'factory_details' ? activeFactory?.name : 'Monastir Smart Environmental Audit'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-emerald-200/50 rounded-full transition-colors text-emerald-800"
        >
          ✕
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
        {activeNode === 'account' && <AccountModule />}
        {activeNode === 'audit' && <AuditModule />}
        {activeNode === 'prediction' && <PredictionModule />}
        {activeNode === 'chat' && <ChatModule />}
        {activeNode === 'factory_details' && <FactoryDetailsModule factory={activeFactory} />}
        {activeNode === 'satellite' && <SatelliteModule />}
      </div>

      {/* Footer */}
      <div className="p-6 bg-white border-t text-center">
        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em]">
          EcoTextil
        </p>
      </div>
    </div>
  )
}

function AccountModule() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>📝</span> Identification de l'Unité
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom de l'Entreprise</label>
            <input type="text" className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 ring-emerald-500 outline-none" placeholder="Ex: Monastir Textile Corp" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Numéro de Licence Industrielle</label>
            <input type="text" className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 ring-emerald-500 outline-none" placeholder="TX-2024-XXXX" />
          </div>
          <button className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
            Enregistrer ma Société
          </button>
        </div>
      </div>
    </div>
  )
}

function AuditModule() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runAudit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target)
    const data = {
      company_id: 1,
      co2: Number(formData.get('co2')),
      water_vol: Number(formData.get('water')),
      toxicity: Number(formData.get('tox')),
      waste: Number(formData.get('waste'))
    }

    try {
      const res = await fetch('http://localhost:5000/api/saeg/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const json = await res.json()
      setResult(json)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={runAudit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-emerald-800 mb-4 uppercase text-sm tracking-widest">Saisie des Données Réelles</h3>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Émission CO2 (t)" name="co2" />
          <InputField label="Volume Eau (m³)" name="water" />
          <InputField label="Toxicité (Index)" name="tox" />
          <InputField label="Déchets Solides (kg)" name="waste" />
        </div>
        <button disabled={loading} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50">
          {loading ? 'Calcul de l\'IPT...' : 'Lancer l\'Audit Stratégique'}
        </button>
      </form>

      {result && (
        <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-2xl space-y-4 animate-fade-in">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Score IPT Final</p>
              <h2 className="text-6xl font-black">{result.ipt_score}</h2>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold text-sm ${result.classification === 'VERT' ? 'bg-green-500' : 'bg-red-500'
              }`}>
              {result.classification}
            </div>
          </div>
          <div className="pt-4 border-t border-emerald-800">
            <p className="text-emerald-300 text-xs uppercase font-bold mb-2">Conseil Stratégique (Action Plan):</p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.action_plan}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function PredictionModule() {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">📈</span>
      </div>
      <h3 className="text-2xl font-black text-slate-800 mb-2">Surveillance Prédictive</h3>
      <p className="text-slate-500 mb-8 max-w-sm mx-auto">Le modèle LSTM analyse les tendances de pH et de métaux lourds dans la nappe phréatique.</p>
      <div className="h-40 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
        <p className="text-slate-300 font-mono text-xs italic">Graphique de tendances temps-réel (LSTM simulation)</p>
      </div>
    </div>
  )
}

function ChatModule() {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-emerald-50 p-4 rounded-xl text-emerald-800 text-sm mb-4 border border-emerald-100">
        Bonjour ! Je suis votre conseiller <strong>EcoTextil AI</strong>. Comment puis-je optimiser votre empreinte écologique aujourd'hui ?
      </div>
      <div className="flex-1 space-y-4">
        {/* Chat bubbles would go here */}
      </div>
      <div className="mt-auto pt-4">
        <input
          type="text"
          className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-inner outline-none focus:ring-2 ring-emerald-500 transition-all"
          placeholder="Posez une question technique..."
        />
      </div>
    </div>
  )
}

function InputField({ label, name }: { label: string, name: string }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">{label}</label>
      <input
        name={name}
        type="number"
        step="0.01"
        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white transition-colors"
      />
    </div>
  )
}

export function FactoryDetailsModule({ factory }: { factory: any }) {
  if (!factory) return <p>Chargement des données...</p>

  const isDanger = factory.status === 'ROUGE'
  const isWarning = factory.status === 'ORANGE'

  return (
    <div className="space-y-6">

      {/* 1. Bloc Blockchain (Le Sceau de Confiance) */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            ⛓️
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em]">Enregistrement Blockchain ETH</p>
            <p className="text-xs text-slate-500 font-mono mt-1 break-all bg-slate-50 p-2 rounded">Tx: {factory.txHash}</p>
          </div>
          <div className="text-emerald-700 text-xs font-bold px-2 py-1 bg-emerald-100 rounded">Smart Contract Synced</div>
        </div>
      </div>

      {/* 2. Capteurs & Métriques Environnementales */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Plomb (Pb)</p>
          <p className="text-2xl font-black text-slate-800">{factory.lastReading?.Lead_Pb} <span className="text-xs text-slate-400 font-normal">mg/L</span></p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Particules PM 2.5</p>
          <p className="text-2xl font-black text-slate-800">{factory.lastReading?.PM25} <span className="text-xs text-slate-400 font-normal">µg/m³</span></p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Émissions CO₂</p>
          <p className="text-2xl font-black text-slate-800">{factory.lastReading?.CO2} <span className="text-xs text-slate-400 font-normal">kg/h</span></p>
        </div>
        <div className="bg-emerald-500 p-4 rounded-2xl border border-emerald-600 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] uppercase font-bold text-white/90 tracking-widest">Bilan GES (eq. Carbone)</p>
          <p className="text-2xl font-black text-white">{factory.lastReading?.ges} <span className="text-xs text-white/80 font-normal">TeqCO2</span></p>
        </div>
      </div>

      {/* 2.5 Rapport d'Évolution (Aide à la Décision) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm mt-4">
        <h4 className="text-[10px] uppercase text-emerald-600 font-bold mb-3 flex items-center justify-between">
          <span>📉 Télémétrie d'Évolution (IPT)</span>
          <span className="text-emerald-500">Temps Réel</span>
        </h4>
        <div className="flex items-end gap-1 h-12 w-full mt-2">
          {factory.history && factory.history.length > 0 ? (
            factory.history.map((record: any, idx: number) => {
              const maxIpt = Math.max(...factory.history.map((r: any) => r.ipt), 100);
              const heightPercent = Math.min((record.ipt / maxIpt) * 100, 100);
              const barColor = record.ipt > 100 ? 'bg-red-500' : (record.ipt > 50 ? 'bg-orange-500' : 'bg-emerald-500');

              return (
                <div
                  key={idx}
                  className={`flex-1 rounded-t-sm transition-all duration-300 ${barColor} opacity-70 hover:opacity-100`}
                  style={{ height: `${heightPercent}%`, minHeight: '10%' }}
                  title={`Score: ${record.ipt} | Heure: ${new Date(record.timestamp).toLocaleTimeString()}`}
                />
              );
            })
          ) : (
            <div className="text-xs text-slate-400 w-full text-center">Acquisition des données...</div>
          )}
        </div>
      </div>

      {/* 3. Analyse AI & Diagnostic */}
      <div className={`p-6 rounded-3xl shadow-xl transition-all ${isDanger ? 'bg-red-500' : (isWarning ? 'bg-orange-500' : 'bg-emerald-500')}`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-white/80 text-[10px] uppercase font-black tracking-[0.2em]">Diagnostic IA (XGBoost)</p>
            <h3 className="text-3xl font-black text-white mt-1">
              {isDanger ? 'Risque Majeur' : (isWarning ? 'Avertissement' : 'Conforme Norme')}
            </h3>
          </div>
          <div className="bg-white/20 px-3 py-2 rounded-xl backdrop-blur-md">
            <p className="text-white text-[10px] uppercase font-bold text-center">Score IPT</p>
            <p className="text-xl font-black text-white text-center leading-none">{factory.lastReading?.ipt}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl text-slate-800 shadow-inner">
          <p className="text-xs uppercase font-black text-slate-400 mb-2 flex items-center gap-2">
            <span>🧠</span> Recommandation Groq
          </p>
          <div className="text-sm leading-relaxed prose max-w-none">
            {factory.aiReport}
          </div>
        </div>
      </div>

      {/* 4. Ethereum Financial Taxation Engine */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <p className="text-white/80 text-[10px] uppercase font-black tracking-[0.2em]">Pénalité Fiscale Web3</p>
        <div className="flex items-end justify-between mt-2 mb-4">
          <div>
            <span className="text-4xl font-black text-white">{(factory.lastReading?.ipt * 0.05).toFixed(3)}</span>
            <span className="text-lg font-bold text-white/70 ml-2">ETH</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/50 uppercase font-black">Base de calcul</p>
            <p className="text-xs text-white font-mono">0.05 ETH/point IPT</p>
          </div>
        </div>

        <button className="w-full py-4 bg-white text-red-600 font-black tracking-widest uppercase text-xs rounded-xl shadow-lg hover:bg-slate-100 transition-colors active:scale-95 flex items-center justify-center gap-2">
          <span>⚡</span> Traiter le paiement Blockchain
        </button>
      </div>

    </div>
  )
}
function SatelliteModule() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runSatelliteAudit = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/saeg/satellite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_name: "2020-03-01-00_00_2020-05-20-23_59_Sentinel-2_L2A_True_color.tiff" })
      })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-emerald-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <span>🛰️</span> Surveillance Côtière
          </h3>
          <p className="text-emerald-100 text-sm mb-6">
            Analyse multispectrale via Sentinel-2 pour détecter les déversements illégaux et les panaches de pollution.
          </p>
          <button 
            onClick={runSatelliteAudit}
            disabled={loading}
            className="w-full py-4 bg-white text-emerald-900 font-black uppercase text-xs tracking-widest rounded-xl hover:bg-emerald-50 transition-all disabled:opacity-50"
          >
            {loading ? 'Calcul YOLO en cours...' : 'Lancer le Scan Littoral'}
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10 scale-150">🛰️</div>
      </div>

      {result && (
        <div className="animate-fade-in space-y-4">
          <div className="bg-white border-2 border-slate-100 p-5 rounded-3xl shadow-sm">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Résultats Vision Artificielle</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Niveau de risque estimé</span>
                <span className={`font-black ${result.level === 'VERT' ? 'text-emerald-500' : 'text-red-500'}`}>{result.level}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Détections YOLO</span>
                <span className="font-bold">{result.detections.length} anomalie(s)</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
            <p className="text-[10px] font-black uppercase text-emerald-600 mb-2 flex items-center gap-2">
              <span>🧠</span> Plan d'Action Groq (Géo-Référé)
            </p>
            <div className="text-sm text-emerald-900 leading-relaxed italic prose prose-sm">
              {result.action_plan}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
