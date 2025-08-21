import { useState, useEffect } from 'react';
// Web-based implementation (Tauri functionality can be added later)
const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__;
import ProjectLaunchTransition from './ProjectLaunchTransition';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'coming-soon';
  commands?: {
    frontend?: string;
    backend?: string;
    url?: string;
    mode?: string;
  };
}

interface ProjectLauncherProps {
  project: Project;
  onComplete: () => void;
  onError: (error: string) => void;
}

type LaunchStep = 
  | 'starting-frontend'
  | 'starting-backend'
  | 'opening-browser'
  | 'complete'
  | 'error';

export default function ProjectLauncher({ project, onComplete, onError }: ProjectLauncherProps) {
  const [currentStep, setCurrentStep] = useState<LaunchStep>('starting-frontend');
  const [statusMessage, setStatusMessage] = useState('Initializing project...');
  const [showWormhole, setShowWormhole] = useState(true); // Start with wormhole
  const [error, setError] = useState<string | null>(null);

  const stepMessages = {
    'starting-frontend': 'Starting frontend server...',
    'starting-backend': 'Starting backend services...',
    'opening-browser': 'Opening project in browser...',
    'complete': 'Project launched successfully!',
    'error': 'Launch failed - see details below'
  };

  const handleWormholeComplete = () => {
    console.log('VITON Wormhole complete - starting project launch');
    setShowWormhole(false);
    launchProject();
  };

  useEffect(() => {
    // Don't auto-launch, wait for wormhole to complete
    // launchProject();
  }, []);

  const launchProject = async () => {
    try {
      // Skip portal animations since wormhole already played
      // Go directly to project setup
      
      // Handle proxied routes mode for VITON - SHOW MANUAL COMMANDS ONLY
      if (project.commands?.mode === 'proxied-routes') {
        setCurrentStep('starting-frontend');
        setStatusMessage('Setting up VITON with clear proxy routes...');
        
        console.log('VITON Proxied Routes Mode:');
        console.log('- Portfolio runs on port 8080');
        console.log('- VITON frontend accessible via /viton/front (proxied to :5173)');
        console.log('- VITON backend accessible via /viton/back (proxied to :8000)');
        console.log('- Clean URLs through single portfolio port');
        
        // ACTUALLY START THE FRONTEND PROCESS
        if (project.commands?.frontend) {
          try {
            console.log('Starting VITON Frontend process...');
            console.log(`Directory: ${project.commands.frontend}`);
            console.log('Command: npm run dev');
            
            // Call the backend API to start the process
            const response = await fetch('/api/start-viton-frontend', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                directory: project.commands.frontend 
              })
            });
            
            if (response.ok) {
              const result = await response.json();
              console.log('Frontend process spawned:', result);
              setStatusMessage('VITON Frontend process started!');
            } else {
              console.error('Failed to spawn frontend process');
              setStatusMessage('Frontend spawn failed - check console');
            }
          } catch (error) {
            console.error('Error spawning frontend:', error);
            setStatusMessage('Frontend spawn error - check console');
          }
        }
      } else {
        // Web-based implementation with separate command execution
        setCurrentStep('starting-frontend');
        setStatusMessage('Starting frontend server...');
        
        // Execute frontend command
        if (project.commands?.frontend) {
          try {
            // For Windows, open separate CMD windows
            const frontendScript = `
              cd /d "${project.commands.frontend}"
              npm run dev
              pause
            `;
            
            // Log Windows-compatible commands (no && chaining)
            console.log('Frontend commands (run separately):');
            console.log(`1. cd /d "${project.commands.frontend}"`);
            console.log('2. npm run dev');
            
            // Log the commands that would be executed
            console.log('Would execute frontend in:', project.commands.frontend);
            console.log('Command: npm run dev');
          } catch (err) {
            console.warn('Frontend command preparation:', err);
          }
        }
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setCurrentStep('starting-backend');
      
      if (project.commands?.mode === 'proxied-routes') {
        setStatusMessage('Starting VITON backend server...');
        
        // ACTUALLY START THE BACKEND PROCESS
        if (project.commands?.backend) {
          try {
            console.log('Starting VITON Backend process...');
            console.log(`Directory: ${project.commands.backend}`);
            console.log('Commands: cd -> venv activate -> uvicorn');
            
            // Call the backend API to start the process
            const response = await fetch('/api/start-viton-backend', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                directory: project.commands.backend 
              })
            });
            
            if (response.ok) {
              const result = await response.json();
              console.log('Backend process spawned:', result);
              setStatusMessage('VITON Backend process started!');
            } else {
              console.error('Failed to spawn backend process');
              setStatusMessage('Backend spawn failed - check console');
            }
          } catch (error) {
            console.error('Error spawning backend:', error);
            setStatusMessage('Backend spawn error - check console');
          }
          console.log('Backend will be accessible via http://localhost:8080/viton/back');
        }
      } else {
        setStatusMessage('Starting backend server...');
        
        // Execute backend command
        if (project.commands?.backend) {
          try {
            const backendScript = `
              cd /d "${project.commands.backend}"
              call venv\\Scripts\\activate
              uvicorn main:app --port 8000
              pause
            `;
            
            // Log Windows-compatible commands (no && chaining)
            console.log('Backend commands (run separately):');
            console.log(`1. cd /d "${project.commands.backend}"`);
            console.log('2. venv\\Scripts\\activate');
            console.log('3. uvicorn main:app');
            
            // Log the commands that would be executed
            console.log('Would execute backend in:', project.commands.backend);
            console.log('Commands (run separately): 1) cd directory 2) venv\\Scripts\\activate 3) uvicorn main:app');
          } catch (err) {
            console.warn('Backend command preparation:', err);
          }
        }
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setCurrentStep('opening-browser');
      setStatusMessage('Project URL ready to open...');
      if (project.commands?.url) {
        console.log('Opening URL:', project.commands.url);
        // Don't auto-open URL since servers may not be running
        console.log('Note: manually run the commands above first, then visit:', project.commands.url);
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentStep('complete');
      setStatusMessage('VITON setup complete! Opening frontend...');
      
      // Auto-open VITON frontend immediately
      const url = 'http://localhost:5173';
      console.log('Auto-opening VITON frontend at:', url);
      console.log('Make sure you run the frontend command first!');
      window.open(url, '_blank');
      
      // Show what commands would be executed in a real environment
      if (project.id === 'viton') {
        console.log('=== VITON PROJECT LAUNCH COMMANDS ===');
        console.log('1. Frontend (in separate terminal):');
        console.log(`   cd "${project.commands?.frontend}"`);
        console.log('   npm run dev');
        console.log('');
        console.log('2. Backend (in separate terminal):');
        console.log(`   cd "${project.commands?.backend}"`);
        console.log('   venv\\Scripts\\activate');
        console.log('   uvicorn main:app');
        console.log('');
        console.log('3. Then open: http://localhost:5173');
        console.log('=====================================');
      }
      
      // Show completion message
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Don't auto-complete - let user stay and explore
      // setTimeout(() => {
      //   onComplete();
      // }, 3000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setCurrentStep('error');
      setStatusMessage(stepMessages['error']);
      onError(errorMessage);
    }
  };

  const getStepIcon = (step: LaunchStep) => {
    switch (step) {
      case 'starting-frontend': return '⚛';
      case 'starting-backend': return '💻';
      case 'opening-browser': return '🌐';
      case 'complete': return '✓';
      case 'error': return '✗';
      default: return '⟲';
    }
  };

  if (showWormhole) {
    return (
      <ProjectLaunchTransition 
        durationMs={5000} 
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
        {/* Floating particles */}
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
        {/* Portal circle */}
        <div className="relative mb-8">
          <div className="w-64 h-64 border-4 border-primary/50 rounded-full animate-spin-slow relative">
            <div className="absolute inset-4 border-2 border-primary/30 rounded-full animate-spin-reverse" />
            <div className="absolute inset-8 border border-primary/20 rounded-full animate-spin" />
            
            {/* Center content */}
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
        <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 border border-primary/50 max-w-md mx-auto">
          <div className="text-xl font-semibold text-white mb-2">{statusMessage}</div>
          
          {/* Progress steps */}
          <div className="space-y-2 text-sm">
            {Object.entries(stepMessages).map(([step, message]) => {
              if (step === 'error') return null;
              const isActive = step === currentStep;
              const isComplete = Object.keys(stepMessages).indexOf(step) < Object.keys(stepMessages).indexOf(currentStep);
              
              return (
                <div 
                  key={step}
                  className={`flex items-center space-x-2 ${
                    isActive ? 'text-primary' : isComplete ? 'text-green-400' : 'text-gray-500'
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    {isComplete ? '✓' : isActive ? '⟲' : '⏳'}
                  </div>
                  <span>{message}</span>
                </div>
              );
            })}
          </div>

          {/* Error display */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
              <div className="text-red-400 font-semibold mb-1">Error Details:</div>
              <div className="text-red-300 text-sm">{error}</div>
              <div className="text-gray-400 text-xs mt-2">
                Please provide this error message for troubleshooting.
              </div>
            </div>
          )}

          {/* Manual commands display */}
          {currentStep === 'complete' && project.id === 'viton' && (
            <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
              <div className="text-blue-400 font-semibold mb-2">
                Manual Setup ({project.commands?.mode === 'proxied-routes' ? 'Proxied Routes Mode' : 'Standard Mode'}):
              </div>
              <div className="text-xs text-blue-300 space-y-2">
                {project.commands?.mode === 'proxied-routes' ? (
                  <>
                    <div className="text-cyan-400 font-semibold mb-2">
                      VITON Clear Proxy Routes - All Through Port 8080!
                    </div>
                    <div className="bg-cyan-900/20 p-3 rounded border border-cyan-500/30 mb-3">
                      <div className="text-cyan-300 text-sm font-semibold mb-1">Proxy Routes:</div>
                      <div className="text-gray-300 text-xs space-y-1">
                        <div>• Portfolio: <span className="text-green-400">http://localhost:8080</span></div>
                        <div>• VITON Frontend: <span className="text-blue-400">http://localhost:8080/viton/front</span> → <span className="text-gray-400">proxied to :5173</span></div>
                        <div>• VITON Backend: <span className="text-purple-400">http://localhost:8080/viton/back</span> → <span className="text-gray-400">proxied to :8000</span></div>
                      </div>
                    </div>
                    <div>
                      <span className="text-yellow-400">Terminal 1 (VITON Frontend):</span>
                      <div className="bg-black/50 p-2 rounded mt-1 font-mono text-green-400">
                        cd "{project.commands?.frontend}"<br/>
                        npm run dev
                      </div>
                    </div>
                    <div>
                      <span className="text-yellow-400">Terminal 2 (VITON Backend - run separately):</span>
                      <div className="bg-black/50 p-2 rounded mt-1 font-mono text-green-400">
                        1. cd "{project.commands?.backend}"<br/>
                        2. venv\Scripts\activate<br/>
                        3. uvicorn main:app
                      </div>
                    </div>
                    <div className="text-center bg-cyan-900/30 p-2 rounded">
                      <span className="text-primary">Visit: {project.commands?.url}</span><br/>
                      <span className="text-xs text-gray-400">All routes through single port 8080!</span>
                    </div>
                    <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-500/50 rounded">
                      <div className="text-yellow-400 text-xs font-semibold mb-1">⚠️ Important Setup Order:</div>
                      <div className="text-yellow-200 text-xs space-y-1">
                        <div>1. Portfolio already running (port 8080)</div>
                        <div>2. Start VITON frontend (port 5173)</div>
                        <div>3. Start VITON backend (port 8000)</div>
                        <div>4. Click "Open Project" to test</div>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded">
                      <div className="text-blue-400 text-xs font-semibold mb-1">Windows CMD Note:</div>
                      <div className="text-blue-200 text-xs">
                        Run each command separately in Windows CMD. Do NOT use && to chain commands.
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-yellow-400">Terminal 1 (Frontend):</span>
                      <div className="bg-black/50 p-2 rounded mt-1 font-mono text-green-400">
                        cd "{project.commands?.frontend}"<br/>
                        npm run dev -- --port 5173
                      </div>
                    </div>
                    <div>
                      <span className="text-yellow-400">Terminal 2 (Backend - run separately):</span>
                      <div className="bg-black/50 p-2 rounded mt-1 font-mono text-green-400">
                        1. cd "{project.commands?.backend}"<br/>
                        2. venv\Scripts\activate<br/>
                        3. uvicorn main:app
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-primary">Then visit: http://localhost:5173</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-4 justify-center">
          {currentStep === 'complete' ? (
            <button
              onClick={onComplete}
              className="px-6 py-2 bg-primary hover:bg-primary/80 border border-primary rounded-lg text-white transition-colors font-semibold"
            >
              ← Back to Explorer
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-500 rounded-lg text-white transition-colors"
            >
              {currentStep === 'error' ? 'Close' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
