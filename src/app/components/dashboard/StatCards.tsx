import { useState, useEffect } from 'react';
import { Users, AlertTriangle, Activity, Gauge } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  color: string;
  progress?: number;
  progressMax?: number;
  tags?: string[];
  trend?: string;
  delay: number;
}

function StatCard({ title, value, suffix = '', icon, color, progress, progressMax, tags, trend, delay }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-[#1e2a4a] rounded-xl p-6 border border-gray-800 relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm mb-2">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">
                {displayValue.toLocaleString()}
              </span>
              {suffix && <span className="text-xl text-gray-400">{suffix}</span>}
            </div>
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            {icon}
          </div>
        </div>

        {tags && (
          <div className="flex gap-2 mb-3">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-1 rounded ${
                  tag.includes('Critical')
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {progress !== undefined && progressMax && (
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-400">Capacity: {progressMax.toLocaleString()}</span>
              <span className="text-green-400 font-bold">
                {Math.round((progress / progressMax) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(progress / progressMax) * 100}%` }}
                transition={{ delay: delay + 0.5, duration: 1 }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              />
            </div>
          </div>
        )}

        {trend && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-gray-400">Detected/min</span>
            <span className="text-xs text-green-400 flex items-center gap-1">
              ↑ {trend}
            </span>
          </div>
        )}
      </div>

      <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${color} opacity-5 rounded-full`}></div>
    </motion.div>
  );
}

export function StatCards() {
  const [attendance, setAttendance] = useState(62400);
  const [incidents, setIncidents] = useState(4);
  const [detections, setDetections] = useState(1240);
  const [avgDensity, setAvgDensity] = useState(2.4);

  // Update all stats every 5-10 seconds
  useEffect(() => {
    const updateStats = () => {
      // Total Attendance: gradually increases (people entering)
      setAttendance(prev => {
        const change = Math.floor(Math.random() * 300) - 100; // -100 to +200
        return Math.max(60000, Math.min(80000, prev + change));
      });

      // Active Incidents: fluctuates between 2-8
      setIncidents(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        return Math.max(2, Math.min(8, prev + change));
      });

      // AI Detections: keeps increasing
      setDetections(prev => {
        const change = Math.floor(Math.random() * 50) + 10; // +10 to +60
        return prev + change;
      });

      // Avg Density: fluctuates based on attendance
      setAvgDensity(prev => {
        const change = (Math.random() - 0.5) * 0.4; // -0.2 to +0.2
        return Math.max(1.8, Math.min(3.2, parseFloat((prev + change).toFixed(1))));
      });
    };

    // Initial update after 3 seconds
    const initialTimeout = setTimeout(updateStats, 3000);

    // Then update every 5-10 seconds
    const interval = setInterval(() => {
      updateStats();
    }, Math.random() * 5000 + 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard
        title="Total Attendance"
        value={attendance}
        icon={<Users className="text-green-400" size={24} />}
        color="bg-green-500/10"
        progress={attendance}
        progressMax={80000}
        delay={0}
      />
      
      <StatCard
        title="Active Incidents"
        value={incidents}
        icon={<AlertTriangle className="text-red-400" size={24} />}
        color="bg-red-500/10"
        tags={['1 Critical', '1 High']}
        delay={0.1}
      />
      
      <StatCard
        title="AI Detections"
        value={detections}
        icon={<Activity className="text-blue-400" size={24} />}
        color="bg-blue-500/10"
        trend="+6%"
        delay={0.2}
      />
      
      <StatCard
        title="Avg Density"
        value={avgDensity}
        suffix="people/m²"
        icon={<Gauge className="text-purple-400" size={24} />}
        color="bg-purple-500/10"
        delay={0.3}
      />
    </div>
  );
}