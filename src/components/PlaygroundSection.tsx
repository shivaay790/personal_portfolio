import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles, Code, Brain, Zap } from 'lucide-react';

const CodeVisualizer = () => {
  const [code, setCode] = useState('');
  const [animation, setAnimation] = useState('');

  const handleCodeSubmit = (inputCode: string) => {
    setCode(inputCode);
    // Simple animation based on code keywords
    if (inputCode.includes('loop') || inputCode.includes('for')) {
      setAnimation('animate-spin');
    } else if (inputCode.includes('function') || inputCode.includes('def')) {
      setAnimation('animate-bounce');
    } else if (inputCode.includes('array') || inputCode.includes('list')) {
      setAnimation('animate-pulse');
    } else {
      setAnimation('animate-ping');
    }
    
    setTimeout(() => setAnimation(''), 2000);
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="text-accent-blue" size={20} />
          Code to Animation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input 
          placeholder="Type some code (try: 'for loop', 'function', 'array')"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCodeSubmit(code)}
          className="font-mono"
        />
        <Button 
          onClick={() => handleCodeSubmit(code)}
          className="w-full"
          disabled={!code.trim()}
        >
          Visualize Code
        </Button>
        
        {animation && (
          <div className="flex justify-center pt-4">
            <div className={`w-16 h-16 bg-gradient-primary rounded-lg ${animation}`} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AIChatBot = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hey! I\'m Shivaay\'s AI assistant. Ask me anything about his work! 🤖' }
  ]);

  const botResponses = [
    "That's a great question! Shivaay loves working with neural networks and creative coding! 🧠",
    "Shivaay's favorite programming languages are Python and C++. He's also passionate about TypeScript! 💻",
    "He's currently exploring the intersection of AI and creative applications. Very exciting stuff! ✨",
    "Shivaay believes in building AI that enhances human creativity rather than replacing it! 🚀",
    "You should definitely check out his neural network visualizer project - it's pretty cool! 🎨",
    "He's always experimenting with new technologies. Currently diving deep into transformer architectures! 🔬"
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessages = [
      ...messages,
      { role: 'user', content: message },
      { 
        role: 'bot', 
        content: botResponses[Math.floor(Math.random() * botResponses.length)]
      }
    ];
    
    setMessages(newMessages);
    setMessage('');
  };

  return (
    <Card className="bg-gradient-card border-border/50 h-96 flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="text-accent-pink" size={20} />
          AI Assistant Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto mb-4 max-h-60">
          {messages.map((msg, index) => (
            <div 
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input 
            placeholder="Ask me anything about Shivaay's work..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="sm"
          >
            <Send size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const TechMoodBoard = () => {
  const [selectedMood, setSelectedMood] = useState('');
  
  const moods = [
    { name: 'Creative', color: 'bg-accent-pink', icon: Sparkles },
    { name: 'Focused', color: 'bg-accent-blue', icon: Zap },
    { name: 'Experimental', color: 'bg-primary', icon: Brain },
    { name: 'Collaborative', color: 'bg-accent-blue', icon: Code }
  ];

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" size={20} />
          Tech Mood Board
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          What's your coding mood today?
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {moods.map((mood) => {
            const IconComponent = mood.icon;
            return (
              <Button
                key={mood.name}
                variant={selectedMood === mood.name ? "default" : "outline"}
                onClick={() => setSelectedMood(mood.name)}
                className="h-auto p-4 flex-col gap-2"
              >
                <IconComponent size={20} />
                <span className="text-xs">{mood.name}</span>
              </Button>
            );
          })}
        </div>
        
        {selectedMood && (
          <div className="text-center pt-2">
            <Badge variant="secondary" className="animate-pulse">
              Feeling {selectedMood} today! 🚀
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PlaygroundSection = () => {
  return (
    <section id="playground" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Interactive <span className="text-gradient">Playground</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A fun space to explore AI concepts and interact with creative demos. 
            This is where my playful side meets serious engineering! 🎮
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CodeVisualizer />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <TechMoodBoard />
            </div>
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <AIChatBot />
          </div>
        </div>

        <div className="text-center mt-12 animate-fade-in">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-card border-border/50">
            <div className="space-y-6">
              <Sparkles className="w-8 h-8 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Try My Live Projects!</h3>
              <p className="text-muted-foreground">
                Experience my journey projects in action. Each link takes you to interactive demos 
                where you can explore the technology hands-on.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2 hover:bg-primary/10 border-primary/30"
                  onClick={() => window.open('#', '_blank')}
                >
                  <img 
                    src="/lovable-uploads/33ef3e46-a9dd-449d-b1b1-961d9284834e.png" 
                    alt="Sentiment Analysis" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-xs">Sentiment Analysis</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2 hover:bg-primary/10 border-primary/30"
                  onClick={() => window.open('#', '_blank')}
                >
                  <img 
                    src="/lovable-uploads/7ea291bf-9464-4c1a-bca0-d5796df6f9ab.png" 
                    alt="Hand Gesture" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-xs">Hand Gesture Recognition</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2 hover:bg-primary/10 border-primary/30"
                  onClick={() => window.open('#', '_blank')}
                >
                  <img 
                    src="/lovable-uploads/eda24642-79a3-4c77-9f4e-e7de1e200b2e.png" 
                    alt="Virtual Try-On" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-xs">Virtual Try-On</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PlaygroundSection;