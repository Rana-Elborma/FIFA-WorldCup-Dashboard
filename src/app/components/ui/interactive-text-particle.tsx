import React, { useEffect, useRef } from 'react';

interface Particle {
  ox: number; oy: number;
  cx: number; cy: number;
  cr: number;
  f: number;
  rgb: number[];
}

export interface ParticleTextEffectProps {
  text?: string;
  colors?: string[];
  className?: string;
  animationForce?: number;
  particleDensity?: number;
}

export const ParticleTextEffect: React.FC<ParticleTextEffectProps> = ({
  text = 'HOVER!',
  colors = ['ffad70', 'f7d297', 'edb9a1', 'e697ac', 'b38dca', '9c76db', '705cb5', '43428e', '2c2142'],
  className = '',
  animationForce = 80,
  particleDensity = 4,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    particles: [] as Particle[],
    pointer: { x: -9999, y: -9999 },
    hasPointer: false,
    animId: 0,
    interactionRadius: 100,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = stateRef.current;

    const rand = (max = 1, min = 0) => min + Math.random() * (max - min);

    const build = () => {
      const W = canvas.offsetWidth  || canvas.parentElement?.clientWidth  || 200;
      const H = canvas.offsetHeight || canvas.parentElement?.clientHeight || 80;
      canvas.width  = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);

      const fh = Math.floor(W / Math.max(1, text.length));
      state.interactionRadius = Math.max(50, fh * 1.5);

      ctx.font          = `900 ${fh}px 'Orbitron', Verdana, sans-serif`;
      ctx.textAlign     = 'center';
      ctx.textBaseline  = 'middle';

      const tw = Math.round(ctx.measureText(text).width);
      const tx = Math.max(0, Math.round(0.5 * (W - tw)));
      const ty = Math.max(0, Math.round(0.5 * (H - fh)));

      const grad = ctx.createLinearGradient(tx, ty, tx + tw, ty + fh);
      const N = Math.max(1, colors.length - 1);
      colors.forEach((c, i) => grad.addColorStop(Math.min(1, i / N), `#${c}`));
      ctx.fillStyle = grad;
      ctx.fillText(text, W / 2, H / 2);

      const data = ctx.getImageData(tx, ty, tw || 1, fh || 1).data;
      const pts: Particle[] = [];

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue;
        const px = (i / 4) % (tw || 1);
        const py = Math.floor((i / 4) / (tw || 1));
        if (px % particleDensity !== 0 || py % particleDensity !== 0) continue;
        pts.push({
          ox: tx + px, oy: ty + py,
          cx: tx + px, cy: ty + py,
          cr: rand(4, 1),
          f:  rand(animationForce + 15, Math.max(5, animationForce - 15)),
          rgb: [data[i], data[i + 1], data[i + 2]].map(c => Math.max(0, c + rand(13, -13))),
        });
      }

      ctx.clearRect(0, 0, W, H);
      state.particles = pts;
    };

    const loop = () => {
      const { particles, pointer, hasPointer, interactionRadius } = state;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        if (hasPointer) {
          const dx = p.cx - pointer.x;
          const dy = p.cy - pointer.y;
          const d  = Math.hypot(dx, dy);
          if (d < interactionRadius && d > 0) {
            const force = Math.min(p.f, ((interactionRadius - d) / d) * 2);
            p.cx += (dx / d) * force;
            p.cy += (dy / d) * force;
          }
        }
        const odx = p.ox - p.cx;
        const ody = p.oy - p.cy;
        const od  = Math.hypot(odx, ody);
        if (od > 0.5) {
          const restore = Math.min(od * 0.1, 3);
          p.cx += (odx / od) * restore;
          p.cy += (ody / od) * restore;
        }
        ctx.fillStyle = `rgb(${p.rgb.map(Math.round).join(',')})`;
        ctx.beginPath();
        ctx.arc(p.cx, p.cy, Math.max(0.5, p.cr), 0, Math.PI * 2);
        ctx.fill();
      }

      state.animId = requestAnimationFrame(loop);
    };

    build();
    state.animId = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(state.animId);
      build();
      state.animId = requestAnimationFrame(loop);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(state.animId);
      ro.disconnect();
    };
  }, [text, colors, animationForce, particleDensity]);

  const onPointerMove = (e: React.PointerEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r  = c.getBoundingClientRect();
    const sx = c.width / r.width;
    const sy = c.height / r.height;
    stateRef.current.pointer    = { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
    stateRef.current.hasPointer = true;
  };

  const onPointerLeave = () => {
    stateRef.current.hasPointer = false;
    stateRef.current.pointer    = { x: -9999, y: -9999 };
  };

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className} cursor-none`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    />
  );
};

export default ParticleTextEffect;
