import { useState, useEffect } from 'react';
import { StatCards } from './dashboard/StatCards';
import { LiveSurveillance } from './dashboard/LiveSurveillance';
import { DensityMap } from './dashboard/DensityMap';
import { CrowdChart } from './dashboard/CrowdChart';
import { HeatmapView } from './dashboard/HeatmapView';

export function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`p-8 space-y-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Monitoring Dashboard</h2>
        <p className="text-gray-400">Real-time crowd monitoring</p>
      </div>

      <StatCards />
      <LiveSurveillance />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CrowdChart />
        <HeatmapView />
      </div>
      <DensityMap />
    </div>
  );
}
