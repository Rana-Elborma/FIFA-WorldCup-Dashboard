import { useState } from 'react';
import { Send, ChevronDown, MessageSquare, Info, AlertCircle, Navigation, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FanAppBroadcastProps {
  showToast: (message: string) => void;
}

export function FanAppBroadcast({ showToast }: FanAppBroadcastProps) {
  const [messageType, setMessageType] = useState<'info' | 'alert' | 'reroute' | 'emergency'>('info');
  const [targetGroup, setTargetGroup] = useState('All Fans');
  const [priority, setPriority] = useState('MEDIUM');
  const [message, setMessage] = useState('');
  const [showRecentBroadcasts, setShowRecentBroadcasts] = useState(false);

  const handleSendNotification = () => {
    if (message.trim()) {
      showToast('Notification sent successfully to ' + targetGroup);
      setMessage('');
    } else {
      showToast('Please enter a message');
    }
  };

  const messageTypePlaceholders = {
    info: 'Use this for general stadium updates, match information, or informational announcements...',
    alert: 'Use this for important warnings or alerts that require fan attention...',
    reroute: 'Use this to redirect fans to alternative routes or areas...',
    emergency: 'Use this for urgent emergency situations requiring immediate action...'
  };

  const recentBroadcasts = [
    { id: 1, type: 'info', message: 'Welcome to FIFA WC 2034! Match kick...', time: '14:15:32', recipients: 62400 },
    { id: 2, type: 'reroute', message: 'Gate A3 temporarily closed. Please use...', time: '14:08:21', recipients: 8200 }
  ];

  return (
    <div className="bg-[#1e2a4a] rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-800 bg-[#1a2340]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <MessageSquare className="text-purple-400" size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Fan App Broadcast</h2>
          </div>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Send size={16} />
            AI Suggest
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Message Type Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setMessageType('info')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              messageType === 'info'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Info size={16} />
            Info
          </button>
          <button
            onClick={() => setMessageType('alert')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              messageType === 'alert'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <AlertCircle size={16} />
            Alert
          </button>
          <button
            onClick={() => setMessageType('reroute')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              messageType === 'reroute'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Navigation size={16} />
            Reroute
          </button>
          <button
            onClick={() => setMessageType('emergency')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              messageType === 'emergency'
                ? 'bg-red-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <AlertTriangle size={16} />
            Emergency
          </button>
        </div>

        {/* Target and Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Group</label>
            <div className="relative">
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full bg-[#111827] border border-gray-700 text-white rounded-lg px-4 py-2.5 appearance-none cursor-pointer focus:outline-none focus:border-blue-500"
              >
                <option>All Fans</option>
                <option>Gate A3 Zone</option>
                <option>VIP Section</option>
                <option>North Stand</option>
                <option>South Stand</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
            <div className="relative">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-[#111827] border border-gray-700 text-white rounded-lg px-4 py-2.5 appearance-none cursor-pointer focus:outline-none focus:border-blue-500"
              >
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
                <option>URGENT</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={messageTypePlaceholders[messageType]}
            className="w-full bg-[#111827] border border-gray-700 text-white rounded-lg px-4 py-3 min-h-[120px] focus:outline-none focus:border-blue-500 resize-none"
          />
          <p className="text-xs text-gray-400 mt-2">
            {message.length}/500 characters • AI-generated message ready
          </p>
        </div>

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSendNotification}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Send size={20} />
          Send Notification
        </motion.button>

        {/* Recent Broadcasts */}
        <div className="border-t border-gray-700 pt-4">
          <button
            onClick={() => setShowRecentBroadcasts(!showRecentBroadcasts)}
            className="flex items-center justify-between w-full text-white hover:text-gray-300 transition-colors"
          >
            <span className="text-sm font-medium">Recent Broadcasts</span>
            <motion.div
              animate={{ rotate: showRecentBroadcasts ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </button>

          <AnimatePresence>
            {showRecentBroadcasts && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-3 overflow-hidden"
              >
                {recentBroadcasts.map((broadcast) => (
                  <div key={broadcast.id} className="bg-[#111827] rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-800 rounded">
                        <MessageSquare size={16} className="text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm mb-2">{broadcast.message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="font-mono">{broadcast.time}</span>
                          <span>•</span>
                          <span>{broadcast.recipients.toLocaleString()} recipients</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
