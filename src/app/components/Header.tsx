import { useState, useEffect } from 'react';
import { Search, Bell, Wifi } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const notifications = [
    { id: 1, text: 'Gate 7 crowd density at 94%', time: '2m ago', color: 'bg-red-500' },
    { id: 2, text: 'Concourse B congestion eased', time: '8m ago', color: 'bg-green-500' },
    { id: 3, text: 'AI model retrained successfully', time: '23m ago', color: 'bg-cyan-500' },
  ];

  return (
    <header className="bg-[#111827] border-b border-gray-800 px-8 py-4 flex items-center justify-between relative z-10">

      {/* Left — Branding */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-white font-bold text-xl">FIFA WC 2034</span>
          <span className="text-purple-400 text-sm">Real-time crowd monitoring</span>
        </div>

        <div className="flex items-center gap-2 bg-green-500/10 border border-green-700/40 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm font-medium">Live Monitoring</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        {/* Clock */}
        <div className="text-right">
          <div className="text-white font-mono text-lg font-bold">{formatTime(currentTime)}</div>
          <div className="text-gray-500 text-xs">{formatDate(currentTime)}</div>
        </div>

        {/* User greeting */}
        {user && (
          <div className="hidden md:flex items-center gap-2 text-sm">
            <div className="w-7 h-7 bg-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{user.initials}</span>
            </div>
            <span className="text-gray-400 text-xs">
              {user.name.split(' ')[0]}
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2">

          {/* Search */}
          <div className="relative flex items-center">
            {searchOpen && (
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onBlur={() => { setSearchOpen(false); setSearchQuery(''); }}
                placeholder="Search gates, alerts..."
                className="absolute right-9 w-52 bg-[#0a0f2e] border border-gray-700 rounded-lg py-1.5 px-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-600"
              />
            )}
            <button
              onClick={() => setSearchOpen(v => !v)}
              className={`p-2 rounded-lg transition-colors ${searchOpen ? 'text-purple-400 bg-purple-900/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
              <Search size={20} />
            </button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(v => !v)}
              className={`p-2 rounded-lg transition-colors relative ${showNotifs ? 'text-purple-400 bg-purple-900/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#111827] border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-white text-sm font-semibold">Notifications</span>
                  <span className="text-xs text-gray-500">{notifications.length} new</span>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-800 transition-colors border-b border-gray-800/60">
                    <div className={`w-2 h-2 rounded-full ${n.color} mt-1.5 flex-shrink-0`} />
                    <div>
                      <p className="text-gray-200 text-sm">{n.text}</p>
                      <p className="text-gray-600 text-xs mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowNotifs(false)}
                  className="w-full py-3 text-purple-400 text-xs hover:bg-gray-800 transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          {/* Connection status */}
          <button className="p-2 text-green-400 hover:bg-gray-800 rounded-lg transition-colors" title="System connected">
            <Wifi size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
