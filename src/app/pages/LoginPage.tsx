import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Shield, Eye, EyeOff, ArrowLeft, Lock, Mail, ArrowRight, Activity, BarChart3, AlertTriangle, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StadiumPrototype3D } from '../components/landing/StadiumPrototype3D';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    signIn(email, name || 'Ahmed Al-Saud', 'Head of Security');
    setLoading(false);
    navigate('/dashboard');
  };

  const handleDemo = () => {
    setEmail('demo@crowdsafe.sa');
    setPassword('demo1234');
    setName('Ahmed Al-Saud');
  };

  return (
    <div className="min-h-screen bg-[#0a0f2e] flex">

      {/* Left — 3D Stadium panel */}
      <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden bg-[#0d1126] border-r border-gray-800">
        {/* 3D scene fills entire panel */}
        <div className="absolute inset-0">
          <StadiumPrototype3D />
        </div>

        {/* Top overlay */}
        <div className="relative z-10 p-8 flex items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-[#111827]/85 border border-gray-700 text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors backdrop-blur-sm"
          >
            <ArrowLeft size={15} /> Back to Home
          </button>
        </div>

        {/* Density legend */}
        <div className="relative z-10 absolute bottom-36 left-6 bg-[#0a0f2e]/85 border border-gray-700 rounded-xl px-4 py-2.5 flex items-center gap-4">
          {[{ c: 'bg-green-500', l: 'Low' }, { c: 'bg-orange-500', l: 'Moderate' }, { c: 'bg-red-500', l: 'Critical' }].map(({ c, l }) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${c}`} />
              <span className="text-gray-500 text-[10px]">{l}</span>
            </div>
          ))}
        </div>

        {/* Bottom overlay card */}
        <div className="relative z-10 mt-auto p-7">
          <div className="bg-[#111827]/90 border border-gray-700 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center">
                <Shield size={18} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">CrowdSafe AI — Aramco Stadium</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-[10px]">Live 3D Prototype · Drag to Rotate</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: Activity,      label: 'Live Monitoring', color: 'text-green-400' },
                { icon: BarChart3,     label: 'AI Analytics',    color: 'text-cyan-400' },
                { icon: AlertTriangle, label: 'Incident Mgmt',   color: 'text-orange-400' },
                { icon: Users,         label: 'Crowd Density',   color: 'text-purple-400' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2 bg-[#0a0f2e]/70 rounded-lg px-3 py-2 border border-gray-800">
                  <Icon size={13} className={color} />
                  <span className="text-gray-300 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="w-full max-w-md"
        >
          {/* Mobile back */}
          <button
            onClick={() => navigate('/')}
            className="flex lg:hidden items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft size={15} /> Back to Home
          </button>

          {/* Mobile brand */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-700 flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">CrowdSafe AI</div>
              <div className="text-purple-400 text-xs">FIFA WC 2034</div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Sign In</h1>
            <p className="text-gray-400 text-sm">Access the security monitoring dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@crowdsafe.sa"
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-600 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-400 text-sm">Password</label>
                <button type="button" className="text-purple-400 text-xs hover:text-purple-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-purple-600 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center gap-3">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-700 bg-[#111827] accent-purple-600" />
              <label htmlFor="remember" className="text-gray-400 text-sm">Keep me signed in</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-600 disabled:bg-purple-900 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-colors"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Sign In to Dashboard</span><ArrowRight size={18} /></>
              }
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-gray-600 text-xs">or</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            {/* Demo */}
            <button
              type="button"
              onClick={handleDemo}
              className="w-full border border-gray-700 bg-[#111827] text-gray-300 py-3.5 rounded-xl text-sm hover:border-gray-600 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Shield size={15} className="text-purple-400" />
              Use Demo Credentials
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Sign up
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
