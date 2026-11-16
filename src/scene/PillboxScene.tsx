import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { DAYS, SLOTS, slotXZ, spread } from "../lib/pillbox";

// A seven-day pillbox seen from above. Solid pink tablets (1 mg, the US warfarin colour) are the predicted weekly dose.
// Faint blue tablets are the extra amount up to the top of the 90% range. Tablets drop in when the patient changes.
const PINK = "#f598b0";
const SCORE = "#c4607c";
const RING = "#f1e6ec";
const TRAY = "#3a2e35";
const FLOOR = "#1f171b";
const LEDGE = "#3a2e35";
const TD = 0.4; // tablet diameter
const TH = 0.1; // tablet thickness
const PITCH = 1.1;
const INNER_W = 1.0;
const INNER_D = 1.9;
const FLOOR_H = 0.1;
const WALL_H = 0.26;
const LEDGE_D = 0.55;
const COUNT = 7 * SLOTS;

function roundedRect(w: number, d: number, r: number, hole?: [number, number, number]) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -d / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r);
  s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d);
  s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  if (hole) {
    const [hw, hd, hr] = hole;
    const p = new THREE.Path();
    const hx = -hw / 2, hy = -hd / 2;
    p.moveTo(hx + hr, hy);
    p.lineTo(hx + hw - hr, hy);
    p.quadraticCurveTo(hx + hw, hy, hx + hw, hy + hr);
    p.lineTo(hx + hw, hy + hd - hr);
    p.quadraticCurveTo(hx + hw, hy + hd, hx + hw - hr, hy + hd);
    p.lineTo(hx + hr, hy + hd);
    p.quadraticCurveTo(hx, hy + hd, hx, hy + hd - hr);
    p.lineTo(hx, hy + hr);
    p.quadraticCurveTo(hx, hy, hx + hr, hy);
    s.holes.push(p);
  }
  return s;
}

function extrude(shape: THREE.Shape, height: number) {
  const bevel = 0.03;
  const g = new THREE.ExtrudeGeometry(shape, { depth: height - bevel * 2, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 3, curveSegments: 8 });
  g.rotateX(-Math.PI / 2);
  g.translate(0, bevel, 0);
  return g;
}

// A tablet with softly rounded edges, turned on a lathe.
function tabletGeometry() {
  const r = TD / 2, h = TH / 2, b = 0.03;
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, -h), new THREE.Vector2(r - b, -h)];
  for (let i = 1; i <= 4; i++) {
    const a = (i / 4) * (Math.PI / 2);
    pts.push(new THREE.Vector2(r - b + Math.sin(a) * b, -h + b - Math.cos(a) * b));
  }
  for (let i = 1; i <= 4; i++) {
    const a = (i / 4) * (Math.PI / 2);
    pts.push(new THREE.Vector2(r - b + Math.cos(a) * b, h - b + Math.sin(a) * b));
  }
  pts.push(new THREE.Vector2(r - b, h), new THREE.Vector2(0, h));
  return new THREE.LatheGeometry(pts, 40);
}

// Day letters, printed on the ledge in front of the box.
function dayLetters(width: number) {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 104;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#e0d0d8";
  ctx.font = "700 72px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  DAYS.forEach((d, i) => ctx.fillText(d, ((i * PITCH + INNER_W / 2 + 0.15) / width) * 2048, 56));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function Studio() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const rt = pmrem.fromScene(room, 0.04);
    scene.environment = rt.texture;
    scene.environmentIntensity = 0.75;
    return () => {
      scene.environment = null;
      rt.dispose();
      pmrem.dispose();
      room.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Rig() {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const cam = camera as THREE.PerspectiveCamera;
    const dist = Math.max(7, 20.4 / aspect);
    const elev = (47 * Math.PI) / 180;
    cam.position.set(0, Math.sin(elev) * dist, Math.cos(elev) * dist + 0.35);
    cam.lookAt(0, 0.15, 0.3);
    cam.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);
  return null;
}

function Pillbox({ dose, high, onReady }: { dose: number; high: number; onReady?: () => void }) {
  const solid = useRef<THREE.InstancedMesh>(null);
  const score = useRef<THREE.InstancedMesh>(null);
  const ghost = useRef<THREE.InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);
  const rig = useRef<THREE.Group>(null);
  const look = useRef({ x: 0, y: 0, rx: 0, ry: 0 });
  const cur = useRef(new Float32Array(COUNT * 2));
  const anim = useRef({ from: new Float32Array(COUNT * 2), to: new Float32Array(COUNT * 2), t0: new Float32Array(COUNT * 2), dur: new Float32Array(COUNT * 2).fill(1) });
  const told = useRef(false);

  const geo = useMemo(() => tabletGeometry(), []);
  const ringGeo = useMemo(() => {
    const g = new THREE.TorusGeometry(TD / 2 - 0.015, 0.02, 8, 40);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);
  const scoreGeo = useMemo(() => new THREE.BoxGeometry(TD * 0.78, 0.006, 0.022), []);
  const tray = useMemo(() => {
    const w = 7 * INNER_W + 6 * 0.1 + 0.3;
    const d = INNER_D + 0.3;
    return {
      w,
      d,
      wall: extrude(roundedRect(w, d, 0.22, [w - 0.3, INNER_D, 0.06]), WALL_H),
      floor: extrude(roundedRect(w, d, 0.22), FLOOR_H),
      ledge: extrude(roundedRect(w, LEDGE_D, 0.16), 0.14),
    };
  }, []);
  const letters = useMemo(() => dayLetters(tray.w), [tray.w]);
  const jitter = useMemo(
    () => Array.from({ length: COUNT }, (_, i) => ({ r: Math.sin(i * 12.9898) * 3.1, x: Math.sin(i * 7.13) * 0.025, z: Math.cos(i * 5.71) * 0.025 })),
    [],
  );
  useEffect(
    () => () => {
      geo.dispose();
      scoreGeo.dispose();
      ringGeo.dispose();
      tray.wall.dispose();
      tray.floor.dispose();
      tray.ledge.dispose();
      letters.dispose();
    },
    [geo, scoreGeo, ringGeo, tray, letters],
  );

  const sCounts = spread(dose);
  const hCounts = spread(Math.max(high, dose));

  // Targets: 1 where a tablet should be shown, 0 elsewhere. A change restarts the staggered drop-in.
  const target = useMemo(() => {
    const t = new Float32Array(COUNT * 2);
    for (let d = 0; d < 7; d++)
      for (let k = 0; k < SLOTS; k++) {
        const i = d * SLOTS + k;
        t[i] = k < sCounts[d] ? 1 : 0;
        t[COUNT + i] = k >= sCounts[d] && k < hCounts[d] ? 1 : 0;
      }
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dose, high]);
  // On a change, tablets that stay do not move. Extra ones lift out first and quickly, then new ones drop in
  // one by one across the week.
  useEffect(() => {
    const A = anim.current;
    const now = performance.now() / 1000;
    let rem = 0, add = 0;
    for (let i = 0; i < COUNT * 2; i++) {
      if (target[i] === A.to[i]) continue;
      if (target[i] < A.to[i]) rem++;
      else add++;
    }
    const step = Math.min(0.02, 0.6 / Math.max(add, 1));
    let r = 0, a = 0;
    for (let i = 0; i < COUNT * 2; i++) {
      if (target[i] === A.to[i]) continue;
      A.from[i] = cur.current[i];
      if (target[i] < A.to[i]) {
        A.t0[i] = now + Math.min(r++ * 0.006, 0.12);
        A.dur[i] = 0.2;
      } else {
        A.t0[i] = now + (rem > 0 ? 0.24 : 0) + a++ * step;
        A.dur[i] = 0.42;
      }
      A.to[i] = target[i];
    }
    invalidate();
  }, [target, invalidate]);

  // The box leans a little toward the pointer, and eases back when the pointer leaves.
  useEffect(() => {
    const el = gl.domElement;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      look.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      look.current.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      invalidate();
    };
    const leave = () => {
      look.current.x = 0;
      look.current.y = 0;
      invalidate();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [gl, invalidate]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lift = useMemo(() => new THREE.Matrix4().makeTranslation(0, TH / 2 + 0.003, 0), []);
  const m2 = useMemo(() => new THREE.Matrix4(), []);

  useFrame((state, delta) => {
    const A = anim.current;
    const now = performance.now() / 1000;
    let moving = false;
    const L = look.current;
    const lk = 1 - Math.exp(-delta * 6);
    L.rx += (L.x - L.rx) * lk;
    L.ry += (L.y - L.ry) * lk;
    if (Math.abs(L.x - L.rx) > 0.001 || Math.abs(L.y - L.ry) > 0.001) moving = true;
    if (rig.current) rig.current.rotation.set(L.ry * 0.04, -0.16 + L.rx * 0.1, 0);
    for (let layer = 0; layer < 2; layer++) {
      const mesh = layer === 0 ? solid.current : ghost.current;
      if (!mesh) continue;
      for (let d = 0; d < 7; d++)
        for (let s = 0; s < SLOTS; s++) {
          const i = d * SLOTS + s;
          const idx = layer * COUNT + i;
          const p = (now - A.t0[idx]) / A.dur[idx];
          let v = A.to[idx];
          if (p <= 0) v = A.from[idx];
          else if (p < 1) {
            const e = A.to[idx] > A.from[idx] ? 1 - (1 - p) ** 3 : p ** 3;
            v = A.from[idx] + (A.to[idx] - A.from[idx]) * e;
          }
          if (p < 1) moving = true;
          cur.current[idx] = v;
          const [sx, sz] = slotXZ(s);
          const j = jitter[i];
          dummy.position.set(-3.3 + d * PITCH + sx * (TD + 0.06) + j.x, FLOOR_H + (layer === 0 ? TH / 2 : 0.025) + (1 - v) * 0.5, sz * (TD + 0.02) + j.z);
          dummy.rotation.set(0, j.r + (1 - v) * 1.6, 0);
          dummy.scale.setScalar(Math.max(v, 0.0001));
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
          if (layer === 0 && score.current) {
            m2.multiplyMatrices(dummy.matrix, lift);
            score.current.setMatrixAt(i, m2);
          }
        }
      mesh.instanceMatrix.needsUpdate = true;
    }
    if (score.current) score.current.instanceMatrix.needsUpdate = true;
    if (moving) state.invalidate();
    if (!told.current) {
      told.current = true;
      onReady?.();
    }
  });

  return (
    <group ref={rig} rotation={[0, -0.16, 0]}>
      <mesh geometry={tray.floor} castShadow receiveShadow>
        <meshStandardMaterial color={FLOOR} roughness={0.8} />
      </mesh>
      <mesh geometry={tray.wall} castShadow receiveShadow>
        <meshStandardMaterial color={TRAY} roughness={0.42} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-2.75 + i * PITCH, FLOOR_H + 0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.24, INNER_D]} />
          <meshStandardMaterial color={TRAY} roughness={0.5} />
        </mesh>
      ))}
      <mesh geometry={tray.ledge} position={[0, 0, tray.d / 2 + LEDGE_D / 2 - 0.18]} receiveShadow>
        <meshStandardMaterial color={LEDGE} roughness={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.146, tray.d / 2 + LEDGE_D / 2 - 0.16]}>
        <planeGeometry args={[tray.w, tray.w * (104 / 2048)]} />
        <meshBasicMaterial map={letters} transparent toneMapped={false} />
      </mesh>

      <instancedMesh ref={solid} args={[geo, undefined, COUNT]} castShadow receiveShadow frustumCulled={false}>
        <meshStandardMaterial color={PINK} roughness={0.55} />
      </instancedMesh>
      <instancedMesh ref={score} args={[scoreGeo, undefined, COUNT]} frustumCulled={false}>
        <meshStandardMaterial color={SCORE} roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={ghost} args={[ringGeo, undefined, COUNT]} frustumCulled={false}>
        <meshBasicMaterial color={RING} />
      </instancedMesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <planeGeometry args={[30, 18]} />
        <shadowMaterial opacity={0.38} />
      </mesh>
    </group>
  );
}

export default function PillboxScene({ dose, high, onReady }: { dose: number; high: number; onReady?: () => void }) {
  return (
    <Canvas
      frameloop="demand"
      flat
      shadows="percentage"
      dpr={[1, 1.75]}
      camera={{ fov: 26, near: 0.5, far: 80 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Studio />
      <Rig />
      <hemisphereLight args={["#ffffff", "#a39aa0", 0.35]} />
      <directionalLight
        position={[-4, 10, 4.5]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={4}
        shadow-bias={-0.0004}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-camera-near={1}
        shadow-camera-far={30}
      />
      <Pillbox dose={dose} high={high} onReady={onReady} />
    </Canvas>
  );
}
