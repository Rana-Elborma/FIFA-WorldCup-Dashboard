import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link2, Zap } from "lucide-react";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
  accentColor?: string;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  className?: string;
}

const STATUS_STYLES: Record<TimelineItem["status"], string> = {
  completed:    "text-green-300 bg-green-900/50 border border-green-700/60",
  "in-progress":"text-orange-300 bg-orange-900/50 border border-orange-700/60",
  pending:      "text-gray-400  bg-gray-800/50   border border-gray-700/50",
};
const STATUS_LABEL: Record<TimelineItem["status"], string> = {
  completed:    "ACTIVE",
  "in-progress":"IN PROGRESS",
  pending:      "PENDING",
};

export default function RadialOrbitalTimeline({
  timelineData,
  className = "",
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const getRelatedItems = (id: number): number[] =>
    timelineData.find((i) => i.id === id)?.relatedIds ?? [];

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const next: Record<number, boolean> = {};
      Object.keys(prev).forEach((k) => { next[parseInt(k)] = false; });
      next[id] = !prev[id];
      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const pulse: Record<number, boolean> = {};
        getRelatedItems(id).forEach((r) => { pulse[r] = true; });
        setPulseEffect(pulse);
        // center on node
        const idx = timelineData.findIndex((i) => i.id === id);
        const target = (idx / timelineData.length) * 360;
        setRotationAngle(270 - target);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return next;
    });
  };

  useEffect(() => {
    if (!autoRotate) return;
    const t = setInterval(() => {
      setRotationAngle((p) => Number(((p + 0.25) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(t);
  }, [autoRotate]);

  const calcPos = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;
    const radius = 185;
    return {
      x: radius * Math.cos(radian),
      y: radius * Math.sin(radian),
      zIndex: Math.round(100 + 50 * Math.cos(radian)),
      opacity: Math.max(0.35, Math.min(1, 0.35 + 0.65 * ((1 + Math.sin(radian)) / 2))),
    };
  };

  const isRelated = (id: number) =>
    activeNodeId !== null && getRelatedItems(activeNodeId).includes(id);

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={`relative w-full flex items-center justify-center overflow-hidden ${className}`}
    >
      <div className="relative w-full max-w-3xl flex items-center justify-center" style={{ height: 520 }}>
        <div
          ref={orbitRef}
          className="absolute w-full h-full flex items-center justify-center"
          style={{ perspective: "900px" }}
        >
          {/* Orbit ring */}
          <div className="absolute w-[370px] h-[370px] rounded-full border border-purple-900/40" />
          <div className="absolute w-[420px] h-[420px] rounded-full border border-[#1a2040]/60" />

          {/* Center node */}
          <div className="absolute z-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-purple-700 border-2 border-purple-500 flex items-center justify-center shadow-[0_0_28px_rgba(124,58,237,0.6)] animate-pulse">
              <div className="w-7 h-7 rounded-full bg-purple-300/80" />
            </div>
            <div className="mt-2 text-[10px] text-purple-400 font-mono tracking-widest uppercase">CRISIS CORE</div>
            {/* ping rings */}
            <div className="absolute w-20 h-20 rounded-full border border-purple-600/30 animate-ping" />
            <div className="absolute w-28 h-28 rounded-full border border-purple-700/20 animate-ping" style={{ animationDelay: "0.7s" }} />
          </div>

          {/* Orbital nodes */}
          {timelineData.map((item, index) => {
            const pos = calcPos(index, timelineData.length);
            const isExp = !!expandedItems[item.id];
            const isPulse = !!pulseEffect[item.id];
            const rel = isRelated(item.id);
            const Icon = item.icon;
            const accent = item.accentColor ?? "#a78bfa";

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                  zIndex: isExp ? 200 : pos.zIndex,
                  opacity: isExp ? 1 : pos.opacity,
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {/* Glow aura */}
                <div
                  className={`absolute rounded-full -inset-3 transition-all duration-500 ${isPulse ? "animate-pulse" : ""}`}
                  style={{
                    background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
                    width: `${item.energy * 0.4 + 36}px`,
                    height: `${item.energy * 0.4 + 36}px`,
                    left: `-${(item.energy * 0.4 + 36 - 40) / 2}px`,
                    top:  `-${(item.energy * 0.4 + 36 - 40) / 2}px`,
                  }}
                />

                {/* Icon circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isExp ? "scale-150" : ""}`}
                  style={{
                    background: isExp ? accent : rel ? `${accent}44` : "#0a0f2e",
                    borderColor: isExp ? accent : rel ? accent : `${accent}66`,
                    boxShadow: isExp ? `0 0 18px ${accent}88` : rel ? `0 0 10px ${accent}55` : "none",
                    color: isExp ? "#fff" : accent,
                  }}
                >
                  <Icon size={15} />
                </div>

                {/* Label */}
                <div
                  className="absolute top-12 whitespace-nowrap text-[10px] font-semibold tracking-wider transition-all duration-300"
                  style={{ color: isExp ? "#fff" : "#9ca3af", transform: isExp ? "scale(1.1)" : "scale(1)" }}
                >
                  {item.title}
                </div>

                {/* Expanded card */}
                {isExp && (
                  <div
                    className="absolute top-16 left-1/2 -translate-x-1/2 w-64 bg-[#0d1126]/95 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-px h-2" style={{ background: accent }} />
                    {/* Header */}
                    <div className="p-4 border-b border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${STATUS_STYLES[item.status]}`}>
                          {STATUS_LABEL[item.status]}
                        </span>
                        <span className="text-[9px] font-mono text-gray-600">{item.date}</span>
                      </div>
                      <h4 className="text-white text-sm font-bold">{item.title}</h4>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-3">
                      <p className="text-gray-400 text-xs leading-relaxed">{item.content}</p>

                      {/* Energy bar */}
                      <div>
                        <div className="flex justify-between items-center text-[9px] mb-1">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Zap size={8} /> Risk Level
                          </span>
                          <span className="font-mono text-gray-400">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${item.energy}%`, background: accent }}
                          />
                        </div>
                      </div>

                      {/* Related nodes */}
                      {item.relatedIds.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1 mb-2">
                            <Link2 size={9} className="text-gray-500" />
                            <span className="text-[9px] uppercase tracking-wider text-gray-500">Connected Issues</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((rid) => {
                              const rel = timelineData.find((i) => i.id === rid);
                              return (
                                <button
                                  key={rid}
                                  onClick={(e) => { e.stopPropagation(); toggleItem(rid); }}
                                  className="flex items-center gap-1 text-[9px] px-2 py-1 rounded-lg bg-gray-800/80 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-all"
                                >
                                  {rel?.title}
                                  <ArrowRight size={7} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-gray-700 text-[10px] tracking-widest uppercase">
        Click a node to explore · Click background to reset
      </div>
    </div>
  );
}
