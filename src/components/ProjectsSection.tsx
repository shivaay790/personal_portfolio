import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExternalLink, Github, Brain, Code, Zap, Sparkles, Database, Globe } from 'lucide-react';

const ProjectCard = ({ project }: { project: any }) => {
  const IconComponent = project.icon;

  return (
    <Card className="group bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 card-3d overflow-hidden">
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="p-3 bg-primary/10 rounded-lg w-fit">
            <IconComponent size={24} className="text-primary" />
          </div>
          <div className="flex gap-2">
            {project.github && (
              <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Github size={16} />
              </Button>
            )}
            {project.demo && (
              <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={16} />
              </Button>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {project.description}
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech: string) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <IconComponent size={24} className="text-primary" />
                {project.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">{project.fullDescription}</p>
              
              <div>
                <h4 className="font-semibold mb-2">Technologies Used:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech: string) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {project.features.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-3 pt-4">
                {project.github && (
                  <Button className="flex items-center gap-2">
                    <Github size={16} />
                    View Code
                  </Button>
                )}
                {project.demo && (
                  <Button variant="outline" className="flex items-center gap-2">
                    <ExternalLink size={16} />
                    Live Demo
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const ProjectsSection = () => {
  const projects = [
    {
      title: "Neural Network Visualizer",
      description: "Interactive tool for visualizing how neural networks learn and make decisions.",
      fullDescription: "An educational platform that helps users understand deep learning concepts through interactive visualizations. Features real-time network training, customizable architectures, and step-by-step explanations of forward and backward propagation.",
      tech: ["Python", "TensorFlow", "React", "D3.js", "FastAPI"],
      features: [
        "Real-time neural network training visualization",
        "Customizable network architectures",
        "Interactive parameter tuning",
        "Educational explanations and tutorials",
        "Export trained models"
      ],
      icon: Brain,
      github: true,
      demo: true
    },
    {
      title: "Smart Code Assistant",
      description: "AI-powered VS Code extension that provides intelligent code suggestions and optimizations.",
      fullDescription: "A sophisticated code assistant that leverages large language models to provide context-aware code suggestions, bug detection, and performance optimizations. Integrates seamlessly with popular IDEs.",
      tech: ["TypeScript", "OpenAI API", "VS Code API", "Node.js", "Python"],
      features: [
        "Context-aware code completion",
        "Automated bug detection and fixes",
        "Code optimization suggestions",
        "Multi-language support",
        "Custom model fine-tuning"
      ],
      icon: Code,
      github: true,
      demo: false
    },
    {
      title: "Real-time Analytics Dashboard",
      description: "High-performance dashboard for monitoring and analyzing large-scale data streams.",
      fullDescription: "A comprehensive analytics platform built for handling millions of data points in real-time. Features custom visualization components, alert systems, and machine learning-powered anomaly detection.",
      tech: ["React", "TypeScript", "WebSocket", "Python", "PostgreSQL", "Redis"],
      features: [
        "Real-time data processing and visualization",
        "Custom chart components with high performance",
        "Automated anomaly detection",
        "Configurable alert systems",
        "Multi-tenant architecture"
      ],
      icon: Zap,
      github: true,
      demo: true
    },
    {
      title: "AI Content Generator",
      description: "Creative writing assistant powered by advanced language models.",
      fullDescription: "An intelligent content creation platform that helps writers, marketers, and creators generate high-quality content. Features multiple AI models, style customization, and collaborative editing capabilities.",
      tech: ["Next.js", "OpenAI GPT-4", "MongoDB", "Tailwind CSS", "Stripe"],
      features: [
        "Multiple AI model integration",
        "Custom writing style adaptation",
        "Collaborative editing workspace",
        "Content optimization suggestions",
        "Usage analytics and insights"
      ],
      icon: Sparkles,
      github: false,
      demo: true
    },
    {
      title: "Distributed ML Pipeline",
      description: "Scalable machine learning pipeline for training and deploying models at scale.",
      fullDescription: "A robust MLOps platform that automates the entire machine learning lifecycle from data ingestion to model deployment. Features distributed training, automated hyperparameter tuning, and model monitoring.",
      tech: ["Python", "Kubernetes", "Apache Airflow", "MLflow", "Docker", "AWS"],
      features: [
        "Automated model training and deployment",
        "Distributed computing support",
        "Hyperparameter optimization",
        "Model performance monitoring",
        "A/B testing framework"
      ],
      icon: Database,
      github: true,
      demo: false
    },
    {
      title: "Interactive Portfolio Platform",
      description: "This very website! A showcase of modern web development with smooth animations.",
      fullDescription: "A modern, interactive portfolio website built with the latest web technologies. Features smooth animations, 3D effects, responsive design, and performance optimizations for an engaging user experience.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"],
      features: [
        "Smooth scroll animations and transitions",
        "3D hover effects and interactions",
        "Fully responsive design",
        "Performance optimized",
        "Modern design system implementation"
      ],
      icon: Globe,
      github: true,
      demo: true
    }
  ];

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A collection of projects that showcase my passion for AI, software engineering, 
            and creating meaningful digital experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.title}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-background"
          >
            View All Projects on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;