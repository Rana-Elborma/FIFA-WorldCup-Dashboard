import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, MapPin, Clock, ChevronRight, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCrowdMetrics } from '../../hooks/useCrowdMetrics';

interface Incident {
  id: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  location: string;
  category: string;
  timestamp: string;
  confidence: number;
  acknowledged: boolean;
  fromAI?: boolean;
}

const initialIncidents: Incident[] = [
  {
    id: 1, severity: 'critical',
    title: 'Severe Overcrowding Detected',
    location: 'Gate A3 - Main Entrance', category: 'Density Violation',
    timestamp: '14:32:05', confidence: 98, acknowledged: false,
  },
  {
    id: 2, severity: 'high',
    title: 'Unauthorized Zone Access',
    location: 'Staff Stand - Corridor', category: 'Door Breach',
    timestamp: '14:28:12', confidence: 94, acknowledged: false,
  },
  {
    id: 3, severity: 'medium',
    title: 'Queue Flow Stoppage',
    location: 'Concourse Level 2', category: 'Flow Analysis',
    timestamp: '14:15:43', confidence: 87, acknowledged: false,
  },
  {
    id: 4, severity: 'low',
    title: 'Camera Obstruction',
    location: 'Gate D / North Stand', category: 'Crowd Heads',
    timestamp: '14:02:31', confidence: 72, acknowledged: false,
  },
];

interface ActiveIncidentsProps {
  showToast: (message: string) => void;
  decrementIncidents: () => void;
}

export function ActiveIncidents({ showToast, decrementIncidents }: ActiveIncidentsProps) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'unassigned'>('all');
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const { latest } = useCrowdMetrics();
  const lastRiskRef = useRef<string>('Normal');
  const nextIdRef   = useRef(100);

  // Inject a new AI incident when backend reports Critical
  useEffect(() => {
    if (!latest) return;
    const risk = latest.riskLevel;
    if (risk === 'Critical' && lastRiskRef.current !== 'Critical') {
      const newIncident: Incident = {
        id:           nextIdRef.current++,
        severity:     'critical',
        title:        'AI: Critical Crowd Density Detected',
        location:     latest.source ?? 'Live Camera Feed',
        category:     'Density Violation',
        timestamp:    latest.timestamp,
        confidence:   Math.round(90 + Math.random() * 9),
        acknowledged: false,
        fromAI:       true,
      };
      setIncidents(prev => [newIncident, ...prev]);
      showToast('⚠️ AI detected critical crowd density!');
    } else if (risk === 'Busy' && lastRiskRef.current === 'Normal') {
      const newIncident: Incident = {
        id:           nextIdRef.current++,
        severity:     'high',
        title:        'AI: High Crowd Density Warning',
        location:     latest.source ?? 'Live Camera Feed',
        category:     'Flow Analysis',
        timestamp:    latest.timestamp,
        confidence:   Math.round(80 + Math.random() * 10),
        acknowledged: false,
        fromAI:       true,
      };
      setIncidents(prev => [newIncident, ...prev]);
    }
    lastRiskRef.current = risk;
  }, [latest?.riskLevel]);

  const filteredIncidents = incidents.filter(incident => {
    if (incident.acknowledged) return false;
    if (filter === 'all')      return true;
    if (filter === 'critical') return incident.severity === 'critical';
    if (filter === 'high')     return incident.severity === 'high';
    return true;
  });

  const handleAcknowledge = (id: number) => {
    setIncidents(prev =>
      prev.map(i => i.id === id ? { ...i, acknowledged: true } : i)
    );
    decrementIncidents();
    showToast('Incident acknowledged successfully');
  };

  const severityColors = {
    critical: { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500',    badge: 'bg-red-500/20 border-red-500/30' },
    high:     { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500', badge: 'bg-orange-500/20 border-orange-500/30' },
    medium:   { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500',   badge: 'bg-blue-500/20 border-blue-500/30' },
    low:      { bg: 'bg-gray-500/10',   text: 'text-gray-400',   border: 'border-gray-500',   badge: 'bg-gray-500/20 border-gray-500/30' },
  };

  const criticalCount = filteredIncidents.filter(i => i.severity === 'critical').length;
  const highCount     = filteredIncidents.filter(i => i.severity === 'high').length;

  return (
    <div className="bg-[#1e2a4a] rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-800 bg-[#1a2340]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="text-red-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Active Incidents</h2>
              <p className="text-sm text-gray-400">Real-time AI detection feed</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path d="M2 4h12M2 8h12M2 12h12" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">⋮</button>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {[
            { key: 'all',      label: `All (${filteredIncidents.length})` },
            { key: 'critical', label: `Critical (${criticalCount})` },
            { key: 'high',     label: `High (${highCount})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                filter === key ? 'bg-[#0f172a] text-white' : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
        <AnimatePresence>
          {filteredIncidents.map((incident, index) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-lg border-l-4 ${severityColors[incident.severity].border} p-4 shadow-sm`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <AlertTriangle className={severityColors[incident.severity].text} size={16} />
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${severityColors[incident.severity].badge} ${severityColors[incident.severity].text}`}>
                    {incident.severity}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-600">
                    {incident.confidence}% AI Confidence
                  </span>
                  {incident.fromAI && (
                    <span className="px-2 py-1 bg-blue-100 border border-blue-300 rounded text-xs text-blue-600 font-bold">
                      LIVE AI
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Clock size={12} />
                  <span className="font-mono">{incident.timestamp}</span>
                </div>
              </div>

              <h3 className="text-gray-900 font-bold mb-2">{incident.title}</h3>

              <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{incident.location}</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1">
                  <Tag size={14} />
                  <span>{incident.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAcknowledge(incident.id)}
                  className="flex-1 bg-[#0f172a] text-white py-2 px-4 rounded hover:bg-gray-900 transition-colors text-sm font-medium"
                >
                  Acknowledge
                </motion.button>
                <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors text-sm font-medium">
                  Assign
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredIncidents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">✓ All Clear</div>
            <p className="text-gray-400 text-sm">No active incidents to display</p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-700">
          <span>Mark all read</span>
          <button className="text-blue-400 hover:text-blue-300">View Incident Log →</button>
        </div>
      </div>
    </div>
  );
}
