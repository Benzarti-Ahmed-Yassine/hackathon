'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

export default function BlockchainStatus() {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        // Try Ganache local (from .env or default)
        const provider = new ethers.JsonRpcProvider('http://localhost:8545')
        const block = await provider.getBlockNumber()
        setBlockNumber(block)
        setStatus('connected')
      } catch (err: any) {
        setStatus('error')
        setError(err.message)
      }
    }
    checkConnection()
  }, [])

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Network Status</h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
          status === 'connected' ? 'bg-green-500/20 text-green-400' : 
          status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            status === 'connected' ? 'bg-green-400' : 
            status === 'error' ? 'bg-red-400' : 'bg-yellow-400'
          }`} />
          {status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
          <p className="text-slate-500 text-xs uppercase">Block Height</p>
          <p className="text-2xl font-mono">{blockNumber ?? '---'}</p>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
          <p className="text-slate-500 text-xs uppercase">Protocol</p>
          <p className="text-2xl font-mono">Ganache</p>
        </div>
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-400 bg-red-400/10 p-2 rounded">
          ⚠ {error?.includes('fetch') ? 'Ganache container not reachable at localhost:8545' : error}
        </p>
      )}
    </div>
  )
}
