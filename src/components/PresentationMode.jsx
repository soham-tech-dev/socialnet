import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Share2,
  Layers,
  Crown,
  ShieldAlert,
  Info
} from 'lucide-react';
import NetworkGraph from './NetworkGraph';
import { PRESENTATION_DATASET } from '../data/demoDatasets';
import {
  analyzeReflexivity,
  analyzeSymmetry,
  analyzeTransitivity,
  calculateNetworkStatistics,
  computeConnectedComponents,
} from '../utils/relationMath';

export default function PresentationMode({
  isOpen,
  onClose,
  users: currentUsers,
  relations: currentRelations,
  statistics: currentStats,
  reflexiveResult: currentReflexive,
  symmetricResult: currentSymmetric,
  transitiveResult: currentTransitive,
  communities: currentCommunities,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Default to Discrete Math Chain (Presentation Dataset) as recommended by Requirement 4
  const [usePresentationDataset, setUsePresentationDataset] = useState(true);

  const totalSlides = 5;

  // Dynamically compute math for presentation dataset
  const presentationMath = useMemo(() => {
    const u = PRESENTATION_DATASET.users;
    const r = PRESENTATION_DATASET.relations;
    return {
      users: u,
      relations: r,
      reflexive: analyzeReflexivity(u, r),
      symmetric: analyzeSymmetry(u, r),
      transitive: analyzeTransitivity(u, r),
      stats: calculateNetworkStatistics(u, r),
      communities: computeConnectedComponents(u, r),
    };
  }, []);

  // Active data based on toggle (defaults to Discrete Math Chain)
  const activeUsers = usePresentationDataset ? presentationMath.users : currentUsers;
  const activeRelations = usePresentationDataset ? presentationMath.relations : currentRelations;
  const activeReflexive = usePresentationDataset ? presentationMath.reflexive : currentReflexive;
  const activeSymmetric = usePresentationDataset ? presentationMath.symmetric : currentSymmetric;
  const activeTransitive = usePresentationDataset ? presentationMath.transitive : currentTransitive;
  const activeStats = usePresentationDataset ? presentationMath.stats : currentStats;
  const activeCommunities = usePresentationDataset ? presentationMath.communities : currentCommunities;

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950 flex flex-col select-none overflow-hidden text-slate-100">
      {/* Top Presentation Bar */}
      <div className="flex items-center justify-between px-6 md:px-8 py-3.5 border-b border-slate-800 bg-navy-950/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-brand-cyan animate-pulse" />
          <span className="font-extrabold tracking-wider text-sm md:text-base text-white font-mono">
            SOCIALNET PRESENTATION DECK
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            Slide {currentSlide + 1} of {totalSlides}
          </span>
        </div>

        {/* Dataset Switcher in Presentation Mode */}
        <div className="hidden sm:flex items-center gap-1 bg-navy-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setUsePresentationDataset(true)}
            className={`px-2.5 py-1 rounded-md transition font-semibold flex items-center gap-1.5 ${
              usePresentationDataset
                ? 'bg-brand-cyan text-navy-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Discrete Math Chain (A-B-C-D-E)</span>
          </button>
          <button
            onClick={() => setUsePresentationDataset(false)}
            className={`px-2.5 py-1 rounded-md transition font-semibold ${
              !usePresentationDataset
                ? 'bg-brand-cyan text-navy-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Active Workbench Network</span>
          </button>
        </div>

        {/* Slide navigation dots & Exit */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-8 bg-brand-cyan' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 transition border border-slate-700"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit (Esc)</span>
          </button>
        </div>
      </div>

      {/* Main Slide Stage */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        {/* SLIDE 1: Title & Theoretical Premise */}
        {currentSlide === 0 && (
          <div className="max-w-4xl w-full text-center space-y-6 md:space-y-8 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Discrete Mathematics Presentation Dataset
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              SOCIALNET
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 font-light max-w-2xl mx-auto">
              Understanding Social Relationships Through Mathematics
            </p>

            {/* Presentation Dataset Chain Display: A - B - C - D - E */}
            <div className="p-4 md:p-6 rounded-2xl bg-navy-900/80 border border-cyan-500/30 shadow-2xl max-w-2xl mx-auto space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-brand-cyan block font-semibold">
                Core Presentation Dataset: Discrete Math Chain
              </span>
              <div className="flex items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base font-mono font-bold text-white">
                <span className="w-8 h-8 rounded-lg bg-cyan-950 border border-brand-cyan text-brand-cyan flex items-center justify-center">A</span>
                <span className="text-slate-500 font-bold">↔</span>
                <span className="w-8 h-8 rounded-lg bg-cyan-950 border border-brand-cyan text-brand-cyan flex items-center justify-center">B</span>
                <span className="text-slate-500 font-bold">↔</span>
                <span className="w-8 h-8 rounded-lg bg-cyan-950 border border-brand-cyan text-brand-cyan flex items-center justify-center">C</span>
                <span className="text-slate-500 font-bold">↔</span>
                <span className="w-8 h-8 rounded-lg bg-cyan-950 border border-brand-cyan text-brand-cyan flex items-center justify-center">D</span>
                <span className="text-slate-500 font-bold">↔</span>
                <span className="w-8 h-8 rounded-lg bg-cyan-950 border border-brand-cyan text-brand-cyan flex items-center justify-center">E</span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                U = {'{'} A, B, C, D, E {'}'} &nbsp;|&nbsp; R = {'{'} (A,B), (B,A), (B,C), (C,B), (C,D), (D,C), (D,E), (E,D) {'}'}
              </p>
            </div>

            {/* Pipeline Flow */}
            <div className="p-4 rounded-xl bg-navy-900/50 border border-slate-800 max-w-3xl mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold font-mono text-slate-300">
                <span className="text-brand-indigo font-bold">Users (U)</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-brand-cyan font-bold">Relations (R)</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-emerald-400 font-bold">Graph (V, E)</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-amber-400 font-bold">Math Evaluation</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-rose-400 font-bold">Insights</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              Press [Space] or [→] to view Relation Property Results
            </div>
          </div>
        )}

        {/* SLIDE 2: Relation Results */}
        {currentSlide === 1 && (
          <div className="max-w-5xl w-full space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-cyan">
                Slide 2: Mathematical Property Evaluation
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Binary Relation Property Results
              </h2>
              {usePresentationDataset && (
                <p className="text-xs font-mono text-brand-cyan">
                  Evaluated on Dataset: U = {'{'} A, B, C, D, E {'}'} (Linear Chain A-B-C-D-E)
                </p>
              )}
            </div>

            {/* 3 Result Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Reflexive */}
              <div className="bg-navy-900/80 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono text-slate-400">Property 1</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                      activeReflexive.isReflexive
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {activeReflexive.isReflexive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    Reflexive → {activeReflexive.isReflexive ? 'YES' : 'NO'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">Reflexivity</h3>
                <div className="p-3 rounded-lg bg-navy-950 font-mono text-xs text-brand-cyan border border-slate-800">
                  ∀ a ∈ U: (a, a) ∈ R
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeReflexive.reasoning}
                </p>
                <div className="p-2.5 rounded bg-rose-950/30 border border-rose-900/40 text-xs font-mono text-rose-300">
                  No self-loops: (A,A), (B,B)... ∉ R
                </div>
              </div>

              {/* Symmetric */}
              <div className="bg-navy-900/80 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono text-slate-400">Property 2</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                      activeSymmetric.isSymmetric
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {activeSymmetric.isSymmetric ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    Symmetric → {activeSymmetric.isSymmetric ? 'YES' : 'NO'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">Symmetry</h3>
                <div className="p-3 rounded-lg bg-navy-950 font-mono text-xs text-brand-cyan border border-slate-800">
                  (a, b) ∈ R ⟹ (b, a) ∈ R
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeSymmetric.reasoning}
                </p>
                <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-900/40 text-xs font-mono text-emerald-300">
                  Mutual pairs: (A,B)↔(B,A), (B,C)↔(C,B)...
                </div>
              </div>

              {/* Transitive */}
              <div className="bg-navy-900/80 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono text-slate-400">Property 3</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                      activeTransitive.isTransitive
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {activeTransitive.isTransitive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    Transitive → {activeTransitive.isTransitive ? 'YES' : 'NO'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">Transitivity</h3>
                <div className="p-3 rounded-lg bg-navy-950 font-mono text-xs text-brand-cyan border border-slate-800">
                  (a, b) ∧ (b, c) ⟹ (a, c) ∈ R
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeTransitive.reasoning}
                </p>
                <div className="p-2.5 rounded bg-amber-950/40 border border-amber-900/40 text-xs font-mono text-amber-300">
                  Counterexample: (A,B), (B,C) ∈ R but (A,C) ∉ R
                </div>
              </div>
            </div>

            {/* Explicit Counterexample Callout as per Requirement 4 */}
            <div className="p-5 rounded-2xl bg-navy-900/90 border border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Key Transitivity Counterexample in A-B-C-D-E Chain:
                </span>
                <p className="text-sm text-slate-200">
                  Since <span className="font-mono text-emerald-400 font-bold">(A, B) ∈ R</span> and{' '}
                  <span className="font-mono text-emerald-400 font-bold">(B, C) ∈ R</span>, transitivity would require{' '}
                  <span className="font-mono text-rose-400 font-bold">(A, C) ∈ R</span>.
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-navy-950 border border-amber-600/50 font-mono text-sm text-amber-300 font-bold shrink-0">
                (A, B), (B, C) ∈ R &nbsp;but&nbsp; (A, C) ∉ R
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3: Interactive Network Graph */}
        {currentSlide === 2 && (
          <div className="w-full max-w-6xl h-[70vh] flex flex-col space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-brand-cyan">
                  Slide 3: Topological Structure & Path Highlight
                </span>
                <h2 className="text-2xl font-bold text-white">
                  {usePresentationDataset ? 'Linear Chain Topology: A ↔ B ↔ C ↔ D ↔ E' : 'Network Topology Visualization'}
                </h2>
              </div>
              <div className="text-xs font-mono text-slate-400">
                {activeUsers.length} Nodes • {activeStats.undirectedFriendshipsCount} Friendships
              </div>
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden border border-slate-800 bg-navy-900/40">
              <NetworkGraph
                users={activeUsers}
                relations={activeRelations}
                communities={activeCommunities}
                selectedUser={null}
                onSelectUser={() => {}}
                highlightedPath={usePresentationDataset ? ['A', 'B', 'C'] : null}
                highlightedMissingPair={usePresentationDataset ? ['A', 'C'] : null}
              />
            </div>
          </div>
        )}

        {/* SLIDE 4: Network Insights & Metrics */}
        {currentSlide === 3 && (
          <div className="max-w-5xl w-full space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-cyan">
                Slide 4: Graph Theory Metrics
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Social Network Topological Insights
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-navy-900/80 border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Social Clusters</span>
                <div className="text-3xl font-extrabold text-brand-cyan font-mono">
                  {activeStats.communitiesCount}
                </div>
                <span className="text-[11px] text-slate-500">Connected Components</span>
              </div>

              <div className="p-5 rounded-xl bg-navy-900/80 border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Friendship Edges</span>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {activeStats.undirectedFriendshipsCount}
                </div>
                <span className="text-[11px] text-slate-500">Mutual Connections</span>
              </div>

              <div className="p-5 rounded-xl bg-navy-900/80 border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Most Connected</span>
                <div className="text-2xl font-extrabold text-amber-400 font-mono truncate">
                  {activeStats.mostConnectedUser?.name || 'N/A'}
                </div>
                <span className="text-[11px] text-slate-500">
                  {activeStats.mostConnectedUser?.connections || 0} Friendships
                </span>
              </div>

              <div className="p-5 rounded-xl bg-navy-900/80 border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Isolated Users</span>
                <div className="text-3xl font-extrabold text-rose-400 font-mono">
                  {activeStats.isolatedUsersCount}
                </div>
                <span className="text-[11px] text-slate-500">Degree 0 Users</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-navy-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Graph Density</span>
                <p className="text-sm text-slate-300 mt-0.5">
                  Formula: <span className="font-mono text-brand-cyan">2E / [N(N-1)]</span>
                </p>
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {activeStats.densityPercentage}%
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 5: Key Finding */}
        {currentSlide === 4 && (
          <div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in duration-300">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-cyan">
              Slide 5: Core Academic Takeaway
            </span>

            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-navy-900/90 to-navy-950 border border-indigo-500/30 shadow-2xl space-y-6">
              <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                “Friendship is generally symmetric, but it is not necessarily reflexive or transitive.”
              </h2>
              <div className="h-0.5 w-24 bg-brand-cyan mx-auto rounded-full" />
              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-light">
                Mathematical modeling proves that social friendship is inherently non-transitive: knowing a mutual friend does not compel a direct link. Reflexivity is socially absent, confirming that social networks form clustered communities rather than uniform equivalence classes.
              </p>
              <div className="p-3.5 rounded-xl bg-navy-950/80 border border-slate-800 text-xs font-mono text-brand-cyan">
                Chain Demonstration: (A,B) ∈ R ∧ (B,C) ∈ R ⟹ (A,C) ∉ R
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-brand-cyan hover:bg-brand-cyanLight text-navy-950 font-bold text-sm transition shadow-lg"
            >
              Return to Live Interactive Platform
            </button>
          </div>
        )}
      </div>

      {/* Bottom Slide Navigation Bar */}
      <div className="px-6 md:px-8 py-3.5 border-t border-slate-800 bg-navy-950/90 backdrop-blur-md flex items-center justify-between">
        <button
          onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
          disabled={currentSlide === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-white transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs font-mono text-slate-500">
          Navigation: Use Left/Right Arrow keys or Spacebar
        </span>

        <button
          onClick={() => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1))}
          disabled={currentSlide === totalSlides - 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-cyan hover:bg-brand-cyanLight disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-navy-950 transition"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
