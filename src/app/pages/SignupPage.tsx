import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Eye, EyeOff, ArrowLeft, Lock, Mail,
  User, Building2, ArrowRight, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/ui/BrandLogo';

const ROLES = [
  'Stadium Operator',
  'Security Officer',
  'Admin / Supervisor',
  'Analytics Viewer',
  'System Engineer',
];

// ── Placeholder API hook ──
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function apiSignUp(payload: {
  name: string; email: string; role: string; password: string;
}): Promise<{ name: string; role: string }> {
  if (API_BASE_URL) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message ?? 'Registration failed. Please try again.');
    }
    const data = await res.json();
    return { name: data.name ?? payload.name, role: data.role ?? payload.role };
  }
  // ── No API connected: simulate success ──
  await new Promise((r) => setTimeout(r, 1200));
  return { name: payload.name, role: payload.role };
}

export function SignupPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [form, setForm] = useState({ name:'', email:'', role:'', password:'', confirm:'' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [done, setDone]         = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.role || !form.password) {
      setError('Please fill in all fields.'); return;
    }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const { name, role } = await apiSignUp({ name:form.name, email:form.email, role:form.role, password:form.password });
      signIn(form.email, name, role);
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strengthLevel = Math.min(4, Math.floor(form.password.length / 2));
  const strengthColors = ['bg-gray-700','bg-red-500','bg-orange-500','bg-yellow-500','bg-green-500'];

  if (done) {
    return (
      <div className="min-h-screen bg-[#0a0f2e] flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity:0, scale:0.9 }}
          animate={{ opacity:1, scale:1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-7 rounded-full bg-green-700 border border-green-600 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">Account Created!</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Welcome to CrowdSafe AI,{' '}
            <span className="text-white font-semibold">{form.name}</span>.{' '}
            Your <span className="text-purple-400">{form.role}</span> account is ready.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 mx-auto bg-purple-700 hover:bg-purple-600 text-white px-10 py-4 rounded-xl font-bold transition-colors"
          >
            Go to Dashboard <ArrowRight size={17} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f2e] flex">

      {/* ── Left: Branding Panel ── */}
      <div className="hidden lg:flex flex-col w-5/12 relative overflow-hidden bg-[#0d1126] border-r border-gray-800">
        {/* Grid bg */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.028]"
          style={{
            backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize:'40px 40px',
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-[#111827] border border-gray-800 text-gray-500 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors w-fit mb-14"
          >
            <ArrowLeft size={14} /> Back to Home
          </button>

          <div className="flex-1 flex flex-col justify-center">
            {/* Left branding panel icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#0a0f2e] border border-purple-800/60 flex items-center justify-center mb-7 shadow-lg shadow-purple-900/20">
              <BrandLogo size={44} />
            </div>

            <h2 className="text-3xl font-black text-white mb-3">
              Join <span className="text-purple-400">CrowdSafe AI</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-xs mb-9">
              Create your account to monitor and manage crowd safety for FIFA World Cup 2034.
            </p>

            <div className="space-y-3">
              {[
                { title:'Real-time Monitoring',  desc:'Live crowd density across all venues',  dot:'bg-cyan-400'   },
                { title:'AI Predictions',         desc:'Anticipate congestion before it happens',dot:'bg-purple-400'},
                { title:'Incident Management',    desc:'Respond to alerts in under 2 seconds',  dot:'bg-orange-400' },
                { title:'Fan Guidance',           desc:'Route spectators to less crowded gates', dot:'bg-green-400'  },
              ].map(({ title, desc, dot }) => (
                <div key={title} className="flex items-start gap-3 p-3.5 bg-[#111827]/70 rounded-xl border border-gray-800">
                  <div className={`w-2 h-2 rounded-full ${dot} mt-1.5 flex-shrink-0`} />
                  <div>
                    <div className="text-white text-sm font-semibold">{title}</div>
                    <div className="text-gray-600 text-xs mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-700 text-[10px]">FIFA World Cup 2034 · Saudi Arabia · Saudi Vision 2030</p>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto bg-[#0a0f2e]">
        <motion.div
          initial={{ opacity:0, y:28 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.55 }}
          className="w-full max-w-md py-6"
        >
          {/* Mobile back */}
          <button
            onClick={() => navigate('/')}
            className="flex lg:hidden items-center gap-2 text-gray-500 hover:text-white transition-colors mb-7 text-sm"
          >
            <ArrowLeft size={14} /> Back
          </button>

          {/* Mobile brand */}
          <div className="flex lg:hidden items-center gap-3 mb-7">
            <div className="w-9 h-9 rounded-xl bg-[#0a0f2e] border border-purple-800/60 flex items-center justify-center">
              <BrandLogo size={24} />
            </div>
            <div>
              <div className="text-white font-bold text-sm">CrowdSafe AI</div>
              <div className="text-purple-400 text-xs">FIFA WC 2034</div>
            </div>
          </div>

          <div className="mb-7">
            <h1 className="text-3xl font-black text-white mb-1.5">Create Account</h1>
            <p className="text-gray-500 text-sm">Join the crowd management platform</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-red-900/20 border border-red-800/60 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Full name */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Ahmed Al-Saud"
                  autoComplete="name"
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-purple-600 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@crowdsafe.sa"
                  autoComplete="email"
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-purple-600 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Role</label>
              <div className="relative">
                <Building2 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none z-10" />
                <select
                  value={form.role}
                  onChange={set('role')}
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-purple-600 transition-colors appearance-none"
                  style={{ color: form.role ? 'white' : '#4b5563' }}
                >
                  <option value="" disabled>Select your role…</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r} style={{ color:'white', background:'#111827' }}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-gray-700 focus:outline-none focus:border-purple-600 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex gap-1">
                  {[1,2,3,4].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full transition-colors ${
                        strengthLevel >= i ? strengthColors[strengthLevel] : 'bg-gray-800'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={set('confirm')}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  className={`w-full bg-[#111827] border rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-700 focus:outline-none transition-colors text-sm ${
                    form.confirm && form.confirm !== form.password
                      ? 'border-red-700 focus:border-red-600'
                      : 'border-gray-700 focus:border-purple-600'
                  }`}
                />
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                required
                id="terms"
                className="w-4 h-4 mt-0.5 rounded border-gray-700 bg-[#111827] accent-purple-600 flex-shrink-0"
              />
              <label htmlFor="terms" className="text-gray-500 text-xs leading-relaxed">
                I agree to the{' '}
                <span className="text-purple-400 cursor-pointer hover:underline">Terms of Service</span>
                {' '}and{' '}
                <span className="text-purple-400 cursor-pointer hover:underline">Privacy Policy</span>
                {' '}of the CrowdSafe AI system.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-600 disabled:bg-purple-900 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-colors mt-1"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Create Account</span><ArrowRight size={17} /></>
              }
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}