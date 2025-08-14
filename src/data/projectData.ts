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
  orbImage: string;
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
    position: { x: 50, y: 85 },
    orbImage: '/lovable-uploads/c52d682d-306f-430f-b337-630faabf776f.png'
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
    position: { x: 35, y: 70 },
    orbImage: '/lovable-uploads/33ef3e46-a9dd-449d-b1b1-961d9284834e.png'
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
    position: { x: 65, y: 70 },
    orbImage: '/lovable-uploads/7ea291bf-9464-4c1a-bca0-d5796df6f9ab.png'
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
    position: { x: 25, y: 55 },
    orbImage: '/lovable-uploads/0198c131-3560-4b3c-b4a3-b8b5753cee5b.png'
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
    position: { x: 75, y: 55 },
    orbImage: '/lovable-uploads/26685107-4d62-4df2-b678-ef0e3dccebb4.png'
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
    position: { x: 45, y: 40 },
    orbImage: '/lovable-uploads/eda24642-79a3-4c77-9f4e-e7de1e200b2e.png'
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
    position: { x: 55, y: 40 },
    orbImage: '/lovable-uploads/0b2476cd-d781-46b2-8713-c15a18949d04.png'
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
    position: { x: 50, y: 25 },
    orbImage: '/lovable-uploads/c4cc2c4d-4526-426f-80d5-cfffd3425c71.png'
  }
];