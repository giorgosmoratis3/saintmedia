import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ThreeGlobe from "three-globe";

interface CountryFeature {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

interface ArcDatum {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
}

const CITIES = [
  { name: "Patras", lat: 38.24, lng: 21.73 },
  { name: "London", lat: 51.5, lng: -0.12 },
  { name: "New York", lat: 40.71, lng: -74.0 },
  { name: "Dubai", lat: 25.2, lng: 55.27 },
  { name: "Tokyo", lat: 35.68, lng: 139.69 },
  { name: "Sydney", lat: -33.86, lng: 151.21 },
  { name: "São Paulo", lat: -23.55, lng: -46.63 },
  { name: "Berlin", lat: 52.52, lng: 13.4 },
  { name: "Cape Town", lat: -33.92, lng: 18.42 },
  { name: "Singapore", lat: 1.35, lng: 103.82 },
  { name: "Mumbai", lat: 19.08, lng: 72.88 },
  { name: "Toronto", lat: 43.65, lng: -79.38 },
];

// Stable per-country color (hash → HSL)
const colorForCountry = (name: string, alpha = 0.55) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return `hsla(${hue}, 85%, 60%, ${alpha})`;
};

// Point-in-polygon (ray casting) in lon/lat space
const pointInRing = (lon: number, lat: number, ring: number[][]) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0],
      yi = ring[i][1];
    const xj = ring[j][0],
      yj = ring[j][1];
    const intersect =
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

const pointInFeature = (lon: number, lat: number, feat: CountryFeature) => {
  const g = feat.geometry;
  const polys: number[][][][] =
    g.type === "Polygon" ? [g.coordinates as number[][][]] : (g.coordinates as number[][][][]);
  for (const poly of polys) {
    if (poly.length === 0) continue;
    if (pointInRing(lon, lat, poly[0])) {
      // not bothering with holes — fine for our usage
      return true;
    }
  }
  return false;
};

const featName = (f: CountryFeature) =>
  (f.properties.ADMIN as string) ||
  (f.properties.NAME as string) ||
  (f.properties.name as string) ||
  "Unknown";

const Globe3D = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 2000);
    camera.position.set(0, 0, 380);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.cursor = "grab";

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const sun = new THREE.DirectionalLight(0xfff1d6, 1.4);
    sun.position.set(1, 0.5, 1);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x6aa8ff, 0.35);
    fill.position.set(-1, -0.3, -1);
    scene.add(fill);

    // ============ Globe ============
    const globe = new ThreeGlobe({ animateIn: true })
      .globeImageUrl("https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg")
      .bumpImageUrl("https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png")
      .showAtmosphere(true)
      .atmosphereColor("#5aa9ff")
      .atmosphereAltitude(0.18);

    // Tone earth material
    const globeMat = globe.globeMaterial() as THREE.MeshPhongMaterial;
    globeMat.shininess = 18;
    globeMat.specular = new THREE.Color(0x1e3a66);
    globeMat.bumpScale = 8;

    // Horizon framing
    globe.position.y = -130;
    globe.scale.setScalar(1.35);
    globe.rotation.y = 1.83; // centered on Europe
    globe.rotation.x = -0.25;
    scene.add(globe);

    // ============ Cities (pulse rings) ============
    globe
      .ringsData(CITIES.map((c) => ({ lat: c.lat, lng: c.lng })))
      .ringColor(() => (t: number) => `rgba(150, 220, 255, ${1 - t})`)
      .ringMaxRadius(3)
      .ringPropagationSpeed(2.5)
      .ringRepeatPeriod(1400);

    globe
      .pointsData(CITIES.map((c) => ({ lat: c.lat, lng: c.lng, size: 0.35 })))
      .pointAltitude(0.005)
      .pointColor(() => "#bfeaff")
      .pointRadius("size");

    // ============ Animated arcs ============
    const makeArc = (): ArcDatum => {
      const a = CITIES[Math.floor(Math.random() * CITIES.length)];
      let b = CITIES[Math.floor(Math.random() * CITIES.length)];
      while (b === a) b = CITIES[Math.floor(Math.random() * CITIES.length)];
      return {
        startLat: a.lat,
        startLng: a.lng,
        endLat: b.lat,
        endLng: b.lng,
        color: ["rgba(80, 170, 255, 0)", "rgba(190, 235, 255, 1)"],
      };
    };
    let arcs: ArcDatum[] = Array.from({ length: 8 }, makeArc);
    globe
      .arcsData(arcs)
      .arcColor("color")
      .arcStroke(0.45)
      .arcAltitudeAutoScale(0.45)
      .arcDashLength(0.55)
      .arcDashGap(2)
      .arcDashInitialGap(() => Math.random() * 5)
      .arcDashAnimateTime(2400);

    const arcInterval = setInterval(() => {
      // Recycle a couple arcs
      arcs = arcs.map((a, i) => (i % 3 === 0 ? makeArc() : a));
      globe.arcsData(arcs);
    }, 2200);

    // ============ Country polygons ============
    let features: CountryFeature[] = [];
    let selected: CountryFeature | null = null;

    const renderPolygons = () => {
      globe
        .polygonsData(features as unknown as object[])
        .polygonCapColor((d: object) => {
          const f = d as CountryFeature;
          if (f === selected) return colorForCountry(featName(f), 0.7);
          return "rgba(255, 255, 255, 0)";
        })
        .polygonSideColor((d: object) => {
          const f = d as CountryFeature;
          if (f === selected) return colorForCountry(featName(f), 0.35);
          return "rgba(0, 0, 0, 0)";
        })
        .polygonStrokeColor((d: object) => {
          const f = d as CountryFeature;
          if (f === selected) return "rgba(255, 255, 255, 0.9)";
          return "rgba(140, 200, 255, 0.18)";
        })
        .polygonAltitude((d: object) => (d === selected ? 0.02 : 0.005))
        .polygonsTransitionDuration(450);
    };

    fetch(
      "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
    )
      .then((r) => r.json())
      .then((data) => {
        features = data.features as CountryFeature[];
        renderPolygons();
      })
      .catch(() => {});

    // ============ Interaction ============
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isDragging = false;
    let didDrag = false;
    let lastX = 0;
    let lastY = 0;
    let rotOffsetX = globe.rotation.x;

    const getLatLngFromEvent = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      // three-globe radius is 100 by default
      const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 100);
      const localRay = raycaster.ray.clone();
      // Convert world ray to globe-local space
      const inv = new THREE.Matrix4().copy(globe.matrixWorld).invert();
      localRay.applyMatrix4(inv);
      const hit = new THREE.Vector3();
      if (!localRay.intersectSphere(sphere, hit)) return null;
      // Convert local hit to lat/lng (three-globe orientation)
      const p = hit.clone().normalize();
      const lat = 90 - (Math.acos(p.y) * 180) / Math.PI;
      const lng = ((Math.atan2(p.z, -p.x) * 180) / Math.PI) - 0;
      return { lat, lng, screenX: clientX - rect.left, screenY: clientY - rect.top };
    };

    const findCountry = (lat: number, lng: number) =>
      features.find((f) => pointInFeature(lng, lat, f)) || null;

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
    const onMove = (e: PointerEvent) => {
      if (isDragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        if (Math.abs(dx) + Math.abs(dy) > 3) didDrag = true;
        lastX = e.clientX;
        lastY = e.clientY;
        globe.rotation.y += dx * 0.005;
        rotOffsetX = THREE.MathUtils.clamp(rotOffsetX + dy * 0.005, -1.0, 0.6);
        globe.rotation.x = rotOffsetX;
        setTooltip(null);
        return;
      }
      const ll = getLatLngFromEvent(e.clientX, e.clientY);
      if (!ll) {
        setTooltip(null);
        return;
      }
      const f = findCountry(ll.lat, ll.lng);
      if (f) {
        setTooltip({ x: ll.screenX, y: ll.screenY, name: featName(f) });
      } else {
        setTooltip(null);
      }
    };
    const onClick = (e: PointerEvent) => {
      if (didDrag) return;
      const ll = getLatLngFromEvent(e.clientX, e.clientY);
      if (!ll) return;
      const f = findCountry(ll.lat, ll.lng);
      selected = selected === f ? null : f;
      renderPolygons();
    };
    const onLeave = () => setTooltip(null);

    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerleave", onLeave);
    renderer.domElement.addEventListener("click", onClick);

    const onResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let rafId: number;
    const animate = () => {
      const dt = clock.getDelta();
      if (!isDragging) globe.rotation.y += 0.04 * dt;
      // three-globe needs tick for arcs/rings dash animation
      (globe as unknown as { tickFrame?: () => void }).tickFrame?.();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(arcInterval);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerleave", onLeave);
      renderer.domElement.removeEventListener("click", onClick);
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
