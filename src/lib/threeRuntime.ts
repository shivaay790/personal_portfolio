import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  PerspectiveCamera,
  Clock,
  SRGBColorSpace,
} from 'three';

type RuntimeCamera = OrthographicCamera | PerspectiveCamera;

type ThreeRuntimeConfig = {
  el?: HTMLElement | null;
  canvas?: HTMLCanvasElement | null;
  width?: number;
  height?: number;
  resize?: boolean;
  antialias?: boolean;
  initCamera?: (r: ThreeRuntime) => void;
  initScene?: (r: ThreeRuntime) => void;
  beforeRender?: (r: ThreeRuntime & { wWidth: number }) => void;
  afterResize?: (r: { width: number; height: number; wWidth: number }) => void;
  onPointerMove?: (e: {
    nPosition: { x: number; y: number };
    delta: { x: number; y: number };
  }) => void;
  onPointerLeave?: () => void;
};

export type ThreeRuntime = {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: RuntimeCamera;
  clock: Clock;
  width: number;
  height: number;
};

export default function three(config: ThreeRuntimeConfig) {
  const el = config.el ?? document.body;
  const canvas = config.canvas ?? document.createElement('canvas');
  if (!config.canvas && el) {
    el.appendChild(canvas);
  }

  const renderer = new WebGLRenderer({ canvas, antialias: config.antialias ?? false, alpha: true });
  // Migrate away from outputEncoding
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (renderer as any).outputColorSpace = SRGBColorSpace;
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const clock = new Clock();
  let camera: RuntimeCamera = new OrthographicCamera();

  const runtime: ThreeRuntime = {
    renderer,
    scene,
    camera,
    clock,
    width: 0,
    height: 0,
  };

  if (config.initCamera) {
    config.initCamera(runtime);
    camera = runtime.camera;
  }

  if (config.initScene) {
    config.initScene(runtime);
  }

  let lastPointer = { x: 0, y: 0 };
  const onMove = (e: PointerEvent | MouseEvent) => {
    const x = (e as PointerEvent).clientX ?? (e as MouseEvent).clientX;
    const y = (e as PointerEvent).clientY ?? (e as MouseEvent).clientY;
    const nPosition = {
      x: (x / runtime.width) * 2 - 1,
      y: (y / runtime.height) * 2 - 1,
    };
    const delta = { x: x - lastPointer.x, y: y - lastPointer.y };
    lastPointer = { x, y };
    config.onPointerMove?.({ nPosition, delta });
  };
  const onLeave = () => config.onPointerLeave?.();

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerleave', onLeave);

  const resize = () => {
    const width = config.width ?? window.innerWidth;
    const height = config.height ?? window.innerHeight;
    runtime.width = width;
    runtime.height = height;
    renderer.setSize(width, height, false);

    // Update orthographic camera to cover viewport in NDC units mapped to pixels
    if (camera instanceof OrthographicCamera) {
      const halfW = width / 2;
      const halfH = height / 2;
      camera.left = -halfW;
      camera.right = halfW;
      camera.top = halfH;
      camera.bottom = -halfH;
      camera.near = -1000;
      camera.far = 1000;
      camera.updateProjectionMatrix();
    }

    const wWidth = camera instanceof OrthographicCamera ? camera.right - camera.left : 2;
    config.afterResize?.({ width, height, wWidth });
  };

  resize();
  const onWindowResize = () => {
    if (config.resize !== false) resize();
  };
  window.addEventListener('resize', onWindowResize);

  let raf = 0;
  const animate = () => {
    const width = runtime.width;
    const height = runtime.height;
    const wWidth = camera instanceof OrthographicCamera ? camera.right - camera.left : 2;
    config.beforeRender?.({ ...runtime, wWidth, width, height });
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  };
  animate();

  return {
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('pointermove', onMove as any);
      window.removeEventListener('pointerleave', onLeave);
      renderer.dispose();
      if (!config.canvas && el && canvas.parentElement === el) {
        el.removeChild(canvas);
      }
    },
  };
}


