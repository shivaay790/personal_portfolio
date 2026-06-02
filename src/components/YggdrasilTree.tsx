import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Github, ExternalLink, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { projectsData, Project } from '@/data/projectData';
import { devLog } from '@/lib/logger';


interface TreeNode {
  id: string;
  x: number;
  y: number;
  project: Project;
  connections: string[];
}

const YggdrasilTree = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [zoom, setZoom] = useState(2);
  const [pan, setPan] = useState({ x: 0, y: 800 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const [treeGrown, setTreeGrown] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger tree growth animation
    const timer = setTimeout(() => setTreeGrown(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const getPhaseColor = (phase: Project['phase']) => {
    switch (phase) {
      case 'roots': return 'hsl(var(--accent-blue))';
      case 'learning': return 'hsl(var(--primary))';
      case 'advanced': return 'hsl(var(--accent-pink))';
      case 'research': return 'hsl(var(--accent-blue-light))';
      case 'achievements': return 'hsl(var(--accent-gold, 45, 100%, 50%))';
      case 'professional': return 'hsl(var(--accent-cyan, 180, 100%, 50%))';
      default: return 'hsl(var(--primary))';
    }
  };

  const handleNodeClick = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag/pan trigger
    setSelectedProject(project);
    devLog('tree:select', project.id);
    
    // Zoom into the node
    setZoom(1.8);
    // Center the node in view
    // Using a simpler centering logic that works with 50% origin
    setPan({ 
      x: (50 - project.position.x) * 15 * zoom, 
      y: (50 - project.position.y) * 15 * zoom 
    });
  };

  const handleBackToTree = () => {
    setSelectedProject(null);
    devLog('tree:back');
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedProject) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || selectedProject) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Calculate new pan with constraints
    const newX = dragStart.panX + deltaX;
    const newY = dragStart.panY + deltaY;
    
    // Even tighter horizontal constraints to keep content centered on the image
    setPan({
      x: Math.max(-100, Math.min(100, newX)),
      y: Math.max(-1000, Math.min(1000, newY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (selectedProject) return;
    
    // If Ctrl key is pressed, it's a zoom action
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.max(1.2, Math.min(4, prev * delta)));
    } else {
      // Regular scroll = Pan
      const isAtTop = pan.y >= 1000 && e.deltaY < 0;
      const isAtBottom = pan.y <= -1000 && e.deltaY > 0;

      // If we are at the top or bottom boundary, don't prevent default, 
      // allowing the page to scroll to the next section.
      if (!isAtTop && !isAtBottom) {
        e.preventDefault();
        setPan(prev => ({
          x: Math.max(-100, Math.min(100, prev.x - e.deltaX)),
          y: Math.max(-1000, Math.min(1000, prev.y - e.deltaY))
        }));
      }
    }
  };

  // Generate tree branches based on the journey
  const branches = [
    { from: 'school', to: 'college-start' },
    { from: 'college-start', to: 'aims-dtu' },
    { from: 'college-start', to: 'yuvaan-dtu' },
    { from: 'aims-dtu', to: 'cotech-intern' },
    { from: 'yuvaan-dtu', to: 'cotech-intern' },
    { from: 'cotech-intern', to: 'ml-intro' },
    { from: 'cotech-intern', to: 'ml-intermediate' },
    { from: 'ml-intro', to: 'seo-forge' },
    { from: 'ml-intermediate', to: 'seo-forge' },
    { from: 'seo-forge', to: 'hand-gesture' },
    { from: 'hand-gesture', to: 'ml-specialization' },
    { from: 'hand-gesture', to: 'dl-specialization' },
    { from: 'ml-specialization', to: 'python-trading' },
    { from: 'dl-specialization', to: 'python-trading' },
    { from: 'python-trading', to: 'mental-health-chatbot' },
    { from: 'mental-health-chatbot', to: 'dream-team-hackathon' },
    { from: 'mental-health-chatbot', to: 'research-forge-hackathon' },
    { from: 'dream-team-hackathon', to: 'apogee-ctf' },
    { from: 'research-forge-hackathon', to: 'apogee-ctf' },
    { from: 'apogee-ctf', to: 'ai-research-intern-dtu' },
    { from: 'apogee-ctf', to: 'projects-node' },
    { from: 'projects-node', to: 'crowd-counting' },
    { from: 'crowd-counting', to: 'viton' },
    { from: 'ai-research-intern-dtu', to: 'sih-gov-portal' },
    { from: 'viton', to: 'ir-image-enhancement' },
    { from: 'sih-gov-portal', to: 'ai-engineer-stealth' },
    { from: 'ir-image-enhancement', to: 'sih-grand-finalist' },
    { from: 'ai-engineer-stealth', to: 'zervai-datathon' },
    { from: 'sih-grand-finalist', to: 'package-case-comp' },
    { from: 'zervai-datathon', to: 'paper-2' },
    { from: 'package-case-comp', to: 'paper-2' },
    { from: 'paper-2', to: 'paper-3' },
    { from: 'paper-3', to: 'paper-4' },
    { from: 'paper-4', to: 'paper-5' },
    { from: 'paper-5', to: 'portfolio' }
  ];

  const getProjectById = (id: string) => projectsData.find(p => p.id === id);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Time-based background gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="h-[2000px] w-full flex flex-col" style={{ transform: `translateY(${pan.y * 0.8}px)` }}>
          {/* Sem 1 (Aug - Nov 2024) */}
          <div className="h-[15%] w-full bg-slate-900/60 transition-colors duration-1000" />
          {/* Winter Vacations (Dec) - Dulling Effect */}
          <div className="h-[5%] w-full bg-slate-950/90 backdrop-blur-sm" />
          {/* Sem 2 (Jan - May 2025) - Normal Again */}
          <div className="h-[15%] w-full bg-slate-900/60" />
          {/* Summer Vacations (June - July) - Dulling Effect */}
          <div className="h-[10%] w-full bg-slate-950/90 backdrop-blur-sm" />
          {/* Sem 3 (Aug - Nov 2025) - Normal Again */}
          <div className="h-[15%] w-full bg-slate-900/60" />
          {/* Winter Vacations (Dec) - Dulling Effect */}
          <div className="h-[5%] w-full bg-slate-950/90 backdrop-blur-sm" />
          {/* Sem 4 (Jan - May 2026) - Normal Again */}
          <div className="h-[15%] w-full bg-slate-900/60" />
          {/* Summer Vacations (June - July 2026) - Dulling Effect */}
          <div className="h-[20%] w-full bg-slate-950/90 backdrop-blur-sm" />
        </div>
      </div>

      {/* Yggdrasil Background Image - Fitted to screen without extra scale */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 ease-out"
        style={{ 
          backgroundImage: `url(/orbs/fa1fe5e0-7f22-4b19-80c9-0c613c05cf0f.png)`,
          filter: 'brightness(0.6) contrast(1.2)',
          transform: `translate(${pan.x * 0.1}px, ${pan.y * 0.1}px)`, // Parallax only, no extra scale
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/80 pointer-events-none z-2" />

      {/* Particle effects - increased density and smoother gradient flicker */}
      <div className="absolute inset-0 pointer-events-none z-3">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              background: 'radial-gradient(circle, rgba(250, 204, 21, 0.95) 0%, rgba(250, 204, 21, 0.5) 45%, rgba(250, 204, 21, 0) 75%)',
              filter: 'blur(0.3px)',
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random()}s infinite, float ${4 + Math.random() * 4}s ease-in-out ${Math.random()}s infinite`
            }}
          />
        ))}
      </div>

      {/* Tree Content - Zoomable and Pannable */}
      <div 
        ref={containerRef}
        className="relative w-full h-full transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing z-10"
        style={{ 
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '50% 50%',
          width: '100%',
          height: '100%'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div className="absolute inset-0 w-full h-[2000px]">
          {/* Energy Connections between Orbs */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: treeGrown ? 1 : 0, transition: 'opacity 1s ease-out', transitionDelay: '2s' }}>
        {/* Connection lines with energy flow */}
        <defs>
          <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Dynamic branches */}
        {branches.map((branch, index) => {
          const fromProject = getProjectById(branch.from);
          const toProject = getProjectById(branch.to);
          
          if (!fromProject || !toProject) return null;
          
          return (
            <line 
              key={`${branch.from}-${branch.to}-${index}`}
              x1={`${fromProject.position.x}%`} 
              y1={`${fromProject.position.y}%`} 
              x2={`${toProject.position.x}%`} 
              y2={`${toProject.position.y}%`} 
              stroke="url(#energyGradient)" 
              strokeWidth="2" 
              filter="url(#glow)"
              className="animate-pulse"
              style={{
                strokeDasharray: '10, 5',
                animation: `dash 10s linear infinite, pulse 4s ease-in-out infinite`
              }}
            />
          );
        })}
      </svg>

      {/* Project Orb Nodes on Tree */}
      <div className="relative w-full h-full">
        {projectsData.map((project, index) => {
          const position = project.position;
          return (
            <div
              key={project.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                opacity: treeGrown ? 1 : 0,
                transition: 'all 1s ease-out',
                transitionDelay: `${index * 200 + 1500}ms`
              }}
              onClick={(e) => handleNodeClick(project, e)}
            >
              {/* Orbital energy ring */}
              <div 
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${getPhaseColor(project.phase)}20 0%, transparent 70%)`,
                  width: '40px',
                  height: '40px',
                  transform: 'translate(-50%, -50%)',
                  left: '50%',
                  top: '50%'
                }}
              />
              
              {/* Magical Orb Node */}
              <div className="relative w-8 h-8 transition-all duration-300 group-hover:scale-125 group-hover:shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
                  <img 
                    src={project.orbImage}
                    alt={`${project.title} orb`}
                    className="w-full h-full object-cover rounded-full"
                    style={{
                      filter: 'brightness(1.1) contrast(1.2) saturate(1.2)',
                      boxShadow: `0 0 15px ${getPhaseColor(project.phase)}60`
                    }}
                  />
                </div>
                {/* Pulsing energy aura */}
                <div 
                  className="absolute inset-0 rounded-full opacity-60 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, transparent 50%, ${getPhaseColor(project.phase)}40 70%, transparent 100%)`,
                    animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}
                />
              </div>
              
              {/* Project label */}
              <div 
                className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-30 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              >
                <div className="font-bold text-foreground text-sm flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getPhaseColor(project.phase) }}
                  />
                  {project.title}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground mt-1 flex justify-between items-center gap-4">
                  <span>{project.date}</span>
                  <span className="uppercase tracking-widest opacity-70">{project.phase}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>

      {/* Project Details Panel */}
      {selectedProject && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in z-20">
          <Card className="max-w-lg w-full bg-gradient-card border-border/50 relative animate-scale-in shadow-2xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 hover:bg-destructive/20"
              onClick={handleBackToTree}
            >
              <X className="w-4 h-4" />
            </Button>
            
            <div className="p-6">
              {/* Project Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getPhaseColor(selectedProject.phase) }}
                  />
                  <h3 className="text-2xl font-display font-bold">
                    {selectedProject.title}
                  </h3>
                </div>
                <p className="text-accent-blue font-mono text-sm mb-4">
                  {selectedProject.date} • {selectedProject.phase.charAt(0).toUpperCase() + selectedProject.phase.slice(1)} Phase
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProject.fullDescription}
                </p>
              </div>

              {/* Technologies */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-foreground">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex flex-wrap gap-3">
                  {selectedProject.githubLink && (
                    <Button
                      variant="outline"
                      className="flex-1 min-w-[140px] hover:bg-primary/10 border-primary/30"
                      onClick={() => window.open(selectedProject.githubLink, '_blank')}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </Button>
                  )}
                  {selectedProject.demoLink && (
                    <Button
                      className="flex-1 min-w-[140px] bg-primary hover:bg-primary/90"
                      onClick={() => window.open(selectedProject.demoLink, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Link
                    </Button>
                  )}
                </div>

                {selectedProject.extraLinks && selectedProject.extraLinks.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.extraLinks.map((link) => (
                      <Button
                        key={link.url}
                        variant="secondary"
                        className="flex-1 min-w-[140px] bg-muted/50 hover:bg-muted"
                        onClick={() => window.open(link.url, '_blank')}
                      >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        {link.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                className="w-full hover:bg-muted/50"
                onClick={handleBackToTree}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Yggdrasil
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};

export default YggdrasilTree;