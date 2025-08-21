import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';

import PlaygroundSection from '@/components/PlaygroundSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import SnakeTrailToggle from '@/components/SnakeTrailToggle';
import EasterEggStar from '@/components/easter-egg/EasterEggStar';
import NeonCursorBackground from '@/components/NeonCursorBackground';
import WormholeSplash from '@/components/WormholeSplash';
import React from 'react';
import WormholeExact from '@/components/WormholeExact';
import PortalTransition from '@/components/PortalTransition';
import CursorSwitcher from '@/components/CursorSwitcher';

import ProjectExplorer3D from '@/components/ProjectExplorer3D';
import ProjectLauncher from '@/components/ProjectLauncher';


const Index = () => {
  useScrollReveal();
  const [splashDone, setSplashDone] = React.useState(false);
  const [showWormhole, setShowWormhole] = React.useState(false);
  const [showProjectExplorer, setShowProjectExplorer] = React.useState(false);
  const [launchingProject, setLaunchingProject] = React.useState<any>(null);

  const handleExploreProjects = () => {
    console.log('Explore Projects clicked - starting wormhole');
    console.log('Current states before:', { splashDone, showWormhole, showProjectExplorer, launchingProject });
    setShowWormhole(true);
    console.log('Set showWormhole to true');
  };

  const handleWormholeComplete = () => {
    console.log('Wormhole complete - showing 3D explorer');
    setShowWormhole(false);
    setShowProjectExplorer(true);
  };

  const handleProjectLaunch = (project: any) => {
    setShowProjectExplorer(false);
    setLaunchingProject(project);
  };

  const handleLaunchComplete = () => {
    setLaunchingProject(null);
    setShowProjectExplorer(true); // Return to 3D explorer
  };

  const handleLaunchError = (error: string) => {
    console.error('Project launch failed:', error);
    // You can add more sophisticated error handling here
    setLaunchingProject(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <NeonCursorBackground />
      
      {/* Initial splash screen */}
      {!splashDone && (
        <WormholeExact key="splash" durationMs={5000} onDone={() => setSplashDone(true)} />
      )}
      
      {/* Portal transition to project explorer */}
      {showWormhole && splashDone && (
        <PortalTransition key="explorer-transition" durationMs={5000} onDone={handleWormholeComplete} />
      )}
      

      
      {/* Main portfolio content */}
      {splashDone && !showWormhole && !showProjectExplorer && !launchingProject && (
        <>
          <SnakeTrailToggle />
          <Navigation />
          <EasterEggStar />
          <CursorSwitcher />


          <div id="hero" data-reveal>
            <HeroSection />
          </div>
          <div id="about" data-reveal>
            <AboutSection />
          </div>
          <div id="playground" data-reveal>
            <PlaygroundSection onExploreProjects={handleExploreProjects} />
          </div>
          <div id="contact" data-reveal>
            <ContactSection />
          </div>
          <Footer />
        </>
      )}
      
      {/* 3D Project Explorer */}
      {showProjectExplorer && (
        <ProjectExplorer3D
          onExit={() => setShowProjectExplorer(false)}
          onProjectLaunch={handleProjectLaunch}
        />
      )}
      
      {/* Project Launcher */}
      {launchingProject && (
        <ProjectLauncher
          project={launchingProject}
          onComplete={handleLaunchComplete}
          onError={handleLaunchError}
        />
      )}
    </div>
  );
};

export default Index;
