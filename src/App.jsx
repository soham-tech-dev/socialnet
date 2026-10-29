import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NetworkExplorer from './components/NetworkExplorer';
import RelationAnalyzer from './components/RelationAnalyzer';
import RelationMatrix from './components/RelationMatrix';
import CommunityAnalysis from './components/CommunityAnalysis';
import UserInsights from './components/UserInsights';
import SimulationLab from './components/SimulationLab';
import AboutProject from './components/AboutProject';
import WhyExplainerModal from './components/WhyExplainerModal';
import PresentationMode from './components/PresentationMode';
import NodeDrawer from './components/NodeDrawer';
import AddRelationshipModal from './components/AddRelationshipModal';

import {
  DEFAULT_NETWORK,
  DEMO_DATASETS
} from './data/demoDatasets';

import {
  analyzeReflexivity,
  analyzeSymmetry,
  analyzeTransitivity,
  calculateNetworkStatistics,
  computeConnectedComponents,
} from './utils/relationMath';

const STORAGE_KEY_USERS = 'socialnet_users_v1';
const STORAGE_KEY_RELATIONS = 'socialnet_relations_v1';
const STORAGE_KEY_DATASET = 'socialnet_dataset_id_v1';

export default function App() {
  // -------------------------------------------------------------
  // 1. STATE INITIALIZATION & LOCALSTORAGE PERSISTENCE
  // -------------------------------------------------------------
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      return saved ? JSON.parse(saved) : DEFAULT_NETWORK.users;
    } catch {
      return DEFAULT_NETWORK.users;
    }
  });

  const [relations, setRelations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RELATIONS);
      return saved ? JSON.parse(saved) : DEFAULT_NETWORK.relations;
    } catch {
      return DEFAULT_NETWORK.relations;
    }
  });

  const [currentDatasetId, setCurrentDatasetId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_DATASET) || DEFAULT_NETWORK.id;
    } catch {
      return DEFAULT_NETWORK.id;
    }
  });

  // Sync to LocalStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEY_RELATIONS, JSON.stringify(relations));
      localStorage.setItem(STORAGE_KEY_DATASET, currentDatasetId);
    } catch (e) {
      console.error('LocalStorage sync error:', e);
    }
  }, [users, relations, currentDatasetId]);

  // -------------------------------------------------------------
  // 2. VIEW STATE & ACTIVE MODALS
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState('dashboard');
  const [educationalMode, setEducationalMode] = useState('student'); // 'student' | 'presentation'

  // Selected node inspector drawer
  const [selectedUser, setSelectedUser] = useState(null);

  // Why Explainer Modal state
  const [whyModalProperty, setWhyModalProperty] = useState(null); // 'reflexive' | 'symmetric' | 'transitive'

  // Presentation Mode state
  const [presentationOpen, setPresentationOpen] = useState(false);

  // Add Relationship Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalInitialSource, setAddModalInitialSource] = useState(null);

  // Graph Highlighting Overlays
  const [highlightedPath, setHighlightedPath] = useState(null);
  const [highlightedMissingPair, setHighlightedMissingPair] = useState(null);
  const [highlightedRelation, setHighlightedRelation] = useState(null);
  const [mutualFriendsHighlight, setMutualFriendsHighlight] = useState(null);

  // -------------------------------------------------------------
  // 3. DYNAMIC MATHEMATICAL EVALUATION
  // All metrics re-calculate automatically whenever users or relations change!
  // -------------------------------------------------------------
  const reflexiveResult = useMemo(() => analyzeReflexivity(users, relations), [users, relations]);
  const symmetricResult = useMemo(() => analyzeSymmetry(users, relations), [users, relations]);
  const transitiveResult = useMemo(() => analyzeTransitivity(users, relations), [users, relations]);
  const statistics = useMemo(() => calculateNetworkStatistics(users, relations), [users, relations]);
  const communities = useMemo(() => computeConnectedComponents(users, relations), [users, relations]);

  // -------------------------------------------------------------
  // 4. ACTION HANDLERS
  // -------------------------------------------------------------
  const handleSelectDataset = (dataset) => {
    setUsers(dataset.users);
    setRelations(dataset.relations);
    setCurrentDatasetId(dataset.id);
    setSelectedUser(null);
    clearHighlights();
  };

  const handleResetNetwork = () => {
    handleSelectDataset(DEFAULT_NETWORK);
  };

  const clearHighlights = () => {
    setHighlightedPath(null);
    setHighlightedMissingPair(null);
    setHighlightedRelation(null);
    setMutualFriendsHighlight(null);
  };

  const handleHighlightOnGraph = (payload) => {
    clearHighlights();
    if (payload.type === 'relation') {
      setHighlightedRelation({ source: payload.source, target: payload.target });
      setActiveTab('network-explorer');
    } else if (payload.type === 'transitive-counter') {
      setHighlightedPath(payload.path);
      setHighlightedMissingPair(payload.missingPair);
      setActiveTab('network-explorer');
    } else if (payload.type === 'path') {
      setHighlightedPath(payload.path);
      setActiveTab('network-explorer');
    }
  };

  // Add User
  const handleAddUser = (newUser) => {
    const exists = users.some(u => u.name.toLowerCase() === newUser.name.toLowerCase());
    if (exists) return false;
    setUsers(prev => [...prev, newUser]);
    return true;
  };

  // Delete User
  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setRelations(prev => prev.filter(r => r.source !== userId && r.target !== userId));
    if (selectedUser?.id === userId) setSelectedUser(null);
    clearHighlights();
  };

  // Add Friendship
  const handleAddRelation = (srcId, tgtId, isMutual) => {
    // Prevent duplicate
    const pairExists = relations.some(r => r.source === srcId && r.target === tgtId);
    if (pairExists) return false;

    const newRelations = [...relations, { id: `${srcId}-${tgtId}`, source: srcId, target: tgtId, isMutual }];
    if (isMutual && srcId !== tgtId) {
      const reverseExists = relations.some(r => r.source === tgtId && r.target === srcId);
      if (!reverseExists) {
        newRelations.push({ id: `${tgtId}-${srcId}`, source: tgtId, target: srcId, isMutual: true });
      }
    }
    setRelations(newRelations);
    return true;
  };

  // Delete Friendship
  const handleDeleteFriendship = (srcId, tgtId) => {
    setRelations(prev => prev.filter(r => !(
      (r.source === srcId && r.target === tgtId) ||
      (r.source === tgtId && r.target === srcId)
    )));
    clearHighlights();
  };

  // Export JSON
  const handleExportJSON = () => {
    const data = {
      name: 'SOCIALNET Friendship Network Export',
      exportedAt: new Date().toISOString(),
      properties: {
        reflexive: reflexiveResult.isReflexive,
        symmetric: symmetricResult.isSymmetric,
        transitive: transitiveResult.isTransitive,
      },
      users,
      relations
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `socialnet_network_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV (Section 20 format: User A | User B)
  const handleExportCSV = () => {
    const header = 'User A,User B,Type\n';
    const rows = relations.map(r => {
      const uA = users.find(u => u.id === r.source)?.name || r.source;
      const uB = users.find(u => u.id === r.target)?.name || r.target;
      return `"${uA}","${uB}","${r.isMutual ? 'Mutual' : 'One-Way'}"`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `socialnet_relations_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentDatasetId={currentDatasetId}
        onSelectDataset={handleSelectDataset}
        onResetNetwork={handleResetNetwork}
        onOpenPresentation={() => setPresentationOpen(true)}
        onOpenAddModal={() => { setAddModalInitialSource(null); setAddModalOpen(true); }}
        onExportJSON={handleExportJSON}
        onExportCSV={handleExportCSV}
        educationalMode={educationalMode}
        onToggleEducationalMode={() => setEducationalMode(prev => prev === 'student' ? 'presentation' : 'student')}
      />

      {/* Main Body with Persistent Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => { setActiveTab(tab); clearHighlights(); }}
          metricsSummary={{
            isReflexive: reflexiveResult.isReflexive,
            isSymmetric: symmetricResult.isSymmetric,
            isTransitive: transitiveResult.isTransitive,
          }}
        />

        {/* Dynamic Main Stage Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              users={users}
              relations={relations}
              statistics={statistics}
              reflexiveResult={reflexiveResult}
              symmetricResult={symmetricResult}
              transitiveResult={transitiveResult}
              communities={communities}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              onOpenWhyExplainer={(prop) => setWhyModalProperty(prop)}
              onOpenAddModal={() => { setAddModalInitialSource(null); setAddModalOpen(true); }}
              onNavigateTab={(tab) => { setActiveTab(tab); clearHighlights(); }}
              highlightedPath={highlightedPath}
              highlightedMissingPair={highlightedMissingPair}
              highlightedRelation={highlightedRelation}
            />
          )}

          {activeTab === 'network-explorer' && (
            <NetworkExplorer
              users={users}
              relations={relations}
              communities={communities}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              onOpenAddModal={() => { setAddModalInitialSource(null); setAddModalOpen(true); }}
              highlightedPath={highlightedPath}
              highlightedMissingPair={highlightedMissingPair}
              highlightedRelation={highlightedRelation}
            />
          )}

          {activeTab === 'relation-analyzer' && (
            <RelationAnalyzer
              users={users}
              relations={relations}
              onOpenWhyExplainer={(prop) => setWhyModalProperty(prop)}
              onHighlightOnGraph={handleHighlightOnGraph}
            />
          )}

          {activeTab === 'relation-matrix' && (
            <RelationMatrix
              users={users}
              relations={relations}
              onSelectRelation={(rel) => handleHighlightOnGraph({ type: 'relation', source: rel.source, target: rel.target })}
              onHighlightPairOnGraph={([src, tgt]) => handleHighlightOnGraph({ type: 'relation', source: src, target: tgt })}
            />
          )}

          {activeTab === 'community-analysis' && (
            <CommunityAnalysis
              communities={communities}
              onSelectUser={(u) => { setSelectedUser(u); setActiveTab('network-explorer'); }}
              onSelectCommunity={(c) => {}}
            />
          )}

          {activeTab === 'user-insights' && (
            <UserInsights
              users={users}
              relations={relations}
              statistics={statistics}
              onSelectUser={(u) => { setSelectedUser(u); setActiveTab('network-explorer'); }}
              onHighlightPathOnGraph={(path) => handleHighlightOnGraph({ type: 'path', path })}
              onHighlightMutualsOnGraph={(mutuals) => {
                setMutualFriendsHighlight(mutuals);
                setActiveTab('network-explorer');
              }}
            />
          )}

          {activeTab === 'simulation-lab' && (
            <SimulationLab
              users={users}
              relations={relations}
              onApplySimulatedNetwork={(newU, newR) => {
                setUsers(newU);
                setRelations(newR);
                clearHighlights();
              }}
            />
          )}

          {activeTab === 'about-project' && (
            <AboutProject />
          )}
        </main>
      </div>

      {/* Node Inspector Drawer */}
      {selectedUser && (
        <NodeDrawer
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          allUsers={users}
          relations={relations}
          communities={communities}
          statistics={statistics}
          onSelectUser={setSelectedUser}
          onInitiatePathFromUser={(userId) => {
            setActiveTab('user-insights');
          }}
          onOpenAddFriendshipForUser={(userId) => {
            setAddModalInitialSource(userId);
            setAddModalOpen(true);
          }}
          onDeleteFriendship={handleDeleteFriendship}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {/* WHY? Mathematical Explainer Modal */}
      <WhyExplainerModal
        isOpen={Boolean(whyModalProperty)}
        onClose={() => setWhyModalProperty(null)}
        propertyType={whyModalProperty}
        reflexiveResult={reflexiveResult}
        symmetricResult={symmetricResult}
        transitiveResult={transitiveResult}
        onHighlightOnGraph={handleHighlightOnGraph}
      />

      {/* Full-screen Presentation Mode */}
      <PresentationMode
        isOpen={presentationOpen}
        onClose={() => setPresentationOpen(false)}
        users={users}
        relations={relations}
        statistics={statistics}
        reflexiveResult={reflexiveResult}
        symmetricResult={symmetricResult}
        transitiveResult={transitiveResult}
        communities={communities}
      />

      {/* Add Friendship / User Modal */}
      <AddRelationshipModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        users={users}
        onAddUser={handleAddUser}
        onAddRelation={handleAddRelation}
        initialSourceUser={addModalInitialSource}
      />
    </div>
  );
}
