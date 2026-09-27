import React, { useState, useRef, useEffect } from 'react';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Search, 
  Filter, 
  Layers, 
  RefreshCw, 
  Info, 
  Share2, 
  ShieldAlert 
} from 'lucide-react';
import NodeDetailDrawer from './NodeDetailDrawer';

const TYPE_COLORS = {
  email: { bg: '#1e3a8a', border: '#3b82f6', text: '#93c5fd' },
  sender: { bg: '#083344', border: '#06b6d4', text: '#67e8f9' },
  domain: { bg: '#450a0a', border: '#ef4444', text: '#fca5a5' },
  ip: { bg: '#431407', border: '#f97316', text: '#fdba74' },
  url: { bg: '#3b0764', border: '#a855f7', text: '#d8b4fe' },
  attachment: { bg: '#701a75', border: '#d946ef', text: '#f5d0fe' },
  campaign: { bg: '#881337', border: '#f43f5e', text: '#fda4af' },
  location: { bg: '#064e3b', border: '#10b981', text: '#6ee7b7' }
};

export default function InvestigationGraph({ initialGraphData }) {
  const [graph, setGraph] = useState(initialGraphData);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  // Position nodes in an interactive orbital/force layout
  const [nodePositions, setNodePositions] = useState({});

  useEffect(() => {
    if (!graph || !graph.nodes) return;
    const pos = {};
    const count = graph.nodes.length;
    const centerX = 450;
    const centerY = 280;
    const radius = 200;

    graph.nodes.forEach((n, idx) => {
      if (n.type === 'campaign') {
        pos[n.id] = { x: centerX + 260, y: centerY - 140 };
      } else if (n.type === 'email') {
        pos[n.id] = { x: centerX - 260, y: centerY };
      } else if (n.type === 'sender') {
        pos[n.id] = { x: centerX - 120, y: centerY - 100 };
      } else if (n.type === 'domain') {
        pos[n.id] = { x: centerX, y: centerY - 60 };
      } else if (n.type === 'ip') {
        pos[n.id] = { x: centerX + 120, y: centerY - 20 };
      } else if (n.type === 'url') {
        pos[n.id] = { x: centerX - 60, y: centerY + 130 };
      } else if (n.type === 'attachment') {
        pos[n.id] = { x: centerX - 200, y: centerY + 130 };
      } else if (n.type === 'location') {
        pos[n.id] = { x: centerX + 140, y: centerY + 140 };
      } else {
        const angle = (idx / count) * 2 * Math.PI;
        pos[n.id] = {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius
        };
      }
    });
    setNodePositions(pos);
  }, [graph]);

  // Pan controls
  const handleMouseDown = (e) => {
    if (e.target.closest('.graph-node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2.2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.4));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const filteredNodes = (graph?.nodes || []).filter(n => {
    if (filterType !== 'ALL' && n.type.toUpperCase() !== filterType) return false;
    if (searchQuery && !n.label.toLowerCase().includes(searchQuery.toLowerCase()) && !n.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const nodeMap = (graph?.nodes || []).reduce((acc, n) => {
    acc[n.id] = n;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Header controls bar */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Network className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">Neo4j Cyber Threat Knowledge Graph</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              CYPHER QUERY ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Interactive relational topography: Attacker/Sender → Email → Domain → URL → IP → Location → Campaign
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-2">
          {/* Node Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Entities ({graph?.nodes?.length || 0})</option>
            <option value="EMAIL">Emails</option>
            <option value="SENDER">Senders</option>
            <option value="DOMAIN">Domains</option>
            <option value="IP">IP Addresses</option>
            <option value="URL">URLs</option>
            <option value="ATTACHMENT">Attachments</option>
            <option value="CAMPAIGN">Campaigns</option>
          </select>

          {/* Search Node */}
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Find node in graph..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Main Graph Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left: Canvas Area (3 cols) */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="lg:col-span-3 h-[600px] bg-[#050913] border border-cyan-500/20 rounded-xl relative overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-2xl"
        >
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Floating Canvas Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-slate-900/90 p-1.5 rounded-lg border border-slate-700 backdrop-blur-md shadow-lg">
            <button onClick={handleZoomIn} className="p-1.5 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors" title="Zoom In">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={handleZoomOut} className="p-1.5 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors" title="Zoom Out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={handleReset} className="p-1.5 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors" title="Reset Center">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="absolute top-4 left-4 z-10 bg-slate-950/80 px-3 py-1.5 rounded border border-slate-850 text-[11px] font-mono text-slate-300 flex items-center gap-3 backdrop-blur-sm">
            <span>Nodes: <strong className="text-cyan-400">{filteredNodes.length}</strong></span>
            <span>Edges: <strong className="text-cyan-400">{graph?.edges?.length || 0}</strong></span>
            <span>Zoom: <strong className="text-cyan-400">{(zoom * 100).toFixed(0)}%</strong></span>
          </div>

          {/* Pan / Zoom Interactive Canvas Surface */}
          <div 
            className="w-full h-full transform transition-transform duration-75 origin-top-left"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
            }}
          >
            {/* SVG Relationship Lines */}
            <svg className="absolute inset-0 w-[2000px] h-[2000px] pointer-events-none">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#00f0ff" opacity="0.6" />
                </marker>
              </defs>
              {(graph?.edges || []).map((e) => {
                const sPos = nodePositions[e.source];
                const tPos = nodePositions[e.target];
                if (!sPos || !tPos) return null;

                const isConnectedToSelected = selectedNode && (selectedNode.id === e.source || selectedNode.id === e.target);

                return (
                  <g key={e.id}>
                    <line
                      x1={sPos.x}
                      y1={sPos.y}
                      x2={tPos.x}
                      y2={tPos.y}
                      stroke={isConnectedToSelected ? "#00f0ff" : "rgba(59, 130, 246, 0.35)"}
                      strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                      strokeDasharray={isConnectedToSelected ? "none" : "4 2"}
                      markerEnd="url(#arrow)"
                    />
                    {/* Edge Label */}
                    <text
                      x={(sPos.x + tPos.x) / 2}
                      y={(sPos.y + tPos.y) / 2 - 6}
                      fill={isConnectedToSelected ? "#00f0ff" : "#94a3b8"}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="select-none"
                    >
                      {e.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Render Nodes */}
            {filteredNodes.map((n) => {
              const pos = nodePositions[n.id] || { x: 450, y: 280 };
              const color = TYPE_COLORS[n.type] || { bg: '#1e293b', border: '#64748b', text: '#cbd5e1' };
              const isSelected = selectedNode?.id === n.id;

              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  className={`graph-node absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all group ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
                  }`}
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`
                  }}
                >
                  <div 
                    className="w-14 h-14 rounded-full flex flex-col items-center justify-center border-2 shadow-lg transition-all"
                    style={{
                      backgroundColor: color.bg,
                      borderColor: isSelected ? '#00f0ff' : color.border,
                      boxShadow: isSelected 
                        ? '0 0 20px rgba(0, 240, 255, 0.6)' 
                        : `0 0 10px ${color.border}40`
                    }}
                  >
                    <span className="text-[10px] font-extrabold font-mono tracking-tight text-white uppercase">
                      {n.type.slice(0, 3)}
                    </span>
                    <span className="text-[9px] font-mono text-cyan-300 font-bold">
                      {n.threat_score}
                    </span>
                  </div>

                  {/* Label tooltip */}
                  <div className="absolute top-15 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-slate-200 whitespace-nowrap shadow-md pointer-events-none max-w-[150px] truncate">
                    {n.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Node Detail Inspection Sidebar */}
        <div className="lg:col-span-1">
          <NodeDetailDrawer selectedNode={selectedNode} onClose={() => setSelectedNode(null)} />
        </div>
      </div>
    </div>
  );
}
