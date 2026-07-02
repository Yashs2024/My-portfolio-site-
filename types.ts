export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  githubUrl?: string;
  demoUrl?: string;
  category: 'Robotics' | 'AI/ML' | 'Automation' | 'Other';
  featured: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface ChartDataPoint {
  subject: string;
  A: number; // Proficiency level (0-100)
  fullMark: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'Award' | 'Code' | 'GraduationCap' | 'Trophy';
}
