import { useState, useEffect } from 'react';
import ProjectLaunchTransition from './ProjectLaunchTransition';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'coming-soon';
  commands?: {
    url?: string;
  };
}

interface ProjectLauncherProps {
  project: Project;
  onComplete: () => void;
  onError: (error: string) => void;
}

type LaunchStep = 
  | 'initializing'
  | 'starting-frontend'
  | 'starting-backend'
  | 'opening-browser'
  | 'complete';

export default function ProjectLauncher({ project, onComplete, onError }: ProjectLauncherProps) {
  const [currentStep, setCurrentStep] = useState<LaunchStep>('initializing');
  const [statusMessage, setStatusMessage] = useState(`Initializing ${project.name}...`);
  const [showWormhole, setShowWormhole] = useState(true);

  const stepMessages = {
    'initializing': `Initializing ${project.name}...`,
    'starting-frontend': `Starting ${project.name} frontend server...`,
    'starting-backend': `Starting ${project.name} backend services...`,
    'opening-browser': `Opening ${project.name} in browser...`,
    'complete': `${project.name} launched successfully!`
  };

  const handleWormholeComplete = () => {
    setShowWormhole(false);
    launchProject();
  };

  const launchProject = async () => {
    try {
      // Step 1: Frontend
      setCurrentStep('starting-frontend');
      setStatusMessage(stepMessages['starting-frontend']);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Backend
      setCurrentStep('starting-backend');
      setStatusMessage(stepMessages['starting-backend']);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Browser
      setCurrentStep('opening-browser');
      setStatusMessage(stepMessages['opening-browser']);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Final Step: Complete & Redirect
      setCurrentStep('complete');
      setStatusMessage(stepMessages['complete']);
      
      if (project.commands?.url) {
        await new Promise(resolve => setTimeout(resolve, 800));
        window.location.href = project.commands.url;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      onError(errorMessage);
    }
  };

  const getStepIcon = (step: LaunchStep) => {
    switch (step) {
      case 'initializing': return '⚡';
      case 'starting-frontend': return '⚛';
      case 'starting-backend': return '💻';
      case 'opening-browser': return '🌐';
      case 'complete': return '✓';
      default: return '⟲';
    }
  };

  if (showWormhole) {
    return (
      <ProjectLaunchTransition 
        durationMs={3000} 
        onDone={handleWormholeComplete}
        projectName={project.name}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[10001] bg-black flex items-center justify-center">
      {/* Animated portal background */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-radial from-primary/20 via-black to-black animate-pulse" />
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main portal interface */}
      <div className="relative z-10 text-center">
        <div className="relative mb-8">
          <div className="w-64 h-64 border-4 border-primary/50 rounded-full animate-spin-slow relative">
            <div className="absolute inset-4 border-2 border-primary/30 rounded-full animate-spin-reverse" />
            <div className="absolute inset-8 border border-primary/20 rounded-full animate-spin" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">
                  {getStepIcon(currentStep)}
                </div>
                <div className="text-2xl font-bold text-primary">{project.name}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Status display */}
        <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 border border-primary/50 w-[400px] mx-auto shadow-2xl">
          <div className="text-xl font-semibold text-white mb-4 h-8 flex items-center justify-center">
            {statusMessage}
          </div>
          
          {/* Progress steps */}
          <div className="space-y-3 text-sm text-left px-4">
            {Object.entries(stepMessages).map(([step, message]) => {
              const stepKey = step as LaunchStep;
              const isActive = stepKey === currentStep;
              const stepOrder = ['initializing', 'starting-frontend', 'starting-backend', 'opening-browser', 'complete'];
              const currentIndex = stepOrder.indexOf(currentStep);
              const thisIndex = stepOrder.indexOf(stepKey);
              const isComplete = thisIndex < currentIndex;
              
              return (
                <div 
                  key={step}
                  className={`flex items-center space-x-3 transition-all duration-300 ${
                    isActive ? 'text-primary scale-105' : isComplete ? 'text-green-400' : 'text-gray-500'
                  }`}
                >
                  <div className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                    isActive ? 'border-primary animate-pulse' : isComplete ? 'border-green-400 bg-green-400/10' : 'border-gray-600'
                  }`}>
                    {isComplete ? '✓' : isActive ? '⟲' : '○'}
                  </div>
                  <span className={isActive ? 'font-bold' : ''}>{message}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cancel button - only shown during loading */}
        {currentStep !== 'complete' && (
          <div className="mt-8">
            <button
              onClick={onComplete}
              className="px-8 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-400 transition-all text-sm uppercase tracking-widest"
            >
              Cancel Launch
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
