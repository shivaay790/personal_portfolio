import { Heart, Code, Coffee } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span>Made with</span>
            <Heart size={16} className="text-accent-pink animate-pulse" />
            <span>and lots of</span>
            <Coffee size={16} className="text-accent-blue" />
            <span>by Shivaay</span>
          </div>
          
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground font-mono">
            <Code size={14} />
            <span>"Code is poetry, AI is magic, and bugs are just surprise features."</span>
            <Code size={14} />
          </div>
          
          <div className="text-sm text-muted-foreground">
            © 2024 Shivaay. All rights reserved. Built with React, TypeScript & a touch of creativity.
          </div>
          
          <div className="pt-4">
            <div className="w-20 h-px bg-gradient-primary mx-auto opacity-50" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;