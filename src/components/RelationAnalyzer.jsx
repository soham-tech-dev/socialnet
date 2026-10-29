import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code,
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import {
  analyzeReflexivity,
  analyzeSymmetry,
  analyzeTransitivity,
  analyzeEquivalence
} from '../utils/relationMath';

export default function RelationAnalyzer({
  users,
  relations,
  onOpenWhyExplainer,
  onHighlightOnGraph,
}) {
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'reflexive' | 'symmetric' | 'transitive'

  const reflexiveResult = analyzeReflexivity(users, relations);
  const symmetricResult = analyzeSymmetry(users, relations);
  const transitiveResult = analyzeTransitivity(users, relations);
  const equivalenceResult = analyzeEquivalence(
    reflexiveResult,
    symmetricResult,
    transitiveResult
  );

  const filteredRelations = relations.filter(r => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    const uSrc = users.find(u => u.id === r.source);
    const uTgt = users.find(u => u.id === r.target);
    return (
      (uSrc && uSrc.name.toLowerCase().includes(q)) ||
      (uTgt && uTgt.name.toLowerCase().includes(q)) ||
      r.source.toLowerCase().includes(q) ||
      r.target.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-navy-900/70 p-6 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-brand-cyan" />
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Mathematical Relation Analyzer
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Rigorous Discrete Mathematics property validation for binary relation{' '}
              <span className="font-mono text-brand-cyan">R ⊆ U × U</span>
            </p>
          </div>

          {/* Equivalence Status Banner */}
          <div
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
              equivalenceResult.isEquivalence
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-navy-950/80 border-slate-700 text-slate-300'
            }`}
          >
            {equivalenceResult.isEquivalence ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400" />
            )}
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Equivalence Relation?</span>
              <span className="font-bold">{equivalenceResult.statusText}</span>
            </div>
          </div>
        </div>

        {/* Formal Mathematical Given Set & Relation R */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
          <div className="bg-navy-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Given Set of Users (U):
            </span>
            <p className="font-mono text-xs text-brand-indigo break-all leading-relaxed max-h-16 overflow-y-auto">
              U = {'{'} {users.map(u => u.name).join(', ')} {'}'}
            </p>
            <span className="text-[11px] text-slate-500 font-mono">
              Cardinality |U| = {users.length}
            </span>
          </div>

          <div className="bg-navy-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Given Binary Relation Set (R):
            </span>
            <p className="font-mono text-xs text-brand-cyan break-all leading-relaxed max-h-16 overflow-y-auto">
              R = {'{'} {relations.map(r => {
                const s = users.find(u => u.id === r.source)?.name || r.source;
                const t = users.find(u => u.id === r.target)?.name || r.target;
                return `(${s}, ${t})`;
              }).join(', ')} {'}'}
            </p>
            <span className="text-[11px] text-slate-500 font-mono">
              Cardinality |R| = {relations.length} ordered pairs
            </span>
          </div>
        </div>
      </div>

      {/* The 3 Core Relation Property Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Reflexive Property Card */}
        <div className="bg-navy-900/60 rounded-xl border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Property 1
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                  reflexiveResult.isReflexive
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {reflexiveResult.isReflexive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {reflexiveResult.statusText}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">Reflexive</h3>
            
            <div className="p-2.5 rounded bg-navy-950 border border-slate-800 text-xs font-mono text-brand-cyan">
              {reflexiveResult.formula}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {reflexiveResult.reasoning}
            </p>

            {/* Counterexamples preview */}
            {!reflexiveResult.isReflexive && (
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/40 text-xs space-y-1">
                <span className="text-rose-400 font-semibold block">Missing Self-Loops:</span>
                <span className="font-mono text-slate-300">
                  {reflexiveResult.missingSelfLoops.slice(0, 3).map(u => `(${u.name}, ${u.name})`).join(', ')}
                  {reflexiveResult.missingSelfLoops.length > 3 && ` +${reflexiveResult.missingSelfLoops.length - 3} more`}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenWhyExplainer('reflexive')}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700"
          >
            <HelpCircle className="w-4 h-4 text-brand-cyan" />
            <span>WHY? (Mathematical Proof)</span>
          </button>
        </div>

        {/* 2. Symmetric Property Card */}
        <div className="bg-navy-900/60 rounded-xl border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Property 2
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                  symmetricResult.isSymmetric
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {symmetricResult.isSymmetric ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {symmetricResult.statusText}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">Symmetric</h3>

            <div className="p-2.5 rounded bg-navy-950 border border-slate-800 text-xs font-mono text-brand-cyan">
              {symmetricResult.formula}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {symmetricResult.reasoning}
            </p>

            {/* Reciprocal count or violation */}
            {symmetricResult.isSymmetric ? (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-xs space-y-1">
                <span className="text-emerald-400 font-semibold block">All pairs reciprocal:</span>
                <span className="font-mono text-slate-300">
                  {symmetricResult.verifiedPairs.length} mutual friendships verified
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/40 text-xs space-y-1">
                <span className="text-rose-400 font-semibold block">Asymmetry Detected:</span>
                <span className="font-mono text-slate-300">
                  {symmetricResult.counterexamples[0]?.explanation}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenWhyExplainer('symmetric')}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700"
          >
            <HelpCircle className="w-4 h-4 text-brand-cyan" />
            <span>WHY? (Mathematical Proof)</span>
          </button>
        </div>

        {/* 3. Transitive Property Card */}
        <div className="bg-navy-900/60 rounded-xl border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Property 3
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                  transitiveResult.isTransitive
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {transitiveResult.isTransitive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {transitiveResult.statusText}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">Transitive</h3>

            <div className="p-2.5 rounded bg-navy-950 border border-slate-800 text-xs font-mono text-brand-cyan">
              {transitiveResult.formula}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {transitiveResult.reasoning}
            </p>

            {/* Counterexample Highlight */}
            {!transitiveResult.isTransitive && transitiveResult.counterexamples[0] && (
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-900/40 text-xs space-y-1">
                <span className="text-amber-400 font-semibold block">Counterexample Triad:</span>
                <span className="font-mono text-slate-300">
                  {transitiveResult.counterexamples[0].step1} ∧ {transitiveResult.counterexamples[0].step2} but{' '}
                  <span className="text-rose-400">{transitiveResult.counterexamples[0].missingPair}</span>
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenWhyExplainer('transitive')}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700"
          >
            <HelpCircle className="w-4 h-4 text-brand-cyan" />
            <span>WHY? (Mathematical Proof)</span>
          </button>
        </div>
      </div>

      {/* Verified Pairs and Counterexamples Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symmetric Reciprocal Pairs Explorer */}
        <div className="bg-navy-900/60 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verified Symmetric Pairs ({symmetricResult.verifiedPairs.length})
            </h4>
            <span className="text-xs text-slate-400 font-mono">(A,B) ↔ (B,A)</span>
          </div>

          {symmetricResult.verifiedPairs.length > 0 ? (
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {symmetricResult.verifiedPairs.map((pair, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-navy-950 border border-slate-800/70 text-xs"
                >
                  <span className="font-mono text-emerald-400 font-semibold">
                    {pair.display}
                  </span>
                  <button
                    onClick={() => onHighlightOnGraph({
                      type: 'relation',
                      source: pair.userA.id,
                      target: pair.userB.id
                    })}
                    className="text-[11px] text-brand-cyan hover:underline"
                  >
                    View on graph
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-navy-950 text-xs text-slate-400 text-center">
              No mutual symmetric pairs exist in the relation.
            </div>
          )}
        </div>

        {/* Transitivity Counterexamples Explorer */}
        <div className="bg-navy-900/60 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              Transitivity Violations ({transitiveResult.counterexamples.length})
            </h4>
            <span className="text-xs text-slate-400 font-mono">(A,B) ∧ (B,C) ⇏ (A,C)</span>
          </div>

          {transitiveResult.counterexamples.length > 0 ? (
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {transitiveResult.counterexamples.map((c, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-navy-950 border border-slate-800/70 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-300 font-medium">
                      {c.step1} ∧ {c.step2}
                    </span>
                    <span className="font-mono text-rose-400 font-bold">
                      {c.missingPair}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                    <span className="text-[11px] text-slate-400">{c.explanation}</span>
                    <button
                      onClick={() => onHighlightOnGraph({
                        type: 'transitive-counter',
                        path: [c.a.id, c.b.id, c.c.id],
                        missingPair: [c.a.id, c.c.id]
                      })}
                      className="text-[11px] text-brand-cyan hover:underline whitespace-nowrap ml-2"
                    >
                      Show on graph
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-xs text-emerald-300 text-center">
              ✅ No transitivity counterexamples found. Every 2-step friendship path is connected!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
