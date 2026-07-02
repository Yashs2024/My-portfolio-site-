import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RefreshCw, MousePointer2, Flag, Ban } from 'lucide-react';

type NodeType = 'empty' | 'wall' | 'start' | 'end' | 'path' | 'visited';

interface Node {
  row: number;
  col: number;
  type: NodeType;
  distance: number;
  previousNode: Node | null;
}

const ROWS = 15;
const COLS = 25;

const PathfindingVisualizer: React.FC = () => {
  const [grid, setGrid] = useState<Node[][]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [tool, setTool] = useState<'wall' | 'start' | 'end'>('wall');
  const [startNode, setStartNode] = useState({ row: 7, col: 4 });
  const [endNode, setEndNode] = useState({ row: 7, col: 20 });
  const [visitedCount, setVisitedCount] = useState(0);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    resetGrid();
  }, []);

  const resetGrid = () => {
    const newGrid: Node[][] = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < COLS; col++) {
        let type: NodeType = 'empty';
        if (row === startNode.row && col === startNode.col) type = 'start';
        else if (row === endNode.row && col === endNode.col) type = 'end';
        
        currentRow.push({
          row,
          col,
          type,
          distance: Infinity,
          previousNode: null,
        });
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
    setVisitedCount(0);
    setPathLength(0);
    setIsRunning(false);
  };

  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return;
    if ((row === startNode.row && col === startNode.col) || (row === endNode.row && col === endNode.col)) return;
    
    if (tool === 'start') {
        const newGrid = [...grid];
        newGrid[startNode.row][startNode.col].type = 'empty';
        newGrid[row][col].type = 'start';
        setStartNode({ row, col });
        setGrid(newGrid);
    } else if (tool === 'end') {
        const newGrid = [...grid];
        newGrid[endNode.row][endNode.col].type = 'empty';
        newGrid[row][col].type = 'end';
        setEndNode({ row, col });
        setGrid(newGrid);
    } else {
        toggleWall(row, col);
        setMouseIsPressed(true);
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!mouseIsPressed || isRunning) return;
    if (tool === 'wall') toggleWall(row, col);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const toggleWall = (row: number, col: number) => {
    const newGrid = [...grid];
    const node = newGrid[row][col];
    if (node.type !== 'start' && node.type !== 'end') {
      node.type = node.type === 'wall' ? 'empty' : 'wall';
      setGrid(newGrid);
    }
  };

  const visualizeDijkstra = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    // Clear previous path/visited
    const newGrid = grid.map(row => row.map(node => ({
        ...node,
        type: (node.type === 'visited' || node.type === 'path') ? 'empty' : node.type,
        distance: Infinity,
        previousNode: null
    })));
    setGrid(newGrid);

    const start = newGrid[startNode.row][startNode.col];
    const end = newGrid[endNode.row][endNode.col];
    start.distance = 0;

    const unvisitedNodes = getAllNodes(newGrid);
    const visitedNodesInOrder: Node[] = [];

    while (unvisitedNodes.length) {
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();
      if (!closestNode || closestNode.distance === Infinity) break; // Trapped
      if (closestNode.type === 'wall') continue;

      closestNode.type = closestNode.type === 'empty' ? 'visited' : closestNode.type;
      visitedNodesInOrder.push(closestNode);
      
      // Animate visited
      if (closestNode.type === 'visited') {
          setGrid([...newGrid]);
          setVisitedCount(prev => prev + 1);
          await new Promise(r => setTimeout(r, 10));
      }

      if (closestNode === end) {
          animatePath(end, newGrid);
          return;
      }

      updateUnvisitedNeighbors(closestNode, newGrid);
    }
    setIsRunning(false);
  };

  const animatePath = async (endNode: Node, currentGrid: Node[][]) => {
    const nodesInShortestPathOrder: Node[] = [];
    let currentNode: Node | null = endNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }

    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        const node = nodesInShortestPathOrder[i];
        if (node.type !== 'start' && node.type !== 'end') {
            node.type = 'path';
            setGrid([...currentGrid]);
            setPathLength(i);
            await new Promise(r => setTimeout(r, 30));
        }
    }
    setIsRunning(false);
  };

  const getAllNodes = (grid: Node[][]) => {
    const nodes: Node[] = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  };

  const sortNodesByDistance = (unvisitedNodes: Node[]) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  };

  const updateUnvisitedNeighbors = (node: Node, grid: Node[][]) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
  };

  const getUnvisitedNeighbors = (node: Node, grid: Node[][]) => {
    const neighbors: Node[] = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => neighbor.type !== 'visited' && neighbor.type !== 'wall' && neighbor.type !== 'start'); // Start is technically visited at step 0
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white font-tech">Pathfinding <span className="text-cyan-400">Visualizer</span></h3>
          <p className="text-sm text-gray-400">Visualize Dijkstra's Algorithm for Robot Motion Planning</p>
        </div>
        
        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
            <button 
                onClick={() => setTool('start')}
                className={`p-2 rounded ${tool === 'start' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Move Start Node"
            >
                <MousePointer2 className="w-4 h-4" />
            </button>
            <button 
                onClick={() => setTool('end')}
                className={`p-2 rounded ${tool === 'end' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Move Target Node"
            >
                <Flag className="w-4 h-4" />
            </button>
            <button 
                onClick={() => setTool('wall')}
                className={`p-2 rounded ${tool === 'wall' ? 'bg-slate-600 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Draw Walls"
            >
                <Ban className="w-4 h-4" />
            </button>
        </div>

        <div className="flex gap-2">
            <button 
                onClick={resetGrid}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors text-sm"
                disabled={isRunning}
            >
                <RefreshCw className="w-4 h-4" />
                Reset
            </button>
            <button 
                onClick={visualizeDijkstra}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-slate-900 font-bold rounded hover:bg-cyan-400 transition-colors text-sm"
                disabled={isRunning}
            >
                <Play className="w-4 h-4" />
                Visualize
            </button>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mb-2 font-mono">
          <span>Visited: {visitedCount}</span>
          <span>Path Length: {pathLength}</span>
      </div>

      <div 
        className="grid gap-[1px] bg-slate-800 border border-slate-700 select-none touch-none"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        onMouseLeave={handleMouseUp}
      >
        {grid.map((row, rowIdx) =>
          row.map((node, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
              onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
              onMouseUp={handleMouseUp}
              className={`
                aspect-square transition-all duration-200
                ${node.type === 'start' ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4] scale-110 z-10 rounded-sm' : ''}
                ${node.type === 'end' ? 'bg-red-500 shadow-[0_0_10px_#ef4444] scale-110 z-10 rounded-sm' : ''}
                ${node.type === 'wall' ? 'bg-slate-700 animate-pop' : ''}
                ${node.type === 'visited' ? 'bg-cyan-900/50 animate-visited' : ''}
                ${node.type === 'path' ? 'bg-yellow-400 shadow-[0_0_10px_#facc15] scale-105 z-10' : ''}
                ${node.type === 'empty' ? 'bg-slate-900 hover:bg-slate-800' : ''}
              `}
            ></div>
          ))
        )}
      </div>
      
      <div className="mt-4 flex gap-6 text-xs text-gray-400 justify-center">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-cyan-500 rounded-sm"></div> Start</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Target</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-700 rounded-sm"></div> Wall</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 rounded-sm"></div> Path</div>
      </div>
    </div>
  );
};

export default PathfindingVisualizer;
