import React, { useState } from 'react';
import { X, UserPlus, Link2, Sparkles, AlertCircle } from 'lucide-react';

export default function AddRelationshipModal({
  isOpen,
  onClose,
  users,
  onAddUser,
  onAddRelation,
  initialSourceUser = null,
}) {
  const [activeTab, setActiveTab] = useState('relation'); // 'relation' | 'user'

  // Friendship form state
  const [sourceUser, setSourceUser] = useState(initialSourceUser || users[0]?.id || '');
  const [targetUser, setTargetUser] = useState(users[1]?.id || '');
  const [relationshipType, setRelationshipType] = useState('mutual'); // 'mutual' | 'oneway'

  // User form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newUserAvatar, setNewUserAvatar] = useState('🧑‍🎓');

  // Error state
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAddRelationSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!sourceUser || !targetUser) {
      setErrorMsg('Please select both users.');
      return;
    }

    const isMutual = relationshipType === 'mutual';
    const success = onAddRelation(sourceUser, targetUser, isMutual);
    if (success) {
      onClose();
    } else {
      setErrorMsg('This friendship relation already exists in R!');
    }
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newUserName.trim()) {
      setErrorMsg('Please enter a valid user name.');
      return;
    }

    const id = newUserName.trim().toLowerCase().replace(/\s+/g, '-');
    const newUser = {
      id,
      name: newUserName.trim(),
      avatar: newUserAvatar,
      major: newUserRole.trim() || 'General Studies',
      role: 'Active Member',
      group: 'Campus'
    };

    const success = onAddUser(newUser);
    if (success) {
      setNewUserName('');
      setNewUserRole('');
      onClose();
    } else {
      setErrorMsg(`A user with the name "${newUserName}" already exists!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-navy-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-navy-950/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Modify Network Structure
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-navy-950 border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('relation'); setErrorMsg(''); }}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-2 ${
              activeTab === 'relation'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Add Friendship</span>
          </button>
          <button
            onClick={() => { setActiveTab('user'); setErrorMsg(''); }}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-2 ${
              activeTab === 'user'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-brand-indigo" />
            <span>Add User</span>
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6">
          {activeTab === 'relation' ? (
            <form onSubmit={handleAddRelationSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Source User (User A):
                </label>
                <select
                  value={sourceUser}
                  onChange={e => setSourceUser(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-cyan"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.major || 'User'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Target User (User B):
                </label>
                <select
                  value={targetUser}
                  onChange={e => setTargetUser(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-cyan"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.major || 'User'})</option>
                  ))}
                </select>
              </div>

              {/* Relationship Type Selection */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-400 block">
                  Relationship Symmetry:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRelationshipType('mutual')}
                    className={`p-3 rounded-xl border text-left text-xs space-y-1 transition ${
                      relationshipType === 'mutual'
                        ? 'bg-cyan-950/40 border-brand-cyan text-white'
                        : 'bg-navy-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-bold block text-brand-cyan">Mutual Friendship</span>
                    <span className="text-[11px] text-slate-400 block">
                      Adds both (A,B) and (B,A) to R. Preserves symmetry.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRelationshipType('oneway')}
                    className={`p-3 rounded-xl border text-left text-xs space-y-1 transition ${
                      relationshipType === 'oneway'
                        ? 'bg-indigo-950/40 border-indigo-400 text-white'
                        : 'bg-navy-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-bold block text-indigo-400">One-way Link</span>
                    <span className="text-[11px] text-slate-400 block">
                      Adds only (A,B) to R. Demonstrates asymmetry!
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-lg bg-brand-cyan hover:bg-brand-cyanLight text-navy-950 font-bold text-xs transition shadow-md"
              >
                Add Friendship to R
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alice Johnson"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-indigo"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Major / Field of Study:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cybersecurity, Architecture"
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Avatar Emoji:
                </label>
                <div className="flex gap-2">
                  {['🧑‍🎓', '👩‍💻', '👨‍🔬', '🎨', '🏀', '🎧', '⚡'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewUserAvatar(emoji)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition ${
                        newUserAvatar === emoji
                          ? 'border-brand-cyan bg-cyan-950/40 scale-110'
                          : 'border-slate-800 bg-navy-950 hover:bg-slate-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-lg bg-brand-indigo hover:bg-brand-indigoLight text-white font-bold text-xs transition shadow-md"
              >
                Insert User into Set U
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
