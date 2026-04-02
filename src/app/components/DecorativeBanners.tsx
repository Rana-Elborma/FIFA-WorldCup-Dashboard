import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   Decorative Ribbon Pair
   RIGHT  — two gently-curved strips (purple + orange-gold) with a looped curl
   LEFT   — two deep-S-curved strips (indigo + teal) with a looped curl
   Both   — geometric patterns, dark-edge depth, spring mouse-repulsion, scroll wave
   ─────────────────────────────────────────────────────────────────────────── */

interface Pt { rx: number; ry: number; x: number; y: number; vx: number; vy: number; }

const N    = 22;
const RW   = 13;
const CELL = 29;

/* ── Spine builders ─────────────────────────────────────────────────────── */
function makeCurvedSpine(
  sx: number, sy: number,
  ex: number, ey: number,
  amp: number, freq: number, phase = 0,
): Pt[] {
  return Array.from({ length: N }, (_, i) => {
    const t  = i / (N - 1);
    const rx = sx + (ex - sx) * t + Math.sin(t * Math.PI * freq + phase) * amp;
    const ry = sy + (ey - sy) * t + Math.sin(t * Math.PI * freq * 0.65 + phase) * amp * 0.42;
    return { rx, ry, x: rx, y: ry, vx: 0, vy: 0 };
  });
}

/* ── Physics ────────────────────────────────────────────────────────────── */
function updateSpine(
  pts: Pt[], scrollVel: number, scrollDir: number,
  mouseX: number, mouseY: number, time: number,
) {
  pts.forEach((pt, i) => {
    const s = Math.sin((i / (N - 1)) * Math.PI);
    pt.vx  += scrollVel * s * 0.009 * scrollDir;
    pt.x   += Math.sin(time * 1.55 + i * 0.58) * 0.20;
    const dx = pt.x - mouseX, dy = pt.y - mouseY;
    const d  = Math.hypot(dx, dy);
    if (d < 80 && d > 0.4) {
      const f = ((80 - d) / 80) * 1.4 * s;
      pt.vx += (dx / d) * f;
      pt.vy += (dy / d) * f;
    }
    pt.vx += (pt.rx - pt.x) * 0.068;
    pt.vy += (pt.ry - pt.y) * 0.068;
    pt.vx *= 0.79; pt.vy *= 0.79;
    pt.x  += pt.vx; pt.y  += pt.vy;
  });
}

/* ── Symbol renderer ────────────────────────────────────────────────────── */
function drawSym(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, angle: number,
  type: number, sz: number,
  outCol: string, dotCol: string,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.strokeStyle = outCol;
  ctx.fillStyle   = dotCol;
  ctx.lineWidth   = 1.35;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.globalAlpha = 0.88;

  switch (type % 6) {
    case 0: // Triangle
      ctx.beginPath();
      ctx.moveTo(0, -sz * 0.92);
      ctx.lineTo( sz * 0.78,  sz * 0.58);
      ctx.lineTo(-sz * 0.78,  sz * 0.58);
      ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, sz * 0.05, sz * 0.19, 0, Math.PI * 2); ctx.fill();
      break;
    case 1: // Diamond
      ctx.beginPath();
      ctx.moveTo(0, -sz); ctx.lineTo(sz * 0.66, 0);
      ctx.lineTo(0, sz);  ctx.lineTo(-sz * 0.66, 0);
      ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, sz * 0.21, 0, Math.PI * 2); ctx.fill();
      break;
    case 2: // Circle + 6-ray asterisk
      ctx.beginPath(); ctx.arc(0, 0, sz * 0.82, 0, Math.PI * 2); ctx.stroke();
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * sz * 0.6, Math.sin(a) * sz * 0.6);
        ctx.strokeStyle = dotCol; ctx.lineWidth = 1.05; ctx.stroke();
      }
      break;
    case 3: // Pentagon
      ctx.beginPath();
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
        const r = sz * 0.82;
        k === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
                : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath(); ctx.strokeStyle = outCol; ctx.lineWidth = 1.35; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, sz * 0.20, 0, Math.PI * 2); ctx.fill();
      break;
    case 4: // Double chevron >>
      ctx.strokeStyle = outCol; ctx.lineWidth = 1.65;
      ctx.beginPath();
      ctx.moveTo(-sz * .68, -sz * .64); ctx.lineTo(sz * .08, 0); ctx.lineTo(-sz * .68, sz * .64);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-sz * .12, -sz * .64); ctx.lineTo(sz * .64, 0); ctx.lineTo(-sz * .12, sz * .64);
      ctx.stroke();
      break;
    case 5: // 8-pt snowflake
      ctx.strokeStyle = outCol; ctx.lineWidth = 1.2;
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI;
        ctx.beginPath();
        ctx.moveTo( Math.cos(a) * sz * .82,  Math.sin(a) * sz * .82);
        ctx.lineTo(-Math.cos(a) * sz * .82, -Math.sin(a) * sz * .82);
        ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(0, 0, sz * .22, 0, Math.PI * 2); ctx.fill();
      break;
  }
  ctx.restore();
}

/* ── Ribbon renderer ────────────────────────────────────────────────────── */
function drawRibbon(
  ctx: CanvasRenderingContext2D,
  pts: Pt[],
  face: string, dark: string,
  outCol: string, dotCol: string,
  symOffset = 0,
) {
  if (pts.length < 2) return;

  let dist = 0, cellIdx = symOffset, nextCell = CELL * 0.55;

  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const dx = b.x - a.x, dy = b.y - a.y;
    const seg = Math.hypot(dx, dy);
    if (seg < 0.1) continue;
    const nx = -dy / seg, ny = dx / seg;

    // Face quad
    ctx.beginPath();
    ctx.moveTo(a.x + nx * RW, a.y + ny * RW);
    ctx.lineTo(b.x + nx * RW, b.y + ny * RW);
    ctx.lineTo(b.x - nx * RW, b.y - ny * RW);
    ctx.lineTo(a.x - nx * RW, a.y - ny * RW);
    ctx.closePath();
    ctx.fillStyle   = face;
    ctx.globalAlpha = 0.93;
    ctx.fill();

    // Dark edge stripe
    ctx.beginPath();
    ctx.moveTo(a.x + nx * RW,         a.y + ny * RW);
    ctx.lineTo(b.x + nx * RW,         b.y + ny * RW);
    ctx.lineTo(b.x + nx * (RW - 3.5), b.y + ny * (RW - 3.5));
    ctx.lineTo(a.x + nx * (RW - 3.5), a.y + ny * (RW - 3.5));
    ctx.closePath();
    ctx.fillStyle   = dark;
    ctx.globalAlpha = 0.48;
    ctx.fill();

    // Edge accent lines
    ctx.lineWidth = 0.65; ctx.globalAlpha = 0.30; ctx.strokeStyle = outCol;
    ctx.beginPath(); ctx.moveTo(a.x + nx * RW, a.y + ny * RW); ctx.lineTo(b.x + nx * RW, b.y + ny * RW); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(a.x - nx * RW, a.y - ny * RW); ctx.lineTo(b.x - nx * RW, b.y - ny * RW); ctx.stroke();
    ctx.globalAlpha = 1;

    // Symbols
    dist += seg;
    while (dist >= nextCell) {
      const lt  = (nextCell - (dist - seg)) / seg;
      const pcx = a.x + dx * lt, pcy = a.y + dy * lt;
      drawSym(ctx, pcx, pcy, Math.atan2(dy, dx) + Math.PI / 2, cellIdx, RW * 0.55, outCol, dotCol);
      cellIdx++; nextCell += CELL;
    }
  }

  // Curl
  const p0 = pts[0], p1 = pts[1];
  const cdx = p1.x - p0.x, cdy = p1.y - p0.y;
  const clen = Math.hypot(cdx, cdy);
  const tx0 = cdx / clen, ty0 = cdy / clen;
  const nx0 = -ty0, ny0 = tx0;
  const bx = -tx0,  by = -ty0;

  const curlLen = RW * 3.0, curlBulge = RW * 2.35;
  const tipX = p0.x + bx * curlLen, tipY = p0.y + by * curlLen;

  const cpx1 = p0.x + nx0 * (RW + curlBulge * .45) + bx * curlLen * .48;
  const cpy1 = p0.y + ny0 * (RW + curlBulge * .45) + by * curlLen * .48;
  const cpx2 = tipX + nx0 * curlBulge, cpy2 = tipY + ny0 * curlBulge;
  const cpx3 = tipX - nx0 * curlBulge, cpy3 = tipY - ny0 * curlBulge;
  const cpx4 = p0.x - nx0 * (RW + curlBulge * .45) + bx * curlLen * .48;
  const cpy4 = p0.y - ny0 * (RW + curlBulge * .45) + by * curlLen * .48;

  ctx.beginPath();
  ctx.moveTo(p0.x + nx0 * RW, p0.y + ny0 * RW);
  ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, tipX, tipY);
  ctx.bezierCurveTo(cpx3, cpy3, cpx4, cpy4, p0.x - nx0 * RW, p0.y - ny0 * RW);
  ctx.closePath();
  ctx.fillStyle = face; ctx.globalAlpha = 0.92; ctx.fill(); ctx.globalAlpha = 1;

  ctx.beginPath();
  ctx.moveTo(p0.x + nx0 * RW, p0.y + ny0 * RW);
  ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, tipX, tipY);
  ctx.bezierCurveTo(cpx3, cpy3, cpx4, cpy4, p0.x - nx0 * RW, p0.y - ny0 * RW);
  ctx.closePath();
  ctx.strokeStyle = dark; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.55; ctx.stroke(); ctx.globalAlpha = 1;

  // Interior ellipse (tube opening)
  ctx.save();
  ctx.translate(tipX + tx0 * RW * .55, tipY + ty0 * RW * .55);
  ctx.rotate(Math.atan2(ny0, nx0));
  ctx.beginPath();
  ctx.ellipse(0, 0, RW * 1.65, RW * 0.58, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#0b1429'; ctx.globalAlpha = 1; ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.11)'; ctx.lineWidth = 1.1; ctx.stroke();
  ctx.restore();

  drawSym(ctx, tipX + tx0 * RW * 1.1, tipY + ty0 * RW * 1.1,
    Math.atan2(ny0, nx0), cellIdx + 2, RW * .48, outCol, dotCol);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Component
   ═════════════════════════════════════════════════════════════════════════ */
export function DecorativeBanners() {
  const rightRef = useRef<HTMLCanvasElement>(null);
  const leftRef  = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const RC = rightRef.current, LC = leftRef.current;
    if (!RC || !LC) return;
    const rctx = RC.getContext('2d'), lctx = LC.getContext('2d');
    if (!rctx || !lctx) return;

    const RW_W = 340, LW_W = 300, H = 340;
    RC.width = RW_W; RC.height = H;
    LC.width = LW_W; LC.height = H;

    /* ── RIGHT spines — gentle single-hump curves ──
       amp=22 / freq=1.3  →  one smooth bow across the height                  */
    const rSpA = makeCurvedSpine(292,  8,  18, 308, 22, 1.3, 0.0);  // purple  – front
    const rSpB = makeCurvedSpine(322, 32,  48, 328, 16, 1.3, 0.6);  // orange-gold – behind

    /* ── LEFT spines — deep S-curves ──
       amp=52 / freq=2.1  →  two full lateral waves across the height           */
    const lSpA = makeCurvedSpine( 20, 15, 280, 330, 52, 2.1, 0.0);  // indigo-purple – front
    const lSpB = makeCurvedSpine( 42, 25, 260, 320, 38, 2.1, 0.9);  // teal – behind

    let rMX = -9999, rMY = -9999;
    let lMX = -9999, lMY = -9999;
    let scrollVel = 0, lastScrollTop = 0;
    let time = 0, animId: number;

    const onMove = (e: MouseEvent) => {
      const rr = RC.getBoundingClientRect();
      rMX = (e.clientX - rr.left) * (RW_W / rr.width);
      rMY = (e.clientY - rr.top)  * (H    / rr.height);
      const lr = LC.getBoundingClientRect();
      lMX = (e.clientX - lr.left) * (LW_W / lr.width);
      lMY = (e.clientY - lr.top)  * (H    / lr.height);
    };
    const onScroll = (e: Event) => {
      const el = e.target as HTMLElement;
      const sy = 'scrollTop' in el ? el.scrollTop : window.scrollY;
      scrollVel += Math.max(-60, Math.min(60, sy - lastScrollTop));
      lastScrollTop = sy;
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });

    const loop = () => {
      animId = requestAnimationFrame(loop);
      time      += 0.016;
      scrollVel *= 0.81;

      updateSpine(rSpA, scrollVel,  1.00, rMX, rMY, time);
      updateSpine(rSpB, scrollVel, -0.85, rMX, rMY, time);
      updateSpine(lSpA, scrollVel,  1.00, lMX, lMY, time);
      updateSpine(lSpB, scrollVel, -0.85, lMX, lMY, time);

      /* RIGHT canvas — orange-gold behind, purple in front */
      rctx.clearRect(0, 0, RW_W, H);
      drawRibbon(rctx, rSpB, '#d97706', '#92400e', 'rgba(255,255,255,0.82)', '#451a00', 3);
      drawRibbon(rctx, rSpA, '#7c3aed', '#4c1d95', 'rgba(255,255,255,0.82)', '#1a0e3d', 0);

      /* LEFT canvas — teal behind, indigo-purple in front */
      lctx.clearRect(0, 0, LW_W, H);
      drawRibbon(lctx, lSpB, '#0f766e', '#134e4a', 'rgba(255,255,255,0.82)', '#032e2c', 5);
      drawRibbon(lctx, lSpA, '#6d28d9', '#3b0764', 'rgba(255,255,255,0.82)', '#1e0a47', 1);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('scroll', onScroll, { capture: true });
    };
  }, []);

  return (
    <>
      {/* RIGHT ribbon */}
      <div
        className="absolute top-0 right-0 z-0 overflow-hidden pointer-events-none"
        style={{ width: 340, height: 340 }}
      >
        <canvas ref={rightRef} className="w-full h-full" style={{ opacity: 0.88 }} />
      </div>

      {/* LEFT ribbon — scaleX(-1) mirrors the curl to the left edge */}
      <div
        className="absolute top-0 left-0 z-0 overflow-hidden pointer-events-none"
        style={{ width: 300, height: 340 }}
      >
        <canvas
          ref={leftRef}
          className="w-full h-full"
          style={{ opacity: 0.88, transform: 'scaleX(-1)' }}
        />
      </div>
    </>
  );
}
