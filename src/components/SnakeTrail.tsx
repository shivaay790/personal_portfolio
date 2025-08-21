import { useEffect, useRef } from 'react';
import { devLog } from '@/lib/logger';

type SnakeTrailProps = {
  maxPoints?: number;
  fadeMs?: number;
  lineWidth?: number;
};

// Canvas-based snake trail that follows the cursor with a smooth, glowing gradient stroke.
export default function SnakeTrail({ maxPoints = 120, fadeMs = 1600, lineWidth = 18 }: SnakeTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<Array<{ x: number; y: number; t: number }>>([]);
  const animRef = useRef<number | null>(null);
  const lastMoveRef = useRef<number>(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resolve theme colors from CSS variables so canvas can use concrete values
    const css = getComputedStyle(document.documentElement);
    const primary = css.getPropertyValue('--primary').trim(); // e.g., "260 85% 65%"
    const accentBlue = css.getPropertyValue('--accent-blue').trim();
    const accentPink = css.getPropertyValue('--accent-pink').trim();
    const colorA = `hsl(${primary} / 0.9)`;
    const colorB = `hsl(${accentBlue} / 0.9)`;
    const colorC = `hsl(${accentPink} / 0.9)`;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const resize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = Math.floor(innerWidth * dpr);
      canvas.height = Math.floor(innerHeight * dpr);
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: PointerEvent | MouseEvent) => {
      const x = (e as PointerEvent).clientX ?? (e as MouseEvent).clientX;
      const y = (e as PointerEvent).clientY ?? (e as MouseEvent).clientY;
      pointsRef.current.push({ x, y, t: performance.now() });
      if (pointsRef.current.length > maxPoints) pointsRef.current.shift();
      lastMoveRef.current = performance.now();
      if (pointsRef.current.length % 10 === 0) devLog('snake', 'points', pointsRef.current.length);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', resize);

    const draw = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Auto-fade entire snake when idle
      const idle = Math.min(1, (now - lastMoveRef.current) / fadeMs);

      const pts = pointsRef.current;
      // Drop very old points to keep memory small
      while (pts.length && now - pts[0].t > fadeMs * 1.5) pts.shift();
      if (pts.length > 1) {
        // Build gradient along the snake path
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        // Match site theme: primary -> accent-blue -> accent-pink
        gradient.addColorStop(0.0, colorA);
        gradient.addColorStop(0.5, colorB);
        gradient.addColorStop(1.0, colorC);

        // Glow
        ctx.shadowColor = colorA;
        ctx.shadowBlur = 28;

        // Draw multiple strokes for a subtle depth effect
        for (let pass = 0; pass < 2; pass++) {
          ctx.beginPath();
          for (let i = 0; i < pts.length - 1; i++) {
            const p = pts[i];
            const n = pts[i + 1];
            const age = (now - p.t) / fadeMs;
            if (age > 1) continue; // fully faded segment

            const alpha = (1 - age) * (1 - idle * 0.85); // fade with age and idle
            const widthScale = 0.85 + 0.6 * (i / pts.length); // thicker towards the head

            ctx.strokeStyle = gradient as unknown as string;
            ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = lineWidth * widthScale - pass * 2;

            ctx.moveTo(p.x, p.y);
            // Use a simple quadratic curve for smoothness
            const cx = (p.x + n.x) / 2;
            const cy = (p.y + n.y) / 2;
            ctx.quadraticCurveTo(p.x, p.y, cx, cy);
            ctx.stroke();
          }
          ctx.closePath();
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, [maxPoints, fadeMs, lineWidth]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-[9999] pointer-events-none select-none"
    />
  );
}


