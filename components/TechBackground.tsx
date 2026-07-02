import React, { useEffect, useRef } from 'react';

const TechBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Robot Arm Parameters
    const segmentLength = Math.min(w, h) * 0.25; 
    const basePos = { x: w / 2, y: h }; 
    
    // Mouse/Target State
    let mouse = { x: w / 2, y: h / 2 };
    let target = { x: w / 2, y: h / 2 };
    let currentPos = { x: w / 2, y: h / 2 }; 
    
    // Idle Animation State
    let lastMouseMoveTime = Date.now();
    let isIdle = false;
    let time = 0;

    // Drone State
    const drone = {
        x: -200,
        y: h * 0.2,
        speed: 1,
        hoverOffset: 0
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      basePos.x = w / 2;
      basePos.y = h;
      drone.y = h * 0.2;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
      lastMouseMoveTime = Date.now();
      isIdle = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Inverse Kinematics Solver (2-Link Planar)
    const solveIK = (x: number, y: number) => {
      // Vector from base to target
      let dx = x - basePos.x;
      let dy = y - basePos.y;
      
      // Distance to target
      let dist = Math.sqrt(dx * dx + dy * dy);
      
      // Clamp distance (reach limit)
      const maxReach = segmentLength * 2;
      if (dist > maxReach) {
        const ratio = maxReach / dist;
        dx *= ratio;
        dy *= ratio;
        dist = maxReach;
      } else if (dist < 1) {
        dist = 1; // Avoid divide by zero
      }

      // Law of Cosines
      const cosAngle2 = (dist * dist - segmentLength * segmentLength - segmentLength * segmentLength) / (2 * segmentLength * segmentLength);
      // Clamp for floating point errors
      const angle2 = Math.acos(Math.max(-1, Math.min(1, cosAngle2)));
      
      // Calculate Angle 1 (Shoulder)
      // base angle to target
      const baseAtan = Math.atan2(dy, dx);
      // Angle offset due to second limb
      const angle1Offset = Math.asin((segmentLength * Math.sin(Math.PI - angle2)) / dist);
      
      // Elbow up solution
      const angle1 = baseAtan - angle1Offset;

      // Calculate Joint Positions
      const j1 = {
        x: basePos.x + segmentLength * Math.cos(angle1),
        y: basePos.y + segmentLength * Math.sin(angle1)
      };

      const j2 = {
        x: j1.x + segmentLength * Math.cos(angle1 + angle2),
        y: j1.y + segmentLength * Math.sin(angle1 + angle2)
      };

      return { j1, j2 };
    };

    let animationFrameId: number;

    const drawDrone = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
        ctx.save();
        ctx.translate(x, y + Math.sin(time * 2) * 10); // Hover effect

        // Scan Beam
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(0, 242, 255, 0.15)');
        gradient.addColorStop(1, 'rgba(0, 242, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(30, 0);
        ctx.lineTo(0, 200); // Beam length
        ctx.closePath();
        ctx.fill();

        // Drone Body (Futuristic Shape)
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#00f2ff';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        
        // Main Chassis
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(-10, -10);
        ctx.lineTo(10, -10);
        ctx.lineTo(20, 0);
        ctx.lineTo(10, 10);
        ctx.lineTo(-10, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Rotors
        const rotorOffsetX = 25;
        const rotorOffsetY = 15;
        const rotorSize = 18;
        
        const rotors = [
            { x: -rotorOffsetX, y: -rotorOffsetY },
            { x: rotorOffsetX, y: -rotorOffsetY },
            { x: -rotorOffsetX, y: rotorOffsetY },
            { x: rotorOffsetX, y: rotorOffsetY }
        ];

        rotors.forEach(r => {
            // Arm to rotor
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(r.x, r.y);
            ctx.strokeStyle = '#00f2ff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Rotor Blur
            ctx.beginPath();
            ctx.ellipse(r.x, r.y, rotorSize, rotorSize/3, time * 20, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 242, 255, ${0.1 + Math.sin(time * 10) * 0.1})`;
            ctx.strokeStyle = `rgba(0, 242, 255, ${0.4 + Math.sin(time * 15) * 0.2})`;
            ctx.fill();
            ctx.stroke();
        });

        // Blinking LED
        if (Math.sin(time * 5) > 0) {
            ctx.fillStyle = '#ff0040';
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#ff0040';
            ctx.beginPath();
            ctx.arc(0, 0, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.restore();
    };

    const draw = () => {
      time += 0.015;

      // Check Idle
      if (Date.now() - lastMouseMoveTime > 2500) {
          isIdle = true;
      }

      // Update Target (Mouse or Idle Animation)
      if (isIdle) {
          // Figure 8 Lissajous pattern for idle animation
          // Slower, smooth movement
          const t = Date.now() * 0.0008; 
          const scaleX = w * 0.25;
          const scaleY = h * 0.15;
          
          target.x = basePos.x + Math.sin(t) * scaleX;
          target.y = basePos.y - h * 0.4 + Math.sin(2 * t) * scaleY;
      } else {
          target.x = mouse.x;
          target.y = mouse.y;
      }

      // Update Drone
      drone.x += drone.speed;
      if (drone.x > w + 100) {
          drone.x = -100;
          // Randomize Y slightly for next pass
          drone.y = h * (0.15 + Math.random() * 0.2); 
      }

      // Smooth arm movement interpolation
      currentPos.x += (target.x - currentPos.x) * 0.08;
      currentPos.y += (target.y - currentPos.y) * 0.08;

      ctx.clearRect(0, 0, w, h);

      // 1. Draw Schematic Grid (Background)
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const gridSize = 60;
      for (let x = 0; x <= w; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y <= h; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // 2. Draw Drone (Background element)
      drawDrone(ctx, drone.x, drone.y);

      // 3. Solve IK
      const { j1, j2 } = solveIK(currentPos.x, currentPos.y);

      // 4. Draw Robotic Arm
      // Glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(0, 242, 255, 0.3)';

      // Segment 1 (Base to Elbow)
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.3)'; 
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(basePos.x, basePos.y);
      ctx.lineTo(j1.x, j1.y);
      ctx.stroke();

      // Segment 2 (Elbow to Hand)
      ctx.beginPath();
      ctx.moveTo(j1.x, j1.y);
      ctx.lineTo(j2.x, j2.y);
      ctx.stroke();

      ctx.shadowBlur = 0; // Reset glow for joints details

      // Joints
      const drawJoint = (x: number, y: number, r: number) => {
        ctx.fillStyle = '#020617';
        ctx.strokeStyle = '#00f2ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Inner dot
        ctx.fillStyle = '#00f2ff';
        ctx.beginPath();
        ctx.arc(x, y, r/2.5, 0, Math.PI * 2);
        ctx.fill();
      };

      drawJoint(basePos.x, basePos.y, 12); // Base
      drawJoint(j1.x, j1.y, 9); // Elbow
      drawJoint(j2.x, j2.y, 7); // End Effector

      // 5. Draw HUD Elements at End Effector
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.4)';
      ctx.lineWidth = 1;
      
      // Target Reticle around end effector
      const spin = time * 2;
      ctx.beginPath();
      ctx.arc(j2.x, j2.y, 22, spin, spin + Math.PI * 1.5);
      ctx.stroke();
      
      // Dashed crosshairs
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.moveTo(j2.x - 35, j2.y);
      ctx.lineTo(j2.x + 35, j2.y);
      ctx.moveTo(j2.x, j2.y - 35);
      ctx.lineTo(j2.x, j2.y + 35);
      ctx.stroke();
      ctx.setLineDash([]);

      // Data Text
      ctx.fillStyle = 'rgba(0, 242, 255, 0.7)';
      ctx.font = '10px Rajdhani, monospace';
      ctx.fillText(`POS_X: ${Math.round(j2.x)}`, j2.x + 30, j2.y - 15);
      ctx.fillText(`POS_Y: ${Math.round(j2.y)}`, j2.x + 30, j2.y - 5);
      if (isIdle) {
         ctx.fillStyle = 'rgba(255, 200, 0, 0.8)';
         ctx.fillText(`MODE: AUTOPILOT`, j2.x + 30, j2.y + 15);
      } else {
         ctx.fillStyle = 'rgba(0, 255, 100, 0.8)';
         ctx.fillText(`MODE: MANUAL`, j2.x + 30, j2.y + 15);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-40"
    />
  );
};

export default TechBackground;