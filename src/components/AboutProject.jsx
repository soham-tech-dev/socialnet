import React from 'react';
import { BookOpen, Binary, GitFork, Users, Network, Lightbulb, Compass, Award } from 'lucide-react';

export default function AboutProject() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono font-semibold">
          <BookOpen className="w-3.5 h-3.5" /> Discrete Mathematics Mini-Project
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          SOCIALNET: Social Media Friendship Network Analyzer
        </h1>
        <p className="text-base text-slate-300 leading-relaxed font-light">
          A rigorous academic computational laboratory demonstrating how discrete mathematical binary relations model real-world social platforms, analyzing reflexivity, symmetry, transitivity, graph clustering, and connectivity.
        </p>
      </div>

      {/* Mathematical Foundation Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Binary className="w-5 h-5 text-brand-indigo" />
          Mathematical Foundation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-navy-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-brand-cyan text-sm">1. Sets and Cartesian Products</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Let <span className="font-mono text-white">U</span> be the non-empty finite set of individuals (users) in the social network. The Cartesian product <span className="font-mono text-brand-indigo">U × U</span> is the set of all ordered pairs <span className="font-mono text-slate-200">{"{ (a, b) | a, b ∈ U }"}</span>.
            </p>
            <div className="p-2.5 rounded bg-navy-950 font-mono text-xs text-brand-indigo">
              |U × U| = |U|² possible relationships
            </div>
          </div>

          <div className="bg-navy-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-brand-cyan text-sm">2. Binary Relation (R ⊆ U × U)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A friendship network is formalized as a subset <span className="font-mono text-brand-cyan">R ⊆ U × U</span>. If person <span className="font-mono text-white">a</span> considers person <span className="font-mono text-white">b</span> their friend, the ordered pair <span className="font-mono text-white">(a, b) ∈ R</span>.
            </p>
            <div className="p-2.5 rounded bg-navy-950 font-mono text-xs text-brand-cyan">
              (a, b) ∈ R ⟺ a is connected to b
            </div>
          </div>

          <div className="bg-navy-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-brand-indigo text-sm">3. Reflexivity & Irreflexivity</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A relation is reflexive if <span className="font-mono text-white">∀ a ∈ U, (a, a) ∈ R</span>. In real-world social networks, users do not send friendship requests to themselves, making friendship relations <em>irreflexive</em> in nature.
            </p>
          </div>

          <div className="bg-navy-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-brand-indigo text-sm">4. Symmetry & Mutuality</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A relation is symmetric if <span className="font-mono text-white">∀ a, b ∈ U, (a, b) ∈ R ⟹ (b, a) ∈ R</span>. Friendship platforms (e.g. Facebook, LinkedIn connections) enforce symmetry, whereas follow systems (e.g. Twitter/X, Instagram) are asymmetric general relations.
            </p>
          </div>

          <div className="bg-navy-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-amber-400 text-sm">5. Non-Transitivity of Social Relations</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Transitivity requires <span className="font-mono text-white">(a, b) ∈ R ∧ (b, c) ∈ R ⟹ (a, c) ∈ R</span>. Human relationships are fundamentally non-transitive: "a friend of my friend is not necessarily my friend." If social networks were transitive, every connected community would form a complete clique!
            </p>
          </div>

          <div className="bg-navy-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-emerald-400 text-sm">6. Graph Theory & Articulation Points</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Representing R as a graph <span className="font-mono text-white">G = (V, E)</span> enables topology analysis: connected components reveal distinct social clubs, while articulation points (bridge users) represent key communicators whose departure fractures the network.
            </p>
          </div>
        </div>
      </div>

      {/* Real-World Industry Applications */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          Real-World Applications in Modern Technology
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800 space-y-2">
            <span className="font-bold text-white block text-sm">Friend Recommendation Engines</span>
            <p>
              Platforms like LinkedIn and Instagram identify 2-hop open triads <span className="font-mono">(A,B) ∧ (B,C)</span> where <span className="font-mono">(A,C)</span> is absent to power "People You May Know" algorithms.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800 space-y-2">
            <span className="font-bold text-white block text-sm">Community Detection & Ad Targeting</span>
            <p>
              Connected components and modularity algorithms isolate demographic clusters to serve contextually relevant content and advertising.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800 space-y-2">
            <span className="font-bold text-white block text-sm">Viral Marketing & Influencers</span>
            <p>
              Degree centrality and bridge identification locate structural connectors who can spread information across campus departments and social bubbles with maximum reach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
