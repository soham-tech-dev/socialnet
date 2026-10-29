import React, { useState } from 'react';
import {
  FlaskConical,
  ArrowRight,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Zap,
  TrendingUp,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import {
  analyzeReflexivity,
  analyzeSymmetry,
  analyzeTransitivity,
  calculateNetworkStatistics
} from '../utils/relationMath';

export default function SimulationLab({
  users,
  relations,
  onApplySimulatedNetwork,
}) {
  // Simulated state starts as clone of current network
  const [simUsers, setSimUsers] = useState([...users]);
  const [simRelations, setSimRelations] = useState([...relations]);
  const [actionHistory, setActionHistory] = useState([]);

  // Form controls
  const [simActionType, setSimActionType] = useState('add-friendship'); // 'add-friendship' | 'remove-friendship' | 'add-user' | 'remove-user' | 'toggle-reflexive'
  const [selectedSrc, setSelectedSrc] = useState(users[0]?.id || '');
  const [selectedTgt, setSelectedTgt] = useState(users[1]?.id || '');
  const [isMutual, setIsMutual] = useState(true);
  const [newUserName, setNewUserName] = useState('');

  // Calculate BEFORE metrics
  const beforeReflexive = analyzeReflexivity(users, relations);
  const beforeSymmetric = analyzeSymmetry(users, relations);
  const beforeTransitive = analyzeTransitivity(users, relations);
  const beforeStats = calculateNetworkStatistics(users, relations);

  // Calculate AFTER metrics
  const afterReflexive = analyzeReflexivity(simUsers, simRelations);
  const afterSymmetric = analyzeSymmetry(simUsers, simRelations);
  const afterTransitive = analyzeTransitivity(simUsers, simRelations);
  const afterStats = calculateNetworkStatistics(simUsers, simRelations);

  // Apply a simulation mutation
  const handleExecuteSimAction = () => {
    if (simActionType === 'add-friendship') {
      if (!selectedSrc || !selectedTgt) return;
      const newRels = [...simRelations];
      const srcName = simUsers.find(u => u.id === selectedSrc)?.name || selectedSrc;
      const tgtName = simUsers.find(u => u.id === selectedTgt)?.name || selectedTgt;

      // Check if already exists
      const exists = newRels.some(r => r.source === selectedSrc && r.target === selectedTgt);
      if (!exists) {
        newRels.push({ id: `sim-${selectedSrc}-${selectedTgt}`, source: selectedSrc, target: selectedTgt, isMutual });
      }
      if (isMutual && selectedSrc !== selectedTgt) {
        const reverseExists = newRels.some(r => r.source === selectedTgt && r.target === selectedSrc);
        if (!reverseExists) {
          newRels.push({ id: `sim-${selectedTgt}-${selectedSrc}`, source: selectedTgt, target: selectedSrc, isMutual: true });
        }
      }
      setSimRelations(newRels);
      setActionHistory(prev => [`Added ${isMutual ? 'mutual' : 'directed'} connection: (${srcName}, ${tgtName})`, ...prev]);
    } else if (simActionType === 'remove-friendship') {
      if (!selectedSrc || !selectedTgt) return;
      const srcName = simUsers.find(u => u.id === selectedSrc)?.name || selectedSrc;
      const tgtName = simUsers.find(u => u.id === selectedTgt)?.name || selectedTgt;

      const newRels = simRelations.filter(r => !(
        (r.source === selectedSrc && r.target === selectedTgt) ||
        (isMutual && r.source === selectedTgt && r.target === selectedSrc)
      ));
      setSimRelations(newRels);
      setActionHistory(prev => [`Removed connection between ${srcName} and ${tgtName}`, ...prev]);
    } else if (simActionType === 'add-user') {
      if (!newUserName.trim()) return;
      const id = 'user-' + Date.now();
      const newUser = {
        id,
        name: newUserName.trim(),
        avatar: '🎓',
        major: 'General Studies',
        role: 'Simulated User',
        group: 'Simulation'
      };
      setSimUsers([...simUsers, newUser]);
      setNewUserName('');
      setActionHistory(prev => [`Added new user: ${newUser.name}`, ...prev]);
    } else if (simActionType === 'remove-user') {
      if (!selectedSrc) return;
      const uName = simUsers.find(u => u.id === selectedSrc)?.name || selectedSrc;
      setSimUsers(simUsers.filter(u => u.id !== selectedSrc));
      setSimRelations(simRelations.filter(r => r.source !== selectedSrc && r.target !== selectedSrc));
      setActionHistory(prev => [`Removed user ${uName} and all incident friendships`, ...prev]);
    } else if (simActionType === 'toggle-reflexive') {
      // Toggle self-loops for all users
      const hasSelfLoops = simRelations.some(r => r.source === r.target);
      if (hasSelfLoops) {
        // Remove all self-loops
        setSimRelations(simRelations.filter(r => r.source !== r.target));
        setActionHistory(prev => ['Removed all self-loops (a,a)', ...prev]);
      } else {
        // Add self loops for all users
        const selfLoops = simUsers.map(u => ({
          id: `loop-${u.id}`,
          source: u.id,
          target: u.id,
          isMutual: true
        }));
        setSimRelations([...simRelations, ...selfLoops]);
        setActionHistory(prev => ['Added self-loops (a,a) for all users', ...prev]);
      }
    }
  };

  const handleResetSimulation = () => {
    setSimUsers([...users]);
    setSimRelations([...relations]);
    setActionHistory([]);
  };

  const handleCommitSimulation = () => {
    onApplySimulatedNetwork(simUsers, simRelations);
  };

  const renderDelta = (beforeVal, afterVal, isBoolean = false) => {
    if (isBoolean) {
      if (beforeVal === afterVal) {
        return <span className="text-slate-500 text-xs">Unchanged</span>;
      }
      return afterVal ? (
        <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> Falsy → True
        </span>
      ) : (
        <span className="text-rose-400 text-xs font-bold flex items-center gap-1">
          <TrendingDown className="w-3.5 h-3.5" /> True → Falsy
        </span>
      );
    }

    const diff = afterVal - beforeVal;
    if (diff === 0) return <span className="text-slate-500 text-xs">0</span>;
    return diff > 0 ? (
      <span className="text-emerald-400 text-xs font-bold">+{diff.toFixed(1)}</span>
    ) : (
      <span className="text-rose-400 text-xs font-bold">{diff.toFixed(1)}</span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-navy-900/70 p-6 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-brand-cyan" />
          <h2 className="text-xl font-bold text-white tracking-tight">"What If?" Network Simulator Lab</h2>
        </div>
        <p className="text-sm text-slate-400">
          Conduct hypothetical experiments on the relation <span className="font-mono text-brand-cyan">R</span> and watch mathematical properties re-evaluate in real time with side-by-side comparative diffs.
        </p>
      </div>

      {/* Simulator Control Panel */}
      <div className="bg-navy-900/60 p-6 rounded-xl border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Choose Simulation Experiment
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: 'add-friendship', label: 'Add Friendship', icon: Plus },
            { id: 'remove-friendship', label: 'Remove Friendship', icon: Trash2 },
            { id: 'add-user', label: 'Add User', icon: Plus },
            { id: 'remove-user', label: 'Remove User', icon: Trash2 },
            { id: 'toggle-reflexive', label: 'Toggle All Self-Loops', icon: Sparkles },
          ].map(btn => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => setSimActionType(btn.id)}
                className={`p-3 rounded-lg text-xs font-semibold flex flex-col items-center gap-2 transition border ${
                  simActionType === btn.id
                    ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan'
                    : 'bg-navy-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-center">{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Parameter Inputs */}
        <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-4">
          {(simActionType === 'add-friendship' || simActionType === 'remove-friendship') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">User A (Source):</label>
                <select
                  value={selectedSrc}
                  onChange={e => setSelectedSrc(e.target.value)}
                  className="w-full bg-navy-900 border border-slate-800 rounded p-2 text-xs text-white"
                >
                  {simUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">User B (Target):</label>
                <select
                  value={selectedTgt}
                  onChange={e => setSelectedTgt(e.target.value)}
                  className="w-full bg-navy-900 border border-slate-800 rounded p-2 text-xs text-white"
                >
                  {simUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    checked={isMutual}
                    onChange={e => setIsMutual(e.target.checked)}
                    className="rounded border-slate-700 text-brand-cyan focus:ring-0"
                  />
                  <span>Mutual Friendship (Both Directions)</span>
                </label>
              </div>
            </div>
          )}

          {simActionType === 'add-user' && (
            <div className="max-w-md">
              <label className="text-[11px] text-slate-400 block mb-1">New User Name:</label>
              <input
                type="text"
                placeholder="e.g. Alice, Dr. Sharma"
                value={newUserName}
                onChange={e => setNewUserName(e.target.value)}
                className="w-full bg-navy-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
              />
            </div>
          )}

          {simActionType === 'remove-user' && (
            <div className="max-w-md">
              <label className="text-[11px] text-slate-400 block mb-1">Select User to Remove:</label>
              <select
                value={selectedSrc}
                onChange={e => setSelectedSrc(e.target.value)}
                className="w-full bg-navy-900 border border-slate-800 rounded p-2 text-xs text-white"
              >
                {simUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          )}

          {simActionType === 'toggle-reflexive' && (
            <p className="text-xs text-slate-300">
              This toggles self-relationships <code className="font-mono text-pink-400">(a, a) ∈ R</code> for every user in the set. Ideal for demonstrating the exact moment Reflexivity shifts between ❌ and ✅!
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-900">
            <button
              onClick={handleExecuteSimAction}
              className="px-5 py-2 rounded-lg bg-brand-cyan hover:bg-brand-cyanLight text-navy-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Change</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetSimulation}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
              <button
                onClick={handleCommitSimulation}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Apply to Live Network</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BEFORE VS AFTER Side-by-Side Comparison Matrix */}
      <div className="bg-navy-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-navy-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Mathematical Delta: Before vs After Simulation
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {actionHistory.length} simulation steps applied
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px] bg-navy-950/60">
                <th className="py-3 px-4">Mathematical Property</th>
                <th className="py-3 px-4 text-center">Current Network (Before)</th>
                <th className="py-3 px-4 text-center">Simulated Network (After)</th>
                <th className="py-3 px-4 text-center">Status Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {/* Reflexive */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">
                  Reflexive Property (∀ a: (a,a) ∈ R)
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={beforeReflexive.isReflexive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {beforeReflexive.statusText}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={afterReflexive.isReflexive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {afterReflexive.statusText}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  {renderDelta(beforeReflexive.isReflexive, afterReflexive.isReflexive, true)}
                </td>
              </tr>

              {/* Symmetric */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">
                  Symmetric Property ((a,b) ∈ R ⟹ (b,a) ∈ R)
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={beforeSymmetric.isSymmetric ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {beforeSymmetric.statusText}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={afterSymmetric.isSymmetric ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {afterSymmetric.statusText}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  {renderDelta(beforeSymmetric.isSymmetric, afterSymmetric.isSymmetric, true)}
                </td>
              </tr>

              {/* Transitive */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">
                  Transitive Property ((a,b) ∧ (b,c) ⟹ (a,c) ∈ R)
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={beforeTransitive.isTransitive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {beforeTransitive.statusText}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={afterTransitive.isTransitive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {afterTransitive.statusText}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  {renderDelta(beforeTransitive.isTransitive, afterTransitive.isTransitive, true)}
                </td>
              </tr>

              {/* Total Users */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">
                  Total Users (|U|)
                </td>
                <td className="py-3.5 px-4 text-center text-slate-300">{beforeStats.totalUsers}</td>
                <td className="py-3.5 px-4 text-center text-white font-bold">{afterStats.totalUsers}</td>
                <td className="py-3.5 px-4 text-center">{renderDelta(beforeStats.totalUsers, afterStats.totalUsers)}</td>
              </tr>

              {/* Unique Friendships */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">
                  Friendships Count (Undirected)
                </td>
                <td className="py-3.5 px-4 text-center text-slate-300">{beforeStats.undirectedFriendshipsCount}</td>
                <td className="py-3.5 px-4 text-center text-white font-bold">{afterStats.undirectedFriendshipsCount}</td>
                <td className="py-3.5 px-4 text-center">{renderDelta(beforeStats.undirectedFriendshipsCount, afterStats.undirectedFriendshipsCount)}</td>
              </tr>

              {/* Network Density */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">
                  Network Density (2E / N(N-1))
                </td>
                <td className="py-3.5 px-4 text-center text-slate-300">{beforeStats.densityPercentage}%</td>
                <td className="py-3.5 px-4 text-center text-white font-bold">{afterStats.densityPercentage}%</td>
                <td className="py-3.5 px-4 text-center">{renderDelta(parseFloat(beforeStats.densityPercentage), parseFloat(afterStats.densityPercentage))}</td>
              </tr>

              {/* Social Communities */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">
                  Connected Communities
                </td>
                <td className="py-3.5 px-4 text-center text-slate-300">{beforeStats.communitiesCount}</td>
                <td className="py-3.5 px-4 text-center text-white font-bold">{afterStats.communitiesCount}</td>
                <td className="py-3.5 px-4 text-center">{renderDelta(beforeStats.communitiesCount, afterStats.communitiesCount)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Log */}
      {actionHistory.length > 0 && (
        <div className="bg-navy-900/50 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] block">
            Simulation Step History:
          </span>
          <div className="space-y-1">
            {actionHistory.map((act, idx) => (
              <div key={idx} className="text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
