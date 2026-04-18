'use client'

import { useState } from 'react'
import { ethers } from 'ethers'

// ABI extracted from Hackathon.sol
const HACKATHON_ABI = [
  'function registerProject(string memory _name) public',
  'function projectCount() public view returns (uint256)',
  'function projects(uint256) public view returns (string name, address leader, uint256 score, bool exists)',
  'event ProjectRegistered(uint256 indexed id, string name, address leader)',
]

// Address where the contract was deployed (update after deploy)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''
const GANACHE_URL = process.env.NEXT_PUBLIC_GANACHE_URL || 'http://localhost:8545'

type TxStatus = 'idle' | 'pending' | 'success' | 'error'

export default function ProjectRegistration() {
  const [projectName, setProjectName] = useState('')
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleRegister = async () => {
    if (!projectName.trim()) return

    setTxStatus('pending')
    setTxHash(null)
    setErrorMsg(null)

    try {
      // Use Ganache provider directly (no Metamask required for local dev)
      const provider = new ethers.JsonRpcProvider(GANACHE_URL)
      const accounts = await provider.listAccounts()
      if (accounts.length === 0) throw new Error('No accounts found in Ganache')

      const signer = await provider.getSigner(accounts[0].address)

      if (!CONTRACT_ADDRESS) {
        // Simulate success for demo when no contract is deployed
        await new Promise(r => setTimeout(r, 1500))
        setTxHash('0xDEMO_' + Math.random().toString(16).slice(2, 18).toUpperCase())
        setTxStatus('success')
        setProjectName('')
        return
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, HACKATHON_ABI, signer)
      const tx = await contract.registerProject(projectName)
      setTxHash(tx.hash)
      await tx.wait()
      setTxStatus('success')
      setProjectName('')
    } catch (err: any) {
      setTxStatus('error')
      setErrorMsg(err.message || 'Transaction failed')
    }
  }

  return (
    <div className="glass-panel p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Register Project</h3>
          <p className="text-slate-500 text-xs">Submit your team project to the blockchain</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm text-slate-400 font-medium" htmlFor="project-name-input">
          Project Name
        </label>
        <input
          id="project-name-input"
          type="text"
          value={projectName}
          onChange={e => setProjectName(e.target.value)}
          placeholder="e.g. MedAI Diagnostics"
          disabled={txStatus === 'pending'}
          className="w-full bg-slate-900/80 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-all disabled:opacity-50"
          onKeyDown={e => e.key === 'Enter' && handleRegister()}
        />
      </div>

      <button
        id="register-project-btn"
        onClick={handleRegister}
        disabled={!projectName.trim() || txStatus === 'pending'}
        className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2
          ${txStatus === 'pending'
            ? 'bg-indigo-500/40 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 shadow-lg shadow-indigo-500/25 active:scale-95'
          }
          disabled:opacity-50`}
      >
        {txStatus === 'pending' ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Broadcasting Transaction...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
            Register on Blockchain
          </>
        )}
      </button>

      {/* Status feedback */}
      {txStatus === 'success' && txHash && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl space-y-1">
          <p className="text-green-400 font-semibold text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Project registered successfully!
          </p>
          <p className="text-slate-500 text-xs font-mono break-all">
            Tx: {txHash}
          </p>
        </div>
      )}

      {txStatus === 'error' && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-red-400 font-semibold text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            Transaction Failed
          </p>
          <p className="text-slate-500 text-xs mt-1 font-mono">{errorMsg}</p>
        </div>
      )}
    </div>
  )
}
