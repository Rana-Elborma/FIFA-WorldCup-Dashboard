import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Cpu, Smartphone, GitMerge, GitBranch,
  ChevronDown, ArrowRight, CheckCircle2, AlertTriangle,
  Users, Zap, BarChart3, Lock, Radio,
  TrendingDown, Eye, Navigation, Activity,
  Camera, Target, Database,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Stadium3D } from '../components/landing/Stadium3D';
import { BrandLogo } from '../components/ui/BrandLogo';
import { BubbleText } from '../components/ui/bubble-text';
import RadialOrbitalTimeline, { TimelineItem } from '../components/ui/radial-orbital-timeline';
import { CardStack, CardStackItem } from '../components/ui/card-stack';
import { VerticalImageStack, StackItem } from '../components/ui/vertical-image-stack';
import { FeatureCarousel } from '../components/ui/feature-carousel';

const fadeUp = { hidden:{opacity:0,y:40}, visible:{opacity:1,y:0,transition:{duration:0.65,ease:'easeOut'}} };
const stagger = { hidden:{}, visible:{transition:{staggerChildren:0.1}} };
const fadeIn  = { hidden:{opacity:0,scale:0.95}, visible:{opacity:1,scale:1,transition:{duration:0.55,ease:'easeOut'}} };

// ── DATA ──
const problemNodes: TimelineItem[] = [
  { id:1, title:'Safety Risks', date:'Critical', content:'Historical disasters like Hillsborough (97 fatalities, 1989) show the devastating consequences of inadequate crowd control. At WC 2034 scale, a failure would be catastrophic.', category:'Safety', icon:AlertTriangle, relatedIds:[2,3], status:'completed', energy:92, accentColor:'#f87171' },
  { id:2, title:'Congestion', date:'High Risk', content:'Millions of fans converge at checkpoints in short windows. Static planning cannot adapt fast enough — queue buildup leads to dangerous crowd compression at gates.', category:'Operations', icon:Users, relatedIds:[1,3], status:'in-progress', energy:78, accentColor:'#fb923c' },
  { id:3, title:'Fragmented Systems', date:'Systemic', content:'Surveillance, gate hardware and analytics operate in complete silos. No unified view, no predictive capability, no automated response — purely reactive after incidents occur.', category:'Technology', icon:GitBranch, relatedIds:[1,2], status:'in-progress', energy:65, accentColor:'#c084fc' },
];

const whyUsCards: CardStackItem[] = [
  { id:1, title:'Proactive Monitoring', description:'CrowdSafe AI predicts crowd density issues minutes before they occur — not after. Traditional systems only react once an incident has already happened.', icon:Eye, accentColor:'#a78bfa', badge:'vs Traditional', tag:'Proactive · Not Reactive' },
  { id:2, title:'AI Decision Engine', description:'Automated decisions delivered in under 2 seconds. Human operators interpreting data manually cannot match the speed required for 100,000+ crowd events.', icon:Cpu, accentColor:'#22d3ee', badge:'AI Powered', tag:'<2 sec Decision Time' },
  { id:3, title:'Unified Platform', description:'Cameras, gate hardware, analytics and fan apps unified under one platform. Traditional systems operate in isolated silos with no cross-system intelligence.', icon:Database, accentColor:'#34d399', badge:'End-to-End', tag:'Sensing → Control' },
  { id:4, title:'Smart Gate Control', description:'Gates auto-adjust based on live AI data — balancing density across entry points in real-time. Traditional gates have static configurations adjusted manually.', icon:GitMerge, accentColor:'#fb923c', badge:'Hardware + AI', tag:'Adaptive Gate Flow' },
  { id:5, title:'Fan Route Guidance', description:'The spectator mobile app delivers personalised congestion updates and route recommendations. Traditional venues provide only static signage.', icon:Navigation, accentColor:'#60a5fa', badge:'Fan Experience', tag:'Real-time Routes' },
  { id:6, title:'Density Prediction', description:'AI models forecast crowd density minutes ahead based on arrival patterns, match schedules, and transport data. Competitors offer no predictive capability.', icon:BarChart3, accentColor:'#f472b6', badge:'Predictive', tag:'Minutes Ahead' },
];

const featureImages = [
  { src:'', alt:'Admin Dashboard' },
  { src:'', alt:'Fan Mobile App' },
  { src:'', alt:'Smart Gate System' },
];
const featureContent = [
  { icon:BarChart3, title:'Admin Dashboard', sub:'For Stadium Operators', accent:'#a78bfa', features:['Live crowd density heatmaps','Gate utilisation & queue lengths','AI-generated alerts & insights','Multi-venue centralised control'] },
  { icon:Smartphone, title:'Fan Mobile App', sub:'For Spectators', accent:'#22d3ee', features:['Real-time congestion indicators','Recommended route guidance','Gate availability & entry times','Privacy-preserving design'] },
  { icon:GitMerge, title:'Smart Gate System', sub:'Physical Infrastructure', accent:'#34d399', features:['Automated crowd flow regulation','AI-commanded gate open/close','Safe-state emergency mode','High-throughput operation'] },
];

const objectiveItems: StackItem[] = [
  { id:1, number:'01', title:'Reduce Entry Waiting Times',    subtitle:'Objective', description:'Measurably reduce average waiting times at all stadium entry gates through intelligent gate routing and crowd flow balancing.', icon:TrendingDown, accentColor:'#22d3ee', tag:'KPI Driven' },
  { id:2, number:'02', title:'AI Crowd Density Prediction',   subtitle:'Objective', description:'Deploy AI models that forecast crowd density and congestion points at least 5 minutes ahead of occurrence using live and historical data.', icon:Cpu, accentColor:'#a78bfa', tag:'5-min Forecast' },
  { id:3, number:'03', title:'Real-time Crowd Monitoring',    subtitle:'Objective', description:'Enable full visibility into crowd conditions across all stadium gates, concourses, and queues with sub-second data refresh rates.', icon:Eye, accentColor:'#60a5fa', tag:'Live · All Gates' },
  { id:4, number:'04', title:'Automated Smart Gate Control',  subtitle:'Objective', description:'Implement AI-commanded physical gates that regulate crowd flow automatically based on live density data — without manual operator intervention.', icon:Target, accentColor:'#fb923c', tag:'Auto-Regulated' },
  { id:5, number:'05', title:'Operator Visibility Dashboard', subtitle:'Objective', description:'Provide security operators with a comprehensive real-time dashboard covering all stadium zones, alert feeds, and AI recommendations.', icon:Camera, accentColor:'#34d399', tag:'Control Room' },
  { id:6, number:'06', title:'Fan Route Guidance App',        subtitle:'Objective', description:'Deliver real-time congestion updates and personalised route recommendations to spectators via a mobile app, reducing self-directed congestion.', icon:Navigation, accentColor:'#f472b6', tag:'Spectator App' },
  { id:7, number:'07', title:'Secure & Privacy-Preserving',   subtitle:'Objective', description:'Ensure all data is handled securely in compliance with Saudi data protection regulations — anonymised crowd analytics, no personal tracking.', icon:Lock, accentColor:'#f87171', tag:'Privacy First' },
];

// ── Helpers ──
function SectionBadge({ icon: Icon, text, accent = 'text-purple-400', border = 'border-purple-800/50' }: { icon: React.ElementType; text: string; accent?: string; border?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 bg-[#111827] border text-xs px-4 py-2 rounded-full mb-5 ${accent} ${border}`}>
      <Icon size={11} />{text}
    </div>
  );
}
function SectionNum({ n }: { n: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="text-gray-700 font-mono text-xs tracking-widest uppercase">{n}</span>
      <div className="flex-1 h-px bg-gray-800" />
    </div>
  );
}
function BubbleHeading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-4xl font-black mb-4 leading-tight ${className}`}>{children}</h2>;
}

/* ── Rim word helper ───────────────────────────��─────────────────────────────
   Positions a BubbleText label at a stadium rim location.
   `top` / `left` are viewport percentages pointing to the oval edge.
   The label is centred on that point with transform: translate(-50%, -50%).
   A small tracking-widest size keeps them compact but readable.
   ─────────────────────────────────────────────────────────────────────────── */
interface RimWordProps {
  text: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  baseColor: string;
  hoverColor0: string;
  hoverColor1: string;
  hoverColor2: string;
  /** extra label shown below the word */
  sub?: string;
  subColor?: string;
  transformX?: string;
  transformY?: string;
}

function RimWord({ text, top, bottom, left, right, baseColor, hoverColor0, hoverColor1, hoverColor2, sub, subColor = 'text-gray-600', transformX = '-50%', transformY = '-50%' }: RimWordProps) {
  return (
    <div
      className="absolute z-20 hidden md:block pointer-events-none"
      style={{ top, bottom, left, right, transform: `translate(${transformX}, ${transformY})` }}
    >
      <div className="pointer-events-auto text-center">
        {/* thin top rule */}
        <div className="mx-auto mb-1 h-px w-8 bg-white/10" />
        <BubbleText
          text={text}
          className="text-lg tracking-[0.22em]"
          baseColor={baseColor}
          hoverColor0={hoverColor0}
          hoverColor1={hoverColor1}
          hoverColor2={hoverColor2}
        />
        {sub && (
          <div className={`text-[9px] tracking-widest uppercase mt-0.5 ${subColor}`}>{sub}</div>
        )}
        <div className="mx-auto mt-1 h-px w-8 bg-white/10" />
      </div>
    </div>
  );
}

// ── Page ──
export function LandingPage() {
  const navigate   = useNavigate();
  const { isAuthenticated } = useAuth();

  const problemRef    = useRef<HTMLDivElement>(null);
  const whyUsRef      = useRef<HTMLDivElement>(null);
  const featuresRef   = useRef<HTMLDivElement>(null);
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
        style={{ background: 'rgba(10,15,46,0.95)', backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0a0f2e] border border-purple-800/60 flex items-center justify-center">
              <BrandLogo size={24} />
            </div>
            <div>
              <div className="text-white text-sm font-black leading-none">CrowdSafe AI</div>
              <div className="text-purple-400 text-[10px] leading-none mt-0.5 tracking-wide">FIFA WC 2034</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-[11px] text-gray-500 font-semibold tracking-widest">
            {[['PROBLEM',problemRef],['WHY US',whyUsRef],['FEATURES',featuresRef],['OBJECTIVES',objectivesRef]].map(([label, ref]) => (
              <button key={label as string} onClick={() => scrollTo(ref as React.RefObject<HTMLDivElement | null>)} className="hover:text-white transition-colors">
                {label as string}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard')} className="text-xs bg-purple-700 hover:bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold transition-colors">Dashboard</button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-xs text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/6 transition-colors border border-gray-800">Sign In</button>
                <button onClick={() => navigate('/signup')} className="text-xs bg-purple-700 hover:bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold transition-colors">Get Started</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="relative h-screen overflow-hidden">

        {/* ── Stadium canvas — full screen background ── */}
        <div className="absolute inset-0">
          <Stadium3D />
        </div>

        {/* ── Left panel gradient ── */}
        <div
          className="absolute inset-y-0 left-0 pointer-events-none z-10"
          style={{
            width: '42%',
            background: 'linear-gradient(to right, rgba(10,15,46,0.97) 0%, rgba(10,15,46,0.82) 55%, rgba(10,15,46,0.35) 80%, transparent 100%)',
          }}
        />
        {/* ── Subtle edge vignette (all sides) ── */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: 'radial-gradient(ellipse 88% 86% at 56% 52%, transparent 42%, rgba(10,15,46,0.35) 100%)' }}
        />

        {/* ════════════════════════════════════════════════════
            LEFT CONTENT PANEL
            Rim words + ground text rendered in Stadium3D canvas.
        ════════════════════════════════════════════════════ */}
        <div className="absolute left-0 top-0 bottom-0 flex items-start pt-28 z-30 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="px-8 lg:px-12 max-w-[360px] pointer-events-auto"
          >
            {/* Mobile-only stadium badge */}
            <div className="flex md:hidden items-center gap-2 bg-[#111827]/80 border border-gray-700/60 text-xs px-3 py-1.5 rounded-full mb-4 backdrop-blur-sm w-fit">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-gray-300 text-[10px]">Aramco Stadium — Live</span>
            </div>

            {/* Mobile title */}
            <div className="block md:hidden mb-4 space-y-1">
              <BubbleText text="INTELLIGENT" className="text-3xl" baseColor="text-purple-600" hoverColor0="text-white" hoverColor1="text-purple-300" hoverColor2="text-purple-500" />
              <BubbleText text="CROWD MANAGEMENT" className="text-2xl" baseColor="text-cyan-700" hoverColor0="text-cyan-200" hoverColor1="text-cyan-400" hoverColor2="text-cyan-600" />
              <BubbleText text="SYSTEM" className="text-3xl" baseColor="text-purple-600" hoverColor0="text-white" hoverColor1="text-purple-300" hoverColor2="text-purple-500" />
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Protecting{' '}
              <span className="text-white font-semibold">3.4M+ visitors</span>{' '}
              across Saudi Arabia's FIFA WC 2034 venues with real-time AI monitoring, predictive analytics, and automated smart-gate control.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-2.5 mb-7">
              <button
                onClick={handleDashboard}
                className="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
              >
                Access Dashboard <ArrowRight size={14} />
              </button>
              <button
                onClick={() => scrollTo(problemRef)}
                className="flex items-center gap-2 bg-[#111827]/80 border border-gray-700 text-gray-300 hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/5 transition-colors backdrop-blur-sm"
              >
                Explore <ChevronDown size={14} />
              </button>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { val:'3.4M+', label:'Visitors',  color:'text-cyan-400',   border:'border-cyan-900/40' },
                { val:'48',    label:'Matches',   color:'text-purple-400', border:'border-purple-900/40' },
                { val:'<2s',   label:'Response',  color:'text-green-400',  border:'border-green-900/40' },
              ].map(s => (
                <div key={s.label} className={`bg-[#111827]/75 border ${s.border} rounded-xl p-3 text-center backdrop-blur-sm`}>
                  <div className={`text-lg font-black ${s.color}`}>{s.val}</div>
                  <div className="text-gray-600 text-[9px] mt-0.5 tracking-wide uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ════════════════════════════════════════════════════
            HUD PANELS — top right
        ════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute top-20 right-4 flex flex-col gap-2 pointer-events-none z-30"
        >
          {[
            { label:'GATE STATUS',   value:'22/24 Active', color:'text-green-400' },
            { label:'CROWD DENSITY', value:'Moderate',      color:'text-orange-400' },
            { label:'AI SCAN',       value:'ACTIVE',        color:'text-cyan-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#0d1126]/88 border border-gray-800/80 rounded-xl px-4 py-2 backdrop-blur-sm flex items-center justify-between gap-5">
              <span className="text-[9px] text-gray-600 tracking-widest uppercase font-semibold">{label}</span>
              <span className={`text-[10px] font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </motion.div>

        {/* ════════════════════════════════════════════════════
            BOTTOM BAR — legend + scroll cue
        ════════════════════════════════════════════════════ */}
        <div className="absolute bottom-0 inset-x-0 z-30 flex flex-col items-center gap-3 pb-4 pointer-events-none">
          {/* Legend pill */}
          <div className="flex items-center gap-4 bg-[#0d1126]/80 border border-gray-800 rounded-xl px-5 py-2 backdrop-blur-sm">
            {[{c:'bg-green-500',l:'Low Density'},{c:'bg-orange-500',l:'Moderate'},{c:'bg-red-500',l:'Critical'}].map(({c,l}) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${c}`} />
                <span className="text-gray-500 text-[10px]">{l}</span>
              </div>
            ))}
            <div className="w-px h-3 bg-gray-700" />
            <span className="text-gray-600 text-[10px]">Drag anywhere to rotate · 24 gates</span>
          </div>
          {/* Scroll cue */}
          <motion.button
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            onClick={() => scrollTo(problemRef)}
            className="text-gray-700 hover:text-gray-400 transition-colors pointer-events-auto"
          >
            <ChevronDown size={22} />
          </motion.button>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <div className="border-y border-gray-800 bg-[#0d1126] py-6">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon:Users,        val:'100,000+',  label:'Spectators / Match',    color:'text-purple-400', border:'border-purple-900/40' },
              { icon:Activity,     val:'Real-time', label:'AI Crowd Monitoring',   color:'text-cyan-400',   border:'border-cyan-900/40'   },
              { icon:Zap,          val:'<2 sec',    label:'Alert Response Target', color:'text-green-400',  border:'border-green-900/40'  },
              { icon:CheckCircle2, val:'99.9%',     label:'System Uptime Target',  color:'text-orange-400', border:'border-orange-900/40' },
            ].map(({ icon:Icon, val, label, color, border }) => (
              <motion.div key={label} variants={fadeUp} className={`flex items-center gap-3 bg-[#111827] border ${border} rounded-xl px-4 py-3`} whileHover={{ scale:1.02 }}>
                <div className={`w-9 h-9 rounded-lg bg-[#0a0f2e] border ${border} flex items-center justify-center ${color} flex-shrink-0`}>
                  <Icon size={17} />
                </div>
                <div>
                  <div className={`font-black text-base leading-none ${color}`}>{val}</div>
                  <div className="text-gray-600 text-[10px] mt-0.5">{label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══ 01 PROBLEM ══ */}
      <div ref={problemRef} />
      <section className="py-20 px-6 bg-[#0a0f2e]">
        <div className="max-w-5xl mx-auto">
          <SectionNum n="01 — Challenge" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.2 }} variants={stagger}>
            <motion.div variants={fadeUp}><SectionBadge icon={AlertTriangle} text="The Problem We Solve" accent="text-red-400" border="border-red-900/40" /></motion.div>
            <motion.div variants={fadeUp}>
              <BubbleHeading>
                <BubbleText text="Why Crowd Management Needs " baseColor="text-white" hoverColor0="text-white" hoverColor1="text-gray-100" hoverColor2="text-gray-300" className="text-4xl" />
                <BubbleText text="a Revolution" baseColor="text-red-500" hoverColor0="text-red-300" hoverColor1="text-red-400" hoverColor2="text-red-500" className="text-4xl" />
              </BubbleHeading>
            </motion.div>
            <motion.p variants={fadeUp} className="text-gray-400 max-w-2xl text-base leading-relaxed mb-6">
              Hosting <strong className="text-white">3.4 million visitors</strong> in 64 days across Saudi Arabia — three interconnected failure points threaten the safety of the world's biggest tournament.
            </motion.p>
          </motion.div>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ duration:0.8 }}>
            <RadialOrbitalTimeline timelineData={problemNodes} className="bg-[#0a0f2e]" />
          </motion.div>
        </div>
      </section>

      {/* ══ 02 WHY US ══ */}
      <div ref={whyUsRef} />
      <section className="py-20 px-6 bg-[#0d1126]">
        <div className="max-w-5xl mx-auto">
          <SectionNum n="02 — Advantage" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.15 }} variants={stagger}>
            <motion.div variants={fadeUp}><SectionBadge icon={Zap} text="CrowdSafe AI vs Traditional" accent="text-cyan-400" border="border-cyan-900/40" /></motion.div>
            <motion.div variants={fadeUp}>
              <BubbleHeading>
                <BubbleText text="Six Reasons We " baseColor="text-white" hoverColor0="text-white" hoverColor1="text-gray-100" hoverColor2="text-gray-300" className="text-4xl" />
                <BubbleText text="Outperform" baseColor="text-cyan-500" hoverColor0="text-cyan-200" hoverColor1="text-cyan-300" hoverColor2="text-cyan-400" className="text-4xl" />
                <BubbleText text=" the Rest" baseColor="text-white" hoverColor0="text-white" hoverColor1="text-gray-100" hoverColor2="text-gray-300" className="text-4xl" />
              </BubbleHeading>
            </motion.div>
            <motion.p variants={fadeUp} className="text-gray-400 max-w-2xl text-base leading-relaxed mb-10">
              Swipe or drag the cards to explore each capability where CrowdSafe AI surpasses traditional stadium management systems.
            </motion.p>
          </motion.div>
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
            <CardStack items={whyUsCards} autoAdvance intervalMs={3000} pauseOnHover cardWidth={400} cardHeight={280} spreadDeg={38} />
          </motion.div>
        </div>
      </section>

      {/* ══ 03 FEATURES ══ */}
      <div ref={featuresRef} />
      <section className="py-20 px-6 bg-[#0a0f2e]">
        <div className="max-w-5xl mx-auto">
          <SectionNum n="03 — System Pillars" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.15 }} variants={stagger}>
            <motion.div variants={fadeUp}><SectionBadge icon={Cpu} text="Three System Deliverables" accent="text-purple-400" border="border-purple-900/40" /></motion.div>
            <motion.div variants={fadeUp}>
              <BubbleHeading>
                <span className="inline-flex flex-wrap gap-x-2 items-baseline">
                  <BubbleText text="Built for" baseColor="text-white" hoverColor0="text-white" hoverColor1="text-gray-100" hoverColor2="text-gray-300" className="text-4xl" />
                  {' '}
                  <BubbleText text="Operators" baseColor="text-purple-500" hoverColor0="text-purple-200" hoverColor1="text-purple-300" hoverColor2="text-purple-400" className="text-4xl" />
                  {', '}
                  <BubbleText text="Fans" baseColor="text-cyan-500" hoverColor0="text-cyan-200" hoverColor1="text-cyan-300" hoverColor2="text-cyan-400" className="text-4xl" />
                  {' & '}
                  <BubbleText text="Infrastructure" baseColor="text-green-500" hoverColor0="text-green-200" hoverColor1="text-green-300" hoverColor2="text-green-400" className="text-4xl" />
                </span>
              </BubbleHeading>
            </motion.div>
            <motion.p variants={fadeUp} className="text-gray-400 max-w-2xl text-base leading-relaxed mb-10">
              Three interconnected components forming a complete end-to-end crowd management ecosystem.
            </motion.p>
          </motion.div>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ duration:0.8 }}>
            <FeatureCarousel
              images={featureImages}
              autoPlayMs={5000}
              renderContent={(index) => {
                const f = featureContent[index % featureContent.length];
                const Icon = f.icon;
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:`${f.accent}22`, border:`1px solid ${f.accent}44` }}>
                        <Icon size={13} style={{ color:f.accent }} />
                      </div>
                      <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color:f.accent }}>{f.sub}</span>
                    </div>
                    <h3 className="text-white font-black text-lg mb-2 leading-tight">{f.title}</h3>
                    <div className="space-y-1">
                      {f.features.map(feat => (
                        <div key={feat} className="flex items-center gap-1.5">
                          <CheckCircle2 size={10} style={{ color:f.accent }} className="flex-shrink-0" />
                          <span className="text-gray-300 text-[10px]">{feat}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors" style={{ background:`${f.accent}22`, color:f.accent, border:`1px solid ${f.accent}33` }}>
                      Explore <ArrowRight size={10} />
                    </button>
                  </div>
                );
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* ══ 04 OBJECTIVES ══ */}
      <div ref={objectivesRef} />
      <section className="py-20 pb-48 px-6 bg-[#0d1126]">
        <div className="max-w-5xl mx-auto">
          <SectionNum n="04 — Objectives" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.15 }} variants={stagger} className="mb-10">
            <motion.div variants={fadeUp}><SectionBadge icon={CheckCircle2} text="Seven Project Goals" accent="text-green-400" border="border-green-900/40" /></motion.div>
            <motion.div variants={fadeUp}>
              <BubbleHeading>
                <BubbleText text="Measurable Goals That " baseColor="text-white" hoverColor0="text-white" hoverColor1="text-gray-100" hoverColor2="text-gray-300" className="text-4xl" />
                <BubbleText text="Define Success" baseColor="text-green-500" hoverColor0="text-green-200" hoverColor1="text-green-300" hoverColor2="text-green-400" className="text-4xl" />
              </BubbleHeading>
            </motion.div>
            <motion.p variants={fadeUp} className="text-gray-400 max-w-2xl text-base leading-relaxed">
              Seven specific, measurable objectives aligned to operational requirements of FIFA WC 2034 and Saudi Vision 2030.
            </motion.p>
          </motion.div>
          {/* mt-20 pushes the card stack down so the heading text above is never covered
              by the peek cards that float upward from the stack centre               */}
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.8 }} className="mt-20">
            <VerticalImageStack items={objectiveItems} className="py-4" />
          </motion.div>
        </div>
      </section>

      {/* ══ TECH STRIP ══ */}
      <section className="py-10 px-6 bg-[#0a0f2e] border-y border-gray-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-700 text-[9px] uppercase tracking-widest mb-6">Powered by</p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger} className="flex flex-wrap justify-center gap-2.5">
            {['Artificial Intelligence','Computer Vision','Digital Twin','Cloud Computing','IoT Sensors','Predictive Analytics','Smart Gate Hardware','Real-time APIs'].map(tech => (
              <motion.div key={tech} variants={fadeIn} whileHover={{ scale:1.05 }} className="flex items-center gap-1.5 bg-[#111827] border border-gray-800 rounded-full px-4 py-2 text-gray-500 text-xs hover:text-white hover:border-gray-700 transition-colors">
                <Radio size={10} className="text-purple-600" />
                {tech}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-24 px-6 bg-[#0d1126]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.3 }} variants={stagger}>
            <motion.div variants={fadeIn} className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-[#0a0f2e] border border-purple-700/60 flex items-center justify-center" whileHover={{ rotateY:12, scale:1.06 }} style={{ perspective:'500px' }}>
              <BrandLogo size={40} />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl font-black text-white mb-4">
              Ready to <span className="text-purple-400">Get Started?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Access the live monitoring dashboard or create your account to explore the full CrowdSafe AI prototype.
            </motion.p>
            <motion.div variants={stagger} className="flex flex-wrap justify-center gap-3">
              <motion.button variants={fadeUp} whileHover={{ scale:1.04 }} onClick={() => navigate('/signup')} className="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 text-white px-9 py-3.5 rounded-xl font-bold transition-colors">
                Create Account <ArrowRight size={16} />
              </motion.button>
              <motion.button variants={fadeUp} whileHover={{ scale:1.04 }} onClick={() => navigate('/login')} className="flex items-center gap-2 border border-gray-700 text-gray-300 hover:text-white px-9 py-3.5 rounded-xl font-bold hover:bg-white/5 transition-colors">
                Sign In
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-gray-800 bg-[#0a0f2e] py-7 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0d1126] border border-purple-800/50 flex items-center justify-center">
              <BrandLogo size={18} />
            </div>
            <div>
              <div className="text-white text-sm font-bold">CrowdSafe AI</div>
              <div className="text-gray-700 text-[10px]">FIFA World Cup 2034 · Saudi Arabia</div>
            </div>
          </div>
          <p className="text-gray-700 text-[10px] text-center">Capstone Project · Smart Crowd Management · Saudi Vision 2030</p>
          <div className="flex gap-5 text-gray-600 text-xs">
            {[['Sign In','/login'],['Sign Up','/signup'],['Dashboard','/dashboard']].map(([l,p]) => (
              <button key={l} onClick={() => navigate(p)} className="hover:text-white transition-colors">{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}