import React, { useState } from 'react';
import { Table, Eye, Check, X, Info, Sparkles, Filter } from 'lucide-react';
import { buildRelationMatrix } from '../utils/relationMath';

export default function RelationMatrix({
  users,
  relations,
  onSelectRelation,
  onHighlightPairOnGraph,
}) {
  const [hoveredCell, setHoveredCell] = useState(null); // { row, col }
  const [selectedCellInfo, setSelectedCellInfo] = useState(null);

  const matrix = buildRelationMatrix(users, relations);
  const n = users.length;

  let totalOnes = 0;
  let totalZeros = 0;
  let diagonalOnes = 0;

  matrix.forEach(row => {
    row.forEach(cell => {
      if (cell.value === 1) {
        totalOnes++;
        if (cell.isDiagonal) diagonalOnes++;
      } else {
        totalZeros++;
      }
    });
  });

  const handleCellClick = (cell) => {
    setSelectedCellInfo(cell);
    if (cell.value === 1 && !cell.isDiagonal) {
      if (onSelectRelation) {
        onSelectRelation({
          source: cell.sourceUser.id,
          target: cell.targetUser.id
        });
      }
    } else if (onHighlightPairOnGraph) {
      onHighlightPairOnGraph([cell.sourceUser.id, cell.targetUser.id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Matrix Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900/70 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-xl font-bold text-white tracking-tight">Relation Adjacency Matrix (M)</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Representation of relation <span className="font-mono text-brand-cyan">R ⊆ U × U</span> where{' '}
            <span className="font-mono text-emerald-400">M[i][j] = 1</span> iff <span className="font-mono text-slate-200">(u_i, u_j) ∈ R</span>, otherwise <span className="font-mono text-slate-400">0</span>.
          </p>
        </div>

        {/* Matrix KPI Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-navy-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Dimensions: </span>
            <span className="font-mono font-bold text-brand-indigo">{n} × {n} ({n * n} entries)</span>
          </div>
          <div className="bg-navy-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Friendship Links (1s): </span>
            <span className="font-mono font-bold text-emerald-400">{totalOnes}</span>
          </div>
          <div className="bg-navy-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Non-Links (0s): </span>
            <span className="font-mono font-bold text-slate-300">{totalZeros}</span>
          </div>
          <div className="bg-navy-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Diagonal Loops: </span>
            <span className="font-mono font-bold text-pink-400">{diagonalOnes} / {n}</span>
          </div>
        </div>
      </div>

      {/* Interactive Matrix Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Matrix Table */}
        <div className="lg:col-span-2 bg-navy-900/50 p-5 rounded-xl border border-slate-800 overflow-x-auto shadow-inner">
          <div className="min-w-fit">
            <table className="border-collapse select-none">
              <thead>
                <tr>
                  {/* Top-left corner cell */}
                  <th className="p-2 text-xs font-mono font-bold text-slate-500 border-b border-r border-slate-800 bg-navy-950/80 sticky top-0 left-0 z-20">
                    U \ U
                  </th>
                  {users.map((u, j) => (
                    <th
                      key={u.id}
                      className={`p-2 text-xs font-semibold text-center transition-colors min-w-[38px] sticky top-0 z-10 ${
                        hoveredCell?.col === j
                          ? 'bg-brand-indigo/20 text-brand-cyan font-bold border-b-2 border-brand-cyan'
                          : 'bg-navy-950/80 text-slate-300 border-b border-slate-800'
                      }`}
                      title={`Column ${j + 1}: ${u.name}`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-500 font-mono">#{j + 1}</span>
                        <span className="truncate max-w-[60px] text-xs font-mono">{u.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, i) => (
                  <tr key={users[i].id} className="transition-colors">
                    {/* Row Header */}
                    <th
                      className={`p-2 text-xs font-semibold text-left transition-colors whitespace-nowrap sticky left-0 z-10 ${
                        hoveredCell?.row === i
                          ? 'bg-brand-indigo/20 text-brand-cyan font-bold border-r-2 border-brand-cyan'
                          : 'bg-navy-950/80 text-slate-300 border-r border-slate-800'
                      }`}
                      title={`Row ${i + 1}: ${users[i].name}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-mono">#{i + 1}</span>
                        <span className="truncate max-w-[70px] text-xs font-mono">{users[i].name}</span>
                      </div>
                    </th>

                    {/* Matrix Cells */}
                    {row.map((cell, j) => {
                      const isHovered = hoveredCell?.row === i && hoveredCell?.col === j;
                      const isSymmetricCounterpart = hoveredCell?.row === j && hoveredCell?.col === i && i !== j;
                      const isRowOrColHovered = hoveredCell?.row === i || hoveredCell?.col === j;
                      const isSelected = selectedCellInfo?.rowIndex === i && selectedCellInfo?.colIndex === j;

                      return (
                        <td
                          key={cell.targetUser.id}
                          onClick={() => handleCellClick(cell)}
                          onMouseEnter={() => setHoveredCell({ row: i, col: j })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`w-9 h-9 text-center text-xs font-mono font-bold cursor-pointer transition-all border border-slate-800/40 relative ${
                            cell.isDiagonal
                              ? 'bg-slate-900/80'
                              : 'bg-navy-950/40'
                          } ${
                            isSelected
                              ? 'ring-2 ring-amber-400 bg-amber-500/20 text-amber-200 z-10'
                              : isHovered
                              ? 'bg-brand-cyan/25 text-white ring-1 ring-brand-cyan scale-105 z-10'
                              : isSymmetricCounterpart
                              ? 'bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/50'
                              : isRowOrColHovered
                              ? 'bg-slate-800/30'
                              : ''
                          }`}
                        >
                          {cell.value === 1 ? (
                            <span
                              className={`${
                                cell.isDiagonal
                                  ? 'text-pink-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              1
                            </span>
                          ) : (
                            <span className="text-slate-600 font-normal">0</span>
                          )}

                          {/* Subtle dot indicator on diagonal */}
                          {cell.isDiagonal && (
                            <span className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-slate-600/40" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 col: Cell Inspector & Mathematical Notes */}
        <div className="space-y-4">
          <div className="bg-navy-900/60 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-cyan" />
              Cell Inspector
            </h3>

            {selectedCellInfo ? (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="p-3 rounded-lg bg-navy-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Selected Coordinates:</span>
                    <span className="font-mono text-xs font-bold text-brand-cyan">
                      M[{selectedCellInfo.rowIndex + 1}][{selectedCellInfo.colIndex + 1}]
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Relation Pair:</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {selectedCellInfo.pairKey}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Adjacency Value:</span>
                    <span
                      className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${
                        selectedCellInfo.value === 1
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {selectedCellInfo.value}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300 space-y-1">
                  <span className="font-semibold text-white block">Discrete Math Meaning:</span>
                  <p>{selectedCellInfo.reason}</p>
                </div>

                {selectedCellInfo.value === 1 && !selectedCellInfo.isDiagonal && (
                  <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-300 flex items-center justify-between">
                    <span>Highlighted edge on the Network Graph</span>
                    <Sparkles className="w-4 h-4 text-brand-cyan animate-pulse" />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 bg-navy-950/40 rounded-lg border border-dashed border-slate-800 p-4">
                Click any cell (1 or 0) in the matrix above to view its discrete mathematical meaning and highlight its connection in the network graph.
              </div>
            )}
          </div>

          {/* Mathematical Properties Guide Card */}
          <div className="bg-navy-900/60 p-5 rounded-xl border border-slate-800 space-y-3 text-xs text-slate-300">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-brand-cyan" />
              Adjacency Matrix Theorems
            </h4>
            <div className="space-y-2">
              <div className="p-2.5 rounded bg-navy-950 border border-slate-800">
                <strong className="text-pink-400 font-mono block">1. Main Diagonal (i = j):</strong>
                <span>Reflexivity requires every diagonal element M[i][i] = 1. Currently {diagonalOnes}/{n} present.</span>
              </div>
              <div className="p-2.5 rounded bg-navy-950 border border-slate-800">
                <strong className="text-indigo-400 font-mono block">2. Symmetry Across Diagonal:</strong>
                <span>A symmetric relation yields a symmetric matrix where M = Mᵀ (i.e., M[i][j] = M[j][i] for all i,j).</span>
              </div>
              <div className="p-2.5 rounded bg-navy-950 border border-slate-800">
                <strong className="text-emerald-400 font-mono block">3. Row Sums (Out-Degree):</strong>
                <span>The sum of entries in row i equals the number of friends/connections initiated by user i.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
