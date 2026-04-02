import { useState, useEffect } from 'react';
import { StatCards } from './dashboard/StatCards';
import { LiveSurveillance } from './dashboard/LiveSurveillance';
import { DensityMap } from './dashboard/DensityMap';

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
      <DensityMap />
    </div>
  );
}
