import React from 'react';
import { X, CheckCircle2, XCircle, ArrowRight, Lightbulb, Compass } from 'lucide-react';

export default function WhyExplainerModal({
  isOpen,
  onClose,
  propertyType, // 'reflexive' | 'symmetric' | 'transitive'
  reflexiveResult,
  symmetricResult,
  transitiveResult,
  onHighlightOnGraph,
}) {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (propertyType) {
      case 'reflexive': {
        const { isReflexive, missingSelfLoops, presentSelfLoops, formula } = reflexiveResult;
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-navy-800/80 border border-slate-700/60">
              {isReflexive ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
              )}
              <div>
                <h3 className="text-lg font-bold text-white">
                  Reflexivity: {isReflexive ? 'Condition Satisfied ✅' : 'Condition Violated ❌'}
                </h3>
                <p className="text-sm text-slate-300 font-mono mt-0.5">
                  Formal Condition: <span className="text-brand-cyan">{formula}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                1. Mathematical Definition
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-navy-950/60 p-3.5 rounded-lg border border-slate-800 font-sans">
                A binary relation <span className="font-mono text-brand-cyan">R</span> on set <span className="font-mono text-brand-indigo">U</span> is <strong className="text-white">reflexive</strong> if and only if every single element <span className="font-mono text-slate-200">a ∈ U</span> is related to itself. That is, the ordered pair <span className="font-mono text-brand-cyan">(a, a)</span> must exist in <span className="font-mono text-brand-cyan">R</span> for all users.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                2. Step-by-Step Evaluation on Current Network
              </h4>
              <div className="bg-navy-950/70 p-4 rounded-lg border border-slate-800 space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Total Users in Set U:</span>
                  <span className="font-mono font-semibold text-white">
                    {reflexiveResult.presentSelfLoops.length + reflexiveResult.missingSelfLoops.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Users with Self-Friendship (a,a) ∈ R:</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    {presentSelfLoops.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Users Missing Self-Friendship (a,a) ∉ R:</span>
                  <span className="font-mono font-semibold text-rose-400">
                    {missingSelfLoops.length}
                  </span>
                </div>
              </div>
            </div>

            {!isReflexive ? (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-rose-400">
                  3. Concrete Counterexamples (Missing Self-Pairs)
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {missingSelfLoops.slice(0, 6).map((u, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/40 text-xs"
                    >
                      <span className="font-mono text-rose-300">
                        ({u.name}, {u.name}) ∉ R
                      </span>
                      <span className="text-slate-400">User {u.name} has no self-loop</span>
                    </div>
                  ))}
                  {missingSelfLoops.length > 6 && (
                    <p className="text-xs text-slate-500 italic">
                      + {missingSelfLoops.length - 6} more missing self-pairs
                    </p>
                  )}
                </div>
                <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>
                    <strong>Real-World Social Context:</strong> In ordinary social media platforms, friendship is irreflexive (people do not send friendship requests to themselves). Therefore, real-world friendship relations naturally fail reflexivity.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-200">
                ✅ Every user in set U contains a self-loop pair <code className="font-mono">(u, u) ∈ R</code>. The relation is strictly reflexive.
              </div>
            )}
          </div>
        );
      }

      case 'symmetric': {
        const { isSymmetric, counterexamples, verifiedPairs, formula } = symmetricResult;
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-navy-800/80 border border-slate-700/60">
              {isSymmetric ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
              )}
              <div>
                <h3 className="text-lg font-bold text-white">
                  Symmetry: {isSymmetric ? 'Condition Satisfied ✅' : 'Condition Violated ❌'}
                </h3>
                <p className="text-sm text-slate-300 font-mono mt-0.5">
                  Formal Condition: <span className="text-brand-cyan">{formula}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                1. Mathematical Definition
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-navy-950/60 p-3.5 rounded-lg border border-slate-800 font-sans">
                A relation <span className="font-mono text-brand-cyan">R</span> is <strong className="text-white">symmetric</strong> if for every ordered pair <span className="font-mono text-brand-cyan">(a, b) ∈ R</span>, the reversed ordered pair <span className="font-mono text-brand-indigo">(b, a) ∈ R</span> is also present. In social terms, every connection must be mutual and reciprocal.
              </p>
            </div>

            {isSymmetric ? (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                  2. Verified Reciprocal Pairs ({verifiedPairs.length} mutual friendships)
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {verifiedPairs.slice(0, 8).map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs"
                    >
                      <span className="font-mono text-emerald-300">{p.display}</span>
                      <span className="text-slate-400">Both directional edges exist in R</span>
                    </div>
                  ))}
                </div>
                <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 shrink-0 text-brand-cyan mt-0.5" />
                  <span>
                    <strong>Why?</strong> "Every friendship has a corresponding reverse connection. If Alex is friends with Priya, then Priya is friends with Alex."
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-rose-400">
                  2. Asymmetric Counterexamples ({counterexamples.length} one-way link(s))
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {counterexamples.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-rose-300 font-bold">{c.pair} ∈ R</span>
                        <span className="font-mono text-rose-400 font-semibold">{c.missingReverse} ∉ R</span>
                      </div>
                      <p className="text-slate-300">{c.explanation}</p>
                      <button
                        onClick={() => {
                          onHighlightOnGraph({
                            type: 'relation',
                            source: c.source.id,
                            target: c.target.id
                          });
                          onClose();
                        }}
                        className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium underline"
                      >
                        <Compass className="w-3 h-3" /> Highlight this asymmetric edge on graph
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'transitive': {
        const { isTransitive, counterexamples, verifiedTriples, formula } = transitiveResult;
        const primaryCounter = counterexamples[0];

        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-navy-800/80 border border-slate-700/60">
              {isTransitive ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
              )}
              <div>
                <h3 className="text-lg font-bold text-white">
                  Transitivity: {isTransitive ? 'Condition Satisfied ✅' : 'Condition Violated ❌'}
                </h3>
                <p className="text-sm text-slate-300 font-mono mt-0.5">
                  Formal Condition: <span className="text-brand-cyan">{formula}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                1. Mathematical Definition
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-navy-950/60 p-3.5 rounded-lg border border-slate-800 font-sans">
                A relation <span className="font-mono text-brand-cyan">R</span> is <strong className="text-white">transitive</strong> if whenever <span className="font-mono text-brand-cyan">(a, b) ∈ R</span> and <span className="font-mono text-brand-cyan">(b, c) ∈ R</span>, then the direct pair <span className="font-mono text-amber-400">(a, c) ∈ R</span> must also belong to <span className="font-mono text-brand-cyan">R</span>.
              </p>
            </div>

            {!isTransitive && primaryCounter ? (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                  2. Detailed Mathematical Proof / Counterexample Walkthrough
                </h4>

                <div className="bg-navy-950/80 p-4 rounded-xl border border-amber-600/30 space-y-3 text-sm">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                      Ex
                    </span>
                    Counterexample Triad: {primaryCounter.a.name} → {primaryCounter.b.name} → {primaryCounter.c.name}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
                    <div className="p-2.5 rounded bg-navy-900 border border-slate-800 text-xs">
                      <span className="text-slate-400 block mb-1">Step 1: Premise A→B</span>
                      <span className="font-mono text-emerald-400 font-bold">{primaryCounter.step1}</span>
                      <p className="text-slate-400 text-[11px] mt-1">{primaryCounter.a.name} is friends with {primaryCounter.b.name}</p>
                    </div>

                    <div className="p-2.5 rounded bg-navy-900 border border-slate-800 text-xs">
                      <span className="text-slate-400 block mb-1">Step 2: Premise B→C</span>
                      <span className="font-mono text-emerald-400 font-bold">{primaryCounter.step2}</span>
                      <p className="text-slate-400 text-[11px] mt-1">{primaryCounter.b.name} is friends with {primaryCounter.c.name}</p>
                    </div>

                    <div className="p-2.5 rounded bg-rose-950/40 border border-rose-800/40 text-xs">
                      <span className="text-rose-400 block mb-1">Step 3: Missing Required Edge</span>
                      <span className="font-mono text-rose-300 font-bold">{primaryCounter.missingPair}</span>
                      <p className="text-slate-300 text-[11px] mt-1">{primaryCounter.a.name} is NOT friends with {primaryCounter.c.name}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
                    <p className="text-xs text-slate-300">
                      <strong>Conclusion:</strong> Transitivity would strictly require a direct friendship between <span className="text-white font-semibold">{primaryCounter.a.name}</span> and <span className="text-white font-semibold">{primaryCounter.c.name}</span>.
                    </p>
                    <button
                      onClick={() => {
                        onHighlightOnGraph({
                          type: 'transitive-counter',
                          path: [primaryCounter.a.id, primaryCounter.b.id, primaryCounter.c.id],
                          missingPair: [primaryCounter.a.id, primaryCounter.c.id]
                        });
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      Highlight {primaryCounter.a.name} → {primaryCounter.b.name} → {primaryCounter.c.name} on Graph
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    All Detected Counterexamples ({counterexamples.length} total):
                  </h5>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {counterexamples.slice(0, 5).map((c, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-navy-950/50 border border-slate-800 text-xs flex items-center justify-between"
                      >
                        <span className="font-mono text-slate-300">
                          ({c.a.name}, {c.b.name}) ∧ ({c.b.name}, {c.c.name}) ⟹ ({c.a.name}, {c.c.name}) ∉ R
                        </span>
                        <button
                          onClick={() => {
                            onHighlightOnGraph({
                              type: 'transitive-counter',
                              path: [c.a.id, c.b.id, c.c.id],
                              missingPair: [c.a.id, c.c.id]
                            });
                            onClose();
                          }}
                          className="text-[11px] text-brand-cyan hover:underline"
                        >
                          Show on graph
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 shrink-0 text-brand-cyan mt-0.5" />
                  <span>
                    <strong>Academic Takeaway:</strong> In real life, "a friend of your friend is not necessarily your friend." If friendship were always transitive, every connected component would be a complete clique (every person friends with everyone else)!
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-200">
                  ✅ Every 2-hop connection has a direct edge! All {verifiedTriples.length} test triples satisfy transitivity.
                </div>
              </div>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-navy-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-navy-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Mathematical "Why?" Explainer
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-navy-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Discrete Mathematics: Binary Relations & Formal Logic
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Close Explainer
          </button>
        </div>
      </div>
    </div>
  );
}
