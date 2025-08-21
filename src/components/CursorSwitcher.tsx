import { useEffect, useRef, useState } from 'react';

type CursorMode = 'system' | 'particles' | 'bubbles';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  id: number;
}

let particleId = 0;

export default function CursorSwitcher() {
	const [mode, setMode] = useState<CursorMode>('system');
	const [pos, setPos] = useState({ x: 0, y: 0 });
	const [particles, setParticles] = useState<Particle[]>([]);
	const requestRef = useRef<number | null>(null);
	const targetRef = useRef({ x: 0, y: 0 });
	const particlesInstanceRef = useRef<any>(null);

	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			targetRef.current.x = e.clientX;
			targetRef.current.y = e.clientY;
			
			// Add particles for bubbles, and particles modes
			// if (mode === 'fairyDust') {
			// 	const newParticles: Particle[] = [];
			// 	for (let i = 0; i < 3; i++) {
			// 		newParticles.push({
			// 			x: e.clientX + (Math.random() - 0.5) * 20,
			// 			y: e.clientY + (Math.random() - 0.5) * 20,
			// 			vx: (Math.random() - 0.5) * 2,
			// 			vy: (Math.random() - 0.5) * 2,
			// 			life: 1,
			// 			maxLife: Math.random() * 60 + 30,
			// 			size: Math.random() * 4 + 2,
			// 			color: `hsl(${45 + Math.random() * 60}, 100%, ${60 + Math.random() * 30}%)`,
			// 			id: particleId++
			// 		});
			// 	}
			// 	setParticles(prev => [...prev, ...newParticles].slice(-100));
			// }
			if (mode === 'bubbles') {
				if (Math.random() < 0.3) {
					const newBubble: Particle = {
						x: e.clientX,
						y: e.clientY,
						vx: (Math.random() - 0.5) * 1,
						vy: -Math.random() * 2 - 1,
						life: 1,
						maxLife: Math.random() * 80 + 60,
						size: Math.random() * 8 + 4,
						color: `hsla(${180 + Math.random() * 60}, 70%, 80%, 0.6)`,
						id: particleId++
					};
					setParticles(prev => [...prev, newBubble].slice(-50));
				}
			}
			// Particles mode handled by ThreeJS in separate effect
		};
		window.addEventListener('mousemove', onMove);
		return () => window.removeEventListener('mousemove', onMove);
	}, [mode]);

	// Particle animation loop
	useEffect(() => {
		const animate = () => {
			setPos((p) => {
				const dx = targetRef.current.x - p.x;
				const dy = targetRef.current.y - p.y;
				return { x: p.x + dx * 0.2, y: p.y + dy * 0.2 };
			});
			
			setParticles(prev => prev.map(p => ({
				...p,
				x: p.x + p.vx,
				y: p.y + p.vy,
				life: p.life + 1,
				vy: mode === 'bubbles' ? p.vy * 0.99 : p.vy
			})).filter(p => p.life < p.maxLife));
			

			
			requestRef.current = requestAnimationFrame(animate);
		};
		requestRef.current = requestAnimationFrame(animate);
		return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
	}, [mode]);

	// ThreeJS particles cursor setup with exact configuration provided
	useEffect(() => {
		if (mode === 'particles') {
			// @ts-ignore - threejs-toys module types
			import('threejs-toys').then(({ particlesCursor }) => {
				const container = document.getElementById('particles-container');
				if (container) {
					particlesInstanceRef.current = particlesCursor({
						el: container,
						gpgpuSize: 512,
						color: 0xfff,
						colors: [0xff00d9, 0xffffff],
						coordScale: 0.5,
						pointSize: 1,
						noiseIntensity: 0.005,
						noiseTimeCoef: 0.001,
						pointDecay: 0.007,
						sleepRadiusX: 250,
						sleepRadiusY: 250,
						sleepTimeCoefX: 0.001,
						sleepTimeCoefY: 0.002
					});
				}
			}).catch(console.warn);
		} else if (particlesInstanceRef.current) {
			try {
				particlesInstanceRef.current.dispose?.();
			} catch {}
			particlesInstanceRef.current = null;
		}
		return () => {
			if (particlesInstanceRef.current) {
				try {
					particlesInstanceRef.current.dispose?.();
				} catch {}
				particlesInstanceRef.current = null;
			}
		};
	}, [mode]);

	useEffect(() => {
		if (mode === 'system') {
			document.body.style.cursor = '';
			// Remove any existing cursor override styles
			const style = document.getElementById('cursor-override-style');
			if (style) style.remove();
		} else if (mode === 'particles') {
			// For particles mode, hide cursor like other effects - ThreeJS provides visual feedback
			document.body.style.cursor = 'none';
			let style = document.getElementById('cursor-override-style');
			if (!style) {
				style = document.createElement('style');
				style.id = 'cursor-override-style';
				document.head.appendChild(style);
			}
			style.textContent = `
				* { cursor: none !important; }
				*:hover { cursor: none !important; }
				a, button, input, textarea, select { cursor: none !important; }
				a:hover, button:hover, input:hover, textarea:hover, select:hover { cursor: none !important; }
			`;
		} else {
			document.body.style.cursor = 'none';
			// Add global cursor override to prevent reverting on hover
			let style = document.getElementById('cursor-override-style');
			if (!style) {
				style = document.createElement('style');
				style.id = 'cursor-override-style';
				document.head.appendChild(style);
			}
			style.textContent = `
				* { cursor: none !important; }
				*:hover { cursor: none !important; }
				a, button, input, textarea, select { cursor: none !important; }
				a:hover, button:hover, input:hover, textarea:hover, select:hover { cursor: none !important; }
			`;
		}
		return () => { 
			document.body.style.cursor = ''; 
			const style = document.getElementById('cursor-override-style');
			if (style) style.remove();
		};
	}, [mode]);

	const renderCursor = () => {
		// No custom cursor rendering needed for particles mode
		return null;
	};

	return (
		<>
			{/* ThreeJS Particles Container */}
			{mode === 'particles' && (
				<div 
					id="particles-container"
					className="fixed inset-0 pointer-events-none z-[99998]"
					style={{ 
						width: '100vw', 
						height: '100vh',
						background: 'transparent'
					}}
				/>
			)}

			        {/* Particle effects for bubbles */}
        {(mode === 'bubbles') && (
				<div className="fixed inset-0 pointer-events-none z-[99999]">
					{particles.map(p => (
						<div
							key={p.id}
							style={{
								position: 'absolute',
								left: p.x - p.size / 2,
								top: p.y - p.size / 2,
								width: p.size,
								height: p.size,
								borderRadius: mode === 'bubbles' ? '50%' : '0',
								background: mode === 'bubbles' 
									? `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), ${p.color})`
									: p.color,
								opacity: 1 - (p.life / p.maxLife),
								transform: 'none',
								boxShadow: mode === 'bubbles' ? `inset -2px -2px 4px rgba(255,255,255,0.3)` : `0 0 ${p.size}px ${p.color}`,
								filter: 'none'
							}}
						/>
					))}
				</div>
			)}
			
			{renderCursor()}
			
			<div className="fixed bottom-4 right-4 z-[100001] flex gap-1 bg-background/70 backdrop-blur-md border border-border rounded-full px-2 py-2 pointer-events-auto text-xs">
				<button 
					onClick={() => setMode('system')} 
					className={`px-2 py-1 rounded-full transition-all duration-200 ${mode==='system'?'bg-primary text-black':'bg-muted text-foreground hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-white'}`}
				>
					System
				</button>
				<button 
					onClick={() => setMode('particles')} 
					className={`px-2 py-1 rounded-full transition-all duration-200 ${mode==='particles'?'bg-primary text-black':'bg-muted text-foreground hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-500/20 hover:text-white'}`}
				>
					Particles
				</button>
				<button 
					            // onClick={() => setMode('fairyDust')}
            className={`px-2 py-1 rounded-full transition-all duration-200 bg-muted text-foreground opacity-50 cursor-not-allowed`}
				>
					Dust
				</button>
				<button 
					onClick={() => setMode('bubbles')} 
					className={`px-2 py-1 rounded-full transition-all duration-200 ${mode==='bubbles'?'bg-primary text-black':'bg-muted text-foreground hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:text-white hover:shadow-lg hover:shadow-cyan-500/20'}`}
				>
					Bubbles
				</button>
			</div>
		</>
	);
}


