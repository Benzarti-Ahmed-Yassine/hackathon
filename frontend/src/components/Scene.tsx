'use client'

import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, MeshDistortMaterial, Sphere, ContactShadows, Environment, Text, Html } from '@react-three/drei'
import * as THREE from 'three'

interface NodeProps {
  position: [number, number, number]
  color: string
  label: string
  icon: string
  onClick: () => void
}

function InteractibleNode({ position, color, label, icon, onClick }: NodeProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={position}>
      <group 
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <Sphere args={[0.5, 64, 64]}>
          <MeshDistortMaterial
            color={hovered ? '#10b981' : color}
            speed={hovered ? 3 : 1.5}
            distort={0.4}
            roughness={0}
            metalness={0.5}
          />
        </Sphere>
        
        <Html position={[0, -0.8, 0]} center distanceFactor={8}>
          <div className={`transition-all duration-300 px-3 py-1 rounded-full border border-emerald-500/20 shadow-lg whitespace-nowrap pointer-events-none
            ${hovered ? 'bg-emerald-500 text-white scale-110' : 'bg-white/80 text-emerald-700'}`}>
            <span className="mr-2">{icon}</span>
            <span className="font-bold text-xs uppercase tracking-tighter">{label}</span>
          </div>
        </Html>
      </group>
    </Float>
  )
}

export default function Scene({ onNodeClick }: { onNodeClick: (key: string) => void }) {
  return (
    <div className="w-full h-full min-h-[600px] relative">
      <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} color="#10b981" intensity={1} />
        
        {/* Core Hub */}
        <Float speed={1} rotationIntensity={0.2}>
          <mesh receiveShadow castShadow>
            <octahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.8} transparent opacity={0.4} envMapIntensity={2} />
          </mesh>
        </Float>

        {/* Interactive Nodes */}
        <InteractibleNode 
          position={[-3, 2, 0]} 
          color="#ecfdf5" 
          icon="🏢" 
          label="Compte Société" 
          onClick={() => onNodeClick('account')} 
        />
        <InteractibleNode 
          position={[3, 1.5, 1]} 
          color="#d1fae5" 
          icon="🧪" 
          label="Calculateur IPT" 
          onClick={() => onNodeClick('audit')} 
        />
        <InteractibleNode 
          position={[-2, -2, 2]} 
          color="#a7f3d0" 
          icon="🤖" 
          label="Prédictions IA" 
          onClick={() => onNodeClick('prediction')} 
        />
        <InteractibleNode 
          position={[2.5, -1.8, -1]} 
          color="#34d399" 
          icon="💬" 
          label="Conseil Expert" 
          onClick={() => onNodeClick('chat')} 
        />

        <ContactShadows resolution={1024} scale={20} blur={2.5} opacity={0.1} far={20} color="#10b981" />
        <Environment preset="forest" />
        <OrbitControls enableZoom={false} makeDefault minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  )
}
