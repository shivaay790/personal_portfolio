import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
// import FairySequence3D from './FairySequence3D';
import { devLog } from '@/lib/logger';

type EasterEggStarProps = {
  className?: string;
};

export default function EasterEggStar({ className = '' }: EasterEggStarProps) {
  const [active, setActive] = useState(false);
  const [useDomFallback, setUseDomFallback] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => {
      try {
        // (window as any).FAIRY?.flySequence?.(['#hero', '#about', '#playground', '#contact']);
      } catch {}
    }, 500);
    return () => window.clearTimeout(t);
  }, [active]);

  return (
    <>
      <button
        aria-label="Easter egg trigger"
        className={`fixed top-3 right-3 z-[10050] p-2 rounded-full bg-background/40 border border-border/50 backdrop-blur-sm hover:scale-110 transition-transform text-primary shadow-sm pointer-events-auto ${className}`}
        onClick={() => { 
          // eslint-disable-next-line no-console
          console.log('[FAIRY] trigger click');
          if (active) {
            devLog('EASTER-EGG', 'Star clicked — stopping fairy');
            // try { (window as any).FAIRY?.cancel?.(); } catch {}
            setActive(false);
            setUseDomFallback(false);
            return;
          }
          devLog('EASTER-EGG', 'Star clicked — starting fairy animation'); 
          setUseDomFallback(false);
          setActive(true); 
        }}
      >
        <Star size={16} className="opacity-80" />
      </button>

      {/* {active && !useDomFallback && (
        <FairySequence3D 
          onComplete={() => { devLog('EASTER-EGG', '3D fairy ended'); setActive(false); }}
          onFallback={() => {
            devLog('EASTER-EGG', '3D failed — switching to DOM fairy');
            setUseDomFallback(true);
          }}
        />
      )} */}

      {active && useDomFallback && null}
    </>
  );
}


