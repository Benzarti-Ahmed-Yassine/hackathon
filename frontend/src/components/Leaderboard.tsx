'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const HACKATHON_ABI = [
  'function projectCount() public view returns (uint256)',
  'function projects(uint256) public view returns (string name, address leader, uint256 score, bool exists)',
]

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''
const GANACHE_URL = process.env.NEXT_PUBLIC_GANACHE_URL || 'http://localhost:8545'

// Demo data shown when no contract is deployed
const DEMO_PROJECTS = [
  { id: 1, name: 'MedAI Diagnostics', leader: '0xf39F...2266', score: 92 },
  { id: 2, name: 'AgriSense ML', leader: '0x7099...79C8', score: 87 },
  { id: 3, name: 'EduBot Neural', leader: '0x3C44...73BC', score: 74 },
  { id: 4, name: 'SmartGrid Vision', leader: '0x9065...4EC7', score: 68 },
  { id: 5, name: 'CyberShield AI', leader: '0x1CBd...56e7', score: 55 },
]

type Project = {
  id: number
  name: string
  leader: string
  score: number
}

const MEDAL = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true)
      try {
        if (!CONTRACT_ADDRESS) throw new Error('No contract deployed')
        const provider = new ethers.JsonRpcProvider(GANACHE_URL)
        const contract = new ethers.Contract(CONTRACT_ADDRESS, HACKATHON_ABI, provider)
        const count: bigint = await contract.projectCount()
        const list: Project[] = []
        for (let i = 1; i <= Number(count); i++) {
          const p = await contract.projects(i)
          list.push({
            id: i,
            name: p.name,
            leader: p.leader.slice(0, 6) + '...' + p.leader.slice(-4),
            score: Number(p.score),
          })
        }
        list.sort((a, b) => b.score - a.score)
        setProjects(list)
        setIsDemo(false)
      } catch {
        setProjects(DEMO_PROJECTS)
        setIsDemo(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const maxScore = projects[0]?.score || 100

  return (
    <div className="glass-panel p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-400 flex-shrink-0 text-lg">
            🏆
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Leaderboard</h3>
            <p className="text-slate-500 text-xs">Live ranking from blockchain</p>
          </div>
        </div>
        {isDemo && (
          <span className="text-xs px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 font-mono">
            DEMO
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 gap-2 text-slate-500">
          <span className="w-4 h-4 border-2 border-slate-600 border-t-indigo-400 rounded-full animate-spin" />
          Loading rankings...
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-8 text-slate-600">
          <p className="text-4xl mb-2">📭</p>
          <p>No projects registered yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all
                ${index === 0
                  ? 'bg-yellow-500/5 border-yellow-500/30 shadow-lg shadow-yellow-500/10'
                  : index === 1
                  ? 'bg-slate-400/5 border-slate-400/20'
                  : index === 2
                  ? 'bg-amber-600/5 border-amber-600/20'
                  : 'bg-slate-900/30 border-slate-800/50'
                }`}
            >
              <span className="text-xl w-7 text-center flex-shrink-0">
                {index < 3 ? MEDAL[index] : `#${index + 1}`}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{project.name}</p>
                <p className="text-xs text-slate-500 font-mono">{project.leader}</p>
                <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-300' : index === 2 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${(project.score / maxScore) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`text-2xl font-black ${
                  index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-500' : 'text-indigo-400'
                }`}>
                  {project.score}
                </span>
                <p className="text-xs text-slate-600">pts</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
