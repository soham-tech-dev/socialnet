import React, { useState } from 'react';
import {
  Share2,
  Search,
  Filter,
  Plus,
  Compass,
  RotateCcw,
  Sparkles,
  Users
} from 'lucide-react';
import NetworkGraph from './NetworkGraph';

export default function NetworkExplorer({
  users,
  relations,
  communities,
  selectedUser,
  onSelectUser,
  onOpenAddModal,
  highlightedPath,
  highlightedMissingPair,
  highlightedRelation,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommunityFilter, setSelectedCommunityFilter] = useState('all');

  // Filtered users for graph if needed, or highlighting
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.major?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedCommunityFilter === 'all') return true;
    const comm = communities.find(c => c.id === selectedCommunityFilter);
    return comm ? comm.members.some(m => m.id === u.id) : true;
  });

  return (
    <div className="space-y-4 h-[calc(100vh-140px)] flex flex-col">
      {/* Top Controls Toolbar */}
      <div className="bg-navy-900/60 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          {/* User Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search user in graph..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-cyan w-48 sm:w-56"
            />
          </div>

          {/* Community Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCommunityFilter}
              onChange={e => setSelectedCommunityFilter(e.target.value)}
              className="bg-navy-950 border border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-cyan"
            >
              <option value="all">All Communities ({communities.length})</option>
              {communities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.size} users)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-1.5 rounded-lg bg-brand-cyan hover:bg-brand-cyanLight text-navy-950 text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Friendship</span>
          </button>
        </div>
      </div>

      {/* Main Graph Canvas */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-slate-800 bg-navy-950/40 relative shadow-2xl">
        <NetworkGraph
          users={filteredUsers}
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
  );
}
