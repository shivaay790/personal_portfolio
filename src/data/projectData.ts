export interface Project {
  id: string;
  title: string;
  date: string;
  shortDescription: string;
  fullDescription: string;
  technologies: string[];
  githubLink: string;
  demoLink?: string;
  phase: 'roots' | 'learning' | 'advanced' | 'research';
  position: { x: number; y: number }; // Position on the tree
}

export const projectsData: Project[] = [
  {
    id: 'college-start',
    title: 'Joined College',
    date: 'Aug 2024',
    shortDescription: 'Started my journey into Computer Science',
    fullDescription: 'Began my computer science studies, laying the foundation for my technical journey.',
    technologies: ['Academic Foundation'],
    githubLink: '#',
    phase: 'roots',
    position: { x: 0, y: 0 }
  },
  {
    id: 'sentiment-analysis',
    title: 'Sentiment Analysis Project',
    date: 'Sep 2024',
    shortDescription: 'Built NLP model for sentiment classification',
    fullDescription: 'Developed a machine learning model to analyze sentiment in text data using natural language processing techniques.',
    technologies: ['Python', 'NLTK', 'Scikit-learn', 'Pandas'],
    githubLink: 'https://github.com/yourusername/sentiment-analysis',
    demoLink: 'https://sentiment-demo.com',
    phase: 'learning',
    position: { x: -150, y: -100 }
  },
  {
    id: 'hand-gesture',
    title: 'Hand Gesture Recognition',
    date: 'Dec 2024',
    shortDescription: 'Computer vision system for gesture detection',
    fullDescription: 'Created a real-time hand gesture recognition system using computer vision and deep learning.',
    technologies: ['Python', 'OpenCV', 'TensorFlow', 'MediaPipe'],
    githubLink: 'https://github.com/yourusername/hand-gesture',
    demoLink: 'https://gesture-demo.com',
    phase: 'learning',
    position: { x: 150, y: -120 }
  },
  {
    id: 'empathic-chatbot',
    title: 'Empathic Chatbot',
    date: 'Mar 2025',
    shortDescription: 'AI chatbot with emotional intelligence',
    fullDescription: 'Developed an AI chatbot capable of understanding and responding to human emotions with empathy.',
    technologies: ['Python', 'Transformers', 'BERT', 'Flask', 'React'],
    githubLink: 'https://github.com/yourusername/empathic-chatbot',
    demoLink: 'https://chatbot-demo.com',
    phase: 'advanced',
    position: { x: -200, y: -200 }
  },
  {
    id: 'crowd-counting',
    title: 'DL Crowd Counting',
    date: 'Jun 2025',
    shortDescription: 'Deep learning model for crowd density estimation',
    fullDescription: 'Built a sophisticated deep learning system for accurate crowd counting and density estimation.',
    technologies: ['Python', 'PyTorch', 'Computer Vision', 'CNNs'],
    githubLink: 'https://github.com/yourusername/crowd-counting',
    phase: 'advanced',
    position: { x: 0, y: -250 }
  },
  {
    id: 'virtual-tryon',
    title: 'Virtual Try-On (VTON)',
    date: 'Jul 2025',
    shortDescription: 'AR/AI-powered virtual clothing try-on system',
    fullDescription: 'Created an advanced virtual try-on system using computer vision and augmented reality.',
    technologies: ['Python', 'TensorFlow', 'OpenCV', 'Unity', 'AR'],
    githubLink: 'https://github.com/yourusername/virtual-tryon',
    demoLink: 'https://vton-demo.com',
    phase: 'advanced',
    position: { x: 200, y: -220 }
  },
  {
    id: 'research-paper',
    title: 'Research Paper',
    date: 'Ongoing',
    shortDescription: 'Academic research in AI/ML domain',
    fullDescription: 'Currently working on original research contributing to the field of artificial intelligence.',
    technologies: ['Research', 'Academic Writing', 'Experimental Design'],
    githubLink: 'https://github.com/yourusername/research',
    phase: 'research',
    position: { x: -100, y: -300 }
  },
  {
    id: 'capstone-project',
    title: 'Personal Project Synthesis',
    date: 'Aug 2025',
    shortDescription: 'Combining all previous projects into one system',
    fullDescription: 'A comprehensive project that integrates learnings and technologies from all previous projects.',
    technologies: ['Full Stack', 'AI/ML', 'System Design', 'Integration'],
    githubLink: 'https://github.com/yourusername/capstone',
    demoLink: 'https://capstone-demo.com',
    phase: 'research',
    position: { x: 100, y: -320 }
  }
];