import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Globe3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    // Lights
    scene.add(new THREE.AmbientLight(0x334466, 4));
    const pLight1 = new THREE.PointLight(0x5588ff, 8, 20);
    pLight1.position.set(3, 3, 3);
    scene.add(pLight1);
    const pLight2 = new THREE.PointLight(0x00ffaa, 3, 15);
    pLight2.position.set(-3, -1, 2);
    scene.add(pLight2);

    // Earth group (everything that rotates with the globe)
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    earthGroup.rotation.z = 0.2;

    // Globe core
    const globeGeo = new THREE.SphereGeometry(1, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({
      color: 0x0d1b4b,
      emissive: 0x060e2a,
      shininess: 40,
    });
    earthGroup.add(new THREE.Mesh(globeGeo, globeMat));

    // Latitude lines
    for (let lat = -75; lat <= 75; lat += 15) {
      const phi = (90 - lat) * (Math.PI / 180);
      const r = Math.sin(phi) * 1.002;
      const y = Math.cos(phi) * 1.002;
      const pts: THREE.Vector3[] = [];
      for (let lon = 0; lon <= 361; lon += 4) {
        const t = lon * (Math.PI / 180);
        pts.push(new THREE.Vector3(r * Math.cos(t), y, r * Math.sin(t)));
      }
      earthGroup.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0x1a3a6a, transparent: true, opacity: 0.35 })
      ));
    }

    // Longitude lines
    for (let lon = 0; lon < 360; lon += 20) {
      const theta = lon * (Math.PI / 180);
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 4) {
        const phi = (90 - lat) * (Math.PI / 180);
        pts.push(new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * 1.002,
          Math.cos(phi) * 1.002,
          Math.sin(phi) * Math.sin(theta) * 1.002
        ));
      }
      earthGroup.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0x1a3a6a, transparent: true, opacity: 0.35 })
      ));
    }

    // Atmosphere glow
    earthGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.08, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x2244ff, transparent: true, opacity: 0.07, side: THREE.BackSide })
    ));
    earthGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.15, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x1133cc, transparent: true, opacity: 0.03, side: THREE.BackSide })
    ));

    // lat/lon → 3D position
    const latLonTo3D = (lat: number, lon: number, r = 1.02): THREE.Vector3 => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    };

    // Saudi Arabia WC 2034 stadium cities
    const stadiums = [
      { name: 'Riyadh', lat: 24.7, lon: 46.7, color: 0x00ffaa },
      { name: 'Jeddah', lat: 21.5, lon: 39.2, color: 0x00ccff },
      { name: 'Al Khobar', lat: 26.2, lon: 50.2, color: 0xffaa00 },
      { name: 'NEOM', lat: 28.0, lon: 35.0, color: 0xff44cc },
      { name: 'Abha', lat: 18.2, lon: 42.5, color: 0x44aaff },
      { name: 'Qassim', lat: 26.3, lon: 43.9, color: 0xaaff44 },
    ];

    // Pulse rings stored for animation
    const pulseRings: { mesh: THREE.Mesh; phase: number; mat: THREE.MeshBasicMaterial }[] = [];

    stadiums.forEach((s, i) => {
      const pos = latLonTo3D(s.lat, s.lon, 1.018);
      const outward = pos.clone().normalize();

      // Core glowing dot
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 10, 10),
        new THREE.MeshBasicMaterial({ color: s.color })
      );
      dot.position.copy(pos);
      earthGroup.add(dot);

      // Inner ring
      const innerMat = new THREE.MeshBasicMaterial({
        color: s.color, transparent: true, opacity: 0.8, side: THREE.DoubleSide
      });
      const innerRing = new THREE.Mesh(new THREE.RingGeometry(0.03, 0.04, 24), innerMat);
      innerRing.position.copy(pos);
      innerRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), outward);
      earthGroup.add(innerRing);
      pulseRings.push({ mesh: innerRing, phase: i * 1.1, mat: innerMat });

      // Outer pulse ring
      const outerMat = new THREE.MeshBasicMaterial({
        color: s.color, transparent: true, opacity: 0.4, side: THREE.DoubleSide
      });
      const outerRing = new THREE.Mesh(new THREE.RingGeometry(0.045, 0.058, 24), outerMat);
      outerRing.position.copy(pos);
      outerRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), outward);
      earthGroup.add(outerRing);
      pulseRings.push({ mesh: outerRing, phase: i * 1.1 + 0.5, mat: outerMat });
    });

    // Arc connections between stadiums
    const arcs = [
      [0, 1], [0, 2], [1, 4], [3, 1], [0, 5], [2, 5],
    ] as [number, number][];

    arcs.forEach(([a, b]) => {
      const p1 = latLonTo3D(stadiums[a].lat, stadiums[a].lon, 1.02);
      const p2 = latLonTo3D(stadiums[b].lat, stadiums[b].lon, 1.02);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(1.35);
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const arcPts = curve.getPoints(40);
      earthGroup.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(arcPts),
        new THREE.LineBasicMaterial({ color: 0x44aaff, transparent: true, opacity: 0.35 })
      ));
    });

    // Floating particles field
    const pCount = 350;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = 1.45 + Math.random() * 0.9;
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      pPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.cos(phi);
      pPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo,
      new THREE.PointsMaterial({ color: 0x4488ff, size: 0.013, transparent: true, opacity: 0.65 })
    );
    scene.add(particles);

    // Orbital rings
    const makeOrbital = (radius: number, color: number, opacity: number, rx: number, ry: number) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.004, 8, 120),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide })
      );
      m.rotation.x = rx; m.rotation.y = ry;
      scene.add(m);
      return m;
    };
    const orb1 = makeOrbital(1.42, 0x4488ff, 0.28, Math.PI / 3.5, 0);
    const orb2 = makeOrbital(1.62, 0x00ffaa, 0.18, -Math.PI / 4, Math.PI / 6);
    const orb3 = makeOrbital(1.78, 0x8844ff, 0.12, Math.PI / 6, Math.PI / 3);

    // Mouse drag with inertia
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
      velocity = { x: 0, y: 0 };
      (renderer.domElement.style as CSSStyleDeclaration).cursor = 'grabbing';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      velocity.x = (e.clientY - prevMouse.y) * 0.004;
      velocity.y = (e.clientX - prevMouse.x) * 0.004;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDragging = false;
      (renderer.domElement.style as CSSStyleDeclaration).cursor = 'grab';
    };

    mount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation loop
    let animId: number;
    let t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.016;

      if (isDragging) {
        earthGroup.rotation.x += velocity.x;
        earthGroup.rotation.y += velocity.y;
      } else {
        velocity.x *= 0.93;
        velocity.y *= 0.93;
        earthGroup.rotation.x += velocity.x;
        earthGroup.rotation.y += velocity.y + 0.0018;
      }

      // Pulse rings
      pulseRings.forEach(({ mesh, phase, mat }) => {
        const s = 1 + 0.35 * Math.sin(t * 2.2 + phase);
        mesh.scale.setScalar(s);
        mat.opacity = 0.5 + 0.5 * Math.sin(t * 2.2 + phase + Math.PI / 4) * 0.5;
      });

      particles.rotation.y += 0.0004;
      orb1.rotation.z += 0.003;
      orb2.rotation.z -= 0.002;
      orb3.rotation.z += 0.0015;

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const resizeObserver = new ResizeObserver(() => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
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
