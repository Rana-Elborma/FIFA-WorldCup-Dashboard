import { useState, useEffect } from 'react';
import { Video, Users, Activity, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';

interface CameraFeed {
  id: number;
  name: string;
  location: string;
  status: 'Normal' | 'Critical' | 'Warning';
  crowdCount: number;
  peopleIcons: number;
}

const initialFeeds: CameraFeed[] = [
  { id: 1, name: 'Gate A3 - Main', location: 'Main Entrance', status: 'Warning', crowdCount: 324, peopleIcons: 4 },
  { id: 2, name: 'Concourse L1', location: 'Level 1', status: 'Normal', crowdCount: 156, peopleIcons: 2 },
  { id: 3, name: 'Gate A3 - Main', location: 'Secondary', status: 'Warning', crowdCount: 298, peopleIcons: 4 },
  { id: 4, name: 'Concourse L2', location: 'Level 2', status: 'Normal', crowdCount: 187, peopleIcons: 2 },
  { id: 5, name: 'VIP Entrance', location: 'VIP Section', status: 'Normal', crowdCount: 89, peopleIcons: 1 },
  { id: 6, name: 'North Stand', location: 'Section A', status: 'Critical', crowdCount: 512, peopleIcons: 5 },
  { id: 7, name: 'VIP Entrance', location: 'VIP Lounge', status: 'Normal', crowdCount: 76, peopleIcons: 1 },
  { id: 8, name: 'Food Court A', location: 'West Wing', status: 'Warning', crowdCount: 356, peopleIcons: 4 },
  { id: 9, name: 'Exit Tunnel 4', location: 'North Exit', status: 'Normal', crowdCount: 142, peopleIcons: 2 },
];

function CameraCard({ feed }: { feed: CameraFeed }) {
  const statusColors = {
    Normal: 'bg-green-500',
    Warning: 'bg-orange-500',
    Critical: 'bg-red-500'
  };

  const cardGlow = feed.status === 'Critical' 
    ? 'shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse' 
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-[#1e2a4a] rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition-all ${cardGlow}`}
    >
      {/* Status Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-bold text-white ${statusColors[feed.status]}`}>
            {feed.status}
          </span>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${statusColors[feed.status]} animate-pulse`}></div>
            <span className="text-xs text-gray-400">LIVE</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Users size={14} />
          <span className="text-xs font-bold text-white">{feed.crowdCount}</span>
        </div>
      </div>

      {/* Video Feed Placeholder */}
      <div className="bg-gray-900 rounded-lg h-32 mb-3 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-50"></div>
        <Video className="text-gray-600 relative z-10" size={32} />
        <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          REC
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2">
        <h3 className="text-white font-bold text-sm">{feed.name}</h3>
        <p className="text-gray-400 text-xs">{feed.location}</p>
        
        {/* People Icons */}
        <div className="flex items-center gap-1">
          {Array.from({ length: feed.peopleIcons }).map((_, idx) => (
            <Users key={idx} size={12} className="text-blue-400" />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
            <Activity size={14} />
          </button>
          <button className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
            <Maximize2 size={14} />
          </button>
          <button className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
            <Video size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function LiveSurveillance() {
  const [feeds, setFeeds] = useState(initialFeeds);

  // Simulate live status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setFeeds(prev => 
        prev.map(feed => {
          const random = Math.random();
          if (random > 0.9) {
            const statuses: Array<'Normal' | 'Critical' | 'Warning'> = ['Normal', 'Warning', 'Critical'];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            return { ...feed, status: newStatus, crowdCount: feed.crowdCount + Math.floor(Math.random() * 20 - 10) };
          }
          return feed;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#111827] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Video className="text-purple-400" size={20} />
          </div>
          <h2 className="text-xl font-bold text-white">Live Surveillance Matrix</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
            Filters
          </button>
          <select className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 text-sm">
            <option>All Zones</option>
            <option>Critical Only</option>
            <option>Entrance Gates</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {feeds.map(feed => (
          <CameraCard key={feed.id} feed={feed} />
        ))}
      </div>
    </div>
  );
}
