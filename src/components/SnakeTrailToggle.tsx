import { useState } from 'react';
import SnakeTrail from './SnakeTrail';
import { devLog } from '@/lib/logger';
import { Activity } from 'lucide-react';

export default function SnakeTrailToggle() {
  const [on, setOn] = useState(false);
  return (
    <>
      <button
        aria-label="Snake trail toggle"
        className="fixed top-3 right-12 z-[10050] p-2 rounded-full bg-background/40 border border-border/50 backdrop-blur-sm hover:scale-110 transition-transform text-accent-blue shadow-sm pointer-events-auto"
        onClick={() => {
          setOn(prev => {
            const next = !prev;
            if (next) {
              // eslint-disable-next-line no-console
              console.log('[SNAKE] on');
              devLog('EASTER-EGG', 'Snake Easter egg clicked (turning on)');
            } else {
              // eslint-disable-next-line no-console
              console.log('[SNAKE] off');
              devLog('EASTER-EGG', 'Snake Easter egg clicked (turning off)');
            }
            return next;
          });
        }}
      >
        <Activity size={16} className="opacity-80" />
      </button>

      {on && <SnakeTrail />}
    </>
  );
}


