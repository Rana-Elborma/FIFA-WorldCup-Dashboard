import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────
   Pure Canvas-2D stadium visualiser
   Bigger, clearer, slower rotation
───────────────────────────────────────────── */

interface Gate {
  angle: number;
  density: number;
  phase: number;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  color: string;
  alpha: number;
}

interface FlowDot {
  gi: number;
  t: number;
  spd: number;
}

const GATE_N  = 24;
const P_COUNT = 1200;
const FLOW_N  = 80;

const SECT_COLORS = [
  '#ef4444','#3b82f6','#22c55e',
  '#f97316','#a855f7','#06b6d4','#eab308','#ec4899',
];

function densityRgb(d: number): string {
  if (d > 0.75) return '#ff3333';
  if (d > 0.48) return '#ff8800';
  return '#00dd66';
}

export function Stadium3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* ── sizing ── */
    let W = canvas.offsetWidth  || 900;
    let H = canvas.offsetHeight || 700;
    const setSize = () => {
      W = canvas.offsetWidth  || 900;
      H = canvas.offsetHeight || 700;
      canvas.width  = W;
      canvas.height = H;
    };
    setSize();

    /* ── projection helpers ── */
    const TILT = 0.50;
    let baseAngle = -0.15; // slight initial tilt for best view

    const project = (x: number, y: number, z = 0): [number, number] => {
      const cosA = Math.cos(baseAngle);
      const sinA = Math.sin(baseAngle);
      const rx =  x * cosA - y * sinA;
      const ry = (x * sinA + y * cosA) * TILT - z * 0.38;
      const scale = Math.min(W, H) * 0.052; // bigger scale factor (was 0.038)
      return [W / 2 + rx * scale, H / 2 + ry * scale];
    };

    /* ── stadium data ── */
    // Larger semi-axes
    const SA = 9.5; // x (was 7.2)
    const SB = 6.3; // y (was 4.8)

    // gates
    const gates: Gate[] = Array.from({ length: GATE_N }, (_, i) => ({
      angle:   (i / GATE_N) * Math.PI * 2,
      density: 0.15 + Math.random() * 0.85,
      phase:   i * 0.26,
    }));

    // crowd particles (fixed on stands)
    const particles: Particle[] = Array.from({ length: P_COUNT }, () => {
      const a   = Math.random() * Math.PI * 2;
      const r   = 0.72 + Math.random() * 0.26;
      const col = SECT_COLORS[Math.floor((a / (Math.PI * 2)) * SECT_COLORS.length) % SECT_COLORS.length];
      return {
        x:     r * SA * Math.cos(a),
        y:     r * SB * Math.sin(a),
        vx: 0, vy: 0,
        r: 2.2 + Math.random() * 1.5,
        color: col,
        alpha: 0.55 + Math.random() * 0.45,
      };
    });

    // flow dots
    const flow: FlowDot[] = Array.from({ length: FLOW_N }, () => ({
      gi:  Math.floor(Math.random() * GATE_N),
      t:   Math.random(),
      spd: 0.003 + Math.random() * 0.004,
    }));

    /* ── drag ── */
    let dragging = false;
    let lastX = 0;
    let velAngle = 0;  // momentum accumulator

    const onDown = (e: MouseEvent | TouchEvent) => {
      dragging  = true;
      const cx  = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      lastX     = cx;
      velAngle  = 0; // kill momentum on grab
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const cx    = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const delta = (cx - lastX) * 0.009; // high sensitivity — fully free rotation
      baseAngle  += delta;
      velAngle    = delta;  // capture for momentum on release
      lastX       = cx;
    };

    const onUp = () => { dragging = false; };

    // Attach mousedown / touchstart to WINDOW so any overlapping element
    // (text, HUD panels) never blocks the drag from starting.
    window.addEventListener('mousedown',  onDown);
    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseup',    onUp);
    window.addEventListener('touchstart', onDown as EventListener, { passive: true });
    window.addEventListener('touchmove',  onMove as EventListener, { passive: true });
    window.addEventListener('touchend',   onUp);

    /* ── draw helpers ── */
    const drawEllipse = (
      ax: number, ay: number, alpha: number,
      color: string, lineW: number, filled = false, fillColor = '',
    ) => {
      ctx.beginPath();
      const SEGS = 100;
      for (let i = 0; i <= SEGS; i++) {
        const a  = (i / SEGS) * Math.PI * 2;
        const [px, py] = project(ax * Math.cos(a), ay * Math.sin(a), 0);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      if (filled) {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth   = lineW;
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    /* ── main render loop ── */
    let animId: number;
    let t = 0;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      t += 0.016;

      // auto-rotate — simple momentum decay + tiny constant drift
      if (!dragging) {
        velAngle *= 0.93;           // decay drag momentum
        velAngle += 0.0003;         // very slow constant drift
        baseAngle += velAngle;
      }

      /* background */
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#070d24';
      ctx.fillRect(0, 0, W, H);

      // radial glow - more prominent
      const grd = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.min(W,H)*0.58);
      grd.addColorStop(0, 'rgba(70,30,140,0.22)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      /* grid */
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = '#334475';
      ctx.lineWidth   = 0.7;
      for (let i = -10; i <= 10; i++) {
        const [x1,y1] = project(i*1.5, -15, 0);
        const [x2,y2] = project(i*1.5,  15, 0);
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
        const [a1,b1] = project(-15, i*1.5, 0);
        const [a2,b2] = project( 15, i*1.5, 0);
        ctx.beginPath(); ctx.moveTo(a1,b1); ctx.lineTo(a2,b2); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* stadium tiers (outer → inner) — brighter colors */
      const tiers = [
        { ax: SA*1.06, ay: SB*1.06, col: '#1e2a5c' },
        { ax: SA*0.96, ay: SB*0.96, col: '#223268' },
        { ax: SA*0.84, ay: SB*0.84, col: '#263a78' },
        { ax: SA*0.72, ay: SB*0.72, col: '#2a4088' },
        { ax: SA*0.60, ay: SB*0.60, col: '#1f3564' },
      ];
      tiers.forEach(({ ax, ay, col }) => {
        ctx.globalAlpha = 1;
        ctx.beginPath();
        const SEGS = 100;
        for (let i = 0; i <= SEGS; i++) {
          const a = (i / SEGS) * Math.PI * 2;
          const [px, py] = project(ax * Math.cos(a), ay * Math.sin(a), 0);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = col;
        ctx.fill();
      });

      /* outer ring glow — more prominent */
      drawEllipse(SA*1.07, SB*1.07, 0.7, '#5588ff', 1.6);
      drawEllipse(SA*1.10, SB*1.10, 0.2, '#3366cc', 1.0);
      drawEllipse(SA*1.13, SB*1.13, 0.08, '#2244aa', 0.6);

      /* Roof structure lines */
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = '#4466bb';
      ctx.lineWidth = 1;
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        const [ox, oy] = project(SA * 1.10 * Math.cos(a), SB * 1.10 * Math.sin(a), 0.5);
        const [ix, iy] = project(SA * 1.06 * Math.cos(a), SB * 1.06 * Math.sin(a), 0);
        ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(ox, oy); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* field */
      ctx.globalAlpha = 1;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const a = (i / 80) * Math.PI * 2;
        const [px, py] = project(SA * 0.60 * Math.cos(a), SB * 0.60 * Math.sin(a), 0.02);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = '#0b4016';
      ctx.fill();

      // field stripes
      for (let i = -4; i <= 4; i++) {
        if (i % 2 !== 0) continue;
        const rx = 0.14 * SA * 0.60;
        const [x0, y0] = project(i * rx,  SB * 0.60, 0.022);
        const [x1, y1] = project(i * rx, -SB * 0.60, 0.022);
        ctx.beginPath();
        ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
        ctx.strokeStyle = '#0e5020';
        ctx.lineWidth   = Math.min(W, H) * 0.052 * rx * 2;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // centre line
      const [cl0x, cl0y] = project(0,  SB * 0.58, 0.025);
      const [cl1x, cl1y] = project(0, -SB * 0.58, 0.025);
      ctx.beginPath(); ctx.moveTo(cl0x, cl0y); ctx.lineTo(cl1x, cl1y);
      ctx.strokeStyle = '#1a7a35'; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.9;
      ctx.stroke(); ctx.globalAlpha = 1;

      // centre circle
      ctx.beginPath();
      const CC = 36;
      const CR = 0.15;
      for (let i = 0; i <= CC; i++) {
        const a = (i / CC) * Math.PI * 2;
        const [px, py] = project(CR * SA * 0.60 * Math.cos(a), CR * SB * 0.60 * Math.sin(a), 0.025);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = '#1a7a35'; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.9;
      ctx.stroke(); ctx.globalAlpha = 1;

      // Penalty areas
      const penW = 0.32, penD = 0.18;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        const corners = [
          [side * SA * 0.60, -SB * 0.60 * penW],
          [side * SA * 0.60 * (1 - penD), -SB * 0.60 * penW],
          [side * SA * 0.60 * (1 - penD), SB * 0.60 * penW],
          [side * SA * 0.60, SB * 0.60 * penW],
        ];
        corners.forEach(([cx, cy], idx) => {
          const [px, py] = project(cx, cy, 0.025);
          if (idx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.strokeStyle = '#1a7a35'; ctx.lineWidth = 1; ctx.globalAlpha = 0.7;
        ctx.stroke(); ctx.globalAlpha = 1;
      }

      /* ── GROUND TEXT: Aramco Stadium — Live Simulation ──
         Projected flat onto the field surface using the same perspective
         transform as all other 3D objects. Rotates with baseAngle.        */
      {
        const z_g   = 0.03;
        const cosA2 = Math.cos(baseAngle);
        const sinA2 = Math.sin(baseAngle);

        // centre of field in screen coords
        const [gcx, gcy] = project(0, 0, z_g);
        // one world-unit to the right — gives us the x-axis screen direction
        const [gex, gey] = project(4, 0, z_g);
        // one world-unit forward  — gives us the y-axis screen direction (for vertical compression)
        const [gpx, gpy] = project(0, 1, z_g);

        const baselineDx  = gex - gcx;
        const baselineDy  = gey - gcy;
        const baselineLen = Math.sqrt(baselineDx * baselineDx + baselineDy * baselineDy) / 4;

        const perpDx  = gpx - gcx;
        const perpDy  = gpy - gcy;
        const perpLen = Math.sqrt(perpDx * perpDx + perpDy * perpDy);

        const yComp    = perpLen / baselineLen; // TILT-aware compression
        const textAngle = Math.atan2(baselineDy, baselineDx);

        const gFontSize = Math.round(10.5 * Math.min(W, H) / 700);
        ctx.save();
        ctx.translate(gcx, gcy);
        ctx.rotate(textAngle);
        ctx.scale(1, yComp);

        // subtle glow behind text
        ctx.font      = `bold ${gFontSize + 2}px monospace`;
        ctx.fillStyle = '#00ff77';
        ctx.globalAlpha = 0.08;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ARAMCO STADIUM — LIVE SIMULATION', 0, 0);

        // main text
        ctx.font      = `bold ${gFontSize}px monospace`;
        ctx.fillStyle = '#33ee88';
        ctx.globalAlpha = 0.62;
        ctx.fillText('ARAMCO STADIUM — LIVE SIMULATION', 0, 0);

        // small subtitle under it
        const subSize = Math.round(6.5 * Math.min(W, H) / 700);
        ctx.font      = `${subSize}px monospace`;
        ctx.fillStyle = '#22cc66';
        ctx.globalAlpha = 0.35;
        ctx.fillText('CAPACITY 92,000  ·  WC 2034  ·  RIYADH', 0, gFontSize * 1.4 / yComp);

        ctx.restore();
      }

      /* crowd particles */
      particles.forEach((p, idx) => {
        const bob = Math.sin(t * 2.2 + idx * 0.31) * 0.04;
        const [px, py] = project(p.x, p.y, bob);
        ctx.beginPath();
        ctx.arc(px, py, p.r * (Math.min(W, H) / 700), 0, Math.PI * 2);
        ctx.fillStyle  = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      /* gates */
      gates.forEach((g, i) => {
        const d   = Math.max(0, Math.min(1, g.density + 0.2 * Math.sin(t * 0.55 + g.phase)));
        const col = densityRgb(d);
        const pulse = 1 + 0.55 * Math.abs(Math.sin(t * 1.9 + g.phase));
        const dotR  = 4.5 * pulse * (Math.min(W, H) / 700);

        const [gx, gy] = project(SA * 1.06 * Math.cos(g.angle), SB * 1.06 * Math.sin(g.angle), 0.3);

        // halo
        const halo = ctx.createRadialGradient(gx, gy, 0, gx, gy, dotR * 5 * pulse);
        halo.addColorStop(0, col + '66');
        halo.addColorStop(1, col + '00');
        ctx.fillStyle = halo;
        ctx.globalAlpha = 0.6 * pulse;
        ctx.beginPath(); ctx.arc(gx, gy, dotR * 5 * pulse, 0, Math.PI * 2); ctx.fill();

        // dot
        ctx.fillStyle  = col;
        ctx.globalAlpha = 0.95;
        ctx.beginPath(); ctx.arc(gx, gy, dotR, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;

        // flow line to interior
        const ix = SA * 0.62 * Math.cos(g.angle);
        const iy = SB * 0.62 * Math.sin(g.angle);
        const [fx, fy] = project(ix, iy, 0.2);
        ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(fx, fy);
        ctx.strokeStyle = col; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.15;
        ctx.stroke(); ctx.globalAlpha = 1;

        // gate label (every 4th)
        if (i % 4 === 0) {
          const scale = Math.min(W, H) / 700;
          ctx.font        = `${Math.round(9 * scale)}px monospace`;
          ctx.fillStyle   = '#aabbcc';
          ctx.globalAlpha = 0.6;
          ctx.textAlign   = 'center';
          ctx.fillText(`G${i + 1}`, gx, gy - dotR * 2.5);
          ctx.globalAlpha = 1;
        }
      });

      /* flow dots */
      flow.forEach((fp) => {
        fp.t += fp.spd;
        if (fp.t >= 1) { fp.t = 0; fp.gi = Math.floor(Math.random() * GATE_N); }
        const g  = gates[fp.gi];
        const gx = SA * 1.06 * Math.cos(g.angle);
        const gy = SB * 1.06 * Math.sin(g.angle);
        const tx = SA * 0.55 * Math.cos(g.angle);
        const ty = SB * 0.55 * Math.sin(g.angle);
        const wx = gx + (tx - gx) * fp.t;
        const wy = gy + (ty - gy) * fp.t;
        const [sx, sy] = project(wx, wy, 0.3 - fp.t * 0.25);
        const alpha = (1 - fp.t) * 0.9;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5 * (Math.min(W, H) / 700), 0, Math.PI * 2);
        ctx.fillStyle   = '#44ccff';
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      /* AI scan sweep */
      const scanAngle = t * 0.5 + baseAngle;
      const [scx, scy] = project(0, 0, 3.5);
      const scanEnd1   = project(
        SA * 0.9 * Math.cos(scanAngle),
        SB * 0.9 * Math.sin(scanAngle),
        0
      );
      const scanEnd2   = project(
        SA * 0.9 * Math.cos(scanAngle + 0.16),
        SB * 0.9 * Math.sin(scanAngle + 0.16),
        0
      );
      ctx.beginPath();
      ctx.moveTo(scx, scy);
      ctx.lineTo(scanEnd1[0], scanEnd1[1]);
      ctx.lineTo(scanEnd2[0], scanEnd2[1]);
      ctx.closePath();
      ctx.fillStyle   = 'rgba(0,170,255,0.05)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,220,255,0.35)';
      ctx.lineWidth   = 0.8;
      ctx.stroke();

      /* orbital ring — slower */
      const OR  = SA * 1.28;
      const ORB = SB * 1.28;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const a = (i / 100) * Math.PI * 2;
        const [px, py] = project(OR * Math.cos(a + t * 0.08), ORB * Math.sin(a + t * 0.08), 2.0);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(68,136,255,0.18)';
      ctx.lineWidth   = 1;
      ctx.globalAlpha = 1;
      ctx.stroke();

      /* second orbital ring */
      const OR2 = SA * 1.35;
      const ORB2 = SB * 1.35;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const a = (i / 100) * Math.PI * 2;
        const [px, py] = project(OR2 * Math.cos(a - t * 0.05), ORB2 * Math.sin(a - t * 0.05), 2.5);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(100,50,220,0.12)';
      ctx.lineWidth   = 0.8;
      ctx.stroke();

      /* ambient sparkles */
      for (let i = 0; i < 7; i++) {
        const spAngle = (t * 0.2 + i * 0.9) % (Math.PI * 2);
        const spR     = SA * (1.18 + 0.06 * Math.sin(t + i));
        const [spx, spy] = project(spR * Math.cos(spAngle), SB * 1.18 * Math.sin(spAngle), 0);
        ctx.beginPath();
        ctx.arc(spx, spy, 1.8, 0, Math.PI * 2);
        ctx.fillStyle   = '#88aaff';
        ctx.globalAlpha = 0.3 + 0.2 * Math.sin(t * 2 + i);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      /* ── RING LABELS — attached to outermost structural ring (SA×1.16)
         Rotate exactly with baseAngle so they travel with the stadium.    */
      {
        const RA     = SA * 1.16;
        const RB     = SB * 1.16;
        const cosA2  = Math.cos(baseAngle);
        const sinA2  = Math.sin(baseAngle);
        const sc2    = Math.min(W, H) * 0.052;

        const rimLabels = [
          { text: 'INTELLIGENT', angle: -Math.PI / 2, color: '#a78bfa', glow: '#6d28d9' },
          { text: 'CROWD',       angle: 0,             color: '#22d3ee', glow: '#0e7490' },
          { text: 'MANAGEMENT',  angle:  Math.PI / 2,  color: '#a78bfa', glow: '#6d28d9' },
          { text: 'SYSTEM',      angle:  Math.PI,      color: '#22d3ee', glow: '#0e7490' },
        ];

        rimLabels.forEach(({ text, angle, color, glow }) => {
          // project position on the ring
          const wx = RA * Math.cos(angle);
          const wy = RB * Math.sin(angle);
          const [sx, sy] = project(wx, wy, 0.5);

          // tangent of the ellipse at this angle → screen rotation
          const tdx = -RA * Math.sin(angle);
          const tdy =  RB * Math.cos(angle);
          const stx = tdx * cosA2 - tdy * sinA2;
          const sty = (tdx * sinA2 + tdy * cosA2) * TILT;
          const tAngle = Math.atan2(sty, stx);

          const fSize   = Math.round(11 * Math.min(W, H) / 700);
          const spacing = fSize * 0.78;

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(tAngle);

          // glow pass
          ctx.font        = `900 ${fSize + 1}px Arial, sans-serif`;
          ctx.fillStyle   = glow;
          ctx.globalAlpha = 0.35;
          ctx.textAlign   = 'center';
          ctx.textBaseline = 'middle';
          const totalW = (text.length - 1) * spacing;
          [...text].forEach((ch, i) => {
            ctx.fillText(ch, i * spacing - totalW / 2, 0);
          });

          // main pass
          ctx.fillStyle   = color;
          ctx.globalAlpha = 0.92;
          [...text].forEach((ch, i) => {
            ctx.fillText(ch, i * spacing - totalW / 2, 0);
          });

          // thin rule lines above + below
          const hw = totalW / 2 + spacing * 0.3;
          ctx.strokeStyle = color;
          ctx.lineWidth   = 0.7;
          ctx.globalAlpha = 0.28;
          ctx.beginPath(); ctx.moveTo(-hw, -fSize * 0.78); ctx.lineTo(hw, -fSize * 0.78); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-hw,  fSize * 0.78); ctx.lineTo(hw,  fSize * 0.78); ctx.stroke();

          ctx.restore();
        });
      }

      ctx.textAlign = 'left';
    };

    draw();

    /* ── resize ── */
    const ro = new ResizeObserver(() => { setSize(); });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousedown',  onDown);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseup',    onUp);
      window.removeEventListener('touchstart', onDown as EventListener);
      window.removeEventListener('touchmove',  onMove as EventListener);
      window.removeEventListener('touchend',   onUp);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ cursor: 'grab' }}
    />
  );
}