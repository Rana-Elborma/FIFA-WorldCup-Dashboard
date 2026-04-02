import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { SquareArrowOutUpRight } from "lucide-react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
  icon?: React.ElementType;
  accentColor?: string;
  badge?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];
  initialIndex?: number;
  maxVisible?: number;
  cardWidth?: number;
  cardHeight?: number;
  overlap?: number;
  spreadDeg?: number;
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;
  springStiffness?: number;
  springDamping?: number;
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;
  showDots?: boolean;
  className?: string;
  onChangeIndex?: (index: number, item: T) => void;
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 5,
  cardWidth = 420,
  cardHeight = 290,
  overlap = 0.44,
  spreadDeg = 40,
  perspectivePx = 1100,
  depthPx = 120,
  tiltXDeg = 10,
  activeLiftPx = 20,
  activeScale = 1.04,
  inactiveScale = 0.93,
  springStiffness = 280,
  springDamping = 28,
  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,
  showDots = true,
  className,
  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() => wrapIndex(initialIndex, len));
  const [hovering, setHovering] = React.useState(false);

  React.useEffect(() => { setActive((a) => wrapIndex(a, len)); }, [len]);
  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len || !canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len || !canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  React.useEffect(() => {
    if (!autoAdvance || reduceMotion || !len || (pauseOnHover && hovering)) return;
    const id = window.setInterval(() => {
      if (loop || active < len - 1) next();
    }, Math.max(700, intervalMs));
    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop, active, next]);

  if (!len) return null;
  const activeItem = items[active]!;

  return (
    <div
      className={cn("w-full", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className="relative w-full"
        style={{ height: Math.max(360, cardHeight + 80) }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-40 w-[60%] rounded-full bg-purple-900/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-32 w-[70%] rounded-full bg-[#0a0f2e]/60 blur-3xl" />

        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{ perspective: `${perspectivePx}px` }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              if (abs > maxOffset) return null;

              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 8;
              const z = -abs * depthPx;
              const isAct = off === 0;
              const scale = isAct ? activeScale : inactiveScale;
              const lift = isAct ? -activeLiftPx : 0;
              const rotateX = isAct ? 0 : tiltXDeg;
              const zIndex = 100 - abs;

              const dragProps = isAct
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragEnd: (_e: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
                      if (reduceMotion) return;
                      const threshold = Math.min(140, cardWidth * 0.2);
                      if (info.offset.x > threshold || info.velocity.x > 600) prev();
                      else if (info.offset.x < -threshold || info.velocity.x < -600) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute bottom-0 rounded-2xl border border-gray-800/80 overflow-hidden shadow-2xl will-change-transform select-none",
                    isAct ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
                  )}
                  style={{ width: cardWidth, height: cardHeight, zIndex, transformStyle: "preserve-3d" }}
                  initial={reduceMotion ? false : { opacity: 0, y: y + 40, x, rotateZ, rotateX, scale }}
                  animate={{ opacity: 1, x, y: y + lift, rotateZ, rotateX, scale }}
                  transition={{ type: "spring", stiffness: springStiffness, damping: springDamping }}
                  onClick={() => setActive(i)}
                  {...dragProps}
                >
                  <div
                    className="h-full w-full"
                    style={{ transform: `translateZ(${z}px)`, transformStyle: "preserve-3d" }}
                  >
                    {renderCard
                      ? renderCard(item, { active: isAct })
                      : <DefaultCard item={item} active={isAct} />
                    }
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Dots */}
      {showDots && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            {items.map((it, idx) => (
              <button
                key={it.id}
                onClick={() => setActive(idx)}
                className={cn(
                  "rounded-full transition-all",
                  idx === active ? "w-5 h-2 bg-purple-500" : "w-2 h-2 bg-gray-700 hover:bg-gray-500"
                )}
                aria-label={`Go to ${it.title}`}
              />
            ))}
          </div>
          {activeItem.href && (
            <a
              href={activeItem.href}
              target="_blank"
              rel="noreferrer"
              className="text-gray-600 hover:text-gray-300 transition"
              aria-label="Open link"
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function DefaultCard({ item, active }: { item: CardStackItem; active: boolean }) {
  const Icon = item.icon;
  const accent = item.accentColor ?? "#a78bfa";
  return (
    <div className="relative h-full w-full bg-[#0d1126]">
      {/* Solid dark background — no image so text is clear */}
      <div className="absolute inset-0 bg-[#0d1126]" />

      {/* Subtle top-right glow accent */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
        style={{ background: `${accent}18` }}
      />
      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl"
        style={{ background: `linear-gradient(to right, transparent, ${accent}55, transparent)` }}
      />

      {/* Active glow edge */}
      {active && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px ${accent}55` }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-5">
        {item.badge && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
            <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: accent }}>
              {item.badge}
            </span>
          </div>
        )}

        <div className="flex items-start gap-3">
          {Icon && (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}
            >
              <Icon size={16} style={{ color: accent }} />
            </div>
          )}
          <div>
            <div className="text-white font-bold text-base leading-tight">{item.title}</div>
            {item.description && (
              <div className="mt-1 text-gray-300 text-xs leading-relaxed">{item.description}</div>
            )}
          </div>
        </div>

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
  );
}