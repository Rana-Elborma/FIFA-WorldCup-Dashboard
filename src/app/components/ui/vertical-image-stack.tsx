import { useState, useCallback, useRef } from "react";
import { motion, type PanInfo } from "motion/react";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface StackItem {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  src?: string;
  icon?: React.ElementType;
  accentColor?: string;
  tag?: string;
  number?: string;
}

interface VerticalImageStackProps {
  items: StackItem[];
  className?: string;
}

export function VerticalImageStack({ items, className = "" }: VerticalImageStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastNavTime = useRef(0);
  const COOLDOWN = 400;

  const navigate = useCallback((dir: number) => {
    const now = Date.now();
    if (now - lastNavTime.current < COOLDOWN) return;
    lastNavTime.current = now;
    setCurrentIndex((prev) => {
      if (dir > 0) return prev === items.length - 1 ? 0 : prev + 1;
      return prev === 0 ? items.length - 1 : prev - 1;
    });
  }, [items.length]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold) navigate(1);
    else if (info.offset.y > threshold) navigate(-1);
  };

  const getCardStyle = (index: number) => {
    const total = items.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0)       return { y: 0,    scale: 1,    opacity: 1,   zIndex: 5, rotateX: 0  };
    if (diff === -1)      return { y: -155, scale: 0.84, opacity: 0.6, zIndex: 4, rotateX: 7  };
    if (diff === -2)      return { y: -270, scale: 0.72, opacity: 0.3, zIndex: 3, rotateX: 14 };
    if (diff === 1)       return { y: 155,  scale: 0.84, opacity: 0.6, zIndex: 4, rotateX: -7 };
    if (diff === 2)       return { y: 270,  scale: 0.72, opacity: 0.3, zIndex: 3, rotateX: -14};
    return { y: diff > 0 ? 380 : -380, scale: 0.6, opacity: 0, zIndex: 0, rotateX: 0 };
  };

  const isVisible = (index: number) => {
    const total = items.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return Math.abs(diff) <= 2;
  };

  const currentItem = items[currentIndex];

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ minHeight: 740 }}>
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-900/8 blur-3xl" />
      </div>

      {/* Counter */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-1">
        <span className="text-3xl font-light text-gray-200 tabular-nums">
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
        <div className="h-px w-6 bg-gray-700 my-1" />
        <span className="text-sm text-gray-600 tabular-nums">
          {String(items.length).padStart(2, "0")}
        </span>
      </div>

      {/* Card stack */}
      <div
        className="relative flex items-center justify-center"
        style={{ perspective: "1100px", width: 340, height: 460 }}
      >
        {items.map((item, index) => {
          if (!isVisible(index)) return null;
          const style = getCardStyle(index);
          const isCurrent = index === currentIndex;
          const Icon = item.icon;
          const accent = item.accentColor ?? "#a78bfa";

          return (
            <motion.div
              key={item.id}
              className="absolute cursor-grab active:cursor-grabbing"
              animate={{
                y: style.y,
                scale: style.scale,
                opacity: style.opacity,
                rotateX: style.rotateX,
                zIndex: style.zIndex,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
              drag={isCurrent ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{ transformStyle: "preserve-3d", zIndex: style.zIndex }}
            >
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  width: 300,
                  height: 400,
                  boxShadow: isCurrent
                    ? `0 20px 50px -10px rgba(0,0,0,0.7), 0 0 0 1px ${accent}33`
                    : "0 8px 24px -8px rgba(0,0,0,0.5)",
                }}
              >
                {/* Solid dark background — no image for clear text */}
                <div className="absolute inset-0 bg-[#111827]" />

                {/* Subtle top glow */}
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                  style={{ background: `${accent}18` }}
                />

                {/* Bottom accent bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(to right, transparent, ${accent}66, transparent)` }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full p-5">
                  {/* Number badge */}
                  <div className="flex items-center justify-between mb-auto">
                    {item.number && (
                      <span className="text-xs font-mono text-gray-600">{item.number}</span>
                    )}
                    {Icon && (
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: `${accent}18`, border: `1px solid ${accent}33` }}
                      >
                        <Icon size={16} style={{ color: accent }} />
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div>
                    {item.subtitle && (
                      <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: accent }}>
                        {item.subtitle}
                      </p>
                    )}
                    <h3 className="text-white font-bold text-lg leading-tight mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{item.description}</p>
                    {item.tag && (
                      <div
                        className="mt-3 inline-block text-[9px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}33` }}
                      >
                        {item.tag}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation dots + buttons */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-20">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          aria-label="Previous"
        >
          <ChevronUp size={14} />
        </button>

        <div className="flex flex-col gap-2 py-1">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className="transition-all duration-300"
              aria-label={`Go to item ${idx + 1}`}
            >
              <div
                className={`rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-2 h-5 bg-purple-500" : "w-2 h-2 bg-gray-700 hover:bg-gray-500"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate(1)}
          className="w-8 h-8 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          aria-label="Next"
        >
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 text-gray-700 text-[10px] tracking-widest uppercase">
        Drag · {currentItem?.title}
      </div>
    </div>
  );
}