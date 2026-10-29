import React from 'react';
import { Users, Network, Activity, Crown, ShieldAlert, Sparkles } from 'lucide-react';

const CLUSTER_ACCENTS = [
  { border: 'border-cyan-500/40', bg: 'bg-cyan-500/10', text: 'text-cyan-400', badge: 'bg-cyan-950 text-cyan-300' },
  { border: 'border-indigo-500/40', bg: 'bg-indigo-500/10', text: 'text-indigo-400', badge: 'bg-indigo-950 text-indigo-300' },
  { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-400', badge: 'bg-emerald-950 text-emerald-300' },
  { border: 'border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-400', badge: 'bg-amber-950 text-amber-300' },
  { border: 'border-pink-500/40', bg: 'bg-pink-500/10', text: 'text-pink-400', badge: 'bg-pink-950 text-pink-300' },
  { border: 'border-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-400', badge: 'bg-purple-950 text-purple-300' },
];

export default function CommunityAnalysis({
  communities,
  onSelectUser,
  onSelectCommunity,
}) {
  const activeCommunities = communities.filter(c => !c.isIsolated);
  const isolatedCommunities = communities.filter(c => c.isIsolated);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900/70 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-xl font-bold text-white tracking-tight">Social Communities & Graph Partitioning</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Connected component clustering partitions user set <span className="font-mono text-brand-cyan">U</span> into disjoint equivalence sub-networks.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-navy-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Total Clusters: </span>
            <span className="font-mono font-bold text-brand-cyan">{activeCommunities.length}</span>
          </div>
          <div className="bg-navy-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Isolated Users: </span>
            <span className="font-mono font-bold text-rose-400">{isolatedCommunities.length}</span>
          </div>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeCommunities.map((cluster, idx) => {
          const style = CLUSTER_ACCENTS[idx % CLUSTER_ACCENTS.length];
          const densityPercent = (cluster.density * 100).toFixed(1);

          return (
            <div
              key={cluster.id}
              className={`bg-navy-900/60 rounded-xl border ${style.border} p-5 flex flex-col justify-between space-y-4 hover:shadow-lg transition`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${style.text.replace('text-', 'bg-')}`} />
                    <h3 className="font-bold text-white text-base">{cluster.name}</h3>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${style.badge}`}>
                    {cluster.size} Users
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-navy-950/80 border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">Internal Links</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {cluster.internalEdgesCount} friendships
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-navy-950/80 border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">Cluster Density</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {densityPercent}%
                    </span>
                  </div>
                </div>

                {/* Cluster Leader / Central User */}
                {cluster.leader && (
                  <div className="p-2.5 rounded-lg bg-navy-950/90 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-slate-400">Cluster Lead:</span>
                    </div>
                    <button
                      onClick={() => onSelectUser(cluster.leader)}
                      className="font-bold text-white hover:text-brand-cyan transition flex items-center gap-1 font-mono"
                    >
                      <span>{cluster.leader.avatar}</span>
                      <span>{cluster.leader.name}</span>
                    </button>
                  </div>
                )}

                {/* Member Avatars */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Cluster Members:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cluster.members.map(member => (
                      <button
                        key={member.id}
                        onClick={() => onSelectUser(member)}
                        className="px-2 py-1 rounded bg-slate-800/70 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700/60 transition flex items-center gap-1"
                        title={member.name}
                      >
                        <span>{member.avatar}</span>
                        <span className="font-mono text-[11px]">{member.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Isolated Users Section */}
      {isolatedCommunities.length > 0 && (
        <div className="bg-navy-900/40 p-5 rounded-xl border border-rose-900/40 space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Socially Isolated Users ({isolatedCommunities.length})
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            These users possess degree 0 (no incident edges in relation R) and form individual singleton connected components.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {isolatedCommunities.map(c => {
              const u = c.members[0];
              return (
                <button
                  key={u.id}
                  onClick={() => onSelectUser(u)}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-200 hover:bg-rose-900/50 text-xs font-mono font-semibold flex items-center gap-1.5 transition"
                >
                  <span>{u.avatar || '🎧'}</span>
                  <span>{u.name}</span>
                  <span className="text-[10px] text-rose-400 font-sans">(0 friends)</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
