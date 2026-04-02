import { useEffect, useState } from 'react';
import { Server, Zap, HardDrive } from 'lucide-react';
import { motion } from 'motion/react';

interface HealthMetric {
  name: string;
  icon: React.ReactNode;
  percentage: number;
  status: string;
  color: string;
}

export function SystemHealth() {
  const [metrics] = useState<HealthMetric[]>([
    {
      name: 'Camera Network',
      icon: <Server size={16} />,
      percentage: 99,
      status: '98% ONLINE',
      color: 'bg-green-500'
    },
    {
      name: 'AI Processing',
      icon: <Zap size={16} />,
      percentage: 99,
      status: 'OPTIMAL',
      color: 'bg-green-500'
    },
    {
      name: 'Storage',
      icon: <HardDrive size={16} />,
      percentage: 44,
      status: '42% USED',
      color: 'bg-blue-500'
    }
  ]);

  return (
    <div className="bg-[#1e2a4a] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Server className="text-blue-400" size={20} />
        </div>
        <h2 className="text-xl font-bold text-white">System Health</h2>
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
              <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-xs font-bold">
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
    </div>
  );
}
