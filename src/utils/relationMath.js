/**
 * Mathematical Relation and Graph Theory Engine for SOCIALNET
 * Implements discrete mathematics concepts:
 * U = Set of users
 * R ⊆ U × U = Binary friendship relation
 */

/**
 * Normalizes relation pairs and helper functions
 */
export function buildRelationPairSet(relations) {
  const set = new Set();
  relations.forEach(r => {
    set.add(`${r.source}->${r.target}`);
  });
  return set;
}

export function hasPair(pairSet, source, target) {
  return pairSet.has(`${source}->${target}`);
}

/**
 * Analyzes Reflexivity:
 * ∀ a ∈ U: (a, a) ∈ R
 */
export function analyzeReflexivity(users, relations) {
  const pairSet = buildRelationPairSet(relations);
  const totalUsers = users.length;
  
  if (totalUsers === 0) {
    return {
      isReflexive: false,
      presentSelfLoops: [],
      missingSelfLoops: [],
      percentage: 0,
      statusText: 'No users in set U',
      reasoning: 'The user set U is empty.'
    };
  }

  const presentSelfLoops = [];
  const missingSelfLoops = [];

  users.forEach(u => {
    if (hasPair(pairSet, u.id, u.id)) {
      presentSelfLoops.push(u);
    } else {
      missingSelfLoops.push(u);
    }
  });

  const isReflexive = missingSelfLoops.length === 0;
  const percentage = Math.round((presentSelfLoops.length / totalUsers) * 100);

  return {
    isReflexive,
    presentSelfLoops,
    missingSelfLoops,
    percentage,
    formula: '∀ a ∈ U: (a, a) ∈ R',
    statusText: isReflexive ? 'YES' : 'NO',
    fullStatusText: isReflexive ? 'REFLEXIVE' : 'NOT REFLEXIVE',
    reasoning: isReflexive
      ? 'Every user in the network has a self-relationship (a, a) ∈ R.'
      : `Missing self-relationships for ${missingSelfLoops.length} user(s). In standard social networks, users are not friends with themselves.`,
    counterexamples: missingSelfLoops.map(u => ({
      user: u,
      pair: `(${u.name}, ${u.name})`,
      explanation: `User ${u.name} does not have a self-loop friendship (${u.name}, ${u.name}) ∉ R`
    }))
  };
}

/**
 * Analyzes Symmetry:
 * ∀ a, b ∈ U: (a, b) ∈ R ⟹ (b, a) ∈ R
 */
export function analyzeSymmetry(users, relations) {
  const pairSet = buildRelationPairSet(relations);
  const totalPairs = relations.length;

  if (totalPairs === 0) {
    return {
      isSymmetric: true, // Vacuously true
      counterexamples: [],
      verifiedPairs: [],
      statusText: 'SYMMETRIC (Vacuously)',
      reasoning: 'Relation R is empty; hence the symmetric condition holds vacuously.'
    };
  }

  const counterexamples = [];
  const verifiedPairKeys = new Set();
  const verifiedPairs = [];

  const userMap = new Map(users.map(u => [u.id, u]));

  relations.forEach(r => {
    const reverseExists = hasPair(pairSet, r.target, r.source);
    if (!reverseExists) {
      const srcUser = userMap.get(r.source) || { id: r.source, name: r.source };
      const tgtUser = userMap.get(r.target) || { id: r.target, name: r.target };
      counterexamples.push({
        source: srcUser,
        target: tgtUser,
        pair: `(${srcUser.name}, ${tgtUser.name})`,
        missingReverse: `(${tgtUser.name}, ${srcUser.name})`,
        explanation: `(${srcUser.name}, ${tgtUser.name}) ∈ R exists, but reverse friendship (${tgtUser.name}, ${srcUser.name}) ∉ R is missing.`
      });
    } else {
      // Verified symmetric pair (avoiding duplicate reporting)
      const key = [r.source, r.target].sort().join('<->');
      if (!verifiedPairKeys.has(key)) {
        verifiedPairKeys.add(key);
        const srcUser = userMap.get(r.source) || { id: r.source, name: r.source };
        const tgtUser = userMap.get(r.target) || { id: r.target, name: r.target };
        verifiedPairs.push({
          userA: srcUser,
          userB: tgtUser,
          display: `(${srcUser.name}, ${tgtUser.name}) ↔ (${tgtUser.name}, ${srcUser.name})`
        });
      }
    }
  });

  const isSymmetric = counterexamples.length === 0;

  return {
    isSymmetric,
    counterexamples,
    verifiedPairs,
    formula: '∀ a, b ∈ U: (a, b) ∈ R ⟹ (b, a) ∈ R',
    statusText: isSymmetric ? 'YES' : 'NO',
    fullStatusText: isSymmetric ? 'SYMMETRIC' : 'NOT SYMMETRIC',
    reasoning: isSymmetric
      ? 'Every friendship is mutual: for each (a, b) ∈ R, the corresponding (b, a) ∈ R exists.'
      : `Found ${counterexamples.length} one-way directional relationship(s) without reciprocal connections.`,
  };
}

/**
 * Analyzes Transitivity:
 * ∀ a, b, c ∈ U: [(a, b) ∈ R ∧ (b, c) ∈ R] ⟹ (a, c) ∈ R
 */
export function analyzeTransitivity(users, relations) {
  const pairSet = buildRelationPairSet(relations);
  const userMap = new Map(users.map(u => [u.id, u]));

  if (relations.length === 0) {
    return {
      isTransitive: true, // Vacuously true
      counterexamples: [],
      verifiedTriples: [],
      statusText: 'YES',
      fullStatusText: 'TRANSITIVE (Vacuously)',
      reasoning: 'Relation R has no pairs; transitivity holds vacuously.'
    };
  }

  // Build adjacency map: node -> list of targets
  const adj = new Map();
  users.forEach(u => adj.set(u.id, []));
  relations.forEach(r => {
    if (!adj.has(r.source)) adj.set(r.source, []);
    adj.get(r.source).push(r.target);
  });

  const counterexamples = [];
  const verifiedTriples = [];
  const seenCounterKeys = new Set();
  const seenVerifiedKeys = new Set();

  // Test all pairs (a, b) and (b, c)
  relations.forEach(r1 => {
    const a = r1.source;
    const b = r1.target;
    const bNeighbors = adj.get(b) || [];

    bNeighbors.forEach(c => {
      // (a, b) ∈ R and (b, c) ∈ R
      const directExists = hasPair(pairSet, a, c);

      const uA = userMap.get(a) || { id: a, name: a };
      const uB = userMap.get(b) || { id: b, name: b };
      const uC = userMap.get(c) || { id: c, name: c };

      if (!directExists) {
        const key = `${a}->${b}->${c}`;
        if (!seenCounterKeys.has(key)) {
          seenCounterKeys.add(key);
          counterexamples.push({
            a: uA,
            b: uB,
            c: uC,
            step1: `(${uA.name}, ${uB.name}) ∈ R`,
            step2: `(${uB.name}, ${uC.name}) ∈ R`,
            missingPair: `(${uA.name}, ${uC.name}) ∉ R`,
            explanation: `${uA.name} is friends with ${uB.name}, and ${uB.name} is friends with ${uC.name}, but ${uA.name} is NOT friends with ${uC.name}.`
          });
        }
      } else {
        const key = `${a}->${b}->${c}`;
        if (!seenVerifiedKeys.has(key)) {
          seenVerifiedKeys.add(key);
          verifiedTriples.push({
            a: uA,
            b: uB,
            c: uC,
            display: `(${uA.name}, ${uB.name}) ∧ (${uB.name}, ${uC.name}) ⟹ (${uA.name}, ${uC.name}) ∈ R`
          });
        }
      }
    });
  });

  const isTransitive = counterexamples.length === 0;

  return {
    isTransitive,
    counterexamples,
    verifiedTriples,
    formula: '∀ a, b, c ∈ U: [(a, b) ∈ R ∧ (b, c) ∈ R] ⟹ (a, c) ∈ R',
    statusText: isTransitive ? 'YES' : 'NO',
    fullStatusText: isTransitive ? 'TRANSITIVE' : 'NOT TRANSITIVE',
    reasoning: isTransitive
      ? 'Friend of a friend is always a friend: every 2-step friendship path has a direct edge.'
      : `Transitivity fails with ${counterexamples.length} counterexample path(s). Friendship in real social networks is almost never transitive!`,
  };
}

/**
 * Checks if R is an Equivalence Relation:
 * Reflexive ∧ Symmetric ∧ Transitive
 */
export function analyzeEquivalence(reflexiveResult, symmetricResult, transitiveResult) {
  const isEquivalence = reflexiveResult.isReflexive && symmetricResult.isSymmetric && transitiveResult.isTransitive;
  const missingProperties = [];
  if (!reflexiveResult.isReflexive) missingProperties.push('Reflexivity');
  if (!symmetricResult.isSymmetric) missingProperties.push('Symmetry');
  if (!transitiveResult.isTransitive) missingProperties.push('Transitivity');

  return {
    isEquivalence,
    statusText: isEquivalence ? 'EQUIVALENCE RELATION' : 'NOT AN EQUIVALENCE RELATION',
    missingProperties,
    reasoning: isEquivalence
      ? 'Relation R partitions the user set U into distinct equivalence classes (clusters where every member is connected to itself and all others in the cluster).'
      : `Relation R fails the following required properties: ${missingProperties.join(', ')}.`
  };
}

/**
 * Generates N x N Adjacency / Relation Matrix
 */
export function buildRelationMatrix(users, relations) {
  const pairSet = buildRelationPairSet(relations);
  const n = users.length;
  const matrix = [];

  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      const src = users[i].id;
      const tgt = users[j].id;
      const isConnected = hasPair(pairSet, src, tgt) ? 1 : 0;
      const isDiagonal = (i === j);
      
      row.push({
        sourceUser: users[i],
        targetUser: users[j],
        value: isConnected,
        isDiagonal,
        rowIndex: i,
        colIndex: j,
        pairKey: `(${users[i].name}, ${users[j].name})`,
        reason: isConnected === 1
          ? isDiagonal
            ? `Self-loop relationship (${users[i].name}, ${users[j].name}) ∈ R`
            : `Direct relationship exists: (${users[i].name}, ${users[j].name}) ∈ R`
          : isDiagonal
            ? `No reflexive self-loop: (${users[i].name}, ${users[j].name}) ∉ R`
            : `No direct relationship: (${users[i].name}, ${users[j].name}) ∉ R`
      });
    }
    matrix.push(row);
  }

  return matrix;
}

/**
 * Computes Connected Components (Social Communities / Clusters)
 * Uses Breadth-First Search (BFS) on the undirected projection of the network.
 */
export function computeConnectedComponents(users, relations) {
  if (users.length === 0) return [];

  // Build undirected adjacency list
  const adj = new Map();
  users.forEach(u => adj.set(u.id, new Set()));

  relations.forEach(r => {
    if (adj.has(r.source) && adj.has(r.target) && r.source !== r.target) {
      adj.get(r.source).add(r.target);
      adj.get(r.target).add(r.source);
    }
  });

  const visited = new Set();
  const components = [];
  const userMap = new Map(users.map(u => [u.id, u]));

  users.forEach(u => {
    if (!visited.has(u.id)) {
      const componentMemberIds = [];
      const queue = [u.id];
      visited.add(u.id);

      while (queue.length > 0) {
        const currId = queue.shift();
        componentMemberIds.push(currId);

        const neighbors = adj.get(currId) || new Set();
        neighbors.forEach(neighborId => {
          if (!visited.has(neighborId)) {
            visited.add(neighborId);
            queue.push(neighborId);
          }
        });
      }

      const members = componentMemberIds.map(id => userMap.get(id));
      
      // Calculate internal edges count
      const memberIdSet = new Set(componentMemberIds);
      let internalEdgesCount = 0;
      const countedUndirectedPairs = new Set();

      relations.forEach(r => {
        if (memberIdSet.has(r.source) && memberIdSet.has(r.target) && r.source !== r.target) {
          const edgeKey = [r.source, r.target].sort().join('--');
          if (!countedUndirectedPairs.has(edgeKey)) {
            countedUndirectedPairs.add(edgeKey);
            internalEdgesCount++;
          }
        }
      });

      // Density of component
      const n = members.length;
      const possibleEdges = n > 1 ? (n * (n - 1)) / 2 : 1;
      const internalDensity = n > 1 ? (internalEdgesCount / possibleEdges) : 0;

      // Find central / most connected member in component
      let leader = members[0];
      let maxDeg = -1;
      members.forEach(m => {
        const deg = adj.get(m.id)?.size || 0;
        if (deg > maxDeg) {
          maxDeg = deg;
          leader = m;
        }
      });

      components.push({
        id: `community-${components.length + 1}`,
        name: `Community ${components.length + 1}`,
        members,
        size: members.length,
        internalEdgesCount,
        density: internalDensity,
        leader,
        isIsolated: members.length === 1 && (adj.get(members[0].id)?.size || 0) === 0
      });
    }
  });

  // Sort components by size descending
  components.sort((a, b) => b.size - a.size);
  // Re-number communities
  components.forEach((c, idx) => {
    if (c.isIsolated) {
      c.name = `Isolated (${c.members[0].name})`;
    } else {
      c.name = `Community ${idx + 1}`;
    }
  });

  return components;
}

/**
 * Identifies Bridge Users (Articulation Points)
 * A bridge user is a node whose removal increases the number of connected components.
 */
export function identifyBridgeUsers(users, relations) {
  if (users.length <= 2) return [];

  const baseComponentsCount = computeConnectedComponents(users, relations).filter(c => !c.isIsolated).length;
  const bridgeUsers = [];

  users.forEach(u => {
    // If user has <= 1 connection, removing them cannot split existing connected components
    const remainingUsers = users.filter(x => x.id !== u.id);
    const remainingRelations = relations.filter(r => r.source !== u.id && r.target !== u.id);
    
    const newComponents = computeConnectedComponents(remainingUsers, remainingRelations).filter(c => !c.isIsolated);
    
    // If number of multi-node components increased, this user was a bridge
    if (newComponents.length > baseComponentsCount) {
      bridgeUsers.push({
        user: u,
        role: 'Bridge User (Articulation Point)',
        explanation: `Removing ${u.name} disconnects the network into ${newComponents.length} separate groups.`
      });
    }
  });

  return bridgeUsers;
}

/**
 * Calculates Comprehensive Network Statistics
 */
export function calculateNetworkStatistics(users, relations) {
  const n = users.length;
  const pairSet = buildRelationPairSet(relations);

  // Distinguish unique undirected friendships vs directed pairs
  const undirectedEdges = new Set();
  let selfLoopsCount = 0;
  let mutualPairsCount = 0;

  relations.forEach(r => {
    if (r.source === r.target) {
      selfLoopsCount++;
    } else {
      const edgeKey = [r.source, r.target].sort().join('--');
      undirectedEdges.add(edgeKey);
      if (hasPair(pairSet, r.target, r.source)) {
        mutualPairsCount++;
      }
    }
  });

  // mutualPairsCount has both directions counted (e.g. A->B and B->A counts as 2)
  const mutualFriendships = mutualPairsCount / 2;

  // Degrees per user
  const degrees = new Map();
  users.forEach(u => degrees.set(u.id, 0));

  undirectedEdges.forEach(key => {
    const [u1, u2] = key.split('--');
    if (degrees.has(u1)) degrees.set(u1, degrees.get(u1) + 1);
    if (degrees.has(u2)) degrees.set(u2, degrees.get(u2) + 1);
  });

  const degValues = Array.from(degrees.values());
  const maxDegree = degValues.length > 0 ? Math.max(...degValues) : 0;
  const totalDegreeSum = degValues.reduce((sum, d) => sum + d, 0);
  const avgDegree = n > 0 ? (totalDegreeSum / n).toFixed(2) : 0;

  // Most connected user
  let mostConnectedUser = null;
  users.forEach(u => {
    const d = degrees.get(u.id) || 0;
    if (!mostConnectedUser || d > (degrees.get(mostConnectedUser.id) || 0)) {
      mostConnectedUser = u;
    }
  });

  // Isolated users
  const isolatedUsers = users.filter(u => (degrees.get(u.id) || 0) === 0);

  // Network Density: 2E / (N * (N - 1))
  const totalPossibleUndirectedEdges = n > 1 ? (n * (n - 1)) / 2 : 1;
  const density = n > 1 ? (undirectedEdges.size / totalPossibleUndirectedEdges) : 0;
  const densityPercentage = (density * 100).toFixed(1);

  // Communities
  const communities = computeConnectedComponents(users, relations);

  // Bridge users
  const bridgeUsers = identifyBridgeUsers(users, relations);

  return {
    totalUsers: n,
    totalRelations: relations.length,
    undirectedFriendshipsCount: undirectedEdges.size,
    mutualFriendshipsCount: mutualFriendships,
    isolatedUsersCount: isolatedUsers.length,
    isolatedUsers,
    mostConnectedUser: mostConnectedUser ? {
      ...mostConnectedUser,
      connections: degrees.get(mostConnectedUser.id) || 0
    } : null,
    maxDegree,
    avgDegree,
    density,
    densityPercentage,
    communitiesCount: communities.length,
    communities,
    bridgeUsers,
    selfLoopsCount,
    degrees
  };
}

/**
 * Finds Shortest Path between two users using BFS ("Find Connection")
 */
export function findShortestPath(sourceId, targetId, users, relations) {
  if (sourceId === targetId) {
    return { path: [sourceId], hops: 0, found: true };
  }

  // Build adjacency
  const adj = new Map();
  users.forEach(u => adj.set(u.id, []));
  relations.forEach(r => {
    if (adj.has(r.source) && !adj.get(r.source).includes(r.target)) {
      adj.get(r.source).push(r.target);
    }
  });

  const queue = [[sourceId]];
  const visited = new Set([sourceId]);

  while (queue.length > 0) {
    const path = queue.shift();
    const curr = path[path.length - 1];

    if (curr === targetId) {
      return { path, hops: path.length - 1, found: true };
    }

    const neighbors = adj.get(curr) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return { path: [], hops: -1, found: false };
}

/**
 * Finds Mutual Friends between two users:
 * M = { x ∈ U | (A, x) ∈ R ∧ (B, x) ∈ R }
 */
export function findMutualFriends(userAId, userBId, users, relations) {
  const pairSet = buildRelationPairSet(relations);
  const userMap = new Map(users.map(u => [u.id, u]));

  const mutuals = [];

  users.forEach(u => {
    if (u.id !== userAId && u.id !== userBId) {
      const connectedToA = hasPair(pairSet, userAId, u.id) || hasPair(pairSet, u.id, userAId);
      const connectedToB = hasPair(pairSet, userBId, u.id) || hasPair(pairSet, u.id, userBId);

      if (connectedToA && connectedToB) {
        mutuals.push(u);
      }
    }
  });

  return mutuals;
}
