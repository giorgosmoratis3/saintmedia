import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Point {
  name: string;
  lat: number;
  lon: number;
}

const POINTS: Point[] = [
  { name: "Patras", lat: 38.24, lon: 21.73 },
  { name: "London", lat: 51.5, lon: -0.12 },
  { name: "New York", lat: 40.71, lon: -74.0 },
  { name: "Dubai", lat: 25.2, lon: 55.27 },
  { name: "Tokyo", lat: 35.68, lon: 139.69 },
  { name: "Sydney", lat: -33.86, lon: 151.21 },
  { name: "São Paulo", lat: -23.55, lon: -46.63 },
  { name: "Berlin", lat: 52.52, lon: 13.4 },
  { name: "Cape Town", lat: -33.92, lon: 18.42 },
  { name: "Singapore", lat: 1.35, lon: 103.82 },
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
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

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Inner translucent sphere
    const sphereGeo = new THREE.SphereGeometry(RADIUS * 0.985, 64, 64);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x0a1428,
      transparent: true,
      opacity: 0.55,
    });
    globeGroup.add(new THREE.Mesh(sphereGeo, sphereMat));

    // Dotted surface (fibonacci sphere)
    const DOT_COUNT = 2000;
    const dotPositions = new Float32Array(DOT_COUNT * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < DOT_COUNT; i++) {
      const y = 1 - (i / (DOT_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      dotPositions[i * 3] = Math.cos(t) * r * RADIUS;
      dotPositions[i * 3 + 1] = y * RADIUS;
      dotPositions[i * 3 + 2] = Math.sin(t) * r * RADIUS;
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0x4ea8ff,
      size: 0.022,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    globeGroup.add(new THREE.Points(dotGeo, dotMat));

    // Atmosphere glow
    const atmoGeo = new THREE.SphereGeometry(RADIUS * 1.15, 48, 48);
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
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.65, 1.0, 1.0) * intensity;
        }
      `,
    });
    globeGroup.add(new THREE.Mesh(atmoGeo, atmoMat));

    // City markers
    POINTS.forEach((p) => {
      const pos = latLonToVec3(p.lat, p.lon, RADIUS * 1.005);
      const markerGeo = new THREE.SphereGeometry(0.025, 12, 12);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0x60d4ff });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      globeGroup.add(marker);

      // Halo
      const haloGeo = new THREE.RingGeometry(0.04, 0.06, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x60d4ff,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos);
      halo.lookAt(0, 0, 0);
      globeGroup.add(halo);
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

    const buildArc = (a: Point, b: Point): Arc => {
      const start = latLonToVec3(a.lat, a.lon);
      const end = latLonToVec3(b.lat, b.lon);
      const mid = start.clone().add(end).multiplyScalar(0.5);
      const dist = start.distanceTo(end);
      const altitude = RADIUS + dist * 0.5;
      mid.normalize().multiplyScalar(altitude);
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const points = curve.getPoints(60);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: 0x4ea8ff,
        transparent: true,
        opacity: 0.0,
      });
      const line = new THREE.Line(geo, mat);
      globeGroup.add(line);

      const headGeo = new THREE.SphereGeometry(0.04, 12, 12);
      const headMat = new THREE.MeshBasicMaterial({ color: 0x9be0ff });
      const head = new THREE.Mesh(headGeo, headMat);
      head.visible = false;
      globeGroup.add(head);

      return { line, mat, curve, progress: -1, speed: 0.004 + Math.random() * 0.004, head, points };
    };

    for (let i = 0; i < 6; i++) {
      const a = POINTS[Math.floor(Math.random() * POINTS.length)];
      let b = POINTS[Math.floor(Math.random() * POINTS.length)];
      while (b === a) b = POINTS[Math.floor(Math.random() * POINTS.length)];
      arcs.push(buildArc(a, b));
    }

    let arcCounter = 0;
    const spawnArc = () => {
      const a = POINTS[Math.floor(Math.random() * POINTS.length)];
      let b = POINTS[Math.floor(Math.random() * POINTS.length)];
      while (b === a) b = POINTS[Math.floor(Math.random() * POINTS.length)];
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

    // Interaction (drag to rotate)
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let rotVelX = 0.0015;
    let rotVelY = 0;
    const onDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => (isDragging = false);
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      rotVelY = dx * 0.005;
      rotVelX = dy * 0.005;
      globeGroup.rotation.y += rotVelY;
      globeGroup.rotation.x += rotVelX;
      rotVelY = 0.0015;
      rotVelX = 0;
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);

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
        globeGroup.rotation.y += rotVelX === 0 ? 0.0015 : rotVelY;
      }

      arcs.forEach((arc) => {
        if (arc.progress < 0) return;
        arc.progress += arc.speed;
        const draw = Math.min(arc.progress, 1);
        const count = Math.floor(arc.points.length * draw);
        if (count >= 2) {
          const slice = arc.points.slice(0, count);
          arc.line.geometry.dispose();
          arc.line.geometry = new THREE.BufferGeometry().setFromPoints(slice);
          arc.mat.opacity = 0.9;
          const headPos = arc.curve.getPoint(draw);
          arc.head.position.copy(headPos);
          arc.head.visible = true;
        }
        if (arc.progress > 1.6) {
          arc.mat.opacity = Math.max(0, arc.mat.opacity - 0.03);
          arc.head.visible = false;
        }
      });

      if (time - lastSpawn > 700) {
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
      window.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} />;
};

export default Globe3D;
