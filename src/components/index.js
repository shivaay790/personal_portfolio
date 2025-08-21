import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import spline from "./spline.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export function setupWormhole(container) {
  const mountEl = container || document.body;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.3);
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(w, h);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  mountEl.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.03;

  // post-processing
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
  bloomPass.threshold = 0.002;
  bloomPass.strength = 3.5;
  bloomPass.radius = 0;
  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  // create a line geometry from the spline
  const points = spline.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const line = new THREE.Line(geometry, material);
  // scene.add(line);

  // create a tube geometry from the spline
  const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);

  // create edges geometry from the spline
  const edges = new THREE.EdgesGeometry(tubeGeo, 0.2);
  const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const tubeLines = new THREE.LineSegments(edges, lineMat);
  scene.add(tubeLines);

  // Add a light at the end of the tunnel
  // Compute a point very close to the end of the spline and its forward direction
  const endParam = 0.995;
  const endPos = tubeGeo.parameters.path.getPointAt(endParam);
  const endTan = tubeGeo.parameters.path.getTangentAt(endParam).normalize();

  // A soft spotlight shining down the tunnel
  const endSpot = new THREE.SpotLight(0xff66cc, 4, 40, Math.PI / 4, 0.35, 2);
  endSpot.position.copy(endPos.clone().sub(endTan.clone().multiplyScalar(3)));
  endSpot.target.position.copy(endPos.clone().add(endTan.clone().multiplyScalar(5)));
  scene.add(endSpot);
  scene.add(endSpot.target);

  // Extra point light to punch through wireframe visually
  const endPoint = new THREE.PointLight(0xffffff, 2.5, 20, 2);
  endPoint.position.copy(endPos.clone().add(endTan.clone().multiplyScalar(0.5)));
  scene.add(endPoint);

  // A small glowing sphere to visually mark the tunnel end
  const glowGeo = new THREE.SphereGeometry(0.3, 24, 24);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xff66cc,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.copy(endPos.clone().add(endTan.clone().multiplyScalar(0.2)));
  glow.scale.setScalar(1.2);
  scene.add(glow);

  // Big additive billboard to guarantee a visible "light at end"
  const gCanvas = document.createElement('canvas');
  gCanvas.width = 256; gCanvas.height = 256;
  const gctx = gCanvas.getContext('2d');
  let sprite;
  if (gctx) {
    const grad = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
    grad.addColorStop(0.4, 'rgba(255, 102, 204, 0.65)');
    grad.addColorStop(1.0, 'rgba(255, 102, 204, 0.0)');
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 256, 256);

    const glowTex = new THREE.CanvasTexture(gCanvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: glowTex,
      color: 0xffffff,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      opacity: 1,
    });
    sprite = new THREE.Sprite(spriteMat);
    sprite.position.copy(endPos.clone().add(endTan.clone().multiplyScalar(0.15)));
    sprite.scale.set(14, 14, 1);
    scene.add(sprite);
  }

  // Exit-light timing (per prompt)
  const TUNNEL_TOTAL_S = 5;
  const LIGHT_RAMP_START_S = 4;
  const LIGHT_RAMP_DURATION_S = 1;
  const EXIT_LIGHT_MAX_INTENSITY = 100; // unit scale 0..100
  const SPOT_UNIT_TO_NATIVE = 0.12;
  const POINT_UNIT_TO_NATIVE = 0.04;
  let baseTimeMs = null;
  let loggedStart = false;
  let loggedRampStart = false;
  let loggedRampEnd = false;
  endSpot.intensity = 0;
  endPoint.intensity = 0;
  if (sprite) sprite.material.opacity = 0;
  const SPRITE_MIN = 8;
  const SPRITE_MAX = 40;

  const numBoxes = 55;
  const size = 0.075;
  const boxGeo = new THREE.BoxGeometry(size, size, size);
  for (let i = 0; i < numBoxes; i += 1) {
    const boxMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    const p = (i / numBoxes + Math.random() * 0.1) % 1;
    const pos = tubeGeo.parameters.path.getPointAt(p);
    pos.x += Math.random() - 0.4;
    pos.z += Math.random() - 0.4;
    box.position.copy(pos);
    const rote = new THREE.Vector3(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    box.rotation.set(rote.x, rote.y, rote.z);
    const edges = new THREE.EdgesGeometry(boxGeo, 0.2);
    const color = new THREE.Color().setHSL(0.7 - p, 1, 0.5);
    const lineMat = new THREE.LineBasicMaterial({ color });
    const boxLines = new THREE.LineSegments(edges, lineMat);
    boxLines.position.copy(pos);
    boxLines.rotation.set(rote.x, rote.y, rote.z);
    // scene.add(box);
    scene.add(boxLines);
  }

  function updateCamera(t) {
    if (baseTimeMs === null) {
      baseTimeMs = t;
      if (!loggedStart) {
        console.log('[TUNNEL-LIGHT] tunnel traversal start @', (baseTimeMs / 1000).toFixed(2), 's');
        loggedStart = true;
      }
    }
    const elapsedS = (t - baseTimeMs) / 1000;
    const time = t * 0.2;
    const looptime = TUNNEL_TOTAL_S * 1000;
    const p = (time % looptime) / looptime;
    const pos = tubeGeo.parameters.path.getPointAt(p);
    const lookAt = tubeGeo.parameters.path.getPointAt((p + 0.03) % 1);
    camera.position.copy(pos);
    camera.lookAt(lookAt);
    // Keep the glow sprite ahead along the tunnel so it's visible while flying
    if (sprite) {
      const dir = lookAt.clone().sub(pos).normalize();
      sprite.position.copy(lookAt.clone().add(dir.multiplyScalar(0.6)));
    }

    // Intensity schedule: 0–4s: 0, 4–5s: 0→100, >5s: 100
    let unitIntensity = 0;
    if (elapsedS < LIGHT_RAMP_START_S) {
      unitIntensity = 0;
    } else if (elapsedS <= LIGHT_RAMP_START_S + LIGHT_RAMP_DURATION_S) {
      const alpha = (elapsedS - LIGHT_RAMP_START_S) / LIGHT_RAMP_DURATION_S;
      unitIntensity = alpha * EXIT_LIGHT_MAX_INTENSITY;
      if (!loggedRampStart) {
        console.log('[TUNNEL-LIGHT] ramp start @', elapsedS.toFixed(2), 's');
        loggedRampStart = true;
      }
    } else {
      unitIntensity = EXIT_LIGHT_MAX_INTENSITY;
      if (!loggedRampEnd) {
        console.log('[TUNNEL-LIGHT] ramp end @', elapsedS.toFixed(2), 's (intensity=100)');
        loggedRampEnd = true;
      }
    }

    endSpot.intensity = (unitIntensity * SPOT_UNIT_TO_NATIVE) / 100;
    endPoint.intensity = (unitIntensity * POINT_UNIT_TO_NATIVE) / 100;
    if (sprite) {
      const e = unitIntensity / 100;
      const s = SPRITE_MIN + (SPRITE_MAX - SPRITE_MIN) * e;
      sprite.scale.set(s, s, 1);
      sprite.material.opacity = e;
    }
  }

  let raf = 0;
  function animate(t = 0) {
    raf = requestAnimationFrame(animate);
    updateCamera(t);
    composer.render(scene, camera);
    controls.update();
  }
  animate();

  function handleWindowResize() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }
  window.addEventListener('resize', handleWindowResize, false);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', handleWindowResize);
    renderer.dispose();
    composer.dispose?.();
    if (renderer.domElement && renderer.domElement.parentElement === mountEl) {
      mountEl.removeChild(renderer.domElement);
    }
  };
}

export default { setupWormhole };