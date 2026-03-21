import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function StadiumPrototype3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // ─── Renderer ───
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // ─── Camera ───
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 200);
    let rotX = 0.92;
    let rotY = 0;
    const CAM_R = 16;
    const updateCamera = () => {
      camera.position.set(
        CAM_R * Math.sin(rotY) * Math.cos(rotX),
        CAM_R * Math.sin(rotX),
        CAM_R * Math.cos(rotY) * Math.cos(rotX)
      );
      camera.lookAt(0, 0.5, 0);
    };
    updateCamera();

    // ─── Lights ───
    scene.add(new THREE.AmbientLight(0x1a2a4a, 6));
    const dirLight = new THREE.DirectionalLight(0x6688cc, 3);
    dirLight.position.set(5, 12, 5);
    scene.add(dirLight);
    const purpleLight = new THREE.PointLight(0x8844ff, 10, 20);
    purpleLight.position.set(-4, 6, -4);
    scene.add(purpleLight);
    const cyanLight = new THREE.PointLight(0x00aaff, 8, 18);
    cyanLight.position.set(4, 5, 4);
    scene.add(cyanLight);

    // ─── Helpers ───
    const makeEllipsePts = (rx: number, rz: number, y: number, segs = 80): THREE.Vector3[] => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(rx * Math.cos(a), y, rz * Math.sin(a)));
      }
      return pts;
    };

    const addEllipseLine = (rx: number, rz: number, y: number, color: number, opacity: number, segs = 80) => {
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(makeEllipsePts(rx, rz, y, segs)),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity })
      );
      scene.add(line);
      return line;
    };

    // ─── Ground plane ───
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshPhongMaterial({ color: 0x050c1a, emissive: 0x020408 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    scene.add(ground);

    // ─── Stadium base ───
    const buildRing = (rx: number, rz: number, innerFactor: number, height: number, y: number, color: number, emissive = 0x000000) => {
      const shape = new THREE.Shape();
      const pts = 72;
      for (let i = 0; i <= pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        if (i === 0) shape.moveTo(rx * Math.cos(a), rz * Math.sin(a));
        else shape.lineTo(rx * Math.cos(a), rz * Math.sin(a));
      }
      const hole = new THREE.Path();
      for (let i = 0; i <= pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        if (i === 0) hole.moveTo(rx * innerFactor * Math.cos(a), rz * innerFactor * Math.sin(a));
        else hole.lineTo(rx * innerFactor * Math.cos(a), rz * innerFactor * Math.sin(a));
      }
      shape.holes.push(hole);
      const geo = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
      const mat = new THREE.MeshPhongMaterial({ color, emissive, shininess: 20 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = y;
      scene.add(mesh);
      return mesh;
    };

    buildRing(6.2, 4.2, 0.86, 0.15, 0,    0x0a1428); // outer concourse
    buildRing(5.5, 3.7, 0.83, 0.35, 0.15, 0x0d1a38); // lower tier
    buildRing(4.6, 3.1, 0.80, 0.30, 0.50, 0x111f42); // mid tier
    buildRing(3.9, 2.6, 0.78, 0.25, 0.80, 0x162548); // upper tier

    // ─── Roof ring ───
    addEllipseLine(6.3, 4.3, 1.1, 0x4488ff, 0.55);
    addEllipseLine(6.1, 4.1, 1.08, 0x2244aa, 0.25);

    // ─── Field ───
    const field = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 2.6),
      new THREE.MeshPhongMaterial({ color: 0x0a3d14, emissive: 0x041008 })
    );
    field.rotation.x = -Math.PI / 2;
    field.position.y = 0.02;
    scene.add(field);

    // Field stripes
    for (let i = -2; i <= 2; i++) {
      if (i % 2 === 0) {
        const stripe = new THREE.Mesh(
          new THREE.PlaneGeometry(0.38, 2.6),
          new THREE.MeshPhongMaterial({ color: 0x0c4518, emissive: 0x051209 })
        );
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(i * 0.78, 0.021, 0);
        scene.add(stripe);
      }
    }

    // Field lines
    const addFieldLine = (pts: THREE.Vector3[], color = 0x1a6a2e) => {
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 })
      ));
    };
    // Center line
    addFieldLine([new THREE.Vector3(0, 0.03, -1.3), new THREE.Vector3(0, 0.03, 1.3)]);
    // Center circle
    const ccPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      ccPts.push(new THREE.Vector3(0.5 * Math.cos(a), 0.03, 0.5 * Math.sin(a)));
    }
    addFieldLine(ccPts);
    // Penalty boxes
    addFieldLine([new THREE.Vector3(-2.1, 0.03, -0.65), new THREE.Vector3(-1.35, 0.03, -0.65),
                  new THREE.Vector3(-1.35, 0.03, 0.65), new THREE.Vector3(-2.1, 0.03, 0.65),
                  new THREE.Vector3(-2.1, 0.03, -0.65)]);
    addFieldLine([new THREE.Vector3(2.1, 0.03, -0.65), new THREE.Vector3(1.35, 0.03, -0.65),
                  new THREE.Vector3(1.35, 0.03, 0.65), new THREE.Vector3(2.1, 0.03, 0.65),
                  new THREE.Vector3(2.1, 0.03, -0.65)]);

    // ─── Orbital rings ───
    const orbLines: { line: THREE.Line; speed: number }[] = [];
    const addOrbit = (rx: number, rz: number, y: number, color: number, opacity: number, speed: number) => {
      const line = addEllipseLine(rx, rz, y, color, opacity);
      orbLines.push({ line, speed });
    };
    addOrbit(8.5, 5.8, 2.2, 0x4488ff, 0.22, 0.18);
    addOrbit(9.5, 6.5, 3.0, 0x8844ff, 0.15, -0.12);
    addOrbit(10.2, 7.0, 1.5, 0x00aaff, 0.10, 0.09);

    // ─── Gates (20 around perimeter) ───
    const GATE_COUNT = 20;
    type GateData = {
      dot: THREE.Mesh; dotMat: THREE.MeshBasicMaterial;
      ring: THREE.Mesh; ringMat: THREE.MeshBasicMaterial;
      flowLine: THREE.Line; flowMat: THREE.LineBasicMaterial;
      phase: number; baseDensity: number;
    };
    const gates: GateData[] = [];

    const densityColor = (d: number): number => {
      if (d > 0.75) return 0xff2222;
      if (d > 0.5)  return 0xff8800;
      return 0x00dd66;
    };

    for (let i = 0; i < GATE_COUNT; i++) {
      const angle = (i / GATE_COUNT) * Math.PI * 2;
      const rx = 6.25, rz = 4.25;
      const x = rx * Math.cos(angle);
      const z = rz * Math.sin(angle);
      const density = 0.2 + Math.random() * 0.8;
      const col = densityColor(density);

      // Gate dot
      const dotMat = new THREE.MeshBasicMaterial({ color: col });
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), dotMat);
      dot.position.set(x, 1.12, z);
      scene.add(dot);

      // Pulse ring
      const ringMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.12, 0.19, 20), ringMat);
      ring.position.set(x, 1.13, z);
      ring.rotation.x = -Math.PI / 2;
      scene.add(ring);

      // Flow line to center
      const innerX = 3.9 * 0.82 * Math.cos(angle);
      const innerZ = 2.6 * 0.82 * Math.sin(angle);
      const flowMat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.25 });
      const flowLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, 1.12, z),
          new THREE.Vector3(innerX, 0.85, innerZ),
        ]),
        flowMat
      );
      scene.add(flowLine);

      gates.push({ dot, dotMat, ring, ringMat, flowLine, flowMat, phase: i * 0.31, baseDensity: density });
    }

    // ─── Crowd particles (stands area) ───
    const CROWD = 1200;
    const cPos = new Float32Array(CROWD * 3);
    const cCol = new Float32Array(CROWD * 3);
    const SECTION_COLS = [
      [0.9, 0.2, 0.2], [0.1, 0.55, 0.95], [0.2, 0.85, 0.4],
      [0.95, 0.6, 0.1], [0.7, 0.2, 0.9], [0.2, 0.8, 0.9],
    ];
    for (let i = 0; i < CROWD; i++) {
      const angle = Math.random() * Math.PI * 2;
      const tr = 0.72 + Math.random() * 0.25;
      cPos[i * 3]     = tr * 5.0 * Math.cos(angle);
      cPos[i * 3 + 1] = 0.18 + Math.random() * 0.55;
      cPos[i * 3 + 2] = tr * 3.4 * Math.sin(angle);
      const sec = Math.floor((angle / (Math.PI * 2)) * SECTION_COLS.length);
      const col = SECTION_COLS[sec % SECTION_COLS.length];
      cCol[i * 3] = col[0]; cCol[i * 3 + 1] = col[1]; cCol[i * 3 + 2] = col[2];
    }
    const crowdGeo = new THREE.BufferGeometry();
    crowdGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3));
    crowdGeo.setAttribute('color', new THREE.BufferAttribute(cCol, 3));
    const crowd = new THREE.Points(crowdGeo, new THREE.PointsMaterial({
      size: 0.055, vertexColors: true, transparent: true, opacity: 0.9,
    }));
    scene.add(crowd);

    // ─── Flow particles (entering through gates) ───
    const FLOW_COUNT = 80;
    type FlowParticle = { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; gateIdx: number; t: number; speed: number };
    const flowParticles: FlowParticle[] = [];
    for (let i = 0; i < FLOW_COUNT; i++) {
      const gi = Math.floor(Math.random() * GATE_COUNT);
      const mat = new THREE.MeshBasicMaterial({ color: 0x44ccff, transparent: true, opacity: 0.8 });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.04, 5, 5), mat);
      scene.add(mesh);
      flowParticles.push({ mesh, mat, gateIdx: gi, t: Math.random(), speed: 0.003 + Math.random() * 0.004 });
    }

    // ─── AI scan beam ───
    const scanPivot = new THREE.Group();
    scanPivot.position.set(0, 6, 0);
    scene.add(scanPivot);
    const scanConeMat = new THREE.MeshBasicMaterial({ color: 0x00bbff, transparent: true, opacity: 0.05, side: THREE.DoubleSide });
    const scanCone = new THREE.Mesh(new THREE.ConeGeometry(1.2, 6.5, 20, 1, true), scanConeMat);
    scanCone.position.y = -3.25;
    scanPivot.add(scanCone);
    const scanRayMat = new THREE.LineBasicMaterial({ color: 0x00eeff, transparent: true, opacity: 0.5 });
    const scanRay = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -6.5, 1.2)]),
      scanRayMat
    );
    scanPivot.add(scanRay);

    // ─── HUD data panels ───
    type HUDPanel = { group: THREE.Group; floatPhase: number };
    const hudPanels: HUDPanel[] = [];
    const panelDefs = [
      { pos: [-8.5, 2.8, -2] as [number,number,number], color: 0x4488ff },
      { pos: [8.5, 3.2, 2] as [number,number,number], color: 0x00aa66 },
      { pos: [0, 4.5, 6] as [number,number,number], color: 0x8844ff },
      { pos: [-6, 3.8, 4] as [number,number,number], color: 0xff8800 },
    ];
    panelDefs.forEach(({ pos, color }, idx) => {
      const g = new THREE.Group();
      g.position.set(...pos);
      // Panel face
      const faceMat = new THREE.MeshBasicMaterial({ color: 0x0d1a38, transparent: true, opacity: 0.75 });
      g.add(new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.55), faceMat));
      // Border
      const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.6, 0.55, 0.02));
      g.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 })));
      // Bar chart bars (fake data)
      for (let b = 0; b < 5; b++) {
        const h = 0.08 + Math.random() * 0.22;
        const barMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 });
        const bar = new THREE.Mesh(new THREE.PlaneGeometry(0.2, h), barMat);
        bar.position.set(-0.55 + b * 0.28, -0.08 + h / 2, 0.01);
        g.add(bar);
      }
      // Connector line to stadium edge
      const connEnd = new THREE.Vector3(Math.sign(pos[0]) * 6.3, 1.1, Math.sign(pos[2]) * 4.3);
      const connStart = new THREE.Vector3(...pos);
      const connMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 });
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([connStart, connEnd]),
        connMat
      ));
      scene.add(g);
      hudPanels.push({ group: g, floatPhase: idx * 1.57 });
    });

    // ─── Floating particles field (ambient) ───
    const AMB = 300;
    const ambPos = new Float32Array(AMB * 3);
    for (let i = 0; i < AMB; i++) {
      ambPos[i * 3]     = (Math.random() - 0.5) * 22;
      ambPos[i * 3 + 1] = 0.5 + Math.random() * 6;
      ambPos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPos, 3));
    const ambParticles = new THREE.Points(ambGeo, new THREE.PointsMaterial({
      color: 0x3366aa, size: 0.035, transparent: true, opacity: 0.45,
    }));
    scene.add(ambParticles);

    // ─── Mouse interaction ───
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let velX = 0, velY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
      velX = velY = 0;
      renderer.domElement.style.cursor = 'grabbing';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      velY = (e.clientX - prevMouse.x) * 0.006;
      velX = -(e.clientY - prevMouse.y) * 0.006;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging = false; renderer.domElement.style.cursor = 'grab'; };
    mount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // ─── Animation ───
    let animId: number;
    let t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.016;

      // Camera orbit
      if (isDragging) {
        rotY += velY;
        rotX = Math.max(0.25, Math.min(1.45, rotX + velX));
      } else {
        velX *= 0.88;
        velY *= 0.88;
        rotX += velX;
        rotY += velY;
        rotY += 0.0025; // slow auto-rotate
      }
      updateCamera();

      // Gate pulse + density fluctuation
      gates.forEach(({ dotMat, ringMat, flowMat, ring, phase, baseDensity }) => {
        const d = Math.max(0, Math.min(1, baseDensity + 0.18 * Math.sin(t * 0.6 + phase)));
        const col = densityColor(d);
        dotMat.color.setHex(col);
        ringMat.color.setHex(col);
        flowMat.color.setHex(col);
        const s = 1 + 0.55 * Math.abs(Math.sin(t * 1.8 + phase));
        ring.scale.setScalar(s);
        ringMat.opacity = 0.25 + 0.45 * Math.abs(Math.sin(t * 1.8 + phase));
        flowMat.opacity = 0.1 + 0.2 * Math.abs(Math.sin(t * 1.2 + phase));
      });

      // Flow particles: gate → inner stands
      flowParticles.forEach(fp => {
        fp.t += fp.speed;
        if (fp.t >= 1) {
          fp.t = 0;
          fp.gateIdx = Math.floor(Math.random() * GATE_COUNT);
        }
        const g = gates[fp.gateIdx];
        const gp = g.dot.position;
        const angle = (fp.gateIdx / GATE_COUNT) * Math.PI * 2;
        const innerX = 4.0 * 0.72 * Math.cos(angle);
        const innerZ = 2.7 * 0.72 * Math.sin(angle);
        const tt = fp.t;
        fp.mesh.position.set(
          gp.x + (innerX - gp.x) * tt,
          gp.y + (0.4 - gp.y) * tt,
          gp.z + (innerZ - gp.z) * tt
        );
        fp.mat.opacity = 0.9 - 0.8 * tt;
      });

      // AI scan rotation
      scanPivot.rotation.y = t * 0.7;
      scanConeMat.opacity = 0.04 + 0.025 * Math.sin(t * 1.2);

      // HUD panels: float + face camera
      hudPanels.forEach(({ group, floatPhase }) => {
        group.position.y += 0.004 * Math.sin(t * 0.9 + floatPhase);
        group.lookAt(camera.position);
      });

      // Orbital rings
      orbLines.forEach(({ line, speed }) => { line.rotation.y += speed * 0.016; });

      // Ambient particles drift
      ambParticles.rotation.y += 0.0006;

      // Crowd micro-bob
      const pos = crowdGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < CROWD; i += 5) {
        pos[i * 3 + 1] = 0.18 + 0.035 * Math.sin(t * 2.1 + i * 0.3);
      }
      crowdGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // ─── Resize ───
    const resizeObserver = new ResizeObserver(() => {
      if (!mount) return;
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(mount);

    return () => {
      cancelAnimationFrame(animId);
      mount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      resizeObserver.disconnect();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ cursor: 'grab' }}
    />
  );
}
