import { useEffect, useRef, useState } from 'react';
import three from '@/lib/threeRuntime';
import { Mesh, OrthographicCamera, PlaneGeometry, ShaderMaterial, Vector2 } from 'three';

type WormholeSplashProps = {
  durationMs?: number;
  onDone: () => void;
};

export default function WormholeSplash({ durationMs = 5000, onDone }: WormholeSplashProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!hostRef.current) return;

    const uRatio = { value: new Vector2(1, 1) };
    const uTime = { value: 0.0 };

    let material: ShaderMaterial;
    let plane: Mesh;

    const runtime = three({
      el: hostRef.current,
      antialias: false,
      initCamera: (r) => {
        r.camera = new OrthographicCamera();
      },
      initScene: ({ scene }) => {
        material = new ShaderMaterial({
          uniforms: { uRatio, uTime },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            precision highp float;
            varying vec2 vUv;
            uniform vec2 uRatio;
            uniform float uTime;
            
            // simple palette
            vec3 palette(float t){
              return mix(vec3(0.13,0.58,0.95), vec3(0.98,0.35,0.74), smoothstep(0.0,1.0,0.5+0.5*sin(t)));
            }
            
            void main(){
              vec2 uv = (vUv - 0.5) * uRatio; // keep aspect
              float ang = atan(uv.y, uv.x);
              float rad = length(uv);
              // tunnel coordinate (log-polar)
              float lane = 8.0; // number of rings/lanes
              float z = -uTime*2.2 + log(rad+1e-3)*lane;
              float stripes = 0.5 + 0.5*sin(z*6.2831 + ang*4.0);
              float glow = 1.0 / (1.0 + 8.0*rad*rad);
              vec3 col = palette(z*0.25 + uTime*0.8);
              col *= stripes * glow * 1.6;
              gl_FragColor = vec4(col, 1.0);
            }
          `,
          transparent: true,
        });
        plane = new Mesh(new PlaneGeometry(2, 2), material);
        scene.add(plane);
      },
      afterResize: ({ width, height }) => {
        if (width >= height) uRatio.value.set(1, height / width); else uRatio.value.set(width / height, 1);
      },
      beforeRender: ({ clock }) => {
        uTime.value = clock.getElapsedTime();
      },
    });

    const t1 = window.setTimeout(() => setFade(true), Math.max(0, durationMs - 300));
    const t2 = window.setTimeout(() => onDone(), durationMs);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      runtime.destroy();
    };
  }, [durationMs, onDone]);
  
  return (
    <div
      ref={hostRef}
      className={`fixed inset-0 z-[11000] bg-black pointer-events-auto transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}
    />
  );
}


