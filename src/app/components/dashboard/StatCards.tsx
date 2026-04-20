import { useState, useEffect } from 'react';
import { Users, AlertTriangle, Activity, Gauge, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useCrowdMetrics } from '../../hooks/useCrowdMetrics';

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
  live?: boolean;
}

function StatCard({ title, value, suffix = '', icon, color, progress, progressMax, tags, trend, delay, live }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = (value - displayValue) / steps;
    let current = displayValue;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= value) || (increment < 0 && current <= value)) {
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
            <div className="flex items-center gap-2 mb-2">
              <p className="text-gray-400 text-sm">{title}</p>
              {live && (
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
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

        {tags && tags.length > 0 && (
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
            <span className="text-xs text-gray-400">Current frame</span>
            <span className="text-xs text-green-400">{trend} people</span>
          </div>
        )}
      </div>

      <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${color} opacity-5 rounded-full`}></div>
    </motion.div>
  );
}

export function StatCards() {
  const { latest, prediction, connected } = useCrowdMetrics();

  const peoplePred   = latest?.peoplePred      ?? 0;
  const incidents    = latest?.activeIncidents ?? 0;
  const density      = latest?.avgDensity      ?? 0;
  const riskLevel    = latest?.riskLevel       ?? 'Normal';

  const forecastDensity = prediction?.predictedDensity ?? 0;
  const forecastRisk    = prediction?.predictedRisk    ?? 'Normal';

  const incidentTags = incidents >= 3
    ? ['1 Critical', '1 High']
    : incidents >= 1
    ? ['1 High']
    : [];

  const forecastColor =
    forecastRisk === 'Critical' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
    forecastRisk === 'Busy'     ? 'text-orange-400 border-orange-500/30 bg-orange-500/10' :
                                  'text-green-400 border-green-500/30 bg-green-500/10';

  const forecastBarColor =
    forecastRisk === 'Critical' ? 'from-red-500 to-rose-500' :
    forecastRisk === 'Busy'     ? 'from-orange-500 to-amber-500' :
                                  'from-green-500 to-emerald-500';

  return (
    <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard
        title="People Detected"
        value={peoplePred}
        icon={<Users className="text-green-400" size={24} />}
        color="bg-green-500/10"
        delay={0}
        live={connected}
      />

      <StatCard
        title="Active Incidents"
        value={incidents}
        icon={<AlertTriangle className={incidents >= 3 ? 'text-red-400' : 'text-orange-400'} size={24} />}
        color={incidents >= 3 ? 'bg-red-500/10' : 'bg-orange-500/10'}
        tags={incidentTags}
        delay={0.1}
        live={connected}
      />

      <StatCard
        title="AI Detections (Session)"
        value={peoplePred}
        icon={<Activity className="text-blue-400" size={24} />}
        color="bg-blue-500/10"
        trend={connected ? String(peoplePred) : undefined}
        delay={0.2}
        live={connected}
      />

      <StatCard
        title="Avg Density"
        value={density}
        suffix="people/m²"
        icon={
          <Gauge
            className={
              riskLevel === 'Critical' ? 'text-red-400'
              : riskLevel === 'Busy'   ? 'text-orange-400'
              : 'text-purple-400'
            }
            size={24}
          />
        }
        color={
          riskLevel === 'Critical' ? 'bg-red-500/10'
          : riskLevel === 'Busy'   ? 'bg-orange-500/10'
          : 'bg-purple-500/10'
        }
        delay={0.3}
        live={connected}
      />
    </div>

    {/* 15-Min Forecast Banner */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className={`rounded-xl border p-5 flex items-center justify-between gap-6 ${forecastColor}`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/5">
          <Clock size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">15-Minute Forecast</p>
          <p className="text-sm font-semibold">
            Predicted density in 15 min:{' '}
            <span className="text-white text-base font-bold">
              {forecastDensity.toFixed(1)} people/m²
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-1">Predicted Risk</p>
          <span className={`text-sm font-bold px-3 py-1 rounded-full border ${forecastColor}`}>
            {forecastRisk.toUpperCase()}
          </span>
        </div>
        <TrendingUp size={22} className="opacity-60" />
      </div>

      {connected && (
        <div className="absolute right-4 top-3 hidden">
          <div className="h-1 w-24 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${forecastBarColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (forecastDensity / 7.5) * 100)}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      )}
    </motion.div>
    </div>
  );
}
