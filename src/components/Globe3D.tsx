import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Country {
  name: string;
  lat: number;
  lon: number;
}

// Capitals / major cities used as country anchors for hover tooltips
const COUNTRIES: Country[] = [
  { name: "Greece", lat: 38.24, lon: 21.73 },
  { name: "United Kingdom", lat: 51.5, lon: -0.12 },
  { name: "United States", lat: 40.71, lon: -74.0 },
  { name: "Canada", lat: 45.42, lon: -75.7 },
  { name: "Mexico", lat: 19.43, lon: -99.13 },
  { name: "Brazil", lat: -23.55, lon: -46.63 },
  { name: "Argentina", lat: -34.6, lon: -58.38 },
  { name: "France", lat: 48.85, lon: 2.35 },
  { name: "Spain", lat: 40.42, lon: -3.7 },
  { name: "Portugal", lat: 38.72, lon: -9.14 },
  { name: "Italy", lat: 41.9, lon: 12.5 },
  { name: "Germany", lat: 52.52, lon: 13.4 },
  { name: "Netherlands", lat: 52.37, lon: 4.9 },
  { name: "Sweden", lat: 59.33, lon: 18.07 },
  { name: "Norway", lat: 59.91, lon: 10.75 },
  { name: "Finland", lat: 60.17, lon: 24.94 },
  { name: "Poland", lat: 52.23, lon: 21.01 },
  { name: "Turkey", lat: 41.01, lon: 28.98 },
  { name: "Russia", lat: 55.75, lon: 37.62 },
  { name: "UAE", lat: 25.2, lon: 55.27 },
  { name: "Saudi Arabia", lat: 24.71, lon: 46.68 },
  { name: "Egypt", lat: 30.04, lon: 31.24 },
  { name: "South Africa", lat: -33.92, lon: 18.42 },
  { name: "Nigeria", lat: 9.08, lon: 7.4 },
  { name: "Kenya", lat: -1.29, lon: 36.82 },
  { name: "India", lat: 28.61, lon: 77.21 },
  { name: "China", lat: 39.9, lon: 116.4 },
  { name: "Japan", lat: 35.68, lon: 139.69 },
  { name: "South Korea", lat: 37.57, lon: 126.98 },
  { name: "Singapore", lat: 1.35, lon: 103.82 },
  { name: "Indonesia", lat: -6.21, lon: 106.85 },
  { name: "Thailand", lat: 13.75, lon: 100.5 },
  { name: "Australia", lat: -33.86, lon: 151.21 },
  { name: "New Zealand", lat: -41.29, lon: 174.78 },
];

const RADIUS = 1.6;

const latLonToVec3 = (lat: number, lon: number, r = RADIUS) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
};

const Globe3D = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 0, 5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.cursor = "grab";

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(5, 3, 5);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x4ea8ff, 0.5);
    rim.position.set(-5, -2, -3);
    scene.add(rim);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    // Realistic earth
    const sphereGeo = new THREE.SphereGeometry(RADIUS, 96, 96);
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x223044,
      shininess: 18,
      specular: new THREE.Color(0x335577),
    });
    const earth = new THREE.Mesh(sphereGeo, earthMat);
    globeGroup.add(earth);

    loader.load(
      "https://unpkg.com/three-globe@2.31.1/example/img/earth-dark.jpg",
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        earthMat.map = tex;
        earthMat.color.set(0xffffff);
        earthMat.needsUpdate = true;
      }
    );
    loader.load(
      "https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png",
      (tex) => {
        earthMat.bumpMap = tex;
        earthMat.bumpScale = 0.04;
        earthMat.needsUpdate = true;
      }
    );

    // Clouds
    const cloudGeo = new THREE.SphereGeometry(RADIUS * 1.012, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    globeGroup.add(clouds);
    loader.load(
      "https://unpkg.com/three-globe@2.31.1/example/img/earth-clouds.png",
      (tex) => {
        cloudMat.map = tex;
        cloudMat.alphaMap = tex;
        cloudMat.needsUpdate = true;
      }
    );

    // Atmosphere glow
    const atmoGeo = new THREE.SphereGeometry(RADIUS * 1.18, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
          gl_FragColor = vec4(0.3, 0.65, 1.0, 1.0) * intensity;
        }
      `,
    });
    scene.add(new THREE.Mesh(atmoGeo, atmoMat));

    // Country markers (anchors used both as visual pins and hover targets)
    interface MarkerEntry {
      country: Country;
      worldPos: THREE.Vector3;
      pin: THREE.Mesh;
      halo: THREE.Mesh;
    }
    const markers: MarkerEntry[] = COUNTRIES.map((c) => {
      const pos = latLonToVec3(c.lat, c.lon, RADIUS * 1.005);
      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 14, 14),
        new THREE.MeshBasicMaterial({ color: 0x60d4ff })
      );
      pin.position.copy(pos);
      globeGroup.add(pin);

      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.035, 0.055, 28),
        new THREE.MeshBasicMaterial({
          color: 0x60d4ff,
          transparent: true,
          opacity: 0.55,
          side: THREE.DoubleSide,
        })
      );
      halo.position.copy(pos);
      halo.lookAt(0, 0, 0);
      globeGroup.add(halo);

      return { country: c, worldPos: pos.clone(), pin, halo };
    });

    // Arcs
    interface Arc {
      line: THREE.Line;
      mat: THREE.LineBasicMaterial;
      curve: THREE.CatmullRomCurve3;
      progress: number;
      speed: number;
      head: THREE.Mesh;
      points: THREE.Vector3[];
    }
    const arcs: Arc[] = [];

    const buildArc = (a: Country, b: Country): Arc => {
      const start = latLonToVec3(a.lat, a.lon);
      const end = latLonToVec3(b.lat, b.lon);
      const mid = start.clone().add(end).multiplyScalar(0.5);
      const dist = start.distanceTo(end);
      const altitude = RADIUS + dist * 0.5;
      mid.normalize().multiplyScalar(altitude);
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const points = curve.getPoints(64);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({ color: 0x4ea8ff, transparent: true, opacity: 0 });
      const line = new THREE.Line(geo, mat);
      globeGroup.add(line);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x9be0ff })
      );
      head.visible = false;
      globeGroup.add(head);

      return { line, mat, curve, progress: 0, speed: 0.005 + Math.random() * 0.004, head, points };
    };

    for (let i = 0; i < 6; i++) {
      const a = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      let b = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      while (b === a) b = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      arcs.push(buildArc(a, b));
    }

    let arcCounter = 0;
    const spawnArc = () => {
      const a = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      let b = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      while (b === a) b = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      const arc = arcs[arcCounter % arcs.length];
      arcCounter++;
      globeGroup.remove(arc.line);
      globeGroup.remove(arc.head);
      arc.line.geometry.dispose();
      const fresh = buildArc(a, b);
      arc.line = fresh.line;
      arc.mat = fresh.mat;
      arc.curve = fresh.curve;
      arc.points = fresh.points;
      arc.head = fresh.head;
      arc.progress = 0;
      arc.speed = fresh.speed;
    };

    // Interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isDragging = false;
    let didDrag = false;
    let lastX = 0;
    let lastY = 0;
    let targetRotVelY = 0.0015;
    let currentRotVelY = 0.0015;
    let rotOffsetX = 0;

    const onDown = (e: PointerEvent) => {
      isDragging = true;
      didDrag = false;
      lastX = e.clientX;
      lastY = e.clientY;
      renderer.domElement.style.cursor = "grabbing";
    };
    const onUp = () => {
      isDragging = false;
      renderer.domElement.style.cursor = "grab";
    };

    const updateHover = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObject(earth, false)[0];
      if (!hit) {
        setTooltip(null);
        markers.forEach((m) => {
          (m.pin.material as THREE.MeshBasicMaterial).color.set(0x60d4ff);
          m.pin.scale.setScalar(1);
        });
        return;
      }
      // Convert hit point to globe-local space
      const local = globeGroup.worldToLocal(hit.point.clone());
      // Find nearest country anchor (local space matches worldPos because anchors are added in local)
      let best: MarkerEntry | null = null;
      let bestDist = Infinity;
      for (const m of markers) {
        const d = m.worldPos.distanceTo(local);
        if (d < bestDist) {
          bestDist = d;
          best = m;
        }
      }
      markers.forEach((m) => {
        const isBest = m === best && bestDist < 0.55;
        (m.pin.material as THREE.MeshBasicMaterial).color.set(isBest ? 0xffffff : 0x60d4ff);
        m.pin.scale.setScalar(isBest ? 1.8 : 1);
      });
      if (best && bestDist < 0.55) {
        setTooltip({ x: clientX - rect.left, y: clientY - rect.top, name: best.country.name });
      } else {
        setTooltip(null);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (isDragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        if (Math.abs(dx) + Math.abs(dy) > 3) didDrag = true;
        lastX = e.clientX;
        lastY = e.clientY;
        globeGroup.rotation.y += dx * 0.005;
        rotOffsetX = THREE.MathUtils.clamp(rotOffsetX + dy * 0.005, -1.2, 1.2);
        globeGroup.rotation.x = rotOffsetX;
        setTooltip(null);
      } else {
        updateHover(e.clientX, e.clientY);
      }
    };

    const onLeave = () => setTooltip(null);

    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerleave", onLeave);

    const onResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    let rafId: number;
    let lastSpawn = 0;
    const animate = (time: number) => {
      if (!isDragging) {
        currentRotVelY += (targetRotVelY - currentRotVelY) * 0.05;
        globeGroup.rotation.y += currentRotVelY;
      }
      clouds.rotation.y += 0.0006;

      arcs.forEach((arc) => {
        arc.progress += arc.speed;
        const draw = Math.min(arc.progress, 1);
        const count = Math.max(2, Math.floor(arc.points.length * draw));
        const slice = arc.points.slice(0, count);
        arc.line.geometry.dispose();
        arc.line.geometry = new THREE.BufferGeometry().setFromPoints(slice);
        arc.mat.opacity = Math.min(0.9, draw * 1.4);
        const headPos = arc.curve.getPoint(draw);
        arc.head.position.copy(headPos);
        arc.head.visible = draw < 1;
        if (arc.progress > 1.6) {
          arc.mat.opacity = Math.max(0, arc.mat.opacity - 0.04);
        }
      });

      if (time - lastSpawn > 900) {
        spawnArc();
        lastSpawn = time;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerleave", onLeave);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      {tooltip && (
        <div
          className="pointer-events-none absolute z-20 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold text-white whitespace-nowrap"
          style={{
            left: tooltip.x + 14,
            top: tooltip.y + 14,
            background: "linear-gradient(135deg, hsl(0 0% 100% / 0.14) 0%, hsl(0 0% 100% / 0.06) 100%)",
            border: "1px solid hsl(195 100% 70% / 0.45)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow: "0 8px 24px hsl(210 100% 50% / 0.25)",
          }}
        >
          {tooltip.name}
        </div>
      )}
    </div>
  );
};

export default Globe3D;
