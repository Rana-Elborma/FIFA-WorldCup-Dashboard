import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function StadiumPrototype3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width  = mount.clientWidth  || 800;
    const height = mount.clientHeight || 600;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 200);
    let rotX = 0.78;
    let rotY = 0;
    const CAM_R = 18;
    const updateCamera = () => {
      camera.position.set(
        CAM_R * Math.sin(rotY) * Math.cos(rotX),
        CAM_R * Math.sin(rotX),
        CAM_R * Math.cos(rotY) * Math.cos(rotX),
      );
      camera.lookAt(0, 0.5, 0);
    };
    updateCamera();

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0x0d1a36, 8));

    const dirLight = new THREE.DirectionalLight(0x5577bb, 3.5);
    dirLight.position.set(6, 14, 6);
    scene.add(dirLight);

    const purpleLight = new THREE.PointLight(0x8844ff, 12, 22);
    purpleLight.position.set(-5, 7, -4);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x00ccff, 8, 18);
    cyanLight.position.set(5, 5, 5);
    scene.add(cyanLight);

    /* ── Ellipse helper ── */
    const ellipsePts = (rx: number, rz: number, y: number, segs = 80): THREE.Vector3[] => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(rx * Math.cos(a), y, rz * Math.sin(a)));
      }
      return pts;
    };

    const addEllipse = (rx: number, rz: number, y: number, col: number, op: number) => {
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(ellipsePts(rx, rz, y)),
        new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: op }),
      );
      scene.add(line);
    };

    /* ── Ground ── */
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(32, 32),
      new THREE.MeshPhongMaterial({ color: 0x040a18, emissive: 0x020408 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.06;
    scene.add(ground);

    /* Grid lines */
    for (let i = -6; i <= 6; i++) {
      const hLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-12, 0, i * 2),
          new THREE.Vector3(12, 0, i * 2),
        ]),
        new THREE.LineBasicMaterial({ color: 0x0d1a36, transparent: true, opacity: 0.4 }),
      );
      scene.add(hLine);

      const vLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(i * 2, 0, -12),
          new THREE.Vector3(i * 2, 0, 12),
        ]),
        new THREE.LineBasicMaterial({ color: 0x0d1a36, transparent: true, opacity: 0.4 }),
      );
      scene.add(vLine);
    }

    /* ── Stadium rings ── */
    const buildRing = (rx: number, rz: number, innerF: number, h: number, y: number, col: number) => {
      const shape = new THREE.Shape();
      for (let i = 0; i <= 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        if (i === 0) shape.moveTo(rx * Math.cos(a), rz * Math.sin(a));
        else         shape.lineTo(rx * Math.cos(a), rz * Math.sin(a));
      }
      const hole = new THREE.Path();
      for (let i = 0; i <= 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        if (i === 0) hole.moveTo(rx * innerF * Math.cos(a), rz * innerF * Math.sin(a));
        else         hole.lineTo(rx * innerF * Math.cos(a), rz * innerF * Math.sin(a));
      }
      shape.holes.push(hole);

      const ringMesh = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false }),
        new THREE.MeshPhongMaterial({ color: col, shininess: 18 }),
      );
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = y;
      scene.add(ringMesh);
    };

    buildRing(6.5, 4.4, 0.86, 0.14, 0.00, 0x0b1530);
    buildRing(5.7, 3.9, 0.83, 0.38, 0.14, 0x0e1d42);
    buildRing(4.8, 3.2, 0.80, 0.30, 0.52, 0x12224a);
    buildRing(4.0, 2.7, 0.78, 0.24, 0.82, 0x17295a);

    addEllipse(6.6, 4.5, 1.14, 0x4488ff, 0.55);
    addEllipse(6.4, 4.3, 1.12, 0x2244aa, 0.22);

    /* ── Field ── */
    const fieldMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 2.8),
      new THREE.MeshPhongMaterial({ color: 0x0a3d14, emissive: 0x041008 }),
    );
    fieldMesh.rotation.x = -Math.PI / 2;
    fieldMesh.position.y = 0.02;
    scene.add(fieldMesh);

    for (let i = -2; i <= 2; i++) {
      if (i % 2 === 0) {
        const stripe = new THREE.Mesh(
          new THREE.PlaneGeometry(0.4, 2.8),
          new THREE.MeshPhongMaterial({ color: 0x0c4518 }),
        );
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(i * 0.8, 0.022, 0);
        scene.add(stripe);
      }
    }

    const addFieldLine = (pts: THREE.Vector3[]) => {
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0x1a6a2e, transparent: true, opacity: 0.75 }),
      ));
    };
    addFieldLine([new THREE.Vector3(0, 0.03, -1.4), new THREE.Vector3(0, 0.03, 1.4)]);

    const circlePts: THREE.Vector3[] = [];
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      circlePts.push(new THREE.Vector3(0.52 * Math.cos(a), 0.03, 0.52 * Math.sin(a)));
    }
    addFieldLine(circlePts);

    addFieldLine([
      new THREE.Vector3(-2.2, 0.03, -0.68), new THREE.Vector3(-1.38, 0.03, -0.68),
      new THREE.Vector3(-1.38, 0.03, 0.68), new THREE.Vector3(-2.2, 0.03, 0.68),
      new THREE.Vector3(-2.2, 0.03, -0.68),
    ]);
    addFieldLine([
      new THREE.Vector3(2.2, 0.03, -0.68), new THREE.Vector3(1.38, 0.03, -0.68),
      new THREE.Vector3(1.38, 0.03, 0.68), new THREE.Vector3(2.2, 0.03, 0.68),
      new THREE.Vector3(2.2, 0.03, -0.68),
    ]);

    /* ── Gates (24) ── */
    const GATE_COUNT = 24;

    const densityColor = (d: number): number =>
      d > 0.75 ? 0xff2222 : d > 0.48 ? 0xff8800 : 0x00dd66;

    type GateData = {
      dotMat:   THREE.MeshBasicMaterial;
      ring:     THREE.Mesh;
      ringMat:  THREE.MeshBasicMaterial;
      phase:    number;
      baseDensity: number;
    };
    const gates: GateData[] = [];

    for (let i = 0; i < GATE_COUNT; i++) {
      const angle    = (i / GATE_COUNT) * Math.PI * 2;
      const gx       = 6.55 * Math.cos(angle);
      const gz       = 4.45 * Math.sin(angle);
      const density  = 0.15 + Math.random() * 0.85;
      const col      = densityColor(density);

      const dotMat = new THREE.MeshBasicMaterial({ color: col });
      const dot    = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), dotMat);
      dot.position.set(gx, 1.15, gz);
      scene.add(dot);

      const ringMat = new THREE.MeshBasicMaterial({
        color: col, transparent: true, opacity: 0.55, side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.14, 0.22, 20), ringMat);
      ring.position.set(gx, 1.16, gz);
      ring.rotation.x = -Math.PI / 2;
      scene.add(ring);

      const ix = 3.8 * 0.80 * Math.cos(angle);
      const iz = 2.6 * 0.80 * Math.sin(angle);
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(gx, 1.15, gz),
          new THREE.Vector3(ix, 0.8,  iz),
        ]),
        new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.18 }),
      ));

      gates.push({ dotMat, ring, ringMat, phase: i * 0.26, baseDensity: density });
    }

    /* ── Crowd particles ── */
    const CROWD = 1400;
    const crowdPos  = new Float32Array(CROWD * 3);
    const crowdCol  = new Float32Array(CROWD * 3);
    const SECT_COLS = [
      [0.9,0.2,0.2],[0.1,0.55,0.95],[0.2,0.85,0.4],
      [0.95,0.6,0.1],[0.7,0.2,0.9],[0.2,0.8,0.9],[0.95,0.85,0.15],
    ];
    for (let i = 0; i < CROWD; i++) {
      const a  = Math.random() * Math.PI * 2;
      const tr = 0.72 + Math.random() * 0.25;
      crowdPos[i*3]   = tr * 5.2 * Math.cos(a);
      crowdPos[i*3+1] = 0.18 + Math.random() * 0.6;
      crowdPos[i*3+2] = tr * 3.6 * Math.sin(a);
      const sc = SECT_COLS[Math.floor((a / (Math.PI * 2)) * SECT_COLS.length) % SECT_COLS.length];
      crowdCol[i*3]=sc[0]; crowdCol[i*3+1]=sc[1]; crowdCol[i*3+2]=sc[2];
    }
    const crowdGeo = new THREE.BufferGeometry();
    crowdGeo.setAttribute('position', new THREE.BufferAttribute(crowdPos, 3));
    crowdGeo.setAttribute('color',    new THREE.BufferAttribute(crowdCol, 3));
    scene.add(new THREE.Points(
      crowdGeo,
      new THREE.PointsMaterial({ size: 0.058, vertexColors: true, transparent: true, opacity: 0.92 }),
    ));

    /* ── Flow particles ── */
    type FlowParticle = {
      mesh: THREE.Mesh;
      mat:  THREE.MeshBasicMaterial;
      gi:   number;
      t:    number;
      spd:  number;
    };
    const FLOW = 100;
    const flowParticles: FlowParticle[] = [];
    for (let i = 0; i < FLOW; i++) {
      const mat  = new THREE.MeshBasicMaterial({ color: 0x44ccff, transparent: true, opacity: 0.8 });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.045, 5, 5), mat);
      scene.add(mesh);
      flowParticles.push({
        mesh,
        mat,
        gi:  Math.floor(Math.random() * GATE_COUNT),
        t:   Math.random(),
        spd: 0.003 + Math.random() * 0.004,
      });
    }

    /* ── AI scan beam ── */
    const scanPivot = new THREE.Group();
    scanPivot.position.set(0, 7, 0);
    scene.add(scanPivot);

    const scanConeMat = new THREE.MeshBasicMaterial({
      color: 0x00aaff, transparent: true, opacity: 0.06, side: THREE.DoubleSide,
    });
    const scanCone = new THREE.Mesh(new THREE.ConeGeometry(1.3, 7.2, 24, 1, true), scanConeMat);
    scanCone.position.y = -3.6;
    scanPivot.add(scanCone);

    scanPivot.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -7.2, 1.3),
      ]),
      new THREE.LineBasicMaterial({ color: 0x00eeff, transparent: true, opacity: 0.55 }),
    ));

    /* ── Orbital rings ── */
    type OrbData = { mesh: THREE.Mesh; spd: number };
    const orbs: OrbData[] = [];

    const addOrb = (radius: number, col: number, op: number, spd: number, rx: number, ry: number) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.005, 8, 120),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, side: THREE.DoubleSide }),
      );
      m.rotation.x = rx;
      m.rotation.y = ry;
      scene.add(m);
      orbs.push({ mesh: m, spd });
    };
    addOrb(9.0,  0x4488ff, 0.22,  0.18,  Math.PI / 3.5,  0);
    addOrb(10.2, 0x00ffaa, 0.14, -0.12, -Math.PI / 4,    Math.PI / 6);
    addOrb(11.2, 0x8844ff, 0.10,  0.09,  Math.PI / 6,    Math.PI / 3);

    /* ── Ambient particles ── */
    const AMB    = 280;
    const ambPos = new Float32Array(AMB * 3);
    for (let i = 0; i < AMB; i++) {
      ambPos[i*3]   = (Math.random() - 0.5) * 24;
      ambPos[i*3+1] = 0.5 + Math.random() * 7;
      ambPos[i*3+2] = (Math.random() - 0.5) * 20;
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPos, 3));
    const ambParticles = new THREE.Points(
      ambGeo,
      new THREE.PointsMaterial({ color: 0x2255aa, size: 0.038, transparent: true, opacity: 0.45 }),
    );
    scene.add(ambParticles);

    /* ── Mouse / touch drag ── */
    let isDragging = false;
    let prevMouse  = { x: 0, y: 0 };
    let velX = 0;
    let velY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse  = { x: e.clientX, y: e.clientY };
      velX = velY = 0;
      renderer.domElement.style.cursor = 'grabbing';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      velY = (e.clientX - prevMouse.x) * 0.007;
      velX = -(e.clientY - prevMouse.y) * 0.007;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDragging = false;
      renderer.domElement.style.cursor = 'grab';
    };

    let prevTouch = { x: 0, y: 0 };
    const onTouchStart = (e: TouchEvent) => {
      prevTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      velX = velY = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      velY = (e.touches[0].clientX - prevTouch.x) * 0.007;
      velX = -(e.touches[0].clientY - prevTouch.y) * 0.007;
      prevTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    mount.addEventListener('mousedown',   onMouseDown);
    window.addEventListener('mousemove',  onMouseMove);
    window.addEventListener('mouseup',    onMouseUp);
    mount.addEventListener('touchstart',  onTouchStart, { passive: true });
    mount.addEventListener('touchmove',   onTouchMove,  { passive: true });

    /* ── Animation loop ── */
    let animId: number;
    let t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.016;

      /* Camera orbit */
      if (isDragging) {
        rotY += velY;
        rotX = Math.max(0.2, Math.min(1.4, rotX + velX));
      } else {
        velX *= 0.86;
        velY *= 0.86;
        rotX += velX;
        rotY += velY + 0.0022;
      }
      updateCamera();

      /* Gate pulses */
      gates.forEach(({ dotMat, ringMat, ring, phase, baseDensity }) => {
        const d   = Math.max(0, Math.min(1, baseDensity + 0.2 * Math.sin(t * 0.55 + phase)));
        const col = densityColor(d);
        dotMat.color.setHex(col);
        ringMat.color.setHex(col);
        const s = 1 + 0.6 * Math.abs(Math.sin(t * 1.9 + phase));
        ring.scale.setScalar(s);
        ringMat.opacity = 0.2 + 0.5 * Math.abs(Math.sin(t * 1.9 + phase));
      });

      /* Flow particles */
      flowParticles.forEach((fp) => {
        fp.t += fp.spd;
        if (fp.t >= 1) {
          fp.t  = 0;
          fp.gi = Math.floor(Math.random() * GATE_COUNT);
        }
        const gateAngle = (fp.gi / GATE_COUNT) * Math.PI * 2;
        const gx = 6.55 * Math.cos(gateAngle);
        const gz = 4.45 * Math.sin(gateAngle);
        const ix = 3.8 * 0.72 * Math.cos(gateAngle);
        const iz = 2.6 * 0.72 * Math.sin(gateAngle);
        fp.mesh.position.set(
          gx + (ix - gx) * fp.t,
          1.15 + (0.4 - 1.15) * fp.t,
          gz + (iz - gz) * fp.t,
        );
        fp.mat.opacity = 0.9 - 0.85 * fp.t;
      });

      /* Scan beam */
      scanPivot.rotation.y   = t * 0.8;
      scanConeMat.opacity     = 0.04 + 0.025 * Math.sin(t * 1.4);

      /* Orbital rings */
      orbs.forEach(({ mesh, spd }) => { mesh.rotation.z += spd * 0.016; });

      /* Ambient drift */
      ambParticles.rotation.y += 0.0007;

      /* Crowd bobbing */
      const posArr = crowdGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < CROWD; i += 4) {
        posArr[i * 3 + 1] = 0.18 + 0.038 * Math.sin(t * 2.2 + i * 0.31);
      }
      crowdGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize observer ── */
    const ro = new ResizeObserver(() => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(animId);
      mount.removeEventListener('mousedown',  onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
      mount.removeEventListener('touchstart', onTouchStart);
      mount.removeEventListener('touchmove',  onTouchMove);
      ro.disconnect();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" style={{ cursor: 'grab' }} />;
}
