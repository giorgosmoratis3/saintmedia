import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Country {
  name: string;
  lat: number;
  lon: number;
}

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

// Build a soft circular sprite texture for the arc head glow
const buildGlowSprite = () => {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(180,230,255,1)");
  g.addColorStop(0.25, "rgba(120,200,255,0.85)");
  g.addColorStop(0.55, "rgba(60,140,255,0.35)");
  g.addColorStop(1, "rgba(0,80,200,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
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
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
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
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.cursor = "grab";

    // Lights — sun + cool fill + warm rim for cinematic earth
    scene.add(new THREE.AmbientLight(0xffffff, 0.28));
    const sun = new THREE.DirectionalLight(0xfff1d6, 1.8);
    sun.position.set(5, 2.5, 4);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x6aa8ff, 0.55);
    fill.position.set(-4, -1, -3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x99ddff, 0.35);
    rim.position.set(-2, 4, -5);
    scene.add(rim);

    const globeGroup = new THREE.Group();
    // Horizon framing: push globe down so only top arc is visible
    globeGroup.position.y = -2.0;
    globeGroup.scale.setScalar(1.55);
    // Start centered on Europe
    globeGroup.rotation.y = 1.83;
    globeGroup.rotation.x = -0.35;
    scene.add(globeGroup);


    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    // Realistic earth with day map + bump + specular
    const sphereGeo = new THREE.SphereGeometry(RADIUS, 128, 128);
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x223044,
      shininess: 28,
      specular: new THREE.Color(0x1a3a66),
    });
    const earth = new THREE.Mesh(sphereGeo, earthMat);
    globeGroup.add(earth);

    loader.load(
      "https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg",
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        earthMat.map = tex;
        earthMat.color.set(0xffffff);
        earthMat.needsUpdate = true;
      }
    );
    loader.load(
      "https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png",
      (tex) => {
        earthMat.bumpMap = tex;
        earthMat.bumpScale = 0.06;
        earthMat.needsUpdate = true;
      }
    );
    loader.load(
      "https://unpkg.com/three-globe@2.31.1/example/img/earth-water.png",
      (tex) => {
        earthMat.specularMap = tex;
        earthMat.needsUpdate = true;
      }
    );

    // Clouds layer
    const cloudGeo = new THREE.SphereGeometry(RADIUS * 1.014, 96, 96);
    const cloudMat = new THREE.MeshPhongMaterial({
      transparent: true,
      opacity: 0.42,
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

    // Inner blue haze (just inside surface — adds depth on terminator)
    const innerHazeGeo = new THREE.SphereGeometry(RADIUS * 1.03, 64, 64);
    const innerHazeMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
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
          float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
          gl_FragColor = vec4(0.35, 0.7, 1.0, rim * 0.45);
        }
      `,
    });
    globeGroup.add(new THREE.Mesh(innerHazeGeo, innerHazeMat));

    // Outer atmosphere glow
    const atmoGeo = new THREE.SphereGeometry(RADIUS * 1.22, 96, 96);
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
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
          float intensity = pow(0.74 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
          gl_FragColor = vec4(0.35, 0.7, 1.0, 1.0) * intensity;
        }
      `,
    });
    scene.add(new THREE.Mesh(atmoGeo, atmoMat));

    const glowTex = buildGlowSprite();

    // Country markers
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
        new THREE.MeshBasicMaterial({ color: 0x9be4ff })
      );
      pin.position.copy(pos);
      globeGroup.add(pin);

      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.038, 0.06, 32),
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

    // ============ Arcs (thick gradient tubes with progressive draw) ============
    interface Arc {
      tube: THREE.Mesh;
      mat: THREE.ShaderMaterial;
      curve: THREE.CatmullRomCurve3;
      progress: number;
      speed: number;
      head: THREE.Sprite;
      endHalo: THREE.Mesh;
      endHaloMat: THREE.MeshBasicMaterial;
      endPos: THREE.Vector3;
    }
    const arcs: Arc[] = [];

    const arcVertex = `
      varying float vU;
      void main() {
        vU = uv.x;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const arcFragment = `
      varying float vU;
      uniform float uProgress;
      uniform vec3  uColorA;
      uniform vec3  uColorB;
      void main() {
        // Only show the part below progress
        if (vU > uProgress) discard;
        // Gradient along arc + brighter near the head
        vec3 col = mix(uColorA, uColorB, vU);
        float head = smoothstep(uProgress - 0.06, uProgress, vU);
        col += head * vec3(0.5, 0.7, 1.0);
        float alpha = 0.85;
        // soft fade at the tail when arc finishes
        float tailFade = smoothstep(1.0, 1.4, uProgress);
        alpha *= (1.0 - tailFade);
        gl_FragColor = vec4(col, alpha);
      }
    `;

    const buildArc = (a: Country, b: Country): Arc => {
      const start = latLonToVec3(a.lat, a.lon);
      const end = latLonToVec3(b.lat, b.lon);
      const mid = start.clone().add(end).multiplyScalar(0.5);
      const dist = start.distanceTo(end);
      const altitude = RADIUS + dist * 0.55;
      mid.normalize().multiplyScalar(altitude);
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);

      const tubeGeo = new THREE.TubeGeometry(curve, 80, 0.012, 8, false);
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uProgress: { value: 0 },
          uColorA: { value: new THREE.Color(0x4ea8ff) },
          uColorB: { value: new THREE.Color(0xb8e7ff) },
        },
        vertexShader: arcVertex,
        fragmentShader: arcFragment,
      });
      const tube = new THREE.Mesh(tubeGeo, mat);
      globeGroup.add(tube);

      // Glow sprite head
      const headMat = new THREE.SpriteMaterial({
        map: glowTex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xffffff,
      });
      const head = new THREE.Sprite(headMat);
      head.scale.set(0.22, 0.22, 1);
      head.visible = false;
      globeGroup.add(head);

      // Pulse ring at the destination
      const endHaloMat = new THREE.MeshBasicMaterial({
        color: 0x9be4ff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const endHalo = new THREE.Mesh(new THREE.RingGeometry(0.04, 0.07, 32), endHaloMat);
      endHalo.position.copy(end.clone().multiplyScalar(1.005));
      endHalo.lookAt(0, 0, 0);
      globeGroup.add(endHalo);

      return {
        tube,
        mat,
        curve,
        progress: 0,
        speed: 0.005 + Math.random() * 0.004,
        head,
        endHalo,
        endHaloMat,
        endPos: end.clone(),
      };
    };

    for (let i = 0; i < 7; i++) {
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
      globeGroup.remove(arc.tube);
      globeGroup.remove(arc.head);
      globeGroup.remove(arc.endHalo);
      arc.tube.geometry.dispose();
      arc.endHalo.geometry.dispose();
      const fresh = buildArc(a, b);
      Object.assign(arc, fresh);
    };

    // Interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let rotOffsetX = 0;

    const onDown = (e: PointerEvent) => {
      isDragging = true;
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
          (m.pin.material as THREE.MeshBasicMaterial).color.set(0x9be4ff);
          m.pin.scale.setScalar(1);
        });
        return;
      }
      const local = globeGroup.worldToLocal(hit.point.clone());
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
        (m.pin.material as THREE.MeshBasicMaterial).color.set(isBest ? 0xffffff : 0x9be4ff);
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
      if (!isDragging) globeGroup.rotation.y += 0.0015;
      clouds.rotation.y += 0.0006;

      arcs.forEach((arc) => {
        arc.progress += arc.speed;
        const draw = Math.min(arc.progress, 1);
        arc.mat.uniforms.uProgress.value = arc.progress;

        if (draw < 1) {
          const headPos = arc.curve.getPoint(draw);
          arc.head.position.copy(headPos);
          arc.head.visible = true;
          const pulse = 0.18 + Math.sin(time * 0.01) * 0.04;
          arc.head.scale.set(pulse, pulse, 1);
        } else {
          arc.head.visible = false;
          // pulse the destination halo briefly after landing
          const since = arc.progress - 1;
          const pulse = Math.max(0, 1 - since / 0.8);
          arc.endHaloMat.opacity = pulse * 0.9;
          arc.endHalo.scale.setScalar(1 + (1 - pulse) * 2);
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
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerleave", onLeave);
      glowTex.dispose();
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
