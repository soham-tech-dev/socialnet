import React, { useState } from 'react';
import {
  Share2,
  Tv,
  Download,
  RotateCcw,
  Sparkles,
  ChevronDown,
  FileSpreadsheet,
  FileCode,
  GraduationCap,
  Plus
} from 'lucide-react';
import { DEMO_DATASETS } from '../data/demoDatasets';

export default function Navbar({
  currentDatasetId,
  onSelectDataset,
  onResetNetwork,
  onOpenPresentation,
  onOpenAddModal,
  onExportJSON,
  onExportCSV,
  educationalMode, // 'student' | 'presentation'
  onToggleEducationalMode,
}) {
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-navy-950/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
      {/* Brand & Live Network Status */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-cyan flex items-center justify-center text-white shadow-glow-cyan shrink-0">
          <Share2 className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-white tracking-wider font-mono">
              SOCIALNET
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-[10px] font-bold text-emerald-400 font-mono tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE NETWORK
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Social Network Relation Analyzer
          </p>
        </div>
      </div>

      {/* Center / Right Action Controls */}
      <div className="flex items-center gap-2.5">
        {/* Load Demo Network Dropdown (Section 15) */}
        <div className="relative">
          <button
            onClick={() => { setDemoMenuOpen(!demoMenuOpen); setExportMenuOpen(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-slate-800 text-xs text-slate-200 border border-slate-700/80 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="hidden md:inline">Dataset:</span>
            <span className="font-semibold text-brand-cyan truncate max-w-[150px]">
              {DEMO_DATASETS.find(d => d.id === currentDatasetId)?.badge || 'Demos'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {demoMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-navy-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-2 py-1 block">
                Pre-built Academic Scenarios
              </span>
              <div className="max-h-80 overflow-y-auto space-y-1">
                {DEMO_DATASETS.map(demo => (
                  <button
                    key={demo.id}
                    onClick={() => {
                      onSelectDataset(demo);
                      setDemoMenuOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition flex flex-col gap-0.5 ${
                      currentDatasetId === demo.id
                        ? 'bg-brand-cyan/20 border border-brand-cyan text-brand-cyan font-bold'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold truncate">{demo.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                        {demo.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{demo.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Student Mode / Presentation Mode Toggle (Section 17) */}
        <button
          onClick={onToggleEducationalMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
            educationalMode === 'student'
              ? 'bg-indigo-950/40 border-indigo-700/60 text-indigo-300'
              : 'bg-cyan-950/40 border-cyan-700/60 text-cyan-300'
          }`}
          title="Toggle between Student Mode (Formulas & Explanations) and Presentation Mode"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mode:</span>
          <span>{educationalMode === 'student' ? 'Student' : 'Presenter'}</span>
        </button>

        {/* Presentation Deck Fullscreen Button (Section 18) */}
        <button
          onClick={onOpenPresentation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
        >
          <Tv className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Slides Deck</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setExportMenuOpen(!exportMenuOpen); setDemoMenuOpen(false); }}
            className="p-1.5 rounded-lg bg-navy-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition"
            title="Export Relation Data"
          >
            <Download className="w-4 h-4" />
          </button>

          {exportMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-navy-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in space-y-1">
              <button
                onClick={() => { onExportJSON(); setExportMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <FileCode className="w-4 h-4 text-brand-cyan" />
                <span>Export Graph (JSON)</span>
              </button>
              <button
                onClick={() => { onExportCSV(); setExportMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export Relation (CSV)</span>
              </button>
            </div>
          )}
        </div>

        {/* Reset Network Button */}
        <button
          onClick={onResetNetwork}
          className="p-1.5 rounded-lg bg-navy-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition"
          title="Reset Network to Default"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
