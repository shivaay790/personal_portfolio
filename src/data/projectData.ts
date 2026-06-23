export interface Project {
  id: string;
  title: string;
  date: string;
  shortDescription: string;
  fullDescription: string;
  technologies: string[];
  githubLink?: string;
  demoLink?: string;
  extraLinks?: { label: string; url: string }[];
  phase: 'roots' | 'learning' | 'advanced' | 'research' | 'achievements' | 'professional';
  position: { x: number; y: number }; // Position on the tree
  orbImage: string;
}

export const projectsData: Project[] = [
  {
    id: 'school',
    title: 'Schooling at DPSD',
    date: '2011 - 2024',
    shortDescription: 'Completed Senior Secondary with 94.20%',
    fullDescription: 'Finished Class XII CBSE at Delhi Private School, Dubai (DPSD). Laid the foundation for my academic and technical journey.',
    technologies: ['Academic Foundation', 'Mathematics', 'Physics'],
    phase: 'roots',
    position: { x: 50, y: 5 },
    orbImage: '/orbs/c52d682d-306f-430f-b337-630faabf776f.png'
  },
  {
    id: 'college-start',
    title: 'DTU B.Tech CSE',
    date: 'Aug 2024',
    shortDescription: 'Started Computer Science at Delhi Technological University',
    fullDescription: 'Began my engineering journey at DTU with a CGPA of 8.5. Immersed myself in the world of AI and Deep Learning.',
    technologies: ['Computer Science', 'Algorithms'],
    phase: 'roots',
    position: { x: 50, y: 10 },
    orbImage: '/orbs/c52d682d-306f-430f-b337-630faabf776f.png'
  },
  {
    id: 'aims-dtu',
    title: 'AIMS DTU Co-Head',
    date: 'Aug 2024 - Jan 2026',
    shortDescription: 'Led the AIML Society of DTU',
    fullDescription: 'Served as Co-Head of AIMS DTU, organizing workshops and fostering an AI/ML culture among students.',
    technologies: ['Leadership', 'Community Building', 'AI/ML'],
    phase: 'roots',
    position: { x: 42, y: 14 },
    orbImage: '/orbs/33ef3e46-a9dd-449d-b1b1-961d9284834e.png'
  },
  {
    id: 'yuvaan-dtu',
    title: 'Yuvaan Corporate Executive',
    date: 'Aug 2024 - Aug 2025',
    shortDescription: 'Literature & Film Fest DTU',
    fullDescription: 'Managed corporate relations and sponsorships for Yuvaan, DTU\'s premier literature and film festival.',
    technologies: ['Management', 'Corporate Relations'],
    phase: 'roots',
    position: { x: 58, y: 14 },
    orbImage: '/orbs/7ea291bf-9464-4c1a-bca0-d5796df6f9ab.png'
  },
  {
    id: 'cotech-intern',
    title: 'AI Intern - COTECH',
    date: 'Sept 2024 - Oct 2024',
    shortDescription: 'NLP and RL projects',
    fullDescription: 'Developed sentiment classifiers and RL-based optimization systems (Cartpole) using PPO.',
    technologies: ['NLP', 'RL', 'PPO', 'Transformers'],
    extraLinks: [
      { label: 'Cartpole RL', url: 'https://github.com/shivaay790/Carpole-problem' },
      { label: 'Sentiment Analysis', url: 'https://github.com/shivaay790/Sentiment-Analysis' }
    ],
    phase: 'learning',
    position: { x: 50, y: 18 },
    orbImage: '/orbs/0198c131-3560-4b3c-b4a3-b8b5753cee5b.png'
  },
  {
    id: 'ml-intro',
    title: 'Intro to ML - Kaggle',
    date: 'Oct 2024',
    shortDescription: 'Foundational ML Certification',
    fullDescription: 'Mastered the basics of machine learning, including data preprocessing and basic model building.',
    technologies: ['Kaggle', 'Python', 'ML Basics'],
    demoLink: 'https://www.kaggle.com/learn/certification/shivaaydhondiyal/intro-to-machine-learning',
    phase: 'learning',
    position: { x: 44, y: 22 },
    orbImage: '/orbs/26685107-4d62-4df2-b678-ef0e3dccebb4.png'
  },
  {
    id: 'ml-intermediate',
    title: 'Intermediate ML - Kaggle',
    date: 'Oct 2024',
    shortDescription: 'Advanced ML Certification',
    fullDescription: 'Learned handling missing values, categorical variables, and pipelines.',
    technologies: ['Kaggle', 'Pipelines', 'Advanced ML'],
    demoLink: 'https://www.kaggle.com/learn/certification/shivaaydhondiyal/intermediate-machine-learning',
    phase: 'learning',
    position: { x: 56, y: 22 },
    orbImage: '/orbs/26685107-4d62-4df2-b678-ef0e3dccebb4.png'
  },
  {
    id: 'seo-forge',
    title: 'AI-Powered SEO Optimization',
    date: 'Oct 25, 2024',
    shortDescription: 'BERT-driven SEO tool',
    fullDescription: 'Developed an AI-driven SEO tool using BERT embeddings to enhance content ranking and keyword relevance.',
    technologies: ['BERT', 'TF-IDF', 'NER', 'Python'],
    githubLink: 'https://github.com/shivaay790/SEO_forge',
    phase: 'advanced',
    position: { x: 50, y: 26 },
    orbImage: '/orbs/eda24642-79a3-4c77-9f4e-e7de1e200b2e.png'
  },
  {
    id: 'hand-gesture',
    title: 'Hand Gesture Drone Control',
    date: 'Dec 29, 2024',
    shortDescription: 'CV-based drone flight control',
    fullDescription: 'Built a real-time gesture-controlled drone system integrating MediaPipe and CNN classification.',
    technologies: ['MediaPipe', 'CNN', 'PyBullet', 'OpenCV'],
    githubLink: 'https://github.com/shivaay790/hand_gesture',
    demoLink: 'https://hand-gesture.shivaaydhondiyal.online/',
    phase: 'advanced',
    position: { x: 50, y: 30 },
    orbImage: '/orbs/0b2476cd-d781-46b2-8713-c15a18949d04.png'
  },
  {
    id: 'ml-specialization',
    title: 'ML Specialization',
    date: 'Jan 2, 2025',
    shortDescription: 'Deeplearning.AI Certification',
    fullDescription: 'Comprehensive ML course covering supervised and unsupervised learning.',
    technologies: ['Deeplearning.AI', 'Supervised Learning', 'Unsupervised Learning'],
    demoLink: 'https://www.coursera.org/account/accomplishments/specialization/RZUR39SVJBIF',
    phase: 'advanced',
    position: { x: 44, y: 34 },
    orbImage: '/orbs/c4cc2c4d-4526-426f-80d5-cfffd3425c71.png'
  },
  {
    id: 'dl-specialization',
    title: 'DL Specialization',
    date: 'Mar 14, 2025',
    shortDescription: 'Deeplearning.AI Certification',
    fullDescription: 'In-depth deep learning specialization covering CNNs, RNNs, and more.',
    technologies: ['Deeplearning.AI', 'Neural Networks', 'CNN', 'RNN'],
    demoLink: 'https://www.coursera.org/account/accomplishments/specialization/5JLSDARI6KDD',
    phase: 'advanced',
    position: { x: 56, y: 34 },
    orbImage: '/orbs/c4cc2c4d-4526-426f-80d5-cfffd3425c71.png'
  },
  {
    id: 'python-trading',
    title: 'Python for Trading',
    date: 'Mar 18, 2025',
    shortDescription: 'Quantinsti Certification',
    fullDescription: 'Learned the basics of algorithmic trading using Python.',
    technologies: ['Python', 'Trading', 'Financial Analysis'],
    demoLink: 'https://quantra.quantinsti.com/certificate-snap/python-trading-basic?certificateKey=9cb7686c1bde2fba9b1ca2d288115824beccac28ac04df3dbce6f9e84c82e250ebb989e5ea6f3165e5fc47f066248b9f',
    phase: 'advanced',
    position: { x: 50, y: 38 },
    orbImage: '/orbs/fa1fe5e0-7f22-4b19-80c9-0c613c05cf0f.png'
  },
  {
    id: 'mental-health-chatbot',
    title: 'Mental Health Chatbot',
    date: 'Mar 29, 2025',
    shortDescription: 'RAG-powered empathetic AI',
    fullDescription: 'Built an LLM-powered mental health chatbot leveraging FastAPI, React, FAISS, and RAG.',
    technologies: ['FastAPI', 'React', 'FAISS', 'RAG', 'Gemini 2.0'],
    githubLink: 'https://github.com/shivaay790/Mental-Health-Chatbot',
    demoLink: 'https://chatbot.shivaaydhondiyal.online/',
    phase: 'research',
    position: { x: 50, y: 42 },
    orbImage: '/orbs/c52d682d-306f-430f-b337-630faabf776f.png'
  },
  {
    id: 'dream-team-hackathon',
    title: 'Dream Team Hackathon',
    date: 'Feb 2025',
    shortDescription: '2nd Place Winner',
    fullDescription: 'Won 2nd place in the Dream Team Challenge Hackathon among 1000+ participants.',
    technologies: ['Hackathon', 'Teamwork', 'Innovation'],
    phase: 'achievements',
    position: { x: 42, y: 46 },
    orbImage: '/orbs/33ef3e46-a9dd-449d-b1b1-961d9284834e.png'
  },
  {
    id: 'research-forge-hackathon',
    title: 'Research Forge Hackathon',
    date: 'Feb 2025',
    shortDescription: '2nd Place Winner',
    fullDescription: 'Won 2nd place in the Research Forge Hackathon among 1200+ participants.',
    technologies: ['Research', 'Problem Solving', 'Hackathon'],
    phase: 'achievements',
    position: { x: 58, y: 46 },
    orbImage: '/orbs/7ea291bf-9464-4c1a-bca0-d5796df6f9ab.png'
  },
  {
    id: 'apogee-ctf',
    title: 'APOGEE \'25 CTF',
    date: 'Mar 2025',
    shortDescription: '1st Place Winner',
    fullDescription: 'Secured 1st place in APOGEE \'25 CTF organized by BITS Pilani among 1500+ participants.',
    technologies: ['Cybersecurity', 'CTF', 'Problem Solving'],
    phase: 'achievements',
    position: { x: 50, y: 50 },
    orbImage: '/orbs/0198c131-3560-4b3c-b4a3-b8b5753cee5b.png'
  },
  {
    id: 'ai-research-intern-dtu',
    title: 'AI Research Intern - DTU',
    date: 'June 2025 - July 2025',
    shortDescription: 'Audio Deepfake Detection',
    fullDescription: 'Developed Liquid Neural Network architecture for audio deepfake detection, outperforming SOTA models.',
    technologies: ['Liquid Neural Networks', 'Wav2Vec2.0', 'Deepfake Detection'],
    phase: 'research',
    position: { x: 38, y: 54 },
    orbImage: '/orbs/26685107-4d62-4df2-b678-ef0e3dccebb4.png'
  },
  {
    id: 'projects-node',
    title: 'Advanced Projects',
    date: 'Jun - July 2025',
    shortDescription: 'Crowd Counting & VITON',
    fullDescription: 'Deep dive into specialized computer vision tasks.',
    technologies: ['Computer Vision', 'PyTorch'],
    phase: 'advanced',
    position: { x: 62, y: 54 },
    orbImage: '/orbs/eda24642-79a3-4c77-9f4e-e7de1e200b2e.png'
  },
  {
    id: 'crowd-counting',
    title: 'DL Crowd Counting',
    date: 'Jun 21, 2025',
    shortDescription: 'Density estimation model',
    fullDescription: 'Designed crowd analytics model using VGG16 and CBAM attention for precise density estimation.',
    technologies: ['VGG16', 'CBAM', 'DBSCAN', 'PyTorch'],
    githubLink: 'https://github.com/shivaay790/DL_crowd_counting',
    demoLink: 'https://crowd-counting.shivaaydhondiyal.online/',
    phase: 'advanced',
    position: { x: 62, y: 58 },
    orbImage: '/orbs/0b2476cd-d781-46b2-8713-c15a18949d04.png'
  },
  {
    id: 'viton',
    title: 'VITON - Virtual Try-On',
    date: 'July 30, 2025',
    shortDescription: 'Pose-guided cloth warping',
    fullDescription: 'Implemented pose estimation and cloth warping for virtual try-on using PyTorch and Pinecone.',
    technologies: ['PyTorch', 'OpenCV', 'Pinecone', 'Fashion-CLIP'],
    githubLink: 'https://github.com/shivaay790/VITON',
    phase: 'advanced',
    position: { x: 62, y: 62 },
    orbImage: '/orbs/c4cc2c4d-4526-426f-80d5-cfffd3425c71.png'
  },
  {
    id: 'sih-gov-portal',
    title: 'Gov Internship Portal',
    date: 'Sep 12, 2025',
    shortDescription: 'AI-integrated portal',
    fullDescription: 'Implemented NLP-powered resume parsing and skill gap analysis for government internships.',
    technologies: ['React', 'Tailwind', 'Gemini RAG', 'Selenium'],
    githubLink: 'https://github.com/shivaay790/sih_proj',
    phase: 'professional',
    position: { x: 42, y: 66 },
    orbImage: '/orbs/fa1fe5e0-7f22-4b19-80c9-0c613c05cf0f.png'
  },
  {
    id: 'ir-image-enhancement',
    title: 'IR Image Enhancement',
    date: 'Oct 15, 2025',
    shortDescription: 'Multi-modal thermal SR',
    fullDescription: 'Built physics-guided thermal super-resolution with Swin Transformers.',
    technologies: ['Swin Transformers', 'Landsat-8', 'Thermal SR', 'PyTorch'],
    githubLink: 'https://github.com/RS-010806/Thermal_SR',
    phase: 'research',
    position: { x: 58, y: 66 },
    orbImage: '/orbs/c52d682d-306f-430f-b337-630faabf776f.png'
  },
  {
    id: 'ai-engineer-stealth',
    title: 'AI Engineer - Stealth Startup',
    date: 'Nov 2025 - Dec 2025',
    shortDescription: 'Healthcare voice agents',
    fullDescription: 'Automated analytics for 1M+ healthcare calls and built voice agent workflows.',
    technologies: ['STT/TTS', 'Metabase', 'Healthcare AI'],
    demoLink: 'https://www.linkedin.com/company/stealth-startup-community/',
    phase: 'professional',
    position: { x: 44, y: 70 },
    orbImage: '/orbs/33ef3e46-a9dd-449d-b1b1-961d9284834e.png'
  },
  {
    id: 'sih-grand-finalist',
    title: 'SIH Grand Finalist',
    date: 'Dec 2025',
    shortDescription: 'Improved Gov Portal',
    fullDescription: 'Finalist in Smart India Hackathon, significantly improving the government internship portal.',
    technologies: ['SIH', 'Innovation', 'Impact'],
    phase: 'achievements',
    position: { x: 56, y: 70 },
    orbImage: '/orbs/7ea291bf-9464-4c1a-bca0-d5796df6f9ab.png'
  },
  {
    id: 'zervai-datathon',
    title: '1st - ZervAI\'25 Datathon',
    date: 'Dec 2025',
    shortDescription: 'IIT Bombay Winner',
    fullDescription: 'Secured 1st place in ZervAI\'25 Datathon organized by IIT Bombay.',
    technologies: ['Datathon', 'IIT Bombay', 'Data Science'],
    phase: 'achievements',
    position: { x: 46, y: 74 },
    orbImage: '/orbs/0198c131-3560-4b3c-b4a3-b8b5753cee5b.png'
  },
  {
    id: 'package-case-comp',
    title: '2nd - Package\'25 Case Comp',
    date: 'Dec 2025',
    shortDescription: 'IIT Bombay Runner-up',
    fullDescription: 'Secured 2nd place in Package\'25 Case Competition organized by IIT Bombay.',
    technologies: ['Case Competition', 'IIT Bombay', 'Strategy'],
    phase: 'achievements',
    position: { x: 54, y: 74 },
    orbImage: '/orbs/26685107-4d62-4df2-b678-ef0e3dccebb4.png'
  },
  {
    id: 'paper-2',
    title: 'Research Paper 2',
    date: 'Jan 10, 2026',
    shortDescription: 'Deepfake Detection Research',
    fullDescription: 'Written research paper in deepfake detection under Prof. Dinesh K Vishwakarma.',
    technologies: ['Deepfake Detection', 'Research', 'Academic Writing'],
    phase: 'research',
    position: { x: 50, y: 78 },
    orbImage: '/orbs/eda24642-79a3-4c77-9f4e-e7de1e200b2e.png'
  },
  {
    id: 'paper-3',
    title: 'Research Paper 3',
    date: 'Feb 7, 2026',
    shortDescription: 'Fundus Diseases Classification',
    fullDescription: 'Written research paper in Fundas diseases classification under Prof. राहुल कटारिया.',
    technologies: ['Medical AI', 'Classification', 'Research'],
    phase: 'research',
    position: { x: 50, y: 81 },
    orbImage: '/orbs/0b2476cd-d781-46b2-8713-c15a18949d04.png'
  },
  {
    id: 'paper-4',
    title: 'Research Paper 4',
    date: 'Mar 1, 2026',
    shortDescription: 'Ongoing AI Research',
    fullDescription: 'Fourth research paper in the field of artificial intelligence.',
    technologies: ['AI', 'Deep Learning', 'Research'],
    phase: 'research',
    position: { x: 50, y: 84 },
    orbImage: '/orbs/c4cc2c4d-4526-426f-80d5-cfffd3425c71.png'
  },
  {
    id: 'paper-5',
    title: 'Research Paper 5',
    date: 'May 01, 2026',
    shortDescription: 'Future Publication',
    fullDescription: 'Fifth research paper to be published in a top-tier venue.',
    technologies: ['Advanced AI', 'Research'],
    phase: 'research',
    position: { x: 50, y: 87 },
    orbImage: '/orbs/fa1fe5e0-7f22-4b19-80c9-0c613c05cf0f.png'
  },
  {
    id: 'portfolio',
    title: 'Personal Portfolio',
    date: 'May 2026',
    shortDescription: '3D Interactive Portfolio',
    fullDescription: 'Built an interactive 3D portfolio using React, Three.js, and Tailwind.',
    technologies: ['React', 'Three.js', 'Tailwind', 'Vite'],
    githubLink: 'https://github.com/shivaay790/personal-portfolio',
    demoLink: 'https://shivaaydhondiyal.online/',
    phase: 'professional',
    position: { x: 50, y: 92 },
    orbImage: '/orbs/c52d682d-306f-430f-b337-630faabf776f.png'
  }
];
