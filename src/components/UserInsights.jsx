import React, { useState } from 'react';
import {
  Award,
  Share2,
  Users,
  Compass,
  ArrowRight,
  Route,
  UserCheck,
  ShieldAlert,
  Flame,
  Search
} from 'lucide-react';
import { findShortestPath, findMutualFriends } from '../utils/relationMath';

export default function UserInsights({
  users,
  relations,
  statistics,
  onSelectUser,
  onHighlightPathOnGraph,
  onHighlightMutualsOnGraph,
}) {
  // Path Finder State
  const [pathSource, setPathSource] = useState(users[0]?.id || '');
  const [pathTarget, setPathTarget] = useState(users[users.length - 1]?.id || '');
  const [pathResult, setPathResult] = useState(null);

  // Mutual Friends State
  const [mutualA, setMutualA] = useState(users[0]?.id || '');
  const [mutualB, setMutualB] = useState(users[1]?.id || '');
  const [mutualResult, setMutualResult] = useState(null);

  // Search filter for rankings
  const [searchQuery, setSearchQuery] = useState('');

  // Sorted users by degree
  const rankedUsers = [...users].map(u => {
    const deg = statistics.degrees.get(u.id) || 0;
    const isBridge = statistics.bridgeUsers.some(b => b.user.id === u.id);
    const isIsolated = deg === 0;
    const centralityPct = users.length > 1 ? ((deg / (users.length - 1)) * 100).toFixed(1) : 0;
    return {
      ...u,
      degree: deg,
      isBridge,
      isIsolated,
      centralityPct,
    };
  }).sort((a, b) => b.degree - a.degree);

  const filteredRankings = rankedUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Execute Shortest Path
  const handleFindPath = () => {
    if (!pathSource || !pathTarget) return;
    const res = findShortestPath(pathSource, pathTarget, users, relations);
    setPathResult(res);
    if (res.found && onHighlightPathOnGraph) {
      onHighlightPathOnGraph(res.path);
    }
  };

  // Execute Mutual Friends Search
  const handleFindMutuals = () => {
    if (!mutualA || !mutualB) return;
    const res = findMutualFriends(mutualA, mutualB, users, relations);
    setMutualResult(res);
    if (onHighlightMutualsOnGraph) {
      onHighlightMutualsOnGraph({
        userA: mutualA,
        userB: mutualB,
        mutuals: res
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-navy-900/70 p-6 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-cyan" />
          <h2 className="text-xl font-bold text-white tracking-tight">User Insights & Graph Centrality</h2>
        </div>
        <p className="text-sm text-slate-400">
          Individual vertex degree centrality, structural bridge analysis, BFS shortest paths, and mutual friend intersections.
        </p>
      </div>

      {/* Top 2 Interactive Tools: "Find Connection" and "Mutual Friends" */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool 1: Shortest Path Finder ("Find Connection") */}
        <div className="bg-navy-900/60 p-5 rounded-xl border border-slate-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Route className="w-5 h-5 text-brand-cyan" />
              <h3 className="font-bold text-white text-base">Find Connection (Shortest Path)</h3>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan font-mono border border-brand-cyan/20">
              BFS Hop Algorithm
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Computes the minimum degree of separation between any two individuals in the social network.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Source User A:</label>
              <select
                value={pathSource}
                onChange={e => setPathSource(e.target.value)}
                className="w-full bg-navy-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.major || 'User'})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target User B:</label>
              <select
                value={pathTarget}
                onChange={e => setPathTarget(e.target.value)}
                className="w-full bg-navy-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.major || 'User'})</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleFindPath}
            className="w-full py-2.5 rounded-lg bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan border border-brand-cyan/40 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Trace Social Degrees of Separation</span>
          </button>

          {pathResult && (
            <div className="p-4 rounded-lg bg-navy-950 border border-slate-800 space-y-2 animate-in fade-in">
              {pathResult.found ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Path Distance:</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {pathResult.hops === 0 ? 'Same user' : `${pathResult.hops} connection${pathResult.hops > 1 ? 's' : ''} away`}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {pathResult.path.map((nodeId, idx) => {
                      const u = users.find(x => x.id === nodeId);
                      return (
                        <React.Fragment key={nodeId}>
                          <span className="px-2.5 py-1 rounded-md bg-brand-cyan/15 text-brand-cyan font-mono text-xs font-bold border border-brand-cyan/30">
                            {u?.name || nodeId}
                          </span>
                          {idx < pathResult.path.length - 1 && (
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Path highlighted in cyan on the network graph.
                  </p>
                </>
              ) : (
                <div className="text-xs text-rose-400 font-medium text-center py-1">
                  ❌ No path exists between these users (they belong to disconnected components or an isolated node).
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tool 2: Mutual Friends Finder */}
        <div className="bg-navy-900/60 p-5 rounded-xl border border-slate-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-brand-indigo" />
              <h3 className="font-bold text-white text-base">Mutual Friend Intersections</h3>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-brand-indigo/10 text-brand-indigoLight font-mono border border-brand-indigo/20">
              M = N(A) ∩ N(B)
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Calculates common social connections shared by two users (discrete set intersection).
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">User A:</label>
              <select
                value={mutualA}
                onChange={e => setMutualA(e.target.value)}
                className="w-full bg-navy-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-indigo"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">User B:</label>
              <select
                value={mutualB}
                onChange={e => setMutualB(e.target.value)}
                className="w-full bg-navy-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-indigo"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleFindMutuals}
            className="w-full py-2.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Find Common Friends</span>
          </button>

          {mutualResult && (
            <div className="p-4 rounded-lg bg-navy-950 border border-slate-800 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Mutual Connections Found:</span>
                <span className="text-xs font-bold text-brand-cyan font-mono">
                  {mutualResult.length} common friend{mutualResult.length !== 1 ? 's' : ''}
                </span>
              </div>
              {mutualResult.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mutualResult.map(m => (
                    <span
                      key={m.id}
                      className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 text-xs font-mono font-semibold flex items-center gap-1"
                    >
                      <span>{m.avatar}</span>
                      <span>{m.name}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No mutual friends found between these two users.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bridge Users (Articulation Points) Section */}
      {statistics.bridgeUsers.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <Share2 className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Network Bridge Users (Graph Articulation Points)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In graph theory, an <strong>articulation point</strong> is a critical vertex whose removal disconnects the graph into multiple isolated subgraphs. These users act as vital social bridges between otherwise separated campus clusters.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {statistics.bridgeUsers.map(b => (
              <div
                key={b.user.id}
                className="p-3 rounded-lg bg-navy-950 border border-amber-700/50 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span>{b.user.avatar}</span>
                    <span>{b.user.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                      Bridge Node
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{b.explanation}</span>
                </div>
                <button
                  onClick={() => onSelectUser(b.user)}
                  className="text-xs text-brand-cyan hover:underline ml-2 whitespace-nowrap"
                >
                  Inspect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Degree Centrality Rankings Table */}
      <div className="bg-navy-900/60 rounded-xl border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">User Degree Centrality Leaderboard</h3>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search user..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-cyan"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Role / Field</th>
                <th className="py-2.5 px-3 text-center">Friendships (Degree)</th>
                <th className="py-2.5 px-3 text-center">Network Reach</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRankings.map((u, idx) => (
                <tr
                  key={u.id}
                  onClick={() => onSelectUser(u)}
                  className="hover:bg-slate-800/40 transition cursor-pointer"
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-400">
                    #{idx + 1}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{u.avatar}</span>
                      <span className="font-semibold text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {u.major || u.role || 'Member'}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-brand-cyan text-sm">
                    {u.degree}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">
                    {u.centralityPct}%
                  </td>
                  <td className="py-3 px-3 text-right">
                    {u.isIsolated ? (
                      <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800 text-[10px] font-semibold">
                        Isolated (0)
                      </span>
                    ) : u.isBridge ? (
                      <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800 text-[10px] font-semibold">
                        Bridge User
                      </span>
                    ) : u.degree >= 5 ? (
                      <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800 text-[10px] font-semibold">
                        Highly Connected
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        Active Node
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
