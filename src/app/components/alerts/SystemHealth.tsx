import { useState } from 'react';
import { Server, Zap, HardDrive } from 'lucide-react';
import { motion } from 'motion/react';
import { useCrowdMetrics } from '../../hooks/useCrowdMetrics';

interface HealthMetric {
  name: string;
  icon: React.ReactNode;
  percentage: number;
  status: string;
  color: string;
}

export function SystemHealth() {
  const { health, connected } = useCrowdMetrics();

  const aiStatus   = !connected          ? 'OFFLINE'
                   : health?.lgbm_loaded && health?.tf_loaded ? 'OPTIMAL'
                   : health?.lgbm_loaded || health?.tf_loaded ? 'PARTIAL'
                   : 'BASIC MODE';

  const aiPct      = !connected          ? 0
                   : health?.lgbm_loaded && health?.tf_loaded ? 99
                   : health?.lgbm_loaded || health?.tf_loaded ? 65
                   : 40;

  const aiColor    = aiPct >= 90 ? 'bg-green-500' : aiPct >= 50 ? 'bg-orange-500' : 'bg-red-500';

  const cameraStatus = connected ? '98% ONLINE' : 'OFFLINE';
  const cameraColor  = connected ? 'bg-green-500' : 'bg-red-500';
  const cameraPct    = connected ? 99 : 0;

  const [storagePct] = useState(44);

  const metrics: HealthMetric[] = [
    {
      name: 'Camera Network',
      icon: <Server size={16} />,
      percentage: cameraPct,
      status: cameraStatus,
      color: cameraColor,
    },
    {
      name: 'AI Processing',
      icon: <Zap size={16} />,
      percentage: aiPct,
      status: aiStatus,
      color: aiColor,
    },
    {
      name: 'Storage',
      icon: <HardDrive size={16} />,
      percentage: storagePct,
      status: `${storagePct}% USED`,
      color: 'bg-blue-500',
    },
  ];

  return (
    <div className="bg-[#1e2a4a] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Server className="text-blue-400" size={20} />
          </div>
          <h2 className="text-xl font-bold text-white">System Health</h2>
        </div>
        <span className={`text-xs px-2 py-1 rounded font-bold ${connected ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {connected ? 'BACKEND ONLINE' : 'BACKEND OFFLINE'}
        </span>
      </div>

      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                {metric.icon}
                <span className="text-sm font-medium">{metric.name}</span>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-bold border ${
                metric.percentage >= 90
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : metric.percentage >= 50
                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {metric.status}
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.percentage}%` }}
                transition={{ delay: index * 0.1 + 0.3, duration: 1, ease: 'easeOut' }}
                className={`h-full ${metric.color}`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {health && (
        <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500 space-y-1">
          <div>Mode: <span className="text-gray-300">{health.mode}</span></div>
          <div>LightGBM: <span className={health.lgbm_loaded ? 'text-green-400' : 'text-red-400'}>{health.lgbm_loaded ? 'Loaded' : 'Not trained yet'}</span></div>
          <div>TensorFlow: <span className={health.tf_loaded ? 'text-green-400' : 'text-red-400'}>{health.tf_loaded ? 'Loaded' : 'Not trained yet'}</span></div>
        </div>
      )}
    </div>
  );
}
