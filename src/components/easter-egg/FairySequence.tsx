import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { devLog } from '@/lib/logger';

type FairySequenceProps = {
  onComplete?: () => void;
  introLines?: string[];
  finalLine?: string;
};

export default function FairySequence({
  onComplete,
  introLines = [
    "Psst... over here! ✨",
    "Follow me to the projects!",
  ],
  finalLine = "Here we are — explore my work below!",
}: FairySequenceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fairyRef = useRef<HTMLDivElement | null>(null);
  const emitterRef = useRef<number | null>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState(introLines[0]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const fairy = fairyRef.current;
    if (!fairy) return;

    devLog('EASTER-EGG', 'Fairy animation started');

    // Start near top-right
    const vw = () => window.innerWidth;
    const vh = () => window.innerHeight;
    const margin = 80;
    const pos = (x: number, y: number) => ({ x, y });

    gsap.set(fairy, { xPercent: 0, yPercent: 0, x: vw() - 120, y: 100, scale: 0.9, opacity: 1, rotate: 0 });

    // Helper to tilt slightly towards the next waypoint, then move
    const tiltAndMove = (toX: number, toY: number, duration = 1.0) => {
      const fromX = Number(gsap.getProperty(fairy, 'x')) || 0;
      const fromY = Number(gsap.getProperty(fairy, 'y')) || 0;
      const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
      const tilt = Math.max(-22, Math.min(22, angle / 3));
      tl.to(fairy, { rotate: tilt, duration: 0.2, ease: 'power1.out' });
      tl.to(fairy, { x: toX, y: toY, duration, ease: 'power2.out' });
    };

    // Start particle emitter
    const emit = () => {
      const container = containerRef.current;
      if (!container || !fairyRef.current) return;
      const x = Number(gsap.getProperty(fairyRef.current, 'x')) || 0;
      const y = Number(gsap.getProperty(fairyRef.current, 'y')) || 0;
      const sparkle = document.createElement('div');
      sparkle.style.position = 'absolute';
      sparkle.style.left = `${x + 12}px`;
      sparkle.style.top = `${y + 12}px`;
      sparkle.style.width = `${Math.random() * 4 + 3}px`;
      sparkle.style.height = sparkle.style.width;
      sparkle.style.borderRadius = '9999px';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.background = 'radial-gradient(circle, rgba(255,255,200,0.95) 0%, rgba(255,235,120,0.5) 40%, rgba(255,220,120,0) 70%)';
      sparkle.style.filter = 'blur(0.2px)';
      container.appendChild(sparkle);
      const driftX = (Math.random() - 0.5) * 60;
      const driftY = (Math.random() - 0.5) * 60;
      gsap.to(sparkle, { x: driftX, y: driftY, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => sparkle.remove() });
    };
    emitterRef.current = window.setInterval(emit, 60);

    // Wings flap animation
    const leftWing = fairy.querySelector('.wing-left');
    const rightWing = fairy.querySelector('.wing-right');
    if (leftWing && rightWing) {
      gsap.to(leftWing, { rotate: -12, yoyo: true, repeat: -1, duration: 0.25, ease: 'sine.inOut' });
      gsap.to(rightWing, { rotate: 12, yoyo: true, repeat: -1, duration: 0.25, ease: 'sine.inOut' });
    }

    // Guided tour across the whole page, visiting sections
    const sections: Array<{ id: string; label: string; yView: number; xSide: 'left' | 'right' | 'center' }> = [
      { id: 'about', label: 'About →', yView: 0.25, xSide: 'left' },
      { id: 'playground', label: 'Playground →', yView: 0.5, xSide: 'center' },
      { id: 'contact', label: 'Contact →', yView: 0.7, xSide: 'right' },
    ];

    // Intro sweep in the current viewport
    tl.add(() => { setShowBubble(true); setBubbleText(introLines[0]); });
    tiltAndMove(vw() - margin * 2, margin, 0.8);
    tiltAndMove(margin, vh() * 0.25, 1.0);
    tl.add(() => setBubbleText(introLines[1] ?? introLines[0]));
    tiltAndMove(vw() * 0.55, vh() * 0.55, 1.0);

    // Visit each section: scroll into view and position the fairy accordingly
    sections.forEach((s, i) => {
      tl.add(() => {
        const el = document.getElementById(s.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setBubbleText(s.label);
      });
      const xTarget = s.xSide === 'left' ? margin : s.xSide === 'right' ? vw() - margin : vw() * 0.5;
      tiltAndMove(xTarget, vh() * s.yView, 1.1);
      // small zigzag for life
      const zigX = s.xSide === 'center' ? vw() * 0.6 : s.xSide === 'left' ? margin + 120 : vw() - margin - 120;
      tiltAndMove(zigX, vh() * (s.yView + 0.08), 0.6);
    });

    // Final hint and exit
    tl.add(() => setBubbleText(finalLine));
    tiltAndMove(margin, vh() - margin * 2, 1.0);

    // Exit
    tl.to(fairy, { opacity: 0, duration: 0.5 });
    tl.add(() => { setShowBubble(false); onComplete?.(); });

    return () => { tl.kill(); };
  }, [finalLine, introLines, onComplete]);

  useEffect(() => () => { if (emitterRef.current) { clearInterval(emitterRef.current); emitterRef.current = null; } }, []);

  return null;
}


