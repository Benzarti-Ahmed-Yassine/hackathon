'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import dynamic from 'next/dynamic'

// Dynamically import Map with SSR disabled
const MapMonastir = dynamic(() => import('@/components/MapMonastir'), { ssr: false })
const Scene = dynamic(() => import('@/components/Scene'), { ssr: false })

export default function Home() {
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [activeFactory, setActiveFactory] = useState<any>(null)

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* ── Top Navigation / Header ── */}
      <nav className="bg-white flex items-center justify-between px-8 py-5 border-b border-slate-100 shadow-sm z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <div>
            <span className="text-xl font-black text-slate-800 tracking-tight block leading-none">SAEG Monastir</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Audit & Blockchain</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-emerald-500 transition-colors">Portail Web3</a>
          <a href="#" className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Réseau Actif</a>
        </div>
      </nav>

      {/* ── Hero & 3D Interactive Simulation ── */}
      <div className="bg-white px-8 py-10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between border-b border-slate-100 shadow-sm z-10 w-full min-h-[600px] lg:h-[600px]">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 rounded-l-full -z-10" />

        <div className="max-w-2xl z-10">
          <div className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 border border-emerald-200">
            Tableau de Bord Décisionnel
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter">
            Contrôle <br />
            Environnemental <br />
            <span className="eco-gradient">Immuable & IA.</span>
          </h1>
          <p className="text-base text-slate-500 font-medium mt-6 leading-relaxed max-w-lg">
            Évaluez le rendement journalier, trackez les émissions via IoT et prélevez la taxe Blockchain immédiatement. Cliquez sur une usine sur la carte pour commencer.
          </p>
          
          <div className="flex gap-4 mt-10">
            <button className="px-8 py-4 bg-emerald-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all hover:-translate-y-1 active:scale-95">
              Explorer le Réseau
            </button>
            <button className="px-8 py-4 bg-white text-slate-800 font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl border border-slate-100 hover:bg-slate-50 transition-all hover:-translate-y-1 active:scale-95">
              Documentation AI
            </button>
          </div>
        </div>

        {/* The requested "White interactive 3D simulation" */}
        <div className="w-full lg:w-[600px] h-[500px] lg:h-full relative z-0 mt-8 lg:mt-0 lg:absolute lg:right-0">
           <Scene onNodeClick={(node) => {
             setActiveFactory(null)
             setActiveNode(node)
           }} />
           <div className="absolute top-10 right-10 glass-panel p-4 z-20">
             <div className="flex items-center gap-2 mb-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-[10px] uppercase font-bold text-slate-600 tracking-widest">Modèle LSTM Actif</span>
             </div>
             <p className="text-[9px] text-slate-400 font-medium max-w-[150px]">Précision de détection des anomalies : 98.4%</p>
           </div>
        </div>
      </div>

      {/* ── Split Screen Dashboard (Map Left, Data Right) ── */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 min-h-[85vh]">
        
        {/* Left: Map Layer */}
        <div className="w-full lg:w-[60%] h-[500px] lg:h-auto rounded-[40px] overflow-hidden shadow-2xl border border-slate-200 relative bg-white group transition-all duration-500 hover:border-emerald-200">
          <MapMonastir onFactoryClick={(factory) => {
            setActiveFactory(factory)
            setActiveNode('factory_details')
          }} />
          
          <div className="absolute bottom-6 left-6 z-10 glass-panel p-4 pointer-events-none group-hover:translate-x-2">
            <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Système de Cartographie</p>
            <p className="text-xs text-slate-500">Visualisation IoT en temps réel</p>
          </div>
        </div>

        {/* Right: Permanent Sidebar Dashboard */}
        <div className="w-full lg:w-[40%] h-[600px] lg:h-auto animate-fade-in">
          <Sidebar 
            activeNode={activeNode} 
            activeFactory={activeFactory}
            onClose={() => { setActiveNode(null); setActiveFactory(null); }} 
          />
        </div>

      </div>

    </main>
  )
}

