import React, { useState, useEffect, useRef } from 'react';
import { Play, RefreshCw, Maximize2, Crosshair, Target } from 'lucide-react';

const InverseKinematics: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [target, setTarget] = useState({ x: 200, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Arm configuration
  const segments = [
    { length: 100, angle: 0 },
    { length: 80, angle: 0 },
    { length: 60, angle: 0 }
  ];
  
  const [armState, setArmState] = useState(segments);
  const origin = { x: 300, y: 300 }; // Base of the arm

  // Forward Kinematics: Calculate joint positions based on angles
  const calculateJoints = (currentSegments: typeof segments) => {
    const joints = [{ ...origin }];
    let currentAngle = 0;
    
    for (let i = 0; i < currentSegments.length; i++) {
      currentAngle += currentSegments[i].angle;
      const prevJoint = joints[i];
      const nextX = prevJoint.x + Math.cos(currentAngle) * currentSegments[i].length;
      const nextY = prevJoint.y + Math.sin(currentAngle) * currentSegments[i].length;
      joints.push({ x: nextX, y: nextY });
    }
    
    return joints;
  };

  // FABRIK (Forward And Backward Reaching Inverse Kinematics) algorithm
  const solveIK = (targetPos: { x: number, y: number }) => {
    let joints = calculateJoints(armState);
    const numJoints = joints.length;
    const tolerance = 1;
    let iterations = 0;
    const maxIterations = 10;
    
    // Check if target is reachable
    const totalLength = armState.reduce((sum, seg) => sum + seg.length, 0);
    const distToBase = Math.hypot(targetPos.x - origin.x, targetPos.y - origin.y);
    
    if (distToBase > totalLength) {
      // Target is unreachable, stretch towards it
      for (let i = 0; i < numJoints - 1; i++) {
        const r = Math.hypot(targetPos.x - origin.x, targetPos.y - origin.y);
        const lambda = armState[i].length / r;
        joints[i + 1] = {
          x: (1 - lambda) * joints[i].x + lambda * targetPos.x,
          y: (1 - lambda) * joints[i].y + lambda * targetPos.y
        };
      }
    } else {
      // Target is reachable
      let distToTarget = Math.hypot(joints[numJoints - 1].x - targetPos.x, joints[numJoints - 1].y - targetPos.y);
      
      while (distToTarget > tolerance && iterations < maxIterations) {
        // Backward pass
        joints[numJoints - 1] = { ...targetPos };
        for (let i = numJoints - 2; i >= 0; i--) {
          const r = Math.hypot(joints[i + 1].x - joints[i].x, joints[i + 1].y - joints[i].y);
          const lambda = armState[i].length / r;
          joints[i] = {
            x: (1 - lambda) * joints[i + 1].x + lambda * joints[i].x,
            y: (1 - lambda) * joints[i + 1].y + lambda * joints[i].y
          };
        }
        
        // Forward pass
        joints[0] = { ...origin };
        for (let i = 0; i < numJoints - 1; i++) {
          const r = Math.hypot(joints[i + 1].x - joints[i].x, joints[i + 1].y - joints[i].y);
          const lambda = armState[i].length / r;
          joints[i + 1] = {
            x: (1 - lambda) * joints[i].x + lambda * joints[i + 1].x,
            y: (1 - lambda) * joints[i].y + lambda * joints[i + 1].y
          };
        }
        
        distToTarget = Math.hypot(joints[numJoints - 1].x - targetPos.x, joints[numJoints - 1].y - targetPos.y);
        iterations++;
      }
    }
    
    // Convert joint positions back to angles
    const newSegments = [...armState];
    let currentGlobalAngle = 0;
    
    for (let i = 0; i < numJoints - 1; i++) {
      const dx = joints[i + 1].x - joints[i].x;
      const dy = joints[i + 1].y - joints[i].y;
      const globalAngle = Math.atan2(dy, dx);
      
      newSegments[i].angle = globalAngle - currentGlobalAngle;
      currentGlobalAngle = globalAngle;
    }
    
    setArmState(newSegments);
  };

  // Draw the arm and target
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid background
    ctx.strokeStyle = '#1e293b'; // slate-800
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Draw Base Coordinate Frame Axes (Reference Frame)
    ctx.lineWidth = 1.5;
    // X-Axis (Red)
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(origin.x + 60, origin.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(origin.x + 60, origin.y);
    ctx.lineTo(origin.x + 54, origin.y - 4);
    ctx.lineTo(origin.x + 54, origin.y + 4);
    ctx.fill();
    ctx.font = '10px monospace';
    ctx.fillText('X_0', origin.x + 64, origin.y + 4);

    // Y-Axis (Green)
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
    ctx.fillStyle = 'rgba(74, 222, 128, 0.4)';
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(origin.x, origin.y - 60);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y - 60);
    ctx.lineTo(origin.x - 4, origin.y - 54);
    ctx.lineTo(origin.x + 4, origin.y - 54);
    ctx.fill();
    ctx.fillText('Y_0', origin.x - 8, origin.y - 66);

    // Draw base
    ctx.fillStyle = '#334155'; // slate-700
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 20, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(origin.x - 20, origin.y, 40, 20);

    const joints = calculateJoints(armState);

    // Draw segments
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    for (let i = 0; i < joints.length - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(joints[i].x, joints[i].y);
      ctx.lineTo(joints[i + 1].x, joints[i + 1].y);
      
      // Gradient for robotic look
      const gradient = ctx.createLinearGradient(joints[i].x, joints[i].y, joints[i + 1].x, joints[i + 1].y);
      gradient.addColorStop(0, '#0ea5e9'); // sky-500
      gradient.addColorStop(1, '#38bdf8'); // sky-400
      ctx.strokeStyle = gradient;
      ctx.stroke();
      
      // Draw joint circles
      ctx.beginPath();
      ctx.arc(joints[i].x, joints[i].y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a'; // slate-950
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();
    }

    // Draw end effector
    const endEffector = joints[joints.length - 1];
    ctx.beginPath();
    ctx.arc(endEffector.x, endEffector.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b'; // amber-500
    ctx.fill();

    // Draw target
    ctx.beginPath();
    ctx.arc(target.x, target.y, 10, 0, Math.PI * 2);
    ctx.strokeStyle = '#ef4444'; // red-500
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(target.x - 15, target.y);
    ctx.lineTo(target.x + 15, target.y);
    ctx.moveTo(target.x, target.y - 15);
    ctx.lineTo(target.x, target.y + 15);
    ctx.stroke();

    // Draw Cyber-Diagnostics HUD Overlay
    const eeX = endEffector.x - origin.x;
    const eeY = origin.y - endEffector.y;
    const a1 = ((armState[0].angle * 180) / Math.PI).toFixed(1);
    const a2 = ((armState[1].angle * 180) / Math.PI).toFixed(1);
    const a3 = ((armState[2].angle * 180) / Math.PI).toFixed(1);

    const hudX = 410, hudY = 20, hudW = 170, hudH = 125;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(hudX, hudY, hudW, hudH);
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(hudX, hudY, hudW, hudH);

    // Corner notches
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(hudX, hudY, 6, 2);
    ctx.fillRect(hudX, hudY, 2, 6);
    ctx.fillRect(hudX + hudW - 6, hudY, 6, 2);
    ctx.fillRect(hudX + hudW - 2, hudY, 2, 6);
    ctx.fillRect(hudX, hudY + hudH - 2, 6, 2);
    ctx.fillRect(hudX, hudY + hudH - 6, 2, 6);
    ctx.fillRect(hudX + hudW - 6, hudY + hudH - 2, 6, 2);
    ctx.fillRect(hudX + hudW - 2, hudY + hudH - 6, 2, 6);

    ctx.fillStyle = 'rgba(74, 222, 128, 0.8)';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('● SYSTEM STATUS: ACTIVE', hudX + 10, hudY + 18);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '10px monospace';
    ctx.fillText(`EE_X: ${eeX >= 0 ? '+' : ''}${eeX.toFixed(1)} mm`, hudX + 10, hudY + 38);
    ctx.fillText(`EE_Y: ${eeY >= 0 ? '+' : ''}${eeY.toFixed(1)} mm`, hudX + 10, hudY + 54);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`JOINT_1: ${a1}°`, hudX + 10, hudY + 76);
    ctx.fillText(`JOINT_2: ${a2}°`, hudX + 10, hudY + 92);
    ctx.fillText(`JOINT_3: ${a3}°`, hudX + 10, hudY + 108);

  }, [armState, target]);

  // Handle mouse/touch interaction
  const handleInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    setTarget({ x, y });
    solveIK({ x, y });
  };

  const resetArm = () => {
    setTarget({ x: 200, y: 150 });
    setArmState([
      { length: 100, angle: -Math.PI / 4 },
      { length: 80, angle: -Math.PI / 4 },
      { length: 60, angle: -Math.PI / 4 }
    ]);
  };

  useEffect(() => {
    solveIK(target);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-2xl mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white font-tech flex items-center gap-2">
            <Maximize2 className="w-5 h-5 text-sky-400" />
            Inverse Kinematics <span className="text-sky-400">Solver</span>
          </h3>
          <p className="text-sm text-gray-400">Drag the red target to see the robotic arm calculate joint angles in real-time using FABRIK.</p>
        </div>
        
        <div className="flex gap-2">
            <button 
                onClick={resetArm}
                className="flex items-center gap-2 px-4 py-2 bg-sky-500/20 text-sky-400 border border-sky-500/50 rounded hover:bg-sky-500/30 transition-colors text-sm"
            >
                <RefreshCw className="w-4 h-4" />
                Reset
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Canvas View */}
        <div className="lg:col-span-2 relative">
            <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden cursor-crosshair">
                <canvas 
                    ref={canvasRef} 
                    width={600} 
                    height={400} 
                    className="w-full h-auto touch-none"
                    onMouseDown={(e) => { setIsDragging(true); handleInteraction(e); }}
                    onMouseMove={handleInteraction}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    onTouchStart={(e) => { setIsDragging(true); handleInteraction(e); }}
                    onTouchMove={handleInteraction}
                    onTouchEnd={() => setIsDragging(false)}
                />
            </div>
            {/* Overlay hint */}
            <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                <Crosshair className="w-4 h-4 text-sky-400" />
                <span className="text-xs text-gray-300 font-medium tracking-wider uppercase">Click & Drag</span>
            </div>
        </div>

        {/* Data Panel */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-6">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700">
                <Target className="w-5 h-5 text-gray-400" />
                <h4 className="font-semibold text-white">Joint Angles</h4>
            </div>

            <div className="space-y-4">
                {armState.map((segment, index) => {
                    // Convert radians to degrees for display
                    const degrees = ((segment.angle * 180) / Math.PI).toFixed(1);
                    return (
                        <div key={index} className="bg-slate-900/50 p-3 rounded border border-slate-700/50">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Joint {index + 1}</span>
                                <span className="text-sm text-sky-400 font-mono">{degrees}°</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                    className="bg-sky-500 h-full rounded-full transition-all duration-100"
                                    style={{ width: `${Math.min(100, Math.max(0, (segment.angle + Math.PI) / (Math.PI * 2) * 100))}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="pt-4 border-t border-slate-700">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Target (X, Y)</span>
                    <span className="text-sm text-amber-400 font-mono">
                        {Math.round(target.x)}, {Math.round(canvasRef.current?.height ? canvasRef.current.height - target.y : target.y)}
                    </span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InverseKinematics;
