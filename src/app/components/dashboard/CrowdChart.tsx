import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { crowdApi, HistoryEntry } from '../../services/crowdApi';

export function CrowdChart() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await crowdApi.getHistory();
      if (data) setHistory(data);
    };
    fetch();
    const id = setInterval(fetch, 5000);
    return () => clearInterval(id);
  }, []);

  const chartData = history.map(h => ({
    time: h.t,
    People: h.peoplePred,
    'Density': parseFloat(h.density.toFixed(1)),
    'Forecast': parseFloat(h.predDensity15.toFixed(1)),
  }));

  return (
    <div className="bg-[#1e2a4a] rounded-xl p-5 border border-gray-800">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <TrendingUp className="text-blue-400" size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Live Crowd Analytics</h2>
          <p className="text-[11px] text-gray-400">
            {history.length > 0
              ? `${history.length} data points • last update ${history[history.length - 1]?.t}`
              : 'Waiting for data…'}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorPeople" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2d4a" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#9ca3af', fontSize: 11 }}
            itemStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
          <Area type="monotone" dataKey="People" stroke="#3b82f6" strokeWidth={2}
            fill="url(#colorPeople)" dot={false} />
          <Area type="monotone" dataKey="Density" stroke="#a855f7" strokeWidth={2}
            fill="url(#colorDensity)" dot={false} />
          <Area type="monotone" dataKey="Forecast" stroke="#f59e0b" strokeWidth={1.5}
            strokeDasharray="4 2" fill="url(#colorForecast)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
