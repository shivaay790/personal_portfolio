import { Button } from '@/components/ui/button';
import { Sparkles, Rocket } from 'lucide-react';

interface PlaygroundSectionProps {
  onExploreProjects?: () => void;
}

const PlaygroundSection = ({ onExploreProjects }: PlaygroundSectionProps) => {
  return (
    <section id="playground" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Interactive <span className="text-gradient">Playground</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A fun space to explore AI concepts and interact with creative demos. 
            This is where my playful side meets serious engineering!
          </p>
          
          {/* Explore Projects Button */}
          <div className="mt-8">
            <Button
              onClick={onExploreProjects}
              className="bg-gradient-to-r from-primary to-accent-pink hover:from-primary/80 hover:to-accent-pink/80 
                         text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl 
                         transform hover:scale-105 transition-all duration-300 glow-primary"
            >
              <Rocket className="mr-3 w-6 h-6" />
              Explore Live Projects
              <Sparkles className="ml-3 w-6 h-6 animate-pulse" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Enter the project dimension and launch real applications
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaygroundSection;
