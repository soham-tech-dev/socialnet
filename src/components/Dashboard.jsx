import React from 'react';
import {
  Users,
  Share2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Crown,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Compass,
  Table,
  Plus
} from 'lucide-react';
import NetworkGraph from './NetworkGraph';

export default function Dashboard({
  users,
  relations,
  statistics,
  reflexiveResult,
  symmetricResult,
  transitiveResult,
  communities,
  selectedUser,
  onSelectUser,
  onOpenWhyExplainer,
  onOpenAddModal,
  onNavigateTab,
  highlightedPath,
  highlightedMissingPair,
  highlightedRelation,
}) {
  return (
    <div className="space-y-8">
      {/* Top Section: KPI Metric Cards (Section 5) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Total Users */}
        <div className="bg-navy-900/60 p-4 rounded-xl border border-slate-800/80 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Users</span>
            <Users className="w-4 h-4 text-brand-cyan" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-white font-mono">{statistics.totalUsers}</span>
            <span className="text-[11px] text-slate-500 block">Set |U|</span>
          </div>
        </div>

        {/* 2. Friendships */}
        <div className="bg-navy-900/60 p-4 rounded-xl border border-slate-800/80 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Friendships</span>
            <Share2 className="w-4 h-4 text-brand-indigo" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-white font-mono">{statistics.undirectedFriendshipsCount}</span>
            <span className="text-[11px] text-slate-500 block">Unique Edges</span>
          </div>
        </div>

        {/* 3. Mutual Connections */}
        <div className="bg-navy-900/60 p-4 rounded-xl border border-slate-800/80 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Mutual Connections</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">{statistics.mutualFriendshipsCount}</span>
            <span className="text-[11px] text-slate-500 block">Reciprocal Pairs</span>
          </div>
        </div>

        {/* 4. Communities */}
        <div className="bg-navy-900/60 p-4 rounded-xl border border-slate-800/80 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Communities</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-amber-400 font-mono">{statistics.communitiesCount}</span>
            <span className="text-[11px] text-slate-500 block">Connected Clusters</span>
          </div>
        </div>

        {/* 5. Isolated Users */}
        <div className="bg-navy-900/60 p-4 rounded-xl border border-slate-800/80 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Isolated Users</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-rose-400 font-mono">{statistics.isolatedUsersCount}</span>
            <span className="text-[11px] text-slate-500 block">Degree 0</span>
          </div>
        </div>

        {/* 6. Most Connected User */}
        <div className="bg-navy-900/60 p-4 rounded-xl border border-slate-800/80 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Most Connected</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 truncate">
            <span className="text-base font-extrabold text-white font-mono truncate block">
              {statistics.mostConnectedUser ? `${statistics.mostConnectedUser.name}` : 'None'}
            </span>
            <span className="text-[11px] text-slate-400 block font-mono">
              {statistics.mostConnectedUser ? `${statistics.mostConnectedUser.connections} connections` : '0 connections'}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Relation Property Summary (Section 5) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-cyan" />
            Relation Property Summary
          </h2>
          <button
            onClick={() => onNavigateTab('relation-analyzer')}
            className="text-xs text-brand-cyan hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Open In-Depth Analyzer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. REFLEXIVE */}
          <div className="bg-navy-900/70 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg hover:border-slate-700 transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-slate-400">REFLEXIVE</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    reflexiveResult.isReflexive
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {reflexiveResult.isReflexive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {reflexiveResult.statusText}
                </span>
              </div>
              <div className="p-2 rounded bg-navy-950 font-mono text-xs text-brand-cyan border border-slate-800/80">
                (a, a) ∈ R for all a ∈ U
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                <strong className="text-white">Why?</strong> {reflexiveResult.reasoning}
              </p>
            </div>
            <button
              onClick={() => onOpenWhyExplainer('reflexive')}
              className="w-full py-2 px-3 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700"
            >
              <HelpCircle className="w-3.5 h-3.5 text-brand-cyan" />
              <span>WHY? (Mathematical Proof)</span>
            </button>
          </div>

          {/* 2. SYMMETRIC */}
          <div className="bg-navy-900/70 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg hover:border-slate-700 transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-slate-400">SYMMETRIC</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    symmetricResult.isSymmetric
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {symmetricResult.isSymmetric ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {symmetricResult.statusText}
                </span>
              </div>
              <div className="p-2 rounded bg-navy-950 font-mono text-xs text-brand-cyan border border-slate-800/80">
                (a, b) ∈ R ⟹ (b, a) ∈ R
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                <strong className="text-white">Why?</strong> {symmetricResult.reasoning}
              </p>
            </div>
            <button
              onClick={() => onOpenWhyExplainer('symmetric')}
              className="w-full py-2 px-3 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700"
            >
              <HelpCircle className="w-3.5 h-3.5 text-brand-cyan" />
              <span>WHY? (Mathematical Proof)</span>
            </button>
          </div>

          {/* 3. TRANSITIVE */}
          <div className="bg-navy-900/70 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg hover:border-slate-700 transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-slate-400">TRANSITIVE</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    transitiveResult.isTransitive
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {transitiveResult.isTransitive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {transitiveResult.statusText}
                </span>
              </div>
              <div className="p-2 rounded bg-navy-950 font-mono text-xs text-brand-cyan border border-slate-800/80">
                (a, b) ∧ (b, c) ⟹ (a, c) ∈ R
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                <strong className="text-white">Why?</strong> {transitiveResult.reasoning}
              </p>
            </div>
            <button
              onClick={() => onOpenWhyExplainer('transitive')}
              className="w-full py-2 px-3 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700"
            >
              <HelpCircle className="w-3.5 h-3.5 text-brand-cyan" />
              <span>WHY? (Mathematical Proof)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Network Visualization Centerpiece (Section 6) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-brand-cyan" />
              Live Interactive Friendship Network
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Node sizes reflect degree centrality; border hues reflect community partitions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('relation-matrix')}
              className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
            >
              <Table className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Adjacency Matrix</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-1.5 rounded-lg bg-brand-cyan hover:bg-brand-cyanLight text-navy-950 text-xs font-bold flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Friendship / User</span>
            </button>
          </div>
        </div>

        {/* Network Graph Container */}
        <div className="h-[520px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-navy-950/40">
          <NetworkGraph
            users={users}
            relations={relations}
            communities={communities}
            selectedUser={selectedUser}
            onSelectUser={onSelectUser}
            highlightedPath={highlightedPath}
            highlightedMissingPair={highlightedMissingPair}
            highlightedRelation={highlightedRelation}
          />
        </div>
      </div>
    </div>
  );
}
