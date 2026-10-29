import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Info, Eye, Layers } from 'lucide-react';

const COMMUNITY_COLORS = [
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
  '#F43F5E', // Rose
];

export default function NetworkGraph({
  users,
  relations,
  selectedUser,
  onSelectUser,
  highlightedPath = null, // array of node IDs for shortest path
  highlightedMissingPair = null, // [sourceId, targetId] for transitivity counterexample
  highlightedRelation = null, // { source, target }
  communities = [],
  mutualFriendsHighlight = null, // { userA, userB, mutuals: [] }
  onAddFriendshipClick,
  onDeleteFriendship,
}) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 550 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [showLabels, setShowLabels] = useState(true);
  const [colorMode, setColorMode] = useState('community'); // 'community' | 'degree'
  const zoomBehaviorRef = useRef(null);

  // Map each community to a distinct color
  const communityColorMap = useMemo(() => {
    const map = new Map();
    communities.forEach((c, idx) => {
      const color = COMMUNITY_COLORS[idx % COMMUNITY_COLORS.length];
      c.members.forEach(m => map.set(m.id, color));
    });
    return map;
  }, [communities]);

  // Track dimensions
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth || 800,
          height: Math.max(clientHeight || 550, 480)
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute node degrees for sizing
  const degreeMap = useMemo(() => {
    const deg = new Map();
    users.forEach(u => deg.set(u.id, 0));
    relations.forEach(r => {
      if (r.source !== r.target) {
        deg.set(r.source, (deg.get(r.source) || 0) + 1);
        deg.set(r.target, (deg.get(r.target) || 0) + 1);
      }
    });
    return deg;
  }, [users, relations]);

  // Aggregate relations into distinct undirected/directed links for visualization
  const graphLinks = useMemo(() => {
    const userIds = new Set(users.map(u => u.id));
    const pairMap = new Map();
    relations.forEach(r => {
      if (userIds.has(r.source) && userIds.has(r.target)) {
        const key = `${r.source}->${r.target}`;
        pairMap.set(key, r);
      }
    });

    const links = [];
    const processedPairs = new Set();

    relations.forEach(r => {
      const src = r.source;
      const tgt = r.target;

      if (!userIds.has(src) || !userIds.has(tgt)) return;

      if (src === tgt) {
        // Self-loop
        links.push({
          id: `loop-${src}`,
          source: src,
          target: tgt,
          isSelfLoop: true,
          isMutual: true,
        });
        return;
      }

      const reverseKey = `${tgt}->${src}`;
      const forwardKey = `${src}->${tgt}`;
      const undirectedKey = [src, tgt].sort().join('--');

      if (pairMap.has(reverseKey)) {
        // Mutual friendship (Undirected)
        if (!processedPairs.has(undirectedKey)) {
          processedPairs.add(undirectedKey);
          links.push({
            id: `mutual-${undirectedKey}`,
            source: src,
            target: tgt,
            isMutual: true,
            isSelfLoop: false,
          });
        }
      } else {
        // One-way directional relationship
        if (!processedPairs.has(forwardKey)) {
          processedPairs.add(forwardKey);
          links.push({
            id: `directed-${forwardKey}`,
            source: src,
            target: tgt,
            isMutual: false,
            isSelfLoop: false,
          });
        }
      }
    });

    return links;
  }, [relations, users]);

  // D3 Force Simulation Effect
  useEffect(() => {
    if (!svgRef.current || users.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = dimensions.width;
    const height = dimensions.height;

    // Defs for arrow markers and gradients
    const defs = svg.append('defs');

    // Arrow marker for directed edges
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 26) // offset from center of target circle
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L9,0L0,4')
      .attr('fill', '#06B6D4');

    defs.append('marker')
      .attr('id', 'arrowhead-active')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 26)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L9,0L0,4')
      .attr('fill', '#F59E0B');

    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-30%')
      .attr('y', '-30%')
      .attr('width', '160%')
      .attr('height', '160%');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Main graph group that zooms/pans
    const g = svg.append('g').attr('class', 'network-main-group');

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = { zoom, svg, g };

    // Deep clone nodes and links for D3 simulation
    const nodes = users.map(u => ({ ...u }));
    const links = graphLinks.map(l => ({ ...l }));

    // Force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(d => (d.isMutual ? 95 : 120))
        .strength(0.6)
      )
      .force('charge', d3.forceManyBody().strength(-240))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.8))
      .force('collision', d3.forceCollide().radius(d => {
        const deg = degreeMap.get(d.id) || 0;
        return 22 + Math.min(deg * 2, 16);
      }))
      .force('x', d3.forceX(width / 2).strength(0.06))
      .force('y', d3.forceY(height / 2).strength(0.06));

    // Groups for links and nodes
    const linkGroup = g.append('g').attr('class', 'links-layer');
    const missingEdgeGroup = g.append('g').attr('class', 'missing-edge-layer');
    const nodeGroup = g.append('g').attr('class', 'nodes-layer');

    // If there is a missing pair (transitivity counterexample), draw dashed projected edge
    let missingLink = null;
    if (highlightedMissingPair) {
      const [srcId, tgtId] = highlightedMissingPair;
      missingLink = missingEdgeGroup.append('line')
        .attr('stroke', '#F43F5E')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0.85);
    }

    // Draw regular links
    const link = linkGroup.selectAll('g.link-item')
      .data(links)
      .enter()
      .append('g')
      .attr('class', 'link-item');

    // Line or arc for each link
    const linkPaths = link.append('path')
      .attr('fill', 'none')
      .attr('stroke-linecap', 'round')
      .attr('marker-end', d => (!d.isMutual && !d.isSelfLoop ? 'url(#arrowhead)' : null));

    // Draw nodes
    const node = nodeGroup.selectAll('g.node-item')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-item cursor-pointer')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      )
      .on('click', (event, d) => {
        event.stopPropagation();
        onSelectUser(d);
      })
      .on('mouseenter', (event, d) => {
        setHoveredNode(d);
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
      });

    // Outer Halo Circle
    node.append('circle')
      .attr('class', 'node-halo')
      .attr('r', d => {
        const deg = degreeMap.get(d.id) || 0;
        return 17 + Math.min(deg * 2, 14);
      })
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .attr('opacity', 0.8);

    // Inner Body Circle
    node.append('circle')
      .attr('class', 'node-core')
      .attr('r', d => {
        const deg = degreeMap.get(d.id) || 0;
        return 14 + Math.min(deg * 1.8, 12);
      })
      .attr('fill', '#0F172A')
      .attr('stroke', '#334155')
      .attr('stroke-width', 1.5);

    // Node Avatar or Icon Text
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', d => {
        const deg = degreeMap.get(d.id) || 0;
        return 11 + Math.min(deg, 4) + 'px';
      })
      .attr('pointer-events', 'none')
      .text(d => d.avatar || '👤');

    // Name Labels below nodes
    const labels = node.append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', d => {
        const deg = degreeMap.get(d.id) || 0;
        return 28 + Math.min(deg * 2, 14) + 'px';
      })
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', '#E2E8F0')
      .attr('pointer-events', 'none')
      .text(d => d.name);

    // Degree Badge Pill
    const badge = node.append('g')
      .attr('transform', d => {
        const deg = degreeMap.get(d.id) || 0;
        const rad = 14 + Math.min(deg * 1.8, 12);
        return `translate(${rad * 0.75}, ${-rad * 0.75})`;
      });

    badge.append('circle')
      .attr('r', 8)
      .attr('fill', '#1E293B')
      .attr('stroke', '#475569')
      .attr('stroke-width', 1);

    badge.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '9px')
      .attr('font-weight', '700')
      .attr('fill', '#38BDF8')
      .text(d => degreeMap.get(d.id) || 0);

    // Tick updates
    simulation.on('tick', () => {
      // Update link paths
      linkPaths.attr('d', d => {
        if (d.isSelfLoop) {
          // Self-loop curved arc
          const x = d.source.x;
          const y = d.source.y;
          const r = 24;
          return `M ${x} ${y - 12} C ${x - r} ${y - r * 2.2}, ${x + r} ${y - r * 2.2}, ${x + 6} ${y - 14}`;
        }
        return `M ${d.source.x} ${d.source.y} L ${d.target.x} ${d.target.y}`;
      });

      // Update missing edge if present
      if (missingLink && highlightedMissingPair) {
        const [srcId, tgtId] = highlightedMissingPair;
        const srcNode = nodes.find(n => n.id === srcId);
        const tgtNode = nodes.find(n => n.id === tgtId);
        if (srcNode && tgtNode) {
          missingLink
            .attr('x1', srcNode.x)
            .attr('y1', srcNode.y)
            .attr('x2', tgtNode.x)
            .attr('y2', tgtNode.y);
        }
      }

      // Update node positions
      node.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });

    // Drag handlers
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Clean background click to deselect
    svg.on('click', () => {
      onSelectUser(null);
    });

    return () => {
      simulation.stop();
    };
  }, [users, graphLinks, dimensions, degreeMap, highlightedMissingPair]);

  // Update Visual Highlighting on hover / selection / path changes
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    // Calculate sets of active IDs
    const activeUserId = selectedUser?.id || hoveredNode?.id;

    // Check neighbors of active node
    const activeNeighbors = new Set();
    if (activeUserId) {
      activeNeighbors.add(activeUserId);
      relations.forEach(r => {
        if (r.source === activeUserId) activeNeighbors.add(r.target);
        if (r.target === activeUserId) activeNeighbors.add(r.source);
      });
    }

    // Shortest path set
    const pathNodesSet = new Set(highlightedPath || []);
    const pathEdgesSet = new Set();
    if (highlightedPath && highlightedPath.length > 1) {
      for (let i = 0; i < highlightedPath.length - 1; i++) {
        pathEdgesSet.add(`${highlightedPath[i]}--${highlightedPath[i+1]}`);
        pathEdgesSet.add(`${highlightedPath[i+1]}--${highlightedPath[i]}`);
      }
    }

    // Mutual friends set
    const mutualsSet = new Set(mutualFriendsHighlight?.mutuals?.map(m => m.id) || []);

    // Update Links Styling
    svg.selectAll('.link-item path').each(function(d) {
      const el = d3.select(this);
      const srcId = d.source.id || d.source;
      const tgtId = d.target.id || d.target;
      const edgeKey = `${srcId}--${tgtId}`;

      const isPathEdge = pathEdgesSet.has(edgeKey);
      const isSelectedRelation = highlightedRelation && 
        ((highlightedRelation.source === srcId && highlightedRelation.target === tgtId) ||
         (highlightedRelation.source === tgtId && highlightedRelation.target === srcId));

      const isConnectedToActive = activeUserId && (srcId === activeUserId || tgtId === activeUserId);

      if (isPathEdge) {
        el.attr('stroke', '#06B6D4')
          .attr('stroke-width', 4)
          .attr('opacity', 1)
          .classed('pulsing-edge', true)
          .attr('filter', 'url(#glow)');
      } else if (isSelectedRelation) {
        el.attr('stroke', '#F59E0B')
          .attr('stroke-width', 4)
          .attr('opacity', 1)
          .attr('filter', 'url(#glow)');
      } else if (activeUserId) {
        if (isConnectedToActive) {
          el.attr('stroke', '#6366F1')
            .attr('stroke-width', 3)
            .attr('opacity', 0.95);
        } else {
          el.attr('stroke', '#334155')
            .attr('stroke-width', 1)
            .attr('opacity', 0.15);
        }
      } else {
        // Default appearance
        el.attr('stroke', d.isMutual ? '#475569' : '#0EA5E9')
          .attr('stroke-width', d.isMutual ? 1.8 : 2.2)
          .attr('stroke-dasharray', d.isMutual ? null : '4,2')
          .attr('opacity', 0.65)
          .classed('pulsing-edge', false)
          .attr('filter', null);
      }
    });

    // Update Nodes Styling
    svg.selectAll('.node-item').each(function(d) {
      const el = d3.select(this);
      const isSelected = selectedUser && selectedUser.id === d.id;
      const isHovered = hoveredNode && hoveredNode.id === d.id;
      const isInPath = pathNodesSet.has(d.id);
      const isMutual = mutualsSet.has(d.id);
      const isNeighbor = activeNeighbors.has(d.id);

      const halo = el.select('.node-halo');
      const core = el.select('.node-core');
      const label = el.select('.node-label');

      // Base color based on mode
      let baseColor = '#6366F1';
      if (colorMode === 'community') {
        baseColor = communityColorMap.get(d.id) || '#6366F1';
      } else {
        // Degree-based heat
        const deg = degreeMap.get(d.id) || 0;
        baseColor = deg > 4 ? '#EC4899' : deg > 2 ? '#6366F1' : '#06B6D4';
      }

      if (isSelected || isHovered) {
        halo.attr('stroke', '#38BDF8')
          .attr('stroke-width', 4)
          .attr('opacity', 1)
          .attr('filter', 'url(#glow)');
        core.attr('fill', '#1E293B').attr('stroke', '#38BDF8');
        label.attr('fill', '#FFFFFF').attr('font-weight', '700');
        el.attr('opacity', 1);
      } else if (isInPath) {
        halo.attr('stroke', '#06B6D4')
          .attr('stroke-width', 3.5)
          .attr('opacity', 1);
        core.attr('fill', '#0E7490').attr('stroke', '#22D3EE');
        label.attr('fill', '#22D3EE').attr('font-weight', '700');
        el.attr('opacity', 1);
      } else if (isMutual) {
        halo.attr('stroke', '#10B981')
          .attr('stroke-width', 3.5)
          .attr('opacity', 1);
        core.attr('fill', '#064E3B').attr('stroke', '#34D399');
        label.attr('fill', '#34D399');
        el.attr('opacity', 1);
      } else if (activeUserId) {
        if (isNeighbor) {
          halo.attr('stroke', baseColor).attr('stroke-width', 2.5).attr('opacity', 0.9);
          core.attr('fill', '#0F172A').attr('stroke', baseColor);
          label.attr('fill', '#E2E8F0');
          el.attr('opacity', 1);
        } else {
          halo.attr('stroke', '#334155').attr('stroke-width', 1).attr('opacity', 0.3);
          core.attr('fill', '#0A0F1D').attr('stroke', '#1E293B');
          label.attr('fill', '#64748B');
          el.attr('opacity', 0.25);
        }
      } else {
        // Normal state
        halo.attr('stroke', baseColor).attr('stroke-width', 2).attr('opacity', 0.85).attr('filter', null);
        core.attr('fill', '#0F172A').attr('stroke', '#334155');
        label.attr('fill', '#E2E8F0').attr('font-weight', '600');
        el.attr('opacity', 1);
      }

      label.attr('visibility', showLabels ? 'visible' : 'hidden');
    });
  }, [
    selectedUser,
    hoveredNode,
    highlightedPath,
    highlightedRelation,
    mutualFriendsHighlight,
    relations,
    showLabels,
    colorMode,
    communityColorMap,
    degreeMap
  ]);

  // Controls Handlers
  const handleZoomIn = () => {
    if (zoomBehaviorRef.current) {
      zoomBehaviorRef.current.svg.transition().duration(300).call(zoomBehaviorRef.current.zoom.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (zoomBehaviorRef.current) {
      zoomBehaviorRef.current.svg.transition().duration(300).call(zoomBehaviorRef.current.zoom.scaleBy, 0.7);
    }
  };

  const handleResetZoom = () => {
    if (zoomBehaviorRef.current) {
      zoomBehaviorRef.current.svg.transition().duration(400).call(zoomBehaviorRef.current.zoom.transform, d3.zoomIdentity);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[500px] flex flex-col bg-navy-900/60 rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Legend Pills */}
        <div className="flex items-center gap-2 pointer-events-auto bg-navy-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/80 text-xs text-slate-300 shadow-md">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan"></span>
            <span>Mutual Friendship</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 border-t-2 border-dashed border-sky-400"></span>
            <span>One-Way Relation</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-pink-400"></span>
            <span>Self Loop (Reflexive)</span>
          </span>
        </div>

        {/* Right: Interactive View Controls */}
        <div className="flex items-center gap-1 pointer-events-auto bg-navy-950/80 backdrop-blur-md p-1 rounded-lg border border-slate-800/80 text-slate-300 shadow-md">
          <button
            onClick={() => setShowLabels(!showLabels)}
            title="Toggle Labels"
            className={`p-1.5 rounded hover:bg-slate-800 transition ${showLabels ? 'text-brand-cyan bg-slate-800/60' : 'text-slate-400'}`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setColorMode(colorMode === 'community' ? 'degree' : 'community')}
            title={`Color Mode: ${colorMode === 'community' ? 'Community Clusters' : 'Degree Centrality'}`}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <Layers className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-800 mx-0.5" />
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            title="Reset Zoom & Pan"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full flex-1 cursor-grab active:cursor-grabbing bg-grid-pattern"
        style={{ minHeight: '480px' }}
      />

      {/* Bottom Hint Banner */}
      <div className="absolute bottom-2 left-3 z-10 text-[11px] text-slate-400 bg-navy-950/70 backdrop-blur-sm px-2.5 py-1 rounded border border-slate-800/50 flex items-center gap-1.5 pointer-events-none">
        <Info className="w-3.5 h-3.5 text-brand-cyan" />
        <span>Click node to inspect • Drag to rearrange • Scroll to zoom</span>
      </div>
    </div>
  );
}
