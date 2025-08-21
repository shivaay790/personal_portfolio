// Fairy functionality completely commented out
type FairySequence3DProps = {
  onComplete?: () => void;
  onFallback?: () => void;
  introLines?: string[];
  finalLine?: string;
};

type FairySpriteProps = {
  onFirstFrame: () => void;
  pendingFlyToRef: React.MutableRefObject<string | null>;
  legResolveRef: React.MutableRefObject<null | (() => void)>;
  onArrive: (selector: string | null) => void;
  cancelRef: React.MutableRefObject<boolean>;
};

function FairySprite({ onFirstFrame, pendingFlyToRef, legResolveRef, onArrive, cancelRef }: FairySpriteProps) {
  const groupRef = useRef<Group>(null);
  const seenRef = useRef(false);
  const [fairy, setFairy] = useState<Group | null>(null);
  const headAnchorRef = useRef<Object3D | null>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const pathRef = useRef<CatmullRomCurve3 | null>(null);
  const pathStartRef = useRef<number | null>(null);
  const pathDurationRef = useRef<number>(3.5); // seconds
  const pathEndedRef = useRef<boolean>(false);
  const currentTargetSelectorRef = useRef<string | null>(null);

  // simple particle trail
  const pointsRef = useRef<Points | null>(null);
  const trailPositionsRef = useRef<number[]>([]);
  const maxTrailPoints = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ? 60 : 140;

  // subtle scroll drift so movement feels separate from page scroll
  const lastScrollYRef = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  const scrollVelRef = useRef<number>(0);
  // mouse parallax
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const parallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      scrollVelRef.current += (y - lastScrollYRef.current);
      lastScrollYRef.current = y;
    };
    const onPointerMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      mouseRef.current.x = Math.max(0, Math.min(1, e.clientX / w));
      mouseRef.current.y = Math.max(0, Math.min(1, e.clientY / h));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // helpers for flight
  function easeInOutCubic(x: number) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function selectorToWorld(selector: string, camera: Camera, depth = 0.35) {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const x = (r.left + r.width / 2) / window.innerWidth * 2 - 1;
    const y = -((r.top + r.height / 2) / window.innerHeight) * 2 + 1;
    const ndc = new Vector3(x, y, depth * 2 - 1);
    ndc.unproject(camera);
    const dir = ndc.sub((camera as any).position).normalize();
    const distance = (((camera as any).far ?? 100) - ((camera as any).near ?? 0.1)) * depth;
    return (camera as any).position.clone().add(dir.multiplyScalar(distance));
  }

  useEffect(() => {
    const loader = new GLTFLoader();
    // Load GLB fairy model (put yours at /public/assets/fairy/fairy.glb)
    loader.load(
      fairyModelUrl,
      (gltf) => {
        const model = gltf.scene as Group;
        model.traverse((obj: any) => {
          if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = false;
          }
        });
        // Normalize model scale and center so it's visible near the origin
        const box = new Box3().setFromObject(model);
        const size = new Vector3();
        const center = new Vector3();
        box.getSize(size);
        box.getCenter(center);
        const targetHeight = 0.6; // world units
        const modelHeight = Math.max(size.y, 1e-3);
        const scale = targetHeight / modelHeight;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale)); // center to origin
        // Add a simple head anchor above model center
        const headAnchor = new Object3D();
        headAnchor.position.set(0, size.y * 0.55 * scale, 0);
        model.add(headAnchor);
        headAnchorRef.current = headAnchor;
        setFairy(model);
        if (gltf.animations && gltf.animations.length > 0) {
          mixerRef.current = new AnimationMixer(model);
          const action = mixerRef.current.clipAction(gltf.animations[0]);
          action.play();
        }
        // eslint-disable-next-line no-console
        console.log('[FAIRY] enter scene');
        // Define a short Catmull-Rom path in view space
        pathRef.current = new CatmullRomCurve3([
          new Vector3(-0.9, 0.5, 0),
          new Vector3(-0.3, 0.2, 0),
          new Vector3(0.15, 0.05, 0),
          new Vector3(0.0, -0.35, 0),
        ], false, 'catmullrom', 0.5);
        pathStartRef.current = performance.now() / 1000;
        pathEndedRef.current = false;
        // eslint-disable-next-line no-console
        console.log('[FAIRY] path start');
        // eslint-disable-next-line no-console
        console.log('[FAIRY] model loaded');
      },
      undefined,
      (err) => {
        // eslint-disable-next-line no-console
        console.warn('[FAIRY] failed to load GLB, using light fallback', err);
      }
    );
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    // handle cancel: clear any active path and reset
    if (cancelRef.current) {
      pathRef.current = null;
      pathStartRef.current = null;
      pathEndedRef.current = false;
      currentTargetSelectorRef.current = null;
      trailPositionsRef.current.length = 0;
      if (pointsRef.current) {
        const geom = pointsRef.current.geometry as BufferGeometry;
        geom.setAttribute('position', new Float32BufferAttribute(new Float32Array([]), 3));
        geom.attributes.position.needsUpdate = true;
      }
      cancelRef.current = false;
    }
    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(t * 0.8) * 0.9;
      groupRef.current.position.y = Math.cos(t * 0.7) * 0.6 + 0.2;
      // apply small scroll-driven drift, damping velocity
      if (scrollVelRef.current !== 0) {
        groupRef.current.position.y += Math.max(-0.3, Math.min(0.3, -scrollVelRef.current * 0.002));
        scrollVelRef.current *= 0.85;
        if (Math.abs(scrollVelRef.current) < 0.01) scrollVelRef.current = 0;
      }
      // mouse parallax towards cursor (2.5D feel)
      const targetPX = (mouseRef.current.x - 0.5) * 0.6; // left/right
      const targetPY = (0.5 - mouseRef.current.y) * 0.45; // up/down
      parallaxRef.current.x += (targetPX - parallaxRef.current.x) * 0.07;
      parallaxRef.current.y += (targetPY - parallaxRef.current.y) * 0.07;
      groupRef.current.position.x += parallaxRef.current.x;
      groupRef.current.position.y += parallaxRef.current.y;
      const s = 0.9 + Math.sin(t * 3.0) * 0.08;
      groupRef.current.scale.set(s, s, s);
    }
    if (mixerRef.current) mixerRef.current.update(delta);
    if (!seenRef.current) {
      seenRef.current = true;
      onFirstFrame();
    }

    // Move fairy along path
    if (fairy && pathRef.current && pathStartRef.current !== null) {
      const elapsed = (performance.now() / 1000) - pathStartRef.current;
      const t01 = Math.min(1, Math.max(0, elapsed / pathDurationRef.current));
      const eased = easeInOutCubic(t01);
      const pos = pathRef.current.getPoint(eased);
      fairy.position.lerp(pos, 0.9);
      // orient toward path tangent
      const tangent = pathRef.current.getTangent(eased).normalize();
      const targetQuat = new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), tangent);
      fairy.quaternion.slerp(targetQuat, Math.min(1, 8 * delta));
      // trail: push current position
      const tp = trailPositionsRef.current;
      tp.push(fairy.position.x, fairy.position.y, fairy.position.z);
      if (tp.length > maxTrailPoints * 3) tp.splice(0, 3);
      if (pointsRef.current) {
        const geom = pointsRef.current.geometry as BufferGeometry;
        geom.setAttribute('position', new Float32BufferAttribute(new Float32Array(tp), 3));
        geom.attributes.position.needsUpdate = true;
      }
      if (t01 >= 1 && !pathEndedRef.current) {
        pathEndedRef.current = true;
        // eslint-disable-next-line no-console
        console.log('[FAIRY] path end');
        onArrive(currentTargetSelectorRef.current);
        legResolveRef.current?.();
        legResolveRef.current = null;
        currentTargetSelectorRef.current = null;
      }
    }

    // If a flyTo is requested and no active path, build one
    if (fairy && !pathRef.current && pendingFlyToRef.current) {
      const worldTarget = selectorToWorld(pendingFlyToRef.current, state.camera, 0.35);
      if (worldTarget) {
        const p0 = fairy.position.clone();
        const mid = p0.clone().lerp(worldTarget, 0.5).add(new Vector3(0, 0.25, 0));
        const p3 = worldTarget.clone();
        pathRef.current = new CatmullRomCurve3([p0, mid, p3], false, 'catmullrom', 0.5);
        const distance = p0.distanceTo(p3);
        const BASE_FLIGHT_SPEED = 1.5;
        const TRAVEL_TIME_MIN = 0.6;
        const TRAVEL_TIME_MAX = 2.4;
        const tTravel = Math.max(TRAVEL_TIME_MIN, Math.min(TRAVEL_TIME_MAX, distance / BASE_FLIGHT_SPEED));
        pathDurationRef.current = tTravel;
        pathStartRef.current = performance.now() / 1000;
        pathEndedRef.current = false;
        currentTargetSelectorRef.current = pendingFlyToRef.current;
        // eslint-disable-next-line no-console
        console.log('[FAIRY] path start ->', pendingFlyToRef.current);
        // consume request
        pendingFlyToRef.current = null;
      } else {
        // eslint-disable-next-line no-console
        console.warn('[FAIRY] selector not found:', pendingFlyToRef.current);
        legResolveRef.current?.();
        legResolveRef.current = null;
        pendingFlyToRef.current = null;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {fairy ? (
        <primitive object={fairy} />
      ) : (
        // Fallback light so something is visible before/if model loads
        <pointLight position={[0, 0.4, 0.3]} intensity={0.9} color={'#ffd1f5'} distance={3} decay={2} />
      )}
      {/* particles trail */}
      <points ref={pointsRef as any}>
        <bufferGeometry />
        <pointsMaterial args={[{ size: 0.04, color: 0xffc0ff, transparent: true, opacity: 0.9 } as unknown as PointsMaterialParameters]} />
      </points>
    </group>
  );
}

export default function FairySequence3D({
  onComplete,
  onFallback,
  introLines = ['Psst... over here! ✨', 'Follow me to the projects!'],
  finalLine = 'Here we are — explore my work below!',
}: FairySequence3DProps) {
  // Fairy functionality commented out
  return null;
  const POP_IN_DURATION = 0.25;
  const GLANCE_DURATION = 0.8;
  const IDLE_BOB_AMPLITUDE = 0.06;
  const IDLE_BOB_PERIOD = 1.6;
  const BASE_FLIGHT_SPEED = 1.5; // units/sec
  const TRAVEL_TIME_MIN = 0.6;
  const TRAVEL_TIME_MAX = 2.4;
  const ROTATION_SLERP_MULTIPLIER = 8;
  const MAX_BODY_ROLL = 0.17; // ~10deg
  const JITTER_AMPLITUDE = 0.02;

  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState(introLines[0]);
  const firstFrameSeenRef = useRef(false);
  const fallbackTimerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pendingFlyToRef = useRef<string | null>(null);
  const legResolveRef = useRef<null | (() => void)>(null);
  const cancelRef = useRef<boolean>(false);
  const [carriedLabel, setCarriedLabel] = useState<string | null>(null);

  // simple narration map
  const speakFor = (selector: string | null) => {
    if (!selector) return;
    const map: Record<string, string> = {
      '#about': 'This is my journey — a brief look at how I got here.',
      '#playground': 'Here is my playground — experiments and fun stuff!',
      '#contact': 'Want to chat? Get in touch here!',
      '#hero': 'Welcome! Let me show you around.',
    };
    const msg = map[selector] ?? 'We arrived!';
    setBubbleText(msg);
    setShowBubble(true);
    window.setTimeout(() => setShowBubble(false), 1800);
  };
  const labelFor = (selector: string | null) => {
    if (!selector) return null;
    const names: Record<string, string> = {
      '#about': 'About',
      '#playground': 'Playground',
      '#contact': 'Contact',
      '#hero': 'Welcome',
    };
    return names[selector] ?? selector;
  };

  // Public API
  useEffect(() => {
    (window as any).FAIRY = (window as any).FAIRY || {};
    (window as any).FAIRY.flyTo = (selector: string) => {
      pendingFlyToRef.current = selector;
      setCarriedLabel(labelFor(selector));
    };
    (window as any).FAIRY.flySequence = async (selectors: string[]) => {
      for (const s of selectors) {
        pendingFlyToRef.current = s;
        setCarriedLabel(labelFor(s));
        // wait until current leg finishes
        // eslint-disable-next-line no-await-in-loop
        await new Promise<void>((resolve) => {
          legResolveRef.current = resolve;
        });
      }
      // eslint-disable-next-line no-console
      console.log('[FAIRY] sequence complete');
    };
    (window as any).FAIRY.cancel = () => {
      pendingFlyToRef.current = null;
      legResolveRef.current?.();
      legResolveRef.current = null;
      cancelRef.current = true;
      setCarriedLabel(null);
    };
    (window as any).FAIRY.say = (text: string, ms = 2200) => {
      setBubbleText(text);
      setShowBubble(true);
      window.setTimeout(() => setShowBubble(false), ms);
    };
  }, []);

  useEffect(() => {
    devLog('EASTER-EGG', '3D fairy start');
    const t1 = setTimeout(() => {
      setShowBubble(true);
      setBubbleText(introLines[0]);
    }, 300);
    const t2 = setTimeout(() => {
      setBubbleText(introLines[1] ?? introLines[0]);
    }, 1500);
    const t3 = setTimeout(() => {
      setShowBubble(false);
    }, 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [introLines]);

  useEffect(() => {
    fallbackTimerRef.current = window.setTimeout(() => {
      if (!firstFrameSeenRef.current) {
        devLog('EASTER-EGG', '3D fairy no frame within 900ms — fallback');
        onFallback?.();
      }
    }, 900);
    return () => {
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
    };
  }, [onFallback]);

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none">
      <Canvas
        gl={{ antialias: false, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3], fov: 50 }}
        onCreated={({ gl }) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (gl as any).outputColorSpace = SRGBColorSpace;
          // Improve PBR lighting compatibility
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (gl as any).physicallyCorrectLights = true;
          gl.shadowMap.enabled = true;
          // grab canvas
          canvasRef.current = gl.domElement as HTMLCanvasElement;
          const canvas = gl.getContext().canvas as HTMLCanvasElement | undefined;
          if (!canvas) return;
          const handler = (e: Event) => {
            e.preventDefault();
            devLog('EASTER-EGG', 'WebGL context lost — falling back to DOM');
            onFallback?.();
          };
          canvas.addEventListener('webglcontextlost', handler, { once: true });
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 5]} intensity={0.8} />
        <group>
          <FairySprite
            onFirstFrame={() => {
              firstFrameSeenRef.current = true;
              if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
            }}
            pendingFlyToRef={pendingFlyToRef}
            legResolveRef={legResolveRef}
            onArrive={(sel) => speakFor(sel)}
            cancelRef={cancelRef}
          />
          {showBubble && (
            <Html position={[0, 1.0, 0]} center style={{ pointerEvents: 'none' }}>
              <div className="px-3 py-2 rounded-xl bg-background/80 border border-border text-sm shadow-md max-w-[240px]">
                {bubbleText}
              </div>
            </Html>
          )}
          {carriedLabel && (
            <Html position={[0.2, 0.0, 0]} center style={{ pointerEvents: 'none' }}>
              <div className="px-2 py-1 rounded-lg bg-background/90 border border-border text-xs shadow-sm">
                {carriedLabel}
              </div>
            </Html>
          )}
        </group>
      </Canvas>
    </div>
  );
}
