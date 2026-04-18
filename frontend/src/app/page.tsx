'use client'

import React, { useState } from 'react'
import Scene from '@/components/Scene'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  const [activeNode, setActiveNode] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar activeNode={activeNode} onClose={() => setActiveNode(null)} />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[100vh] bg-emerald-50/50 rounded-l-[100px] -z-10" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl -z-10" />

      {/* ── Navigation / Header ── */}
      <nav className="flex items-center justify-between px-8 py-6 z-20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-black">E</span>
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tighter">EcoTextil</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-emerald-500 transition-colors">Vision</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Partenaires</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Ressources</a>
        </div>
        <button 
          onClick={() => setActiveNode('account')}
          className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-emerald-600 transition-all shadow-xl"
        >
          Espace Industriel
        </button>
      </nav>

      {/* ── Hero Section ── */}
      <div className="flex-1 flex flex-col lg:flex-row items-center px-8 lg:px-20 gap-10 z-10">
        
        {/* Left: Branding & Copy */}
        <div className="w-full lg:w-1/2 space-y-8 py-10">
          <div className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
            Hackathon Monastir 2026
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
            Smart <br />
            <span className="eco-gradient">Audit.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
            Surveillance intelligente de la pollution textile : <span className="text-emerald-500 font-bold">eau, air, sol.</span>
          </p>
          
          <div className="flex items-center gap-4 pt-4">
            <button 
              onClick={() => setActiveNode('audit')}
              className="px-8 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              Lancer un Audit IPT
            </button>
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
              ))}
              <div className="pl-6 text-xs font-bold text-slate-400">
                +45 Unités auditées à Monastir
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-10">
            <div className="glass-panel p-4 border-slate-100">
              <p className="text-2xl font-black text-slate-800">92%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Précision LSTM</p>
            </div>
            <div className="glass-panel p-4 border-slate-100">
              <p className="text-2xl font-black text-slate-800">Real-time</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suivi Blockchain</p>
            </div>
          </div>
        </div>

        {/* Right: 3D Scene */}
        <div className="w-full lg:w-1/2 h-[600px] relative rounded-[40px] overflow-hidden lg:shadow-2xl lg:shadow-emerald-500/10">
          <Scene onNodeClick={(node) => setActiveNode(node)} />
          
          {/* 3D Floating Caption */}
          <div className="absolute bottom-10 left-10 glass-panel p-6 max-w-xs animate-float">
            <h4 className="font-bold text-slate-800 text-sm mb-1 uppercase">Infrastructure SAEG</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explorez les modules en cliquant sur les sphères interactives.
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="px-8 py-10 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
           <p className="text-sm font-bold text-slate-800 italic">EcoTextil Monastir</p>
           <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Université de Monastir — Palais des Sciences</p>
        </div>
        <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-emerald-500 transition-colors">GitHub</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Documentation</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">LinkedIn</a>
        </div>
      </footer>
    </main>
  )
}
