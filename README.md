# Yash Surve - Robotics & Automation Portfolio 🤖✨

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer-Black?style=for-the-badge&logo=framer&logoColor=blue)

Welcome to the source code of my personal portfolio website! As a Robotics & Automation Engineering student, I wanted to build a portfolio that doesn't just list my skills, but actively demonstrates my understanding of robotics concepts through interactive web technologies.

🌐 **Live Site:** [Insert Live URL Here]

## 🚀 Key Features

Beyond standard portfolio sections (About, Experience, Projects), this site features a custom **Robotics Lab** with interactive simulations:

*   **Inverse Kinematics (IK) Solver:** An interactive 3-segment robotic arm simulation on an HTML5 Canvas. Users can drag a target and watch the arm calculate joint angles in real-time using the FABRIK algorithm.
*   **Automated Quality Control Assembly Line:** A live conveyor belt simulation featuring a computer vision scanner and a robotic sorting arm that detects and rejects defective products, complete with live yield statistics.
*   **Pathfinding Visualizer:** An interactive grid demonstrating Dijkstra's Algorithm. Users can draw walls, move the start/target nodes, and watch the algorithm find the shortest path in real-time.
*   **3D Hero Section:** An immersive, interactive 3D background powered by `@react-three/fiber` and `@react-three/drei`.
*   **Glassmorphism & Depth Integration:** Sleek, semi-transparent UI cards with blurred backgrounds that allow the 3D elements and glowing particles to shine through.
*   **Interactive Experience Timeline:** A vertical timeline for experience and education with glowing nodes and hover effects.
*   **Performance Optimized:** Utilizing React `lazy` and `Suspense` to asynchronously load computationally heavy simulations, ensuring lightning-fast initial page loads.
*   **Dynamic Skills Radar:** A responsive radar chart visualizing proficiency across different engineering disciplines (ROS 2, Python, CAD, etc.).
*   **Cyberpunk/Tech Aesthetic:** Custom typing animations, glitch effects, and a custom cursor to match the robotics theme.

## 🛠️ Tech Stack

*   **Frontend Framework:** React 18
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **3D Rendering:** Three.js, React Three Fiber
*   **Data Visualization:** Recharts
*   **Icons:** Lucide React
*   **Build Tool:** Vite

## 💻 Getting Started

To run this project locally on your machine:

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Yashs2024/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` (or the port specified in your terminal).

## 📁 Project Structure

```text
├── src/
│   ├── components/       # Reusable UI components (Hero, About, Projects, etc.)
│   │   ├── InverseKinematics.tsx # Interactive FABRIK IK solver
│   │   ├── AssemblyLine.tsx      # Automated quality control simulation
│   │   ├── PathfindingVisualizer.tsx # Dijkstra algorithm visualizer
│   │   └── ...
│   ├── constants.ts      # Centralized data (Projects, Experience, Skills)
│   ├── types.ts          # TypeScript interfaces and types
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
├── public/               # Static assets (images, resume, 3D models)
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Project dependencies and scripts
```

## 📬 Contact

*   **Email:** yashusurve2005@gmail.com
*   **LinkedIn:** [Yash Surve](https://www.linkedin.com/in/yash-surve-3b6a72253)
*   **GitHub:** [@Yashs2024](https://github.com/Yashs2024)

---
*Designed and built by Yash Surve.*
