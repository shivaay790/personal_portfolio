import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Brain, Code2, Database, Rocket, Cpu, Lightbulb } from 'lucide-react';
import YggdrasilTree from './YggdrasilTree';

const SkillBubble = ({ skill, icon: Icon, level }: { skill: string, icon: any, level: number }) => (
  <div className="relative group">
    <Card className="p-4 bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 card-3d">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon size={20} className="text-primary" />
        </div>
        <div className="flex-1">
          <div className="font-medium">{skill}</div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${level}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  </div>
);


const AboutSection = () => {
  const skills = [
    { skill: "Python", icon: Code2, level: 95 },
    { skill: "ML/DL Architecture", icon: Brain, level: 90 },
    { skill: "C++", icon: Cpu, level: 88 },
    { skill: "C", icon: Cpu, level: 82 },
    { skill: "MySQL", icon: Database, level: 80 },
    { skill: "HTML/CSS/JS", icon: Code2, level: 85 },
    { skill: "TSX / JSX", icon: Code2, level: 84 },
    { skill: "React", icon: Code2, level: 86 },
  ];


  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            I'm passionate about creating intelligent solutions that make a difference. 
            My journey combines technical expertise with creative problem-solving.
          </p>
        </div>

        {/* Skills Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-display font-semibold mb-8 text-center">
            Technical <span className="text-accent-blue">Skills</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <div 
                key={skill.skill}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <SkillBubble {...skill} />
              </div>
            ))}
          </div>
        </div>

        {/* Yggdrasil Tree Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-display font-semibold mb-12 text-center">
            My <span className="text-accent-pink">Journey</span>
          </h3>
          <YggdrasilTree />
        </div>

        {/* Fun Facts */}
        <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
          <Card className="p-6 text-center bg-gradient-card border-border/50">
            <Rocket className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-accent-blue">50+</div>
            <div className="text-muted-foreground">Projects Built</div>
          </Card>
          
          <Card className="p-6 text-center bg-gradient-card border-border/50">
            <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-accent-pink">10+</div>
            <div className="text-muted-foreground">AI Models Trained</div>
          </Card>
          
          <Card className="p-6 text-center bg-gradient-card border-border/50">
            <Lightbulb className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-primary">∞</div>
            <div className="text-muted-foreground">Ideas Generated</div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;