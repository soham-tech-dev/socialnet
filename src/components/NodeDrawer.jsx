import React from 'react';
import {
  X,
  User,
  Users,
  Compass,
  Trash2,
  Plus,
  Share2,
  ShieldAlert,
  Award,
  CheckCircle2
} from 'lucide-react';

export default function NodeDrawer({
  user,
  onClose,
  allUsers,
  relations,
  communities,
  statistics,
  onSelectUser,
  onInitiatePathFromUser,
  onOpenAddFriendshipForUser,
  onDeleteFriendship,
  onDeleteUser,
}) {
  if (!user) return null;

  const deg = statistics.degrees.get(user.id) || 0;
  const isIsolated = deg === 0;
  const isBridge = statistics.bridgeUsers.some(b => b.user.id === user.id);
  const isLeader = statistics.mostConnectedUser?.id === user.id;

  // Find user community
  const userCommunity = communities.find(c => c.members.some(m => m.id === user.id));

  // Find friends list
  const friends = [];
  relations.forEach(r => {
    if (r.source === user.id && r.target !== user.id) {
      const friendObj = allUsers.find(u => u.id === r.target);
      if (friendObj && !friends.some(f => f.user.id === friendObj.id)) {
        friends.push({ user: friendObj, isMutual: r.isMutual });
      }
    } else if (r.target === user.id && r.source !== user.id) {
      const friendObj = allUsers.find(u => u.id === r.source);
      if (friendObj && !friends.some(f => f.user.id === friendObj.id)) {
        friends.push({ user: friendObj, isMutual: r.isMutual });
      }
    }
  });

  return (
    <div className="fixed top-0 right-0 bottom-0 w-80 md:w-96 bg-navy-950/95 backdrop-blur-xl border-l border-slate-800 z-40 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-[11px] font-mono uppercase tracking-widest text-brand-cyan">
            Node Inspector
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-navy-900 border border-slate-700 flex items-center justify-center text-3xl shadow-inner">
            {user.avatar || '👤'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">{user.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{user.major || user.group || 'Campus Member'}</p>
            {/* Role Badge */}
            <div className="mt-1.5 flex flex-wrap gap-1">
              {isLeader && (
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                  Highly Connected Lead
                </span>
              )}
              {isBridge && (
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                  Bridge Node
                </span>
              )}
              {isIsolated && (
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">
                  Isolated User
                </span>
              )}
              {!isLeader && !isBridge && !isIsolated && (
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                  {user.role || 'Active Member'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-navy-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Direct Friends</span>
            <span className="text-xl font-bold text-white font-mono">{deg}</span>
          </div>
          <div className="p-3 rounded-xl bg-navy-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Social Cluster</span>
            <span className="text-xs font-bold text-brand-cyan font-mono truncate block mt-1">
              {userCommunity?.name || 'Independent'}
            </span>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Graph Actions:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onInitiatePathFromUser(user.id)}
              className="py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700"
            >
              <Compass className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Trace Path</span>
            </button>
            <button
              onClick={() => onOpenAddFriendshipForUser(user.id)}
              className="py-2 px-3 rounded-lg bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-brand-cyan/40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect Friend</span>
            </button>
          </div>
        </div>

        {/* Direct Friends List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Friendship Connections ({friends.length}):
            </span>
          </div>

          {friends.length > 0 ? (
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {friends.map(({ user: f, isMutual }) => (
                <div
                  key={f.id}
                  className="p-2 rounded-lg bg-navy-900/80 border border-slate-800 text-xs flex items-center justify-between"
                >
                  <button
                    onClick={() => onSelectUser(f)}
                    className="flex items-center gap-2 hover:text-brand-cyan transition"
                  >
                    <span>{f.avatar || '👤'}</span>
                    <span className="font-semibold text-white">{f.name}</span>
                    {isMutual && (
                      <span className="text-[10px] text-emerald-400 font-mono">(Mutual)</span>
                    )}
                  </button>
                  <button
                    onClick={() => onDeleteFriendship(user.id, f.id)}
                    title="Remove Friendship"
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-3 rounded-lg bg-navy-900/40 border border-slate-800 text-center">
              This user has no active friendships in relation R.
            </p>
          )}
        </div>
      </div>

      {/* Delete User Bottom Action */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={() => onDeleteUser(user.id)}
          className="w-full py-2 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete User from Network</span>
        </button>
      </div>
    </div>
  );
}
