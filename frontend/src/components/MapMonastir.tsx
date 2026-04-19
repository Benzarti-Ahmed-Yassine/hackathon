'use client'

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix typical Next.js / Leaflet icon missing issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Factory {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'VERT' | 'ORANGE' | 'ROUGE';
  lastReading: any;
  txHash: string;
  aiReport: string;
}

export default function MapMonastir({ onFactoryClick }: { onFactoryClick: (factory: Factory) => void }) {
  const [factories, setFactories] = useState<Factory[]>([]);

  // Fetch from the Node.js backend IoT simulator
  useEffect(() => {
    const fetchFactories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/factories');
        if (res.ok) {
          const data = await res.json();
          setFactories(data);
        }
      } catch (err) {
        console.error("Failed to fetch factories", err);
      }
    };

    fetchFactories();
    const interval = setInterval(fetchFactories, 5000);
    return () => clearInterval(interval);
  }, []);

  const getIconHtml = (status: string) => {
    let glowClass = 'shadow-emerald-500/50 bg-emerald-500/10 border-emerald-500 text-emerald-400';
    if (status === 'ROUGE') glowClass = 'animate-pulse shadow-red-500/80 bg-red-500/20 border-red-500 text-red-500 scale-110';
    if (status === 'ORANGE') glowClass = 'shadow-orange-500/60 bg-orange-500/20 border-orange-500 text-orange-400';

    return `
      <div className="relative">
        <div class="flex items-center justify-center w-12 h-12 rounded-full border-2 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 ${glowClass}">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 10H22V21H2V10H12M22 6H12V8H22M12 2H2V4H12M2 6H12V8H2Z" />
          </svg>
        </div>
      </div>
    `;
  };

  return (
    <div className="absolute inset-0 w-full h-full z-0 bg-slate-50">
      <MapContainer 
        center={[35.65, 10.95]} 
        zoom={11} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        {/* Bright Voyager Theme */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />

        {factories.map((f) => {
          const customIcon = L.divIcon({
            html: getIconHtml(f.status),
            className: '',
            iconSize: [48, 48],
            iconAnchor: [24, 24]
          });

          return (
            <Marker 
              key={f.id} 
              position={[f.lat, f.lng]} 
              icon={customIcon}
              eventHandlers={{ click: () => onFactoryClick(f) }}
            >
            {/* Simple pulsating tooltip for hover */}
              <Popup className="custom-popup">
                <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl">
                  <span className="text-[10px] uppercase text-emerald-600 block font-black tracking-widest">{f.id}</span>
                  <p className="font-bold text-slate-800 text-sm my-1">{f.name}</p>
                  <p className="text-[10px] mt-1 text-slate-500">Cliquez pour Audit & Taxe Blockchain</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
