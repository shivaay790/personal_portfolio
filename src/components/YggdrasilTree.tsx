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

  return (
    <div className="relative w-full h-[800px] overflow-hidden rounded-lg bg-gradient-to-br from-background via-background/95 to-muted/30">
      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Tree SVG */}
      <div
        ref={containerRef}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="-400 -400 800 800"
          className="transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
          }}
        >
          {/* Tree branches */}
          {branches.map((branch, index) => {
            const fromProject = getProjectById(branch.from);
            const toProject = getProjectById(branch.to);
            if (!fromProject || !toProject) return null;

            return (
              <g key={`${branch.from}-${branch.to}`}>
                <line
                  x1={fromProject.position.x}
                  y1={fromProject.position.y}
                  x2={toProject.position.x}
                  y2={toProject.position.y}
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  opacity={treeGrown ? 0.6 : 0}
                  className="transition-all duration-1000 ease-out"
                  style={{
                    transitionDelay: `${index * 200 + 800}ms`
                  }}
                />
                {/* Glowing overlay */}
                <line
                  x1={fromProject.position.x}
                  y1={fromProject.position.y}
                  x2={toProject.position.x}
                  y2={toProject.position.y}
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  opacity={treeGrown ? 0.3 : 0}
                  className="transition-all duration-1000 ease-out animate-pulse-glow"
                  style={{
                    transitionDelay: `${index * 200 + 1000}ms`
                  }}
                />
              </g>
            );
          })}

          {/* Project nodes */}
          {projectsData.map((project, index) => (
            <g
              key={project.id}
              className="cursor-pointer transition-transform duration-300 hover:scale-110"
              onClick={() => handleNodeClick(project)}
              transform={`translate(${project.position.x}, ${project.position.y})`}
            >
              {/* Node glow effect */}
              <circle
                r="25"
                fill={getPhaseColor(project.phase)}
                opacity={treeGrown ? 0.2 : 0}
                className="transition-all duration-1000 ease-out animate-pulse-glow"
                style={{
                  transitionDelay: `${index * 150 + 1200}ms`
                }}
              />
              
              {/* Main node */}
              <circle
                r="15"
                fill={getPhaseColor(project.phase)}
                stroke="hsl(var(--background))"
                strokeWidth="3"
                opacity={treeGrown ? 1 : 0}
                className="transition-all duration-1000 ease-out"
                style={{
                  transitionDelay: `${index * 150 + 1000}ms`
                }}
              />
              
              {/* Node label */}
              <text
                y="35"
                textAnchor="middle"
                className="fill-foreground text-xs font-medium pointer-events-none"
                opacity={treeGrown ? 1 : 0}
                style={{
                  transitionDelay: `${index * 150 + 1400}ms`
                }}
              >
                {project.date}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Project Details Panel */}
      {selectedProject && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <Card className="max-w-md w-full bg-gradient-card border-border/50 relative animate-scale-in">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={handleBackToTree}
            >
              <X className="w-4 h-4" />
            </Button>
            
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-display font-bold mb-2">
                  {selectedProject.title}
                </h3>
                <p className="text-accent-blue font-mono text-sm mb-3">
                  {selectedProject.date}
                </p>
                <p className="text-muted-foreground mb-4">
                  {selectedProject.fullDescription}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(selectedProject.githubLink, '_blank')}
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                {selectedProject.demoLink && (
                  <Button
                    className="flex-1"
                    onClick={() => window.open(selectedProject.demoLink, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                )}
              </div>

              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={handleBackToTree}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tree
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 rounded-lg p-2">
        Click & drag to explore • Scroll to zoom • Click nodes for details
      </div>
    </div>
  );
};

export default YggdrasilTree;