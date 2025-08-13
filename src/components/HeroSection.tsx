import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Code, Brain, Sparkles, Zap, Coffee } from 'lucide-react';
import heroAvatar from '@/assets/hero-avatar.jpg';

const AnimatedTitle = () => {
  const titles = [
    "Code Magician 🪄",
    "AI Explorer 🚀", 
    "Bug Whisperer 🐛",
    "Neural Network Ninja 🧠",
    "Algorithm Artist 🎨"
  ];
  
  const [currentTitle, setCurrentTitle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 overflow-hidden">
      <div 
        className="transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(-${currentTitle * 32}px)` }}
      >
        {titles.map((title, index) => (
          <div key={index} className="h-8 flex items-center text-accent-blue">
            {title}
          </div>
        ))}
      </div>
    </div>
  );
};

const FloatingIcon = ({ Icon, className }: { Icon: any, className: string }) => (
  <div className={`absolute text-primary/30 ${className} floating interactive`}>
    <Icon size={24} />
  </div>
);

const HeroSection = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      
      {/* Floating Icons */}
      <FloatingIcon Icon={Code} className="top-1/4 left-1/4" />
      <FloatingIcon Icon={Brain} className="top-1/3 right-1/4 floating-delayed" />
      <FloatingIcon Icon={Sparkles} className="bottom-1/3 left-1/6" />
      <FloatingIcon Icon={Zap} className="top-1/2 right-1/6 floating-delayed" />
      <FloatingIcon Icon={Coffee} className="bottom-1/4 right-1/3" />
      
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-6 animate-enter">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight">
              Hi, I'm{' '}
              <span className="text-gradient-hero">Shivaay</span>
            </h1>
            
            <div className="text-2xl lg:text-3xl font-medium text-muted-foreground">
              AI & Software Engineer with a{' '}
              <span className="text-accent-pink font-bold">playful twist</span>
            </div>
            
            <div className="text-xl font-mono">
              <AnimatedTitle />
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            I craft intelligent solutions and build amazing software experiences. 
            When I'm not training neural networks or debugging code, you'll find me 
            exploring the intersection of AI and creativity. ✨
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              size="lg"
              onClick={() => scrollToSection('projects')}
              className="bg-primary hover:bg-primary-dark glow-primary font-semibold"
            >
              View My Work
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('contact')}
              className="border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-background"
            >
              Contact Me
            </Button>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="relative animate-enter-delayed">
          <div className="relative">
            <img 
              src={heroAvatar}
              alt="Shivaay - AI & Software Engineer"
              className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
            />
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-2xl blur-xl -z-10" />
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-lg p-3 floating">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-mono">Status: Coding</span>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm rounded-lg p-3 floating-delayed">
            <div className="text-sm font-mono text-accent-blue">
              {`{ creativity: true }`}
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;