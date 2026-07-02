import { Project, Experience, Education, SkillCategory, ChartDataPoint, Achievement, TimelineItem } from './types';
import profileImage from './assets/profilee.jpg';
import vectrasimImage from './assets/vectrasim.png.png';

export const PERSONAL_INFO = {
  name: "Yash Surve",
  title: "Robotics & Automation Engineering Student",
  location: "Pune, India",
  tagline: "Developing AI-driven robotic systems with ROS 2 and Deep Learning.",
  about: "Robotics and Automation Engineering student focused on AI-driven robotic systems. Hands-on with ROS 2, embedded control, and mechanical CAD/FEA, experienced building TensorFlow-based CV/NLP models and deploying Arduino-powered prototypes. Seeking opportunities to apply perception, control, and simulation skills to real-world robots.",
  email: "yashusurve2005@gmail.com",
  phone: "+91 79723 08355",
  github: "https://github.com/Yashs2024", 
  linkedin: "https://www.linkedin.com/in/yash-surve-3b6a72253",
  resumeLink: '/resume.pdf',
  profileImage: profileImage
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Programming",
    skills: ["Python (production experience)", "C++ (Embedded)", "ROS 2 (Humble/Foxy)", "MATLAB", "LaTeX"]
  },
  {
    title: "AI & Machine Learning",
    skills: ["MediaPipe (Gesture Control)", "TensorFlow", "OpenCV (Computer Vision)", "Google AI Studio", "Deep Learning"]
  },
  {
    title: "Robotics & Hardware",
    skills: ["ESP32/NodeMCU", "Inverse Kinematics", "Gazebo Sim", "PCB Design", "LiPo Battery Safety"]
  },
  {
    title: "CAD & Prototyping",
    skills: ["Autodesk Fusion 360 (Advanced Surface Modeling)", "DFM (3D Printing)", "Ansys Workbench", "Tolerance Analysis"]
  }
];

export const SKILL_CHART_DATA: ChartDataPoint[] = [
  { subject: 'ROS 2', A: 50, fullMark: 100 },
  { subject: 'Python', A: 75, fullMark: 100 },
  { subject: 'Fusion 360', A: 65, fullMark: 100 },
  { subject: 'Embedded C', A: 55, fullMark: 100 },
  { subject: 'Comp Vision', A: 95, fullMark: 100 },
  { subject: 'Kinematics', A: 70, fullMark: 100 },
];

export const EXPERIENCE: Experience[] = [
  {
    id: "0",
    role: "Robotics Software Engineer Intern",
    company: "Botmakers Pvt Limited",
    location: "Pune, India",
    period: "Nov 2025 - Present",
    description: [
      "Engineered 'Sesame Quadruped', a research-grade 8-DOF robot under ₹4,000 using ESP32-S2 and custom Inverse Kinematics engine.",
      "Led technical workshops at IIT Bombay Techfest 2025 and PCCOE Akurdi, mentoring 500+ students in Drone fabrication and IoT.",
      "Designed and deployed a low-cost (<₹500) IoT educational kit and comprehensive drone curriculum (DGCA regulations, PID tuning).",
      "Developed 'Physical AI' systems combining MediaPipe gesture tracking with UDP communication for real-time robot control."
    ],
    technologies: ["Fusion 360", "Inverse Kinematics", "ESP32", "MediaPipe", "Public Speaking"]
  },
  {
    id: "1",
    role: "AI Intern",
    company: "Personifwy Artificial Intelligence Division",
    location: "Bengaluru, Karnataka",
    period: "Jul 2025 - Sep 2025",
    description: [
      "Achieved 92% accuracy on text classification model using TensorFlow.",
      "Reduced model inference time by 30% through optimization techniques.",
      "Processed and annotated 5000+ images for object detection training.",
      "Implemented landmark detection pipeline combining OpenCV preprocessing with CNN-based feature extraction."
    ],
    technologies: ["TensorFlow", "OpenCV", "Python", "CNN", "Deep Learning"]
  }
];

export const PROJECTS: Project[] = [
  {
    id: "p6",
    title: "🤖 VectraSim Suite — Multi-Engine Robotics Simulation Platform",
    description: "An interactive, browser-based, high-performance robotics simulation platform containing four standalone engine simulators accessible from a single cyber-themed hub. Designed as a modern educational tool for robotics, kinematics, logistics, and drone swarm flight dynamics. The platform operates completely in the browser—leveraging Vanilla JavaScript, HTML5 Canvas 2D, and Three.js WebGL rendering for 60FPS execution with zero backend dependencies.",
    technologies: ["JavaScript", "HTML5 Canvas", "Three.js", "WebGL", "Vite", "Algorithms"],
    imageUrl: vectrasimImage,
    category: "Robotics",
    featured: true,
    demoVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    githubUrl: "https://github.com/Yashs2024/robotic-Slam-lidar-simulator"
  },
  {
    id: "p7",
    title: "RoboArm Nexus",
    description: "An industrial-grade robotic arm control suite built with React, MediaPipe, and Google Gemini. Features real-time hand tracking, 2-DOF Inverse Kinematics simulation, and AI-powered firmware generation for Python and Arduino.",
    technologies: ["React", "MediaPipe", "Google Gemini", "Inverse Kinematics", "Python"],
    imageUrl: "https://raw.githubusercontent.com/Yashs2024/roboarm-nexus/main/public/images/Screenshot%202026-03-07%20182401.png",
    category: "Robotics",
    featured: true,
    demoVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    githubUrl: "https://github.com/Yashs2024/roboarm-nexus"
  },
  {
    id: "p8",
    title: "RoboHand Simulator",
    description: "A real-time 'Digital Twin' experiment that maps human hand gestures onto a 3D robotic model entirely in the browser. Built with React, Three.js, and Google's MediaPipe, creating a seamless bridge between optical hand tracking and WebGL visualization.",
    technologies: ["React", "Three.js", "MediaPipe", "WebGL", "Computer Vision"],
    imageUrl: "https://raw.githubusercontent.com/Yashs2024/robohand-simulator-with-OpenCV/main/public/Screenshot%202026-03-07%20180708.png",
    category: "AI/ML",
    featured: true,
    githubUrl: "https://github.com/Yashs2024/robohand-simulator-with-OpenCV"
  },
  {
    id: "p1",
    title: "Sesame Quadruped (8-DOF)",
    description: "A low-cost, research-grade quadruped robot. Designed a monocoque chassis in Fusion 360 with internal cable routing. Developed a custom Inverse Kinematics (IK) engine in C++ running on ESP32-S2 to calculate Hip and Knee angles in real-time.",
    technologies: ["Fusion 360", "C++", "Inverse Kinematics", "ESP32", "3D Printing"],
    imageUrl: "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?auto=format&fit=crop&q=80&w=800",
    category: "Robotics",
    featured: true,
    githubUrl: "#"
  },
  {
    id: "p2",
    title: "AI-Controlled Biomimetic Hand",
    description: "An anthropomorphic robotic hand controlled via human gestures. Used MediaPipe for hand tracking and UDP for low-latency communication to NodeMCU. Designed an underactuated tendon system using fishing lines (flexors) and elastic threads (extensors).",
    technologies: ["Python", "MediaPipe", "OpenCV", "UDP", "IoT"],
    imageUrl: "https://raw.githubusercontent.com/Yashs2024/roboarm-nexus/main/public/images/Ai%20gestured%20controlled%20robohand.jpeg",
    category: "AI/ML",
    featured: true,
    githubUrl: "#"
  },
  {
    id: "p4",
    title: "6 DOF Robotic Arm with Sliding Base",
    description: "Designed a 6 DOF robotic arm and base in Fusion 360, conducting stress analysis in Ansys. Achieved ±2mm positioning accuracy across 800mm workspace. Optimized trajectory planning reducing motion time by 25%. Successfully tested with payloads up to 2kg.",
    technologies: ["Fusion 360", "Ansys", "Arduino", "C++", "Kinematics"],
    imageUrl: "https://www.okystar.com/wp-content/uploads/2018/08/square-base-manipulator-5.jpg",
    category: "Robotics",
    featured: false,
    githubUrl: "#"
  },
  {
    id: "p5",
    title: "Alumni Management System (AlumniX)",
    description: "Developed for Smart India Hackathon 2025. Built scalable system supporting 1000+ alumni profiles. AI chatbot handles 50+ query types with 85% accuracy. Reduced manual query response time from hours to seconds.",
    technologies: ["React.js", "Next.js", "Figma", "AI Integration"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "AI/ML",
    featured: false,
    githubUrl: "#"
  }
];

export const EDUCATION: Education[] = [
  {
    id: "1",
    degree: "B.Tech in Automation & Robotics",
    institution: "MES Wadia College of Engineering, Pune",
    year: "2023 - 2027",
    details: "CGPA: 8.00/10"
  },
  {
    id: "2",
    degree: "HSC (Class 12)",
    institution: "ASM Junior College, Pune",
    year: "2021 - 2023",
    details: "Aggregate: 73.33%"
  },
  {
    id: "3",
    degree: "SSC (Class 10)",
    institution: "SPG International Public School, Pune",
    year: "2009 - 2021",
    details: "Aggregate: 80.20%"
  }
];

export const CERTIFICATIONS: string[] = [
  "Advanced Python",
  "Autodesk Fusion 360",
  "TensorFlow",
  "ROS 2",
  "Battery Safety (LiPo)"
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "1",
    title: "Smart India Hackathon 2025",
    description: "Participant - Built Alumni Management System with AI integration",
    icon: "Code"
  },
  {
    id: "3",
    title: "Academic Achievement",
    description: "8.00 CGPA in Robotics & Automation Engineering",
    icon: "GraduationCap"
  }
];

export const TIMELINE: TimelineItem[] = [
  {
    id: "t1",
    year: "2021",
    title: "First Arduino Project",
    description: "Built my first electronics project — a sensor-driven LED matrix using Arduino UNO. Sparked a passion for embedded systems and hardware-software integration.",
    icon: "🔌",
    type: "project"
  },
  {
    id: "t2",
    year: "2023",
    title: "B.Tech Robotics & Automation — MES Wadia",
    description: "Enrolled in Robotics & Automation Engineering at MES Wadia College of Engineering, Pune. Began studying kinematics, control systems, and embedded programming.",
    icon: "🎓",
    type: "education"
  },
  {
    id: "t3",
    year: "2024",
    title: "AI-Controlled Biomimetic Hand",
    description: "Built an anthropomorphic robotic hand controlled by gestures using MediaPipe + UDP. First real-world intersection of AI and physical robotics.",
    icon: "🤖",
    type: "project"
  },
  {
    id: "t4",
    year: "2025 Q1",
    title: "RoboArm Nexus & RoboHand Simulator",
    description: "Developed browser-based robotic arm control suite with React, MediaPipe, and Google Gemini AI — with 2-DOF IK simulation and AI firmware generation.",
    icon: "💻",
    type: "project"
  },
  {
    id: "t5",
    year: "2025 Q2",
    title: "Smart India Hackathon 2025",
    description: "Participated in SIH 2025. Built AlumniX — a scalable alumni management system with an AI chatbot handling 50+ query types at 85% accuracy.",
    icon: "🏆",
    type: "achievement"
  },
  {
    id: "t6",
    year: "2025 Q3",
    title: "AI Intern — Personifwy AI Division",
    description: "Achieved 92% accuracy on text classification with TensorFlow. Reduced model inference time by 30% through optimization. Processed 5000+ images for object detection.",
    icon: "🧠",
    type: "work"
  },
  {
    id: "t7",
    year: "2025 Q4",
    title: "IIT Bombay Techfest 2025 Workshop",
    description: "Led technical workshops at IIT Bombay Techfest 2025 mentoring 500+ students in drone fabrication, IoT systems, and PID tuning.",
    icon: "📡",
    type: "achievement"
  },
  {
    id: "t8",
    year: "2025 Nov",
    title: "Robotics SWE Intern — Botmakers",
    description: "Engineered Sesame Quadruped — a research-grade 8-DOF robot under ₹4,000 with custom IK engine on ESP32-S2. Developed 'Physical AI' systems with MediaPipe + UDP.",
    icon: "🦾",
    type: "work"
  },
  {
    id: "t9",
    year: "2026",
    title: "VectraSim Suite — Multi-Engine Simulation Platform",
    description: "Built a browser-based robotics simulation platform with four standalone engine simulators — SLAM, drone swarm dynamics, logistics, and kinematics — running at 60FPS with zero backend.",
    icon: "🚀",
    type: "project"
  }
];