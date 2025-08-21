import { useEffect, useRef, useState } from 'react';
import wormhole from '@/components';

// Direct integration of the provided neon cursor/wormhole-like effect without changing logic
// The code is wrapped in a React component and mounted fullscreen for a limited duration

type WormholeExactProps = { durationMs?: number; onDone: () => void };

export default function WormholeExact({ durationMs = 5000, onDone }: WormholeExactProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!hostRef.current) return;
    let destroyed = false;
    let instance: any;
    instance = wormhole.setupWormhole(hostRef.current!);

    const t1 = window.setTimeout(() => setFade(true), Math.max(0, durationMs - 300));
    const t2 = window.setTimeout(() => onDone(), durationMs);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      // Best-effort cleanup if the factory returned a destroy API
      destroyed = true;
      try { instance?.(); } catch {}
      // Remove content
      if (hostRef.current) hostRef.current.innerHTML = '';
    };
  }, [durationMs, onDone]);

  return (
    <div ref={hostRef} className={`fixed inset-0 z-[15000] bg-black transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`} />
  );
}


