import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Mail, MapPin, Coffee, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SocialLink = ({ href, icon: Icon, label }: {
  href: string;
  icon: any;
  label: string;
}) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`p-4 rounded-xl border border-border/50 hover:border-primary transition-all duration-300 group bg-gradient-card interactive`}
  >
    <div className="flex items-center gap-3">
      <Icon size={24} className={`text-primary group-hover:scale-110 transition-transform`} />
      <span className="font-medium">{label}</span>
    </div>
  </a>
);

const FloatingElement = ({ children, className }: { children: React.ReactNode; className: string }) => (
  <div className={`absolute opacity-20 ${className} floating`}>
    {children}
  </div>
);

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send email via API
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Message sent!",
          description: "Thanks for reaching out! I'll get back to you soon. Check your email for confirmation.",
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Error sending message",
        description: "Something went wrong. Please try again or contact me directly at shivaaydhondiyal23@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
      {/* Floating Background Elements */}
      <FloatingElement className="top-10 left-10">
        <Coffee size={32} />
      </FloatingElement>
      <FloatingElement className="top-20 right-20 floating-delayed">
        <Heart size={28} />
      </FloatingElement>
      <FloatingElement className="bottom-20 left-20 floating-delayed">
        <MapPin size={30} />
      </FloatingElement>

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have an exciting project in mind? Want to collaborate on something amazing? 
            Or just want to chat about AI and technology? I'd love to hear from you! ✨
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="bg-gradient-card border-border/50 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="text-primary" size={24} />
                Send Me a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your awesome name"
                    required
                    className="transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    className="transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell me about your project, idea, or just say hi! 👋"
                    rows={6}
                    required
                    className="transition-all duration-300 focus:scale-[1.02] resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark glow-primary transition-all duration-300"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & Social Links */}
          <div className="space-y-8">
            {/* Quick Info */}
            <Card className="bg-gradient-card border-border/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-accent-blue" />
                    <span>Available for remote work worldwide 🌍</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Coffee size={20} className="text-accent-pink" />
                    <span>Always up for a virtual coffee chat ☕</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart size={20} className="text-primary" />
                    <span>Passionate about meaningful projects ❤️</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-semibold">Connect With Me</h3>
              
              <div className="space-y-3">
                <SocialLink 
                  href="https://github.com/shivaay790"
                  icon={Github}
                  label="GitHub"
                />
                
                <SocialLink 
                  href="https://www.linkedin.com/in/shivaay-dhondiyal/"
                  icon={Linkedin}
                  label="LinkedIn"
                />
                
                <SocialLink 
                  href="mailto:shivaaydhondiyal23@gmail.com"
                  icon={Mail}
                  label="Email"
                />
              </div>
            </div>

            {/* Status */}
            <Card className="bg-gradient-card border-border/50 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <Badge variant="secondary" className="font-mono">
                    Status: Available for new opportunities
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Currently seeking exciting AI/ML and full-stack development opportunities. 
                  Let's build something amazing together!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;