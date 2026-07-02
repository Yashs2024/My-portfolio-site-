import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Stars as DreiStars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

const RobotCore = (props: any) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Much slower rotation for a smooth, floating feel
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group {...props}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        {/* Outer Wireframe Shell */}
        <mesh
          ref={meshRef}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          scale={hovered ? 1.1 : 1}
        >
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color={hovered ? "#00f2ff" : "#22d3ee"}
            wireframe
            emissive={hovered ? "#00f2ff" : "#000000"}
            emissiveIntensity={0.2}
            transparent
            opacity={0.3}
          />
        </mesh>
        
        {/* Inner Core */}
        <mesh scale={0.5}>
          <sphereGeometry args={[1, 32, 32]} />
          <MeshDistortMaterial
            color="#00f2ff"
            emissive="#00f2ff"
            emissiveIntensity={1}
            distort={0.3}
            speed={1}
          />
        </mesh>

        {/* Orbiting Rings - Slower and more subtle */}
        <group rotation={[Math.PI / 4, 0, 0]}>
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[1.4, 0.01, 16, 100]} />
            <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.5} transparent opacity={0.4} />
          </mesh>
        </group>
        <group rotation={[-Math.PI / 4, 0, 0]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[1.8, 0.01, 16, 100]} />
            <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={0.5} transparent opacity={0.4} />
          </mesh>
        </group>
      </Float>
    </group>
  );
};

const FloatingParticles = () => {
  const count = 40; // Drastically reduced from 200
  const mesh = useRef<THREE.InstancedMesh>(null!);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.002 + Math.random() / 500; // Much slower speed
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      if (mesh.current) {
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
    });
    if (mesh.current) {
        mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.1, 0]} />
      <meshPhongMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={0.2} transparent opacity={0.4} />
    </instancedMesh>
  );
};

const RobotBackground: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className="absolute inset-0 z-0 h-full w-full opacity-60 bg-space-900" />;
  }

  return (
    <div className="absolute inset-0 z-0 h-full w-full opacity-60">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00f2ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.2} color="#4ade80" />
        
        {/* Single Main Robot Core - Moved slightly to the right */}
        <RobotCore position={[3.5, 0, 0]} />
        
        <FloatingParticles />
        {/* Reduced star count and speed */}
        <DreiStars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />
      </Canvas>
    </div>
  );
};

export default RobotBackground;
