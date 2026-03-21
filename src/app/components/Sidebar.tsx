import { Home, Bell, Settings, Power } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import hostNationLogo from '../../assets/90281fab4f78e6712a13e4c63a2ae2bd7279d79a.png';
interface SidebarProps {
  currentView: 'dashboard' | 'alerts' | 'settings';
  setCurrentView: (view: 'dashboard' | 'alerts' | 'settings') => void;
  incidentCount: number;
}

const NAV = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
  { id: 'alerts' as const, label: 'Alerts', icon: Bell },
  { id: 'settings' as const, label: 'Settings', icon: Settings },
];

export function Sidebar({ currentView, setCurrentView, incidentCount }: SidebarProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const initials = user?.initials ?? 'AS';
  const displayName = user?.name ?? 'Ahmed Al-Saud';
  const displayRole = user?.role ?? 'Head of Security';

  return (
    <div className="w-64 bg-[#111827] flex flex-col border-r border-gray-800">

      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex flex-col items-center gap-3">
          <img
            src={hostNationLogo}
            alt="Host Nation Saudi Arabia"
            className="w-full max-w-[140px] h-auto object-contain"
          />
          <div>
            <div className="text-white font-bold text-sm text-center">FIFA WC 2034</div>
            <div className="text-purple-400 text-xs text-center">Admin Dashboard</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = currentView === id;
          return (
            <button
              key={id}
              onClick={() => setCurrentView(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                active
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>

              {/* Alert badge on alerts tab */}
              {id === 'alerts' && incidentCount > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {incidentCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-gray-800" />

      {/* User section */}
      <div className="p-4 pb-5 space-y-3">
        {/* User info */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{displayName}</div>
            <div className="text-gray-400 text-xs truncate">{displayRole}</div>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-transparent hover:border-red-900/40 rounded-lg transition-colors text-sm"
        >
          <Power size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
