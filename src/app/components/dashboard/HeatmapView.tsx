import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { crowdApi } from '../../services/crowdApi';
import { useCrowdMetrics } from '../../hooks/useCrowdMetrics';

export function HeatmapView() {
  const [src, setSrc] = useState<string>('');
  const { latest, connected } = useCrowdMetrics();

  useEffect(() => {
    const fetch = async () => {
      const data = await crowdApi.getHeatmap();
      if (data?.heatmap) setSrc(`data:image/jpeg;base64,${data.heatmap}`);
    };
    fetch();
    const id = setInterval(fetch, 5000);
    return () => clearInterval(id);
  }, []);

  const riskColor =
    latest?.riskLevel === 'Critical' ? 'text-red-400' :
    latest?.riskLevel === 'Busy'     ? 'text-orange-400' :
    'text-green-400';

  return (
    <div className="bg-[#1e2a4a] rounded-xl p-5 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <Flame className="text-red-400" size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Crowd Density Heatmap</h2>
            <p className="text-[11px] text-gray-400">
              {connected && latest
                ? `${latest.peoplePred} people • ${latest.source}`
                : 'Connecting to backend…'}
            </p>
          </div>
        </div>
        {connected && latest && (
          <span className={`text-sm font-bold ${riskColor}`}>
            {latest.riskLevel.toUpperCase()}
          </span>
        )}
      </div>

      <div className="relative rounded-lg overflow-hidden bg-[#111827] flex items-center justify-center" style={{ height: 280 }}>
        {src ? (
          <img src={src} alt="Crowd heatmap" className="w-full h-full object-cover" />
        ) : (
          <p className="text-gray-500 text-sm">Loading heatmap…</p>
        )}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 rounded px-2 py-1">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[10px] text-green-400">LIVE</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3 px-1">
        <span className="text-[10px] text-gray-500">Low density</span>
        <div className="flex-1 mx-3 h-2 rounded-full"
          style={{ background: 'linear-gradient(to right, #00008b, #0000ff, #00ffff, #ffff00, #ff0000)' }} />
        <span className="text-[10px] text-gray-500">High density</span>
      </div>
    </div>
  );
}
