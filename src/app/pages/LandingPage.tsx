import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Shield, Cpu, Smartphone, GitMerge,
  ChevronDown, ArrowRight, CheckCircle2, AlertTriangle,
  Users, Zap, BarChart3, Lock,
  TrendingDown, Eye, Navigation, Radio,
  Activity, Camera, Layers, GitBranch,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlowCard } from '../components/ui/spotlight-card';
import { StadiumPrototype3D } from '../components/landing/StadiumPrototype3D';

// ── Motion presets ──
const fadeUp = {
  hidden:  { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
const fadeIn = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const staggerFast = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ── Section label ──
function SectionBadge({ icon: Icon, text, color }: { icon: React.ElementType; text: string; color: string }) {
  return (
    <div className={`inline-flex items-center gap-2 bg-[#111827] border text-xs px-4 py-2 rounded-full mb-5 ${color}`}>
      <Icon size={12} />
      {text}
    </div>
  );
}

// ── Section heading ──
function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-4xl font-black text-white mb-5 leading-tight">{children}</h2>;
}

// ── Divider ──
function SectionNumber({ n }: { n: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="text-gray-700 font-mono text-xs tracking-widest">{n}</span>
      <div className="flex-1 h-px bg-gray-800" />
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const heroRef      = useRef<HTMLDivElement>(null);
  const problemRef   = useRef<HTMLDivElement>(null);
  const whyUsRef     = useRef<HTMLDivElement>(null);
  const featuresRef  = useRef<HTMLDivElement>(null);
  const objectivesRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) =>
    ref.current?.scrollIntoView({ behavior: 'smooth' });

  const handleDashboard = () =>
    isAuthenticated ? navigate('/dashboard') : navigate('/login');

  return (
    <div className="min-h-screen bg-[#0a0f2e] text-white overflow-x-hidden">

      {/* ══ NAVBAR ══ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/80"
        style={{ background: 'rgba(10,15,46,0.94)', backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-700 flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <div className="text-white text-sm font-black leading-none">CrowdSafe AI</div>
              <div className="text-purple-400 text-[10px] leading-none mt-0.5 tracking-wide">FIFA WC 2034</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-xs text-gray-400 font-medium tracking-wide">
            {[
              { label: 'PROBLEM',    ref: problemRef },
              { label: 'WHY US',     ref: whyUsRef },
              { label: 'FEATURES',   ref: featuresRef },
              { label: 'OBJECTIVES', ref: objectivesRef },
            ].map(({ label, ref }) => (
              <button
                key={label}
                onClick={() => scrollTo(ref)}
                className="hover:text-white transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xs bg-purple-700 hover:bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-xs text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/8 transition-colors border border-gray-700"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="text-xs bg-purple-700 hover:bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <div ref={heroRef} />
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* BG grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        {/* BG dot accent */}
        <div className="absolute top-32 right-1/4 w-96 h-96 rounded-full bg-purple-900/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-cyan-900/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left — copy */}
          <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10">
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 bg-[#1a2444] border border-purple-800/50 text-purple-300 text-xs px-4 py-2 rounded-full mb-7">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                FIFA World Cup 2034 · Kingdom of Saudi Arabia
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl lg:text-[3.8rem] font-black leading-[1.04] mb-6">
              <span className="text-white">Intelligent</span>{' '}
              <span className="text-purple-400">Crowd</span>
              <br />
              <span className="text-white">Management</span>
              <br />
              <span className="text-cyan-400">System</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">
              Protecting <span className="text-white font-semibold">3.4M+ visitors</span> across Saudi Arabia's FIFA WC 2034 venues with AI-powered real-time monitoring, predictive crowd analytics, and automated smart-gate control.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={handleDashboard}
                className="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-colors"
              >
                Access Dashboard <ArrowRight size={16} />
              </button>
              <button
                onClick={() => scrollTo(problemRef)}
                className="flex items-center gap-2 border border-gray-700 text-gray-300 hover:text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-white/5 transition-colors"
              >
                Learn More <ChevronDown size={16} />
              </button>
            </motion.div>

            {/* Mini stat cards */}
            <motion.div variants={staggerFast} className="grid grid-cols-3 gap-3">
              {[
                { val: '3.4M+', label: 'Visitors', color: 'text-cyan-400', border: 'border-cyan-900/50' },
                { val: '48',    label: 'Matches',  color: 'text-purple-400', border: 'border-purple-900/50' },
                { val: '15+',   label: 'Cities',   color: 'text-green-400',  border: 'border-green-900/50' },
              ].map(s => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  className={`bg-[#111827] border ${s.border} rounded-xl p-4 text-center`}
                  style={{ perspective: '500px' }}
                  whileHover={{ rotateY: 6, scale: 1.04, transition: { duration: 0.25 } }}
                >
                  <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
                  <div className="text-gray-600 text-xs mt-1">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — 3D Stadium Prototype */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
            className="relative h-[520px] lg:h-[650px] rounded-2xl overflow-hidden border border-gray-800 bg-[#0d1126]"
            style={{ perspective: '1200px' }}
          >
            {/* Corner dots */}
            <div className="absolute top-3 left-4 z-10 flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            {/* Top right badge */}
            <div className="absolute top-3 right-4 z-10 flex items-center gap-2 bg-[#0a0f2e]/90 border border-gray-700 rounded-lg px-3 py-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-gray-400 text-[10px] font-mono tracking-wider">ARAMCO STADIUM LIVE</span>
            </div>

            {/* 3D scene */}
            <StadiumPrototype3D />

            {/* Density legend */}
            <div className="absolute bottom-4 left-4 z-10 bg-[#0a0f2e]/85 border border-gray-700 rounded-xl px-4 py-2.5 flex items-center gap-4">
              {[{ c: 'bg-green-500', l: 'Low' }, { c: 'bg-orange-500', l: 'Moderate' }, { c: 'bg-red-500', l: 'Critical' }].map(({ c, l }) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${c}`} />
                  <span className="text-gray-500 text-[10px]">{l}</span>
                </div>
              ))}
            </div>

            {/* Drag hint */}
            <div className="absolute bottom-4 right-4 z-10 bg-[#0a0f2e]/85 border border-gray-700 rounded-lg px-3 py-2">
              <span className="text-gray-500 text-[10px]">Drag to rotate</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.button
          animate={{ y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          onClick={() => scrollTo(problemRef)}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-700 hover:text-gray-500 transition-colors"
        >
          <ChevronDown size={26} />
        </motion.button>
      </section>

      {/* ══ STATS BAR ══ */}
      <div className="border-y border-gray-800 bg-[#0d1126] py-7">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={staggerFast}
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
          >
            {[
              { icon: Users,    val: '100,000+',  label: 'Spectators / Match',   color: 'text-purple-400', border: 'border-purple-900/40' },
              { icon: Activity, val: 'Real-time', label: 'AI Crowd Monitoring',  color: 'text-cyan-400',   border: 'border-cyan-900/40' },
              { icon: Zap,      val: '<2 sec',    label: 'Alert Response Target', color: 'text-green-400',  border: 'border-green-900/40' },
              { icon: Shield,   val: '99.9%',     label: 'System Uptime Target', color: 'text-orange-400', border: 'border-orange-900/40' },
            ].map(({ icon: Icon, val, label, color, border }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className={`flex items-center gap-4 bg-[#111827] border ${border} rounded-xl p-4`}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <div className={`w-10 h-10 rounded-lg bg-[#0a0f2e] border ${border} flex items-center justify-center ${color} flex-shrink-0`}>
                  <Icon size={19} />
                </div>
                <div>
                  <div className={`font-black text-lg leading-none ${color}`}>{val}</div>
                  <div className="text-gray-600 text-xs mt-1">{label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══ PROBLEM SECTION ══ */}
      <div ref={problemRef} />
      <section className="py-24 px-6 bg-[#0a0f2e]">
        <div className="max-w-7xl mx-auto">
          <SectionNumber n="01 — CHALLENGE" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionBadge icon={AlertTriangle} text="The Problem We Solve" color="border-red-800/50 text-red-400" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <SectionHeading>
                Why Crowd Management Needs{' '}
                <span className="text-red-400">a Revolution</span>
              </SectionHeading>
            </motion.div>
            <motion.p variants={fadeUp} className="text-gray-400 max-w-2xl text-lg leading-relaxed mb-14">
              Hosting <strong className="text-white">3.4 million visitors</strong> across Saudi Arabia in just 64 days — traditional crowd management is dangerously unequipped for this scale.
            </motion.p>

            <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: AlertTriangle, glow: 'red' as const,
                  title: 'Critical Safety Risks',
                  desc: 'The Hillsborough disaster (1989) killed 97 people due to poor crowd control and delayed response. At WC 2034 scale, a similar incident could be catastrophic.',
                  tag: '97 fatalities · Hillsborough 1989',
                  tagColor: 'text-red-400 bg-red-900/20 border border-red-900/40',
                },
                {
                  icon: Users, glow: 'orange' as const,
                  title: 'Unmanageable Congestion',
                  desc: 'Millions converge at gate checkpoints within short windows. Static planning and manual supervision cannot adapt fast enough to prevent dangerous bottlenecks.',
                  tag: '100K+ per match · multi-venue',
                  tagColor: 'text-orange-400 bg-orange-900/20 border border-orange-900/40',
                },
                {
                  icon: GitBranch, glow: 'purple' as const,
                  title: 'Fragmented Systems',
                  desc: 'Current surveillance, gate hardware, and analytics operate in complete isolation with no unified view, no prediction capability, and no automated response.',
                  tag: 'Reactive, not proactive',
                  tagColor: 'text-purple-400 bg-purple-900/20 border border-purple-900/40',
                },
              ].map(({ icon: Icon, glow, title, desc, tag, tagColor }) => (
                <motion.div key={title} variants={fadeIn}>
                  <GlowCard
                    glowColor={glow}
                    customSize
                    className="h-full p-7 flex flex-col gap-5"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#111827] border border-gray-700 flex items-center justify-center mb-5">
                        <Icon size={22} className={
                          glow === 'red' ? 'text-red-400' :
                          glow === 'orange' ? 'text-orange-400' : 'text-purple-400'
                        } />
                      </div>
                      <h3 className="text-white font-bold text-xl mb-3">{title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                    </div>
                    <div className={`text-xs font-semibold ${tagColor} rounded-lg px-3 py-2 mt-auto inline-block`}>
                      ⚠ {tag}
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ WHY US ══ */}
      <div ref={whyUsRef} />
      <section className="py-24 px-6 bg-[#0d1126]">
        <div className="max-w-7xl mx-auto">
          <SectionNumber n="02 — ADVANTAGE" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionBadge icon={Zap} text="Our Advantage" color="border-cyan-800/50 text-cyan-400" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <SectionHeading>
                <span className="text-cyan-400">CrowdSafe AI</span>{' '}
                vs Traditional Systems
              </SectionHeading>
            </motion.div>
            <motion.p variants={fadeUp} className="text-gray-400 max-w-2xl leading-relaxed mb-12">
              We unify real-time sensing, AI prediction, and automated physical control into one platform — a first for large-scale event management.
            </motion.p>

            <motion.div variants={fadeIn} className="overflow-hidden rounded-2xl border border-gray-800">
              {/* Table header */}
              <div className="grid grid-cols-3 bg-[#111827] border-b border-gray-800">
                <div className="p-5 text-gray-500 text-xs font-semibold tracking-widest uppercase">Capability</div>
                <div className="p-5 text-center text-gray-600 text-xs font-semibold tracking-widest uppercase border-x border-gray-800">Traditional</div>
                <div className="p-5 text-center text-cyan-400 text-xs font-semibold tracking-widest uppercase">CrowdSafe AI</div>
              </div>

              {[
                { cap: 'Monitoring Approach',   old: 'Reactive — acts after incidents',     us: 'Proactive — predicts issues ahead of time' },
                { cap: 'Decision Making',       old: 'Manual operator interpretation',      us: 'AI-automated decisions in under 2 seconds' },
                { cap: 'System Integration',    old: 'Isolated silos (cameras, gates)',     us: 'Unified platform from sensing to control' },
                { cap: 'Gate Control',          old: 'Static, manually adjusted configs',   us: 'Smart gates auto-adjust from live AI data' },
                { cap: 'Fan Guidance',          old: 'Static signs, no personalization',    us: 'Mobile app with real-time route guidance' },
                { cap: 'Congestion Prediction', old: 'Not available',                       us: 'AI models predict density minutes ahead' },
              ].map(({ cap, old, us }, i) => (
                <motion.div
                  key={cap}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className={`grid grid-cols-3 border-b border-gray-800/50 transition-colors hover:bg-[#1e2a4a]/30 ${i % 2 === 0 ? 'bg-[#0d1126]' : 'bg-[#0a0f2e]'}`}
                >
                  <div className="p-5 text-white text-sm font-medium">{cap}</div>
                  <div className="p-5 text-center border-x border-gray-800/50 flex items-center justify-center">
                    <span className="text-gray-600 text-sm">{old}</span>
                  </div>
                  <div className="p-5 flex items-center justify-center gap-2">
                    <CheckCircle2 size={13} className="text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{us}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ SYSTEM DELIVERABLES ══ */}
      <div ref={featuresRef} />
      <section className="py-24 px-6 bg-[#0a0f2e]">
        <div className="max-w-7xl mx-auto">
          <SectionNumber n="03 — DELIVERABLES" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionBadge icon={Cpu} text="Three System Pillars" color="border-purple-800/50 text-purple-400" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <SectionHeading>
                Built for <span className="text-purple-400">Operators</span>,{' '}
                <span className="text-cyan-400">Fans</span>{' '}&{' '}
                <span className="text-green-400">Infrastructure</span>
              </SectionHeading>
            </motion.div>
            <motion.p variants={fadeUp} className="text-gray-400 max-w-2xl leading-relaxed mb-14">
              Three interconnected components that form a complete end-to-end crowd management ecosystem.
            </motion.p>

            <motion.div variants={stagger} className="grid md:grid-cols-3 gap-7">
              {[
                {
                  icon: BarChart3, glow: 'purple' as const,
                  num: '01',
                  title: 'Admin Dashboard',
                  sub: 'For Stadium Operators',
                  accent: 'text-purple-400', accentBorder: 'border-purple-900/50',
                  features: [
                    { icon: Eye, t: 'Live crowd density heatmaps' },
                    { icon: Activity, t: 'Queue lengths & gate utilization' },
                    { icon: BarChart3, t: 'AI-generated alerts & insights' },
                    { icon: Layers, t: 'Key performance indicators' },
                    { icon: Camera, t: 'Multi-venue centralized control' },
                  ],
                  desc: 'Centralized real-time visibility into crowd conditions, AI alerts, and recommendations across all stadium gates and concourses.',
                  action: () => navigate('/dashboard'),
                  actionLabel: 'Open Dashboard',
                },
                {
                  icon: Smartphone, glow: 'cyan' as const,
                  num: '02',
                  title: 'Fan Mobile App',
                  sub: 'For Spectators',
                  accent: 'text-cyan-400', accentBorder: 'border-cyan-900/50',
                  features: [
                    { icon: Activity, t: 'Real-time congestion indicators' },
                    { icon: Navigation, t: 'Gate status & live availability' },
                    { icon: ArrowRight, t: 'Recommended route guidance' },
                    { icon: Zap, t: 'Entry time predictions' },
                    { icon: Lock, t: 'Privacy-preserving design' },
                  ],
                  desc: 'The spectator-facing app guiding fans with real-time data to reduce waiting and improve entry experience.',
                  action: null,
                  actionLabel: 'Coming Soon',
                },
                {
                  icon: GitMerge, glow: 'green' as const,
                  num: '03',
                  title: 'Smart Gate System',
                  sub: 'Physical Infrastructure',
                  accent: 'text-green-400', accentBorder: 'border-green-900/50',
                  features: [
                    { icon: Zap, t: 'Automated flow regulation' },
                    { icon: Cpu, t: 'AI-commanded gate control' },
                    { icon: Users, t: 'High-throughput operation' },
                    { icon: Shield, t: 'Safe-state emergency mode' },
                    { icon: Activity, t: 'Real-time status telemetry' },
                  ],
                  desc: 'Smart physical gates that automatically adjust based on live AI commands, balancing crowd density and preventing dangerous congestion.',
                  action: null,
                  actionLabel: 'Hardware Prototype',
                },
              ].map(({ icon: Icon, glow, num, title, sub, accent, accentBorder, features, desc, action, actionLabel }) => (
                <motion.div key={title} variants={fadeIn} className="flex flex-col">
                  <GlowCard glowColor={glow} customSize className="h-full flex flex-col">
                    {/* Card header */}
                    <div className={`p-6 border-b border-gray-800 bg-[#111827]/60`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-[#0a0f2e] border ${accentBorder} flex items-center justify-center`}>
                          <Icon size={22} className={accent} />
                        </div>
                        <span className="text-gray-700 font-mono text-xs">{num}</span>
                      </div>
                      <h3 className="text-white font-black text-xl leading-none mb-1">{title}</h3>
                      <p className={`${accent} text-xs`}>{sub}</p>
                    </div>

                    {/* Card body */}
                    <div className="p-6 flex flex-col flex-1 gap-5">
                      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                      <ul className="space-y-2.5 flex-1">
                        {features.map(({ icon: FIcon, t }) => (
                          <li key={t} className="flex items-center gap-3 text-sm text-gray-300">
                            <FIcon size={13} className={accent} />
                            {t}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={action ?? undefined}
                        disabled={!action}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors border ${accentBorder} ${
                          action
                            ? `${accent} hover:bg-white/5`
                            : 'text-gray-600 border-gray-800 cursor-not-allowed'
                        }`}
                      >
                        {actionLabel}{action && <ArrowRight size={13} className="inline ml-1.5" />}
                      </button>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ OBJECTIVES ══ */}
      <div ref={objectivesRef} />
      <section className="py-24 px-6 bg-[#0d1126]">
        <div className="max-w-7xl mx-auto">
          <SectionNumber n="04 — OBJECTIVES" />
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid lg:grid-cols-5 gap-12 items-start"
          >
            {/* Left column — heading */}
            <motion.div variants={fadeUp} className="lg:col-span-2">
              <SectionBadge icon={CheckCircle2} text="Project Goals" color="border-green-800/50 text-green-400" />
              <SectionHeading>
                Seven Goals That{' '}
                <span className="text-green-400">Define Success</span>
              </SectionHeading>
              <p className="text-gray-400 leading-relaxed mb-8">
                Measurable, specific objectives directly addressing the operational requirements of a nationwide FIFA World Cup 2034 event.
              </p>
              <GlowCard glowColor="green" customSize className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-900/40 border border-green-900/60 flex items-center justify-center flex-shrink-0">
                    <Activity size={15} className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-bold mb-1">Saudi Vision 2030</div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Aligned with KSA's smart-city, digital-infrastructure and quality-of-life transformation roadmap.
                    </p>
                  </div>
                </div>
              </GlowCard>
            </motion.div>

            {/* Right column — objectives */}
            <motion.div variants={stagger} className="lg:col-span-3 space-y-3">
              {[
                { icon: TrendingDown, text: 'Reduce average waiting times at stadium entry points',                color: 'text-cyan-400',   bg: 'border-cyan-900/40',    num: '1' },
                { icon: Cpu,          text: 'Predict crowd density and congestion using AI-based models',         color: 'text-purple-400', bg: 'border-purple-900/40',  num: '2' },
                { icon: Eye,          text: 'Enable real-time monitoring of crowd across all gates and queues',   color: 'text-blue-400',   bg: 'border-blue-900/40',    num: '3' },
                { icon: Zap,          text: 'Automatically regulate crowd flow through AI-commanded smart gates', color: 'text-yellow-400', bg: 'border-yellow-900/40',  num: '4' },
                { icon: BarChart3,    text: 'Provide operators with real-time dashboards for supervision',        color: 'text-green-400',  bg: 'border-green-900/40',   num: '5' },
                { icon: Navigation,   text: 'Offer spectators live congestion updates & route guidance via app',  color: 'text-orange-400', bg: 'border-orange-900/40',  num: '6' },
                { icon: Lock,         text: 'Ensure secure, reliable, privacy-preserving data handling',          color: 'text-red-400',    bg: 'border-red-900/40',     num: '7' },
              ].map(({ icon: Icon, text, color, bg, num }, i) => (
                <motion.div
                  key={num}
                  variants={fadeUp}
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                  className={`flex items-center gap-4 p-4 bg-[#111827]/60 border ${bg} rounded-xl cursor-default`}
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0a0f2e] border border-gray-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 font-mono text-[10px]">{num}</span>
                  </div>
                  <Icon size={15} className={`${color} flex-shrink-0`} />
                  <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ TECH STRIP ══ */}
      <section className="py-12 px-6 bg-[#0a0f2e] border-y border-gray-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-700 text-[10px] uppercase tracking-widest mb-7">Powered by</p>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              'Artificial Intelligence', 'Computer Vision', 'Digital Twin',
              'Cloud Computing', 'IoT Sensors', 'Predictive Analytics',
              'Smart Gate Hardware', 'Real-time APIs',
            ].map(tech => (
              <motion.div
                key={tech}
                variants={fadeUp}
                whileHover={{ scale: 1.07, transition: { duration: 0.18 } }}
                className="flex items-center gap-2 bg-[#111827] border border-gray-800 rounded-full px-5 py-2.5 text-gray-400 text-xs hover:text-white hover:border-gray-600 transition-colors"
              >
                <Radio size={11} className="text-cyan-500" />
                {tech}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-28 px-6 bg-[#0d1126]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.div
              variants={fadeIn}
              className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-purple-700 border border-purple-600 flex items-center justify-center"
              whileHover={{ rotateY: 15, scale: 1.08, transition: { duration: 0.3 } }}
              style={{ perspective: '600px' }}
            >
              <Shield size={36} className="text-white" />
            </motion.div>

            <motion.h2 variants={fadeUp} className="text-5xl font-black text-white mb-5">
              Ready to <span className="text-purple-400">Get Started?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              Access the live monitoring dashboard or create your account to explore the full CrowdSafe AI prototype.
            </motion.p>

            <motion.div variants={staggerFast} className="flex flex-wrap justify-center gap-4">
              <motion.button
                variants={fadeUp}
                whileHover={{ scale: 1.04 }}
                onClick={() => navigate('/signup')}
                className="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 text-white px-10 py-4 rounded-xl font-bold text-base transition-colors"
              >
                Create Account <ArrowRight size={18} />
              </motion.button>
              <motion.button
                variants={fadeUp}
                whileHover={{ scale: 1.04 }}
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 border border-gray-700 text-gray-300 hover:text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-white/5 transition-colors"
              >
                Sign In to Dashboard
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-gray-800 bg-[#0a0f2e] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-purple-700 flex items-center justify-center">
              <Shield size={13} className="text-white" />
            </div>
            <div>
              <div className="text-white text-sm font-bold">CrowdSafe AI</div>
              <div className="text-gray-700 text-xs">FIFA World Cup 2034 · Saudi Arabia</div>
            </div>
          </div>
          <p className="text-gray-700 text-xs text-center">
            Capstone Project · Smart Crowd Management System · Saudi Vision 2030
          </p>
          <div className="flex gap-5 text-gray-600 text-xs">
            <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Sign In</button>
            <button onClick={() => navigate('/signup')} className="hover:text-white transition-colors">Sign Up</button>
            <button onClick={handleDashboard} className="hover:text-white transition-colors">Dashboard</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
