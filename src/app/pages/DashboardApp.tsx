import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Dashboard } from '../components/Dashboard';
import { AlertManagement } from '../components/AlertManagement';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { DecorativeBanners } from '../components/DecorativeBanners';
import { Toast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

export function DashboardApp() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [currentView, setCurrentView] = useState<'dashboard' | 'alerts' | 'settings'>('dashboard');
  const [activeIncidents, setActiveIncidents] = useState(4);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const decrementIncidents = () => {
    setActiveIncidents(prev => Math.max(0, prev - 1));
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-[#0a0f2e] overflow-hidden">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        incidentCount={activeIncidents}
      />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header />
        <DecorativeBanners />
        <main className="flex-1 overflow-y-auto relative">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'alerts' && (
            <AlertManagement
              showToast={showToast}
              decrementIncidents={decrementIncidents}
            />
          )}
          {currentView === 'settings' && (
            <div className="p-8 text-white">
              <h2 className="text-2xl font-bold">Settings</h2>
              <p className="mt-4 text-gray-400">Settings panel coming soon...</p>
            </div>
          )}
        </main>
      </div>
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}