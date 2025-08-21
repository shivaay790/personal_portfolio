import { useEffect, useRef } from 'react';
import three from '@/lib/threeRuntime';
import {
  Color,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  ShaderMaterial,
  SplineCurve,
  Vector2,
  Vector3,
} from 'three';

export default function NeonCursorBackground() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    const shaderPoints = 8;
    const curvePoints = 80;
    const curveLerp = 0.75;
    const radius1 = 3;
    const radius2 = 5;
    const velocityTreshold = 10;
    const sleepRadiusX = 150;
    const sleepRadiusY = 150;
    const sleepTimeCoefX = 0.0025;
    const sleepTimeCoefY = 0.0025;

    const points = new Array(curvePoints).fill(0).map(() => new Vector2());
    const spline = new SplineCurve(points);
    const velocity = new Vector3();
    const velocityTarget = new Vector3();

    const uRatio = { value: new Vector2() };
    const uSize = { value: new Vector2() };
    const uPoints = { value: new Array(shaderPoints).fill(0).map(() => new Vector2()) } as { value: Vector2[] };
    const uColor = { value: new Color(0xff00ff) };

    let material: ShaderMaterial;
    let plane: Mesh;
    let hover = false;

    const destroy = three({
      el: hostRef.current,
      antialias: false,
      initCamera: (r) => {
        r.camera = new OrthographicCamera();
      },
      initScene: ({ scene }) => {
        const geometry = new PlaneGeometry(2, 2);
        material = new ShaderMaterial({
          uniforms: { uRatio, uSize, uPoints, uColor },
          defines: { SHADER_POINTS: shaderPoints },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            float sdBezier(vec2 pos, vec2 A, vec2 B, vec2 C) {
              vec2 a = B - A;
              vec2 b = A - 2.0*B + C;
              vec2 c = a * 2.0;
              vec2 d = A - pos;
              float kk = 1.0 / dot(b,b);
              float kx = kk * dot(a,b);
              float ky = kk * (2.0*dot(a,a)+dot(d,b)) / 3.0;
              float kz = kk * dot(d,a);
              float res = 0.0;
              float p = ky - kx*kx;
              float p3 = p*p*p;
              float q = kx*(2.0*kx*kx - 3.0*ky) + kz;
              float h = q*q + 4.0*p3;
              if(h >= 0.0){
                h = sqrt(h);
                vec2 x = (vec2(h, -h) - q) / 2.0;
                vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
                float t = uv.x + uv.y - kx;
                t = clamp( t, 0.0, 1.0 );
                vec2 qos = d + (c + b*t)*t;
                res = length(qos);
              } else {
                float z = sqrt(-p);
                float v = acos( q/(p*z*2.0) ) / 3.0;
                float m = cos(v);
                float n = sin(v)*1.732050808;
                vec3 t = vec3(m + m, -n - m, n - m) * z - kx;
                t = clamp( t, 0.0, 1.0 );
                vec2 qos = d + (c + b*t.x)*t.x;
                float dis = dot(qos,qos);
                res = dis;
                qos = d + (c + b*t.y)*t.y;
                dis = dot(qos,qos);
                res = min(res,dis);
                qos = d + (c + b*t.z)*t.z;
                dis = dot(qos,qos);
                res = min(res,dis);
                res = sqrt( res );
              }
              return res;
            }
            uniform vec2 uRatio;
            uniform vec2 uSize;
            uniform vec2 uPoints[${shaderPoints}];
            uniform vec3 uColor;
            varying vec2 vUv;
            void main() {
              float intensity = 1.0;
              float radius = 0.015;
              vec2 pos = (vUv - 0.5) * uRatio;
              vec2 c = (uPoints[0] + uPoints[1]) / 2.0;
              vec2 c_prev;
              float dist = 10000.0;
              for(int i = 0; i < ${shaderPoints} - 1; i++){
                c_prev = c;
                c = (uPoints[i] + uPoints[i + 1]) / 2.0;
                dist = min(dist, sdBezier(pos, c_prev, uPoints[i], c));
              }
              dist = max(0.0, dist);
              float glow = pow(uSize.y / dist, intensity);
              vec3 col = vec3(0.0);
              col += 10.0 * vec3(smoothstep(uSize.x, 0.0, dist));
              col += glow * uColor;
              col = 1.0 - exp(-col);
              col = pow(col, vec3(0.4545));
              gl_FragColor = vec4(col, 1.0);
            }
          `,
        });
        plane = new Mesh(new PlaneGeometry(2, 2), material);
        scene.add(plane);
      },
      afterResize: ({ width, height }) => {
        uSize.value.set(radius1, radius2);
        if (width >= height) {
          uRatio.value.set(1, height / width);
          uSize.value.multiplyScalar(1 / width);
        } else {
          uRatio.value.set(width / height, 1);
          uSize.value.multiplyScalar(1 / height);
        }
      },
      beforeRender: ({ clock, width, height, wWidth }) => {
        const t = clock.getElapsedTime();
        for (let i = 1; i < curvePoints; i++) {
          points[i].lerp(points[i - 1], curveLerp);
        }
        for (let i = 0; i < shaderPoints; i++) {
          spline.getPoint(i / (shaderPoints - 1), uPoints.value[i]);
        }

        if (!hover) {
          const t1 = t * sleepTimeCoefX;
          const t2 = t * sleepTimeCoefY;
          const cos = Math.cos(t1);
          const sin = Math.sin(t2);
          const r1 = sleepRadiusX * wWidth / width;
          const r2 = sleepRadiusY * wWidth / width;
          const x = r1 * cos;
          const y = r2 * sin;
          spline.points[0].set(x, y);
          uColor.value.r = 0.5 + 0.5 * Math.cos(t * 0.0015);
          uColor.value.g = 0;
          uColor.value.b = 1 - uColor.value.r;
        } else {
          uColor.value.r = velocity.z;
          uColor.value.g = 0;
          uColor.value.b = 1 - velocity.z;
          velocity.multiplyScalar(0.95);
        }
      },
      onPointerMove: ({ nPosition, delta }) => {
        hover = true;
        const x = (0.5 * nPosition.x) * uRatio.value.x;
        const y = (0.5 * nPosition.y) * uRatio.value.y;
        spline.points[0].set(x, y);

        velocityTarget.x = Math.min(velocity.x + Math.abs(delta.x) / velocityTreshold, 1);
        velocityTarget.y = Math.min(velocity.y + Math.abs(delta.y) / velocityTreshold, 1);
        velocityTarget.z = Math.sqrt(velocityTarget.x * velocityTarget.x + velocityTarget.y * velocityTarget.y);
        velocity.lerp(velocityTarget, 0.05);
      },
      onPointerLeave: () => { hover = false; },
    });

    return () => {
      destroy.destroy();
    };
  }, []);

  return <div ref={hostRef} className="fixed inset-0 -z-10 pointer-events-none" aria-hidden style={{ background: 'transparent' }} />;
}


