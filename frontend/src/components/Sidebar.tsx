'use client'

import React, { useState, useEffect } from 'react'

interface PanelProps {
  onClose: () => void
  activeNode: string | null
}

export default function Sidebar({ activeNode, onClose }: PanelProps) {
  if (!activeNode) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      
      <div className="w-full max-w-xl bg-white h-full shadow-2xl relative z-10 pointer-events-auto flex flex-col transform transition-transform duration-500 ease-out animate-slide-in">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-emerald-50 text-emerald-900">
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {activeNode === 'account' && '🏢'}
              {activeNode === 'audit' && '🧪'}
              {activeNode === 'prediction' && '🤖'}
              {activeNode === 'chat' && '💬'}
            </span>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">
                {activeNode === 'account' && 'Compte Société'}
                {activeNode === 'audit' && 'Moteur d\'Audit IPT'}
                {activeNode === 'prediction' && 'Prédictions de Pollution'}
                {activeNode === 'chat' && 'Assistant EcoTextil'}
              </h2>
              <p className="text-xs opacity-70">Monastir Smart Environmental Audit</p>
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
        </div>
        
        {/* Footer */}
        <div className="p-6 bg-white border-t text-center">
          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em]">
            EcoTextil — Powered by Groq & LSTM AI
          </p>
        </div>
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
            <div className={`px-4 py-2 rounded-full font-bold text-sm ${
              result.classification === 'VERT' ? 'bg-green-500' : 'bg-red-500'
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
