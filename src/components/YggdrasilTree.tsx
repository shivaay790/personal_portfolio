import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Github, ExternalLink, ArrowLeft } from 'lucide-react';
import { projectsData, Project } from '@/data/projectData';


interface TreeNode {
  id: string;
  x: number;
  y: number;
  project: Project;
  connections: string[];
}

const YggdrasilTree = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
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
      default: return 'hsl(var(--primary))';
    }
  };

  const handleNodeClick = (project: Project) => {
    setSelectedProject(project);
    // Center and zoom to the node
    const nodeX = project.position.x;
    const nodeY = project.position.y;
    setPan({ x: -nodeX * 1.5, y: -nodeY * 1.5 });
    setZoom(1.5);
  };

  const handleBackToTree = () => {
    setSelectedProject(null);
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
    setPan({
      x: dragStart.panX + deltaX,
      y: dragStart.panY + deltaY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (selectedProject) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  // Generate tree branches (simplified connections)
  const branches = [
    { from: 'college-start', to: 'sentiment-analysis' },
    { from: 'college-start', to: 'hand-gesture' },
    { from: 'sentiment-analysis', to: 'empathic-chatbot' },
    { from: 'hand-gesture', to: 'crowd-counting' },
    { from: 'crowd-counting', to: 'virtual-tryon' },
    { from: 'empathic-chatbot', to: 'research-paper' },
    { from: 'virtual-tryon', to: 'capstone-project' },
    { from: 'research-paper', to: 'capstone-project' }
  ];

  const getProjectById = (id: string) => projectsData.find(p => p.id === id);

  // Define leaf positions on the tree for each project
  const leafPositions = {
    'college-start': { x: 50, y: 85 }, // Roots
    'sentiment-analysis': { x: 35, y: 70 }, // Lower left branch
    'hand-gesture': { x: 65, y: 70 }, // Lower right branch
    'empathic-chatbot': { x: 25, y: 55 }, // Mid left
    'crowd-counting': { x: 75, y: 55 }, // Mid right
    'virtual-tryon': { x: 45, y: 40 }, // Upper left
    'research-paper': { x: 55, y: 40 }, // Upper right
    'capstone-project': { x: 50, y: 25 } // Crown of the tree
  };

  return (
    <div className="relative w-full h-[800px] overflow-hidden rounded-lg bg-gradient-to-br from-background via-background/95 to-muted/30">
      {/* Yggdrasil Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{ 
          backgroundImage: `url(/lovable-uploads/fa1fe5e0-7f22-4b19-80c9-0c613c05cf0f.png)`,
          filter: 'brightness(0.8) contrast(1.1)'
        }}
      />
      
      {/* Overlay gradient for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30" />
      
      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/60 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

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
        
        {/* Connect college start to first projects */}
        <line 
          x1="50%" y1="85%" 
          x2="35%" y2="70%" 
          stroke="url(#energyGradient)" 
          strokeWidth="2" 
          filter="url(#glow)"
          className="animate-pulse"
        />
        <line 
          x1="50%" y1="85%" 
          x2="65%" y2="70%" 
          stroke="url(#energyGradient)" 
          strokeWidth="2" 
          filter="url(#glow)"
          className="animate-pulse"
        />
        
        {/* Connect learning projects to advanced ones */}
        <line 
          x1="35%" y1="70%" 
          x2="25%" y2="55%" 
          stroke="url(#energyGradient)" 
          strokeWidth="2" 
          filter="url(#glow)"
          className="animate-pulse"
        />
        <line 
          x1="65%" y1="70%" 
          x2="75%" y2="55%" 
          stroke="url(#energyGradient)" 
          strokeWidth="2" 
          filter="url(#glow)"
          className="animate-pulse"
        />
        
        {/* Connect to research level */}
        <line 
          x1="25%" y1="55%" 
          x2="45%" y2="40%" 
          stroke="url(#energyGradient)" 
          strokeWidth="2" 
          filter="url(#glow)"
          className="animate-pulse"
        />
        <line 
          x1="75%" y1="55%" 
          x2="55%" y2="40%" 
          stroke="url(#energyGradient)" 
          strokeWidth="2" 
          filter="url(#glow)"
          className="animate-pulse"
        />
        
        {/* Connect to capstone */}
        <line 
          x1="45%" y1="40%" 
          x2="50%" y2="25%" 
          stroke="url(#energyGradient)" 
          strokeWidth="2" 
          filter="url(#glow)"
          className="animate-pulse"
        />
        <line 
          x1="55%" y1="40%" 
          x2="50%" y2="25%" 
          stroke="url(#energyGradient)" 
          strokeWidth="2" 
          filter="url(#glow)"
          className="animate-pulse"
        />
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
              onClick={() => handleNodeClick(project)}
            >
              {/* Orbital energy ring */}
              <div 
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${getPhaseColor(project.phase)}20 0%, transparent 70%)`,
                  width: '80px',
                  height: '80px',
                  transform: 'translate(-50%, -50%)',
                  left: '50%',
                  top: '50%'
                }}
              />
              
              {/* Magical Orb Node */}
              <div className="relative w-16 h-16 transition-all duration-300 group-hover:scale-125 group-hover:shadow-2xl">
                <img 
                  src={project.orbImage}
                  alt={`${project.title} orb`}
                  className="w-full h-full object-cover rounded-full border-2 border-white/60 shadow-lg"
                  style={{
                    filter: 'brightness(1.1) contrast(1.2) saturate(1.2)',
                    boxShadow: `0 0 30px ${getPhaseColor(project.phase)}60`
                  }}
                />
                {/* Pulsing energy aura */}
                <div 
                  className="absolute inset-0 rounded-full opacity-60"
                  style={{
                    background: `radial-gradient(circle, transparent 50%, ${getPhaseColor(project.phase)}30 70%, transparent 100%)`,
                    animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}
                />
              </div>
              
              {/* Project label */}
              <div 
                className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-10 shadow-xl"
                style={{ fontSize: '12px' }}
              >
                <div className="font-semibold text-foreground">{project.title}</div>
                <div className="text-xs text-muted-foreground">{project.date}</div>
              </div>
            </div>
          );
        })}
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
              <div className="flex gap-3 mb-4">
                <Button
                  variant="outline"
                  className="flex-1 hover:bg-primary/10 border-primary/30"
                  onClick={() => window.open(selectedProject.githubLink, '_blank')}
                >
                  <Github className="w-4 h-4 mr-2" />
                  View Code
                </Button>
                {selectedProject.demoLink && (
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => window.open(selectedProject.demoLink, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
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

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 text-xs text-white/90 bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <div className="font-medium mb-1">🌳 Explore the World Tree</div>
        <div>Click leaf nodes to discover projects • Hover for details</div>
      </div>
    </div>
  );
};

export default YggdrasilTree;