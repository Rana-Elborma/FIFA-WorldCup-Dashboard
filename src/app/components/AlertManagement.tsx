import { SystemHealth } from './alerts/SystemHealth';
import { ActiveIncidents } from './alerts/ActiveIncidents';
import { FanAppBroadcast } from './alerts/FanAppBroadcast';

interface AlertManagementProps {
  showToast: (message: string) => void;
  decrementIncidents: () => void;
}

export function AlertManagement({ showToast, decrementIncidents }: AlertManagementProps) {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Alert Management</h2>
        <p className="text-gray-400">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Monitoring
          </span>
        </p>
      </div>

      <SystemHealth />
      <ActiveIncidents showToast={showToast} decrementIncidents={decrementIncidents} />
      <FanAppBroadcast showToast={showToast} />
    </div>
  );
}
