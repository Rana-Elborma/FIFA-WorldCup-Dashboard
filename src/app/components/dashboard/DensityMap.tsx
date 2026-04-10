import { useState, useEffect } from 'react';
import { Map, Play, Pause, AlertTriangle, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { useCrowdMetrics } from '../../hooks/useCrowdMetrics';

interface Zone {
  id: string;
  name: string;
  x: number;
  y: number;
  percentage: number;
  people: string;
  status: 'normal' | 'busy' | 'critical';
  hasAlert: boolean;
}

const generateInitialZones = (): Zone[] => [
  // TOP SECTION — 5 pairs × 2 rows = 20 gates
  // Pair 1 (x=20,26)
  { id: 'T1-1', name: 'S2-F', x: 20, y: 5,  percentage: 91.7, people: '2.8', status: 'critical', hasAlert: true },
  { id: 'T1-2', name: 'S1-V', x: 20, y: 17, percentage: 86.3, people: '2.6', status: 'critical', hasAlert: false },
  { id: 'T2-1', name: 'S1-F', x: 26, y: 5,  percentage: 81.2, people: '2.4', status: 'critical', hasAlert: false },
  { id: 'T2-2', name: 'S1-F', x: 26, y: 17, percentage: 78.1, people: '2.3', status: 'critical', hasAlert: true },

  // Pair 2 (x=33,39)
  { id: 'T3-1', name: 'N1-F', x: 33, y: 5,  percentage: 62.4, people: '1.9', status: 'busy',     hasAlert: false },
  { id: 'T3-2', name: 'N1-V', x: 33, y: 17, percentage: 55.7, people: '1.7', status: 'busy',     hasAlert: false },
  { id: 'T4-1', name: 'N2-F', x: 39, y: 5,  percentage: 41.0, people: '1.2', status: 'normal',   hasAlert: false },
  { id: 'T4-2', name: 'N2-V', x: 39, y: 17, percentage: 33.5, people: '1.0', status: 'normal',   hasAlert: false },

  // Pair 3 center (x=46,52)
  { id: 'TC1-1', name: 'N3-F', x: 46, y: 5,  percentage: 54.0, people: '1.6', status: 'busy',   hasAlert: false },
  { id: 'TC1-2', name: 'N3-V', x: 46, y: 17, percentage: 66.2, people: '2.0', status: 'busy',   hasAlert: false },
  { id: 'TC2-1', name: 'N4-F', x: 52, y: 5,  percentage: 37.5, people: '1.1', status: 'normal', hasAlert: false },
  { id: 'TC2-2', name: 'N4-V', x: 52, y: 17, percentage: 44.8, people: '1.3', status: 'busy',   hasAlert: false },

  // Pair 4 (x=59,65)
  { id: 'T5-1', name: 'N5-F', x: 59, y: 5,  percentage: 29.3, people: '0.9', status: 'normal',  hasAlert: false },
  { id: 'T5-2', name: 'N5-V', x: 59, y: 17, percentage: 38.2, people: '1.1', status: 'normal',  hasAlert: false },
  { id: 'T6-1', name: 'N6-F', x: 65, y: 5,  percentage: 71.0, people: '2.1', status: 'critical', hasAlert: true },
  { id: 'T6-2', name: 'N6-V', x: 65, y: 17, percentage: 58.7, people: '1.8', status: 'busy',    hasAlert: false },

  // Pair 5 (x=72,78)
  { id: 'T7-1', name: 'S3-V', x: 72, y: 5,  percentage: 42.0, people: '1.3', status: 'normal',  hasAlert: false },
  { id: 'T7-2', name: 'S3-B', x: 72, y: 17, percentage: 78.4, people: '2.4', status: 'critical', hasAlert: true },
  { id: 'T8-1', name: 'S4-V', x: 78, y: 5,  percentage: 35.6, people: '1.1', status: 'normal',  hasAlert: false },
  { id: 'T8-2', name: 'S4-B', x: 78, y: 17, percentage: 49.3, people: '1.5', status: 'busy',    hasAlert: false },

  // LEFT SIDE - 2 columns × 3 rows = 6 gates
  { id: 'L1-1', name: 'N4-B', x: 6,  y: 28, percentage: 33.5, people: '1.0', status: 'normal',   hasAlert: false },
  { id: 'L1-2', name: 'S3-A', x: 6,  y: 46, percentage: 56.2, people: '1.7', status: 'busy',     hasAlert: false },
  { id: 'L1-3', name: 'S1-A', x: 6,  y: 64, percentage: 88.8, people: '2.7', status: 'critical', hasAlert: true  },
  { id: 'L2-1', name: 'S1-A', x: 12, y: 28, percentage: 82.3, people: '2.5', status: 'critical', hasAlert: false },
  { id: 'L2-2', name: 'S3-A', x: 12, y: 46, percentage: 64.5, people: '1.9', status: 'busy',     hasAlert: false },
  { id: 'L2-3', name: 'N4-B', x: 12, y: 64, percentage: 36.7, people: '1.1', status: 'normal',   hasAlert: false },

  // RIGHT SIDE - 2 columns × 3 rows = 6 gates
  { id: 'R1-1', name: 'S1-A', x: 88, y: 28, percentage: 94.3, people: '2.8', status: 'critical', hasAlert: true  },
  { id: 'R1-2', name: 'S3-A', x: 88, y: 46, percentage: 61.3, people: '1.8', status: 'busy',     hasAlert: false },
  { id: 'R1-3', name: 'N4-B', x: 88, y: 64, percentage: 28.4, people: '0.9', status: 'normal',   hasAlert: false },
  { id: 'R2-1', name: 'S1-A', x: 94, y: 28, percentage: 89.2, people: '2.7', status: 'critical', hasAlert: true  },
  { id: 'R2-2', name: 'S3-A', x: 94, y: 46, percentage: 52.8, people: '1.6', status: 'busy',     hasAlert: false },
  { id: 'R2-3', name: 'N4-B', x: 94, y: 64, percentage: 31.5, people: '0.9', status: 'normal',   hasAlert: false },

  // BOTTOM SECTION — 5 pairs × 2 rows = 20 gates (mirrors top x positions)
  // Pair 1 (x=20,26)
  { id: 'B1-1', name: 'S1-A', x: 20, y: 75, percentage: 89.4, people: '2.7', status: 'critical', hasAlert: true  },
  { id: 'B1-2', name: 'S3-A', x: 20, y: 87, percentage: 93.9, people: '2.8', status: 'critical', hasAlert: true  },
  { id: 'B2-1', name: 'S2-A', x: 26, y: 75, percentage: 51.3, people: '1.5', status: 'busy',     hasAlert: false },
  { id: 'B2-2', name: 'S4-A', x: 26, y: 87, percentage: 48.2, people: '1.4', status: 'busy',     hasAlert: false },

  // Pair 2 (x=33,39)
  { id: 'B3-1', name: 'S5-B', x: 33, y: 75, percentage: 74.6, people: '2.2', status: 'critical', hasAlert: false },
  { id: 'B3-2', name: 'S5-A', x: 33, y: 87, percentage: 60.1, people: '1.8', status: 'busy',     hasAlert: false },
  { id: 'B4-1', name: 'S6-B', x: 39, y: 75, percentage: 28.9, people: '0.9', status: 'normal',   hasAlert: false },
  { id: 'B4-2', name: 'S6-A', x: 39, y: 87, percentage: 35.4, people: '1.1', status: 'normal',   hasAlert: false },

  // Pair 3 center (x=46,52)
  { id: 'BC1-1', name: 'S2-B', x: 46, y: 75, percentage: 71.4, people: '2.1', status: 'critical', hasAlert: false },
  { id: 'BC1-2', name: 'S2-A', x: 46, y: 87, percentage: 58.3, people: '1.7', status: 'busy',     hasAlert: false },
  { id: 'BC2-1', name: 'S4-B', x: 52, y: 75, percentage: 39.7, people: '1.2', status: 'normal',   hasAlert: false },
  { id: 'BC2-2', name: 'S4-A', x: 52, y: 87, percentage: 22.1, people: '0.7', status: 'normal',   hasAlert: false },

  // Pair 4 (x=59,65)
  { id: 'B5-1', name: 'S7-B', x: 59, y: 75, percentage: 83.2, people: '2.5', status: 'critical', hasAlert: true  },
  { id: 'B5-2', name: 'S7-A', x: 59, y: 87, percentage: 44.7, people: '1.3', status: 'busy',     hasAlert: false },
  { id: 'B6-1', name: 'S8-B', x: 65, y: 75, percentage: 31.0, people: '0.9', status: 'normal',   hasAlert: false },
  { id: 'B6-2', name: 'S8-A', x: 65, y: 87, percentage: 67.5, people: '2.0', status: 'busy',     hasAlert: false },

  // Pair 5 (x=72,78)
  { id: 'B7-1', name: 'N4-B', x: 72, y: 75, percentage: 33.0, people: '1.0', status: 'normal',   hasAlert: false },
  { id: 'B7-2', name: 'N4-A', x: 72, y: 87, percentage: 26.6, people: '0.8', status: 'normal',   hasAlert: false },
  { id: 'B8-1', name: 'S1-A', x: 78, y: 75, percentage: 92.8, people: '2.8', status: 'critical', hasAlert: true  },
  { id: 'B8-2', name: 'S3-A', x: 78, y: 87, percentage: 54.2, people: '1.6', status: 'busy',     hasAlert: false },
];

function ZoneCard({ zone }: { zone: Zone }) {
  const statusColors: Record<Zone['status'], { bg: string; border: string; text: string; alertBg: string }> = {
    normal: { bg: '#d1fae5', border: '#86efac', text: '#065f46', alertBg: '#22c55e' },
    busy: { bg: '#fed7aa', border: '#fb923c', text: '#9a3412', alertBg: '#f97316' },
    critical: { bg: '#fecaca', border: '#f87171', text: '#991b1b', alertBg: '#ef4444' }
  };

  const color = statusColors[zone.status];

  if (!color) {
    return null;
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: Math.random() * 0.15 }}
      className="absolute"
      style={{ 
        left: `${zone.x}%`, 
        top: `${zone.y}%`, 
        transform: 'translate(-50%, -50%)',
        width: '58px'
      }}
    >
      <motion.div
        animate={{
          backgroundColor: zone.status === 'critical' 
            ? ['#fecaca', '#fca5a5', '#fecaca']
            : zone.status === 'busy'
            ? ['#fed7aa', '#fdba74', '#fed7aa']
            : ['#d1fae5', '#a7f3d0', '#d1fae5']
        }}
        transition={{
          duration: zone.status === 'critical' ? 1.8 : zone.status === 'busy' ? 2.8 : 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="border-2 rounded-xl p-2 text-center shadow-lg relative"
        style={{ 
          borderColor: color.border,
          backgroundColor: color.bg 
        }}
      >
        {zone.hasAlert && (
          <div className="absolute -top-1.5 -left-1.5">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              <AlertTriangle className="text-white" size={9} strokeWidth={3} />
            </div>
          </div>
        )}
        
        <div className="text-[9px] font-semibold mb-0.5 opacity-70" style={{ color: color.text }}>
          {zone.id}
        </div>
        <div className="text-[11px] font-bold leading-none mb-1" style={{ color: color.text }}>
          {zone.percentage}%
        </div>
        <div className="text-[10px] font-bold mb-0.5" style={{ color: color.text }}>{zone.name}</div>
        <div className="text-[8px] font-medium opacity-80" style={{ color: color.text }}>{zone.people}k</div>
      </motion.div>
    </motion.div>
  );
}

export function DensityMap() {
  const [zones, setZones] = useState(generateInitialZones());
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeRange, setTimeRange] = useState('15m');

  const { latest, prediction } = useCrowdMetrics();
  const aiSubtitle = latest
    ? `${latest.peoplePred} detected • ${latest.riskLevel} • 15m forecast: ${prediction?.predictedRisk ?? '...'}`
    : '52 gates • Live AI + IOT Monitoring';

  // Drive the center gate (TC1-1) from live AI data
  useEffect(() => {
    if (!latest) return;
    const liveStatus: Zone['status'] =
      latest.riskLevel === 'Critical' ? 'critical' :
      latest.riskLevel === 'Busy'     ? 'busy'     : 'normal';
    const livePct = Math.min(100, Math.round((latest.peoplePred / 80) * 100));
    setZones(prev => prev.map(z =>
      z.id === 'TC1-1'
        ? { ...z, status: liveStatus, percentage: livePct,
            people: (latest.avgDensity).toFixed(1),
            hasAlert: latest.riskLevel === 'Critical' }
        : z
    ));
  }, [latest?.riskLevel, latest?.peoplePred]);

  // Calculate metrics dynamically from zones
  const criticalCount = zones.filter(z => z.status === 'critical').length;
  const warningCount = zones.filter(z => z.status === 'busy').length;

  // Simulate real-time density changes every 5-10 seconds
  useEffect(() => {
    if (!isPlaying) return;
    
    const changeGates = () => {
      setZones(prev => 
        prev.map(zone => {
          const change = (Math.random() - 0.5) * 20;
          const newPercentage = Math.max(15, Math.min(100, zone.percentage + change));
          
          let newStatus: Zone['status'];
          if (newPercentage < 45) newStatus = 'normal';
          else if (newPercentage < 70) newStatus = 'busy';
          else newStatus = 'critical';
          
          const newPeople = (Math.round((newPercentage / 100) * 3 * 10) / 10).toFixed(1);
          
          return {
            ...zone,
            percentage: Math.round(newPercentage * 10) / 10,
            people: newPeople,
            status: newStatus,
            hasAlert: newStatus === 'critical' && Math.random() > 0.35
          };
        })
      );
    };

    const initialTimeout = setTimeout(changeGates, 3000);
    const interval = setInterval(() => {
      changeGates();
    }, Math.random() * 5000 + 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isPlaying]);

  // Update time progress
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const max = timeRange === '5m' ? 300 : timeRange === '15m' ? 900 : 3600;
        return prev >= max ? 0 : prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, timeRange]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const maxTime = timeRange === '5m' ? 300 : timeRange === '15m' ? 900 : 3600;

  return (
    <div className="bg-[#1e2a4a] rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Map className="text-purple-400" size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Gate & Concourse Density</h2>
            <p className="text-[11px] text-gray-400">{aiSubtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.div 
            key={`critical-${criticalCount}`}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg px-3 py-2 flex items-center gap-2"
          >
            <span className="text-lg font-bold text-red-600">{criticalCount}</span>
            <span className="text-xs text-gray-700">Critical</span>
          </motion.div>
          <motion.div 
            key={`warning-${warningCount}`}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg px-3 py-2 flex items-center gap-2"
          >
            <span className="text-lg font-bold text-orange-600">{warningCount}</span>
            <span className="text-xs text-gray-700">Warning</span>
          </motion.div>
          <div className="bg-white rounded-lg px-2 py-2 flex items-center gap-1">
            <button
              onClick={() => setTimeRange('5m')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                timeRange === '5m' ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              5m
            </button>
            <button
              onClick={() => setTimeRange('15m')}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                timeRange === '15m' ? 'bg-orange-500 text-white' : 'text-gray-400'
              }`}
            >
              15m
            </button>
            <button
              onClick={() => setTimeRange('1h')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                timeRange === '1h' ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              1h
            </button>
          </div>
        </div>
      </div>

      {/* Main Stadium Map */}
      <div className="bg-[#f5f3ef] rounded-2xl p-6 relative overflow-hidden" style={{ minHeight: '680px' }}>
        {/* Stadium Structure */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: '480px', height: '230px' }}>
          {/* Outer stadium gray background - wider horizontal shape */}
          <div className="absolute inset-0 bg-gray-400 opacity-70" style={{ borderRadius: '120px' }}></div>
          
          {/* North Gates label */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-gray-600 opacity-60">
            North Gates
          </div>
          
          {/* South Gates label */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-gray-600 opacity-60">
            South Gates
          </div>
          
          {/* Inner darker ring */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[200px] bg-gray-500 opacity-80" style={{ borderRadius: '100px' }}></div>
          
          {/* Center pitch - more rectangular */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[140px] bg-white rounded-2xl border-3 border-gray-600 flex flex-col items-center justify-center shadow-lg">
            <div className="text-gray-700 text-xl font-bold tracking-wider">PITCH</div>
            <div className="text-gray-500 text-xs mt-1">Aramco Stadium</div>
          </div>
        </div>

        {/* Zone Cards */}
        {zones.map(zone => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}

        {/* Top right controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="w-8 h-8 bg-white hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors shadow-sm border border-gray-200">
            <Layers size={14} className="text-gray-600" />
          </button>
          <button className="w-8 h-8 bg-white hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors shadow-sm border border-gray-200">
            <ZoomIn size={14} className="text-gray-600" />
          </button>
          <button className="w-8 h-8 bg-white hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors shadow-sm border border-gray-200">
            <ZoomOut size={14} className="text-gray-600" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-3 shadow-md">
          <div className="text-xs font-bold text-gray-800 mb-2">Gate Status</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-[10px] text-gray-600">Normal (&lt;45%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-400"></div>
              <span className="text-[10px] text-gray-600">Busy (45-70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-[10px] text-gray-600">Critical (&gt;70%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Scrubber */}
      <div className="mt-4 flex items-center gap-3 bg-[#2a3556] rounded-lg p-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
        >
          {isPlaying ? (
            <Pause className="text-white" size={14} fill="white" />
          ) : (
            <Play className="text-white ml-0.5" size={14} fill="white" />
          )}
        </button>
        <div className="flex-1 relative h-1.5 bg-gray-600 rounded-full overflow-hidden cursor-pointer">
          <motion.div
            animate={{ width: `${(currentTime / maxTime) * 100}%` }}
            className="h-full bg-green-500 rounded-full"
          />
          <input
            type="range"
            min="0"
            max={maxTime}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
          />
        </div>
        <span className="text-xs text-gray-400 font-mono min-w-[50px] text-right">
          -{formatTime(maxTime - currentTime)}
        </span>
      </div>
    </div>
  );
}