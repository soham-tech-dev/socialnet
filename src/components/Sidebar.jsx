import React from 'react';
import {
  LayoutDashboard,
  Share2,
  BookOpen,
  Table,
  Users,
  Award,
  FlaskConical,
  Info,
  ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'network-explorer', label: 'Network Explorer', icon: Share2, badge: 'Hero' },
  { id: 'relation-analyzer', label: 'Relation Analyzer', icon: BookOpen, badge: 'Discrete Math' },
  { id: 'relation-matrix', label: 'Relation Matrix', icon: Table, badge: 'Matrix' },
  { id: 'community-analysis', label: 'Community Analysis', icon: Users, badge: null },
  { id: 'user-insights', label: 'User Insights', icon: Award, badge: null },
  { id: 'simulation-lab', label: 'Simulation Lab', icon: FlaskConical, badge: 'What If?' },
  { id: 'about-project', label: 'About Project', icon: Info, badge: null },
];

export default function Sidebar({
  activeTab,
  onSelectTab,
  metricsSummary,
}) {
  return (
    <aside className="w-64 bg-navy-950/70 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0 hidden md:flex">
      {/* Navigation Links */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 px-3">
            Core Modules
          </span>
          <nav className="space-y-1 pt-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-indigo/30 to-brand-cyan/20 text-white border border-brand-cyan/40 shadow-glow-cyan'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-cyan' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        isActive
                          ? 'bg-brand-cyan/20 text-brand-cyan'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Relation Status Mini Widget */}
        <div className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800/80 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            Binary Relation Status
          </span>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Reflexive:</span>
              <span className={`font-mono text-[11px] font-bold ${metricsSummary.isReflexive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metricsSummary.isReflexive ? 'TRUE ✅' : 'FALSE ❌'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Symmetric:</span>
              <span className={`font-mono text-[11px] font-bold ${metricsSummary.isSymmetric ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metricsSummary.isSymmetric ? 'TRUE ✅' : 'FALSE ❌'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Transitive:</span>
              <span className={`font-mono text-[11px] font-bold ${metricsSummary.isTransitive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metricsSummary.isTransitive ? 'TRUE ✅' : 'FALSE ❌'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Discrete Math Mini Note */}
      <div className="p-3 rounded-lg bg-navy-900/30 border border-slate-800/50 text-[11px] text-slate-500 font-mono">
        R ⊆ U × U (Binary Relation)
        <br />
        G = (V, E) Graph Model
      </div>
    </aside>
  );
}
