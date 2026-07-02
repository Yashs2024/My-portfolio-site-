import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Box, CheckCircle2, XCircle, Activity } from 'lucide-react';

interface Item {
  id: number;
  x: number;
  y: number;
  isDefective: boolean;
  state: 'entering' | 'scanning' | 'passing' | 'rejecting';
  scanProgress: number;
}

const AssemblyLine: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const [isRunning, setIsRunning] = useState(true);
  const [defectRate, setDefectRate] = useState(30); // 30% chance of defect
  
  // Stats
  const [stats, setStats] = useState({ total: 0, accepted: 0, rejected: 0 });
  const statsRef = useRef({ total: 0, accepted: 0, rejected: 0 });

  // Simulation state
  const itemsRef = useRef<Item[]>([]);
  const beltOffsetRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const armExtensionRef = useRef(0);

  const SPAWN_RATE = 1500; // ms between spawns
  const BELT_SPEED = 2;
  const SCAN_X = 250;
  const REJECT_X = 350;

  const updateStats = (type: 'accepted' | 'rejected') => {
    statsRef.current.total += 1;
    if (type === 'accepted') statsRef.current.accepted += 1;
    if (type === 'rejected') statsRef.current.rejected += 1;
    setStats({ ...statsRef.current });
  };

  const animate = (time: number) => {
    if (!isRunning) {
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (canvas && ctx) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update belt offset
      beltOffsetRef.current = (beltOffsetRef.current + BELT_SPEED) % 40;

      // Spawn new items
      if (time - lastSpawnRef.current > SPAWN_RATE) {
        itemsRef.current.push({
          id: time,
          x: -50,
          y: 180,
          isDefective: Math.random() * 100 < defectRate,
          state: 'entering',
          scanProgress: 0
        });
        lastSpawnRef.current = time;
      }

      // Draw Conveyor Belt
      ctx.fillStyle = '#1e293b'; // slate-800
      ctx.fillRect(0, 160, canvas.width, 80);
      
      // Draw Reject Chute
      ctx.fillStyle = '#0f172a'; // slate-950
      ctx.fillRect(REJECT_X - 10, 240, 60, 160);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(REJECT_X - 10, 240, 60, 160);

      // Draw Belt Lines
      ctx.strokeStyle = '#334155'; // slate-700
      ctx.lineWidth = 2;
      for (let i = -40; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i + beltOffsetRef.current, 160);
        ctx.lineTo(i + beltOffsetRef.current, 240);
        ctx.stroke();
      }

      // Draw Scanner Arch
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(SCAN_X - 20, 140, 80, 20);
      ctx.fillRect(SCAN_X - 20, 240, 80, 20);
      ctx.fillStyle = '#38bdf8'; // sky-400
      ctx.fillRect(SCAN_X + 15, 140, 10, 100); // Scanner laser window

      let isRejectingActive = false;

      // Update and Draw Items
      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i];

        // State Machine
        if (item.state === 'entering') {
          item.x += BELT_SPEED;
          if (item.x >= SCAN_X) {
            item.state = 'scanning';
          }
        } else if (item.state === 'scanning') {
          item.scanProgress += 2;
          // Draw scanning laser effect
          ctx.fillStyle = `rgba(56, 189, 248, ${Math.sin(item.scanProgress * 0.2) * 0.5 + 0.2})`;
          ctx.fillRect(item.x - 10, item.y - 10, 60, 60);
          
          if (item.scanProgress >= 100) {
            item.state = item.isDefective ? 'rejecting' : 'passing';
            updateStats(item.isDefective ? 'rejected' : 'accepted');
          }
        } else if (item.state === 'passing') {
          item.x += BELT_SPEED;
        } else if (item.state === 'rejecting') {
          if (item.x < REJECT_X) {
            item.x += BELT_SPEED;
          } else {
            item.y += BELT_SPEED * 2; // Fall down chute
            isRejectingActive = true;
          }
        }

        // Remove off-screen items
        if (item.x > canvas.width + 50 || item.y > canvas.height + 50) {
          itemsRef.current.splice(i, 1);
          continue;
        }

        // Draw Item
        ctx.fillStyle = item.state === 'scanning' 
          ? '#94a3b8' // Gray while scanning
          : item.isDefective && item.state !== 'entering' 
            ? '#ef4444' // Red if defective and scanned
            : '#10b981'; // Green if good or entering

        // Add glow if defective and rejected
        if (item.state === 'rejecting') {
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 15;
        } else if (item.state === 'passing') {
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillRect(item.x, item.y, 40, 40);
        
        // Item detail (circuit pattern)
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(item.x + 5, item.y + 5, 30, 30);
        ctx.beginPath();
        ctx.moveTo(item.x + 20, item.y + 5);
        ctx.lineTo(item.x + 20, item.y + 35);
        ctx.stroke();
        
        ctx.shadowBlur = 0; // Reset shadow
      }

      // Draw Robotic Reject Arm
      const armBaseX = REJECT_X + 20;
      const armBaseY = 100;
      
      // Animate arm extension
      if (isRejectingActive) {
        armExtensionRef.current = Math.min(armExtensionRef.current + 5, 80);
      } else {
        armExtensionRef.current = Math.max(armExtensionRef.current - 2, 0);
      }

      // Arm Base
      ctx.fillStyle = '#475569';
      ctx.fillRect(armBaseX - 20, armBaseY - 20, 40, 40);
      
      // Arm Piston
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(armBaseX - 5, armBaseY + 20, 10, 40 + armExtensionRef.current);
      
      // Arm Pusher Head
      ctx.fillStyle = '#f59e0b'; // amber-500
      ctx.fillRect(armBaseX - 25, armBaseY + 60 + armExtensionRef.current, 50, 10);
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, defectRate]);

  const resetSim = () => {
    itemsRef.current = [];
    statsRef.current = { total: 0, accepted: 0, rejected: 0 };
    setStats({ total: 0, accepted: 0, rejected: 0 });
    beltOffsetRef.current = 0;
    armExtensionRef.current = 0;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-2xl mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white font-tech flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Automated Quality <span className="text-emerald-400">Control</span>
          </h3>
          <p className="text-sm text-gray-400">Computer vision scanner detecting and sorting defective products in real-time.</p>
        </div>
        
        <div className="flex gap-2">
            <button 
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors text-sm font-bold ${
                  isRunning 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30'
                }`}
            >
                {isRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start</>}
            </button>
            <button 
                onClick={resetSim}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded hover:bg-slate-700 transition-colors text-sm"
            >
                <RefreshCw className="w-4 h-4" />
                Reset
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Canvas View */}
        <div className="lg:col-span-3 relative">
            <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                <canvas 
                    ref={canvasRef} 
                    width={600} 
                    height={400} 
                    className="w-full h-auto"
                />
            </div>
            {/* Legend */}
            <div className="absolute top-4 left-4 flex gap-3 bg-slate-900/80 px-3 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-sm shadow-[0_0_8px_#10b981]"></div>
                  <span className="text-xs text-gray-300 font-medium">Passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-sm shadow-[0_0_8px_#ef4444]"></div>
                  <span className="text-xs text-gray-300 font-medium">Defective</span>
                </div>
            </div>
        </div>

        {/* Controls & Stats Panel */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-6 flex flex-col">
            
            {/* Defect Rate Control */}
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-white">Defect Rate</label>
                    <span className="text-sm text-red-400 font-mono">{defectRate}%</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5" 
                    value={defectRate} 
                    onChange={(e) => setDefectRate(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <p className="text-xs text-gray-500 mt-2">Adjust the probability of a defective product spawning.</p>
            </div>

            <div className="h-px w-full bg-slate-700 my-2"></div>

            {/* Live Stats */}
            <div className="space-y-4 flex-1">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Box className="w-4 h-4 text-cyan-400" />
                  Live Statistics
                </h4>
                
                <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50 flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total Scanned</span>
                    <span className="text-lg font-mono text-white">{stats.total}</span>
                </div>
                
                <div className="bg-emerald-900/20 p-3 rounded border border-emerald-500/30 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-emerald-100">Accepted</span>
                    </div>
                    <span className="text-lg font-mono text-emerald-400">{stats.accepted}</span>
                </div>
                
                <div className="bg-red-900/20 p-3 rounded border border-red-500/30 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-100">Rejected</span>
                    </div>
                    <span className="text-lg font-mono text-red-400">{stats.rejected}</span>
                </div>
            </div>
            
            {/* Efficiency Metric */}
            <div className="pt-4 border-t border-slate-700">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Yield Rate</span>
                    <span className="text-sm text-cyan-400 font-mono">
                        {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 100}%
                    </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                        className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${stats.total > 0 ? (stats.accepted / stats.total) * 100 : 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AssemblyLine;
