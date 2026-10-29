# SOCIALNET — Social Media Friendship Network Analyzer

> **Discrete Mathematics & Graph Theory Laboratory Mini-Project**  
> Modeling real-world social media friendship networks using binary relations $R \subseteq U \times U$, evaluating formal properties, and visualizing topological structures.

---

## 🎯 Core Mathematical Problem Statement

Let:
- **$U$** = Finite set of users in the network
- **$R \subseteq U \times U$** = Binary friendship relation where $(a, b) \in R$ signifies that user $a$ has a friendship relation with user $b$.

### Formal Mathematical Property Definitions
1. **Reflexivity**:
   $$\forall a \in U: (a, a) \in R$$
   *Real-World Finding*: Standard social platforms are **irreflexive**—users are not friends with themselves.
2. **Symmetry**:
   $$\forall a, b \in U: (a, b) \in R \implies (b, a) \in R$$
   *Real-World Finding*: Mutual friendships are symmetric; one-way following (e.g. celebrities) introduces asymmetry.
3. **Transitivity**:
   $$\forall a, b, c \in U: [(a, b) \in R \land (b, c) \in R] \implies (a, c) \in R$$
   *Real-World Finding*: "A friend of my friend is not necessarily my friend." Friendship networks naturally violate transitivity, forming rich social clusters instead of complete cliques.
4. **Equivalence Relation**:
   Holds if and only if $R$ is Reflexive, Symmetric, and Transitive.

---

## 🚀 Quick Start (Local Run)

The application requires **zero external authentication, zero paid APIs, and no internet connection after installation**:

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open your browser at `http://localhost:5173/`.

---

## 🌟 Key Application Features

### 1. 📊 Executive & Academic Dashboard
- **Real-Time KPIs**: Total Users, Friendships, Mutual Connections, Communities, Isolated Users, Most Connected User.
- **Relation Property Summary Cards**: Reflexive, Symmetric, Transitive with symbolic notation, truth values, and interactive **"WHY?"** proof buttons.
- **Embedded Hero Force Graph**: D3 physics simulation with interactive node selection.

### 2. 🕸️ Network Explorer
- Full-screen force-directed graph with drag, zoom, pan, and fit controls.
- Dynamic community cluster color coding & degree-centrality node sizing.
- Instant search filter and community isolation.
- Displays arrows for asymmetric one-way relationships and loop arcs for reflexive pairs.

### 3. 📐 Mathematical Relation Analyzer
- Explicit display of Set $U$ and Relation Set $R \subseteq U \times U$ with cardinality $|U|$ and $|R|$.
- Step-by-step verification breakdown.
- Verified reciprocal pairs list: $(A, B) \leftrightarrow (B, A)$.
- Concrete transitivity counterexample triads: $(A, B) \land (B, C) \not\implies (A, C)$.
- "Show on Graph" buttons that jump to the graph and visually highlight the counterexample path.

### 4. 🔢 Interactive Relation Matrix ($M$)
- Complete $N \times N$ adjacency matrix representation: $M[i][j] = 1$ if $(u_i, u_j) \in R$, else $0$.
- Interactive cells: Click any `1` to highlight the corresponding edge on the graph; click `0` to view the non-relation proof.
- Visual symmetric crosshair and diagonal highlights demonstrating reflexivity and matrix transposition symmetry $M = M^T$.

### 5. 👥 Social Community Analysis
- Connected components decomposition via Breadth-First Search (BFS).
- Cluster size, internal density calculation ($2E_c / [N_c(N_c - 1)]$), and identification of cluster leaders.
- Explicit detection and segregation of isolated singleton nodes.

### 6. 💡 User Insights & Graph Theory Metrics
- **"Find Connection" (Shortest Path)**: Computes degrees of separation between any two users via BFS and animates the hop route on the graph.
- **Mutual Friend Finder**: Set intersection $M = N(A) \cap N(B)$ with instant graph highlight.
- **Bridge Users (Articulation Points)**: Tarjan's algorithm / component disconnection analysis detecting vital social bridges.
- **Degree Centrality Leaderboard**: Sorted user rankings with network reach percentages.

### 7. 🧪 "What If?" Simulation Lab
- Add/remove friendships, add/remove users, or toggle self-loops.
- Live side-by-side **BEFORE vs AFTER** comparison table showing property shifts (Reflexive, Symmetric, Transitive, Density, Communities).
- Option to apply simulation permanently or discard changes.

### 8. 🎓 Educational & Fullscreen Presentation Mode
- **Student Mode**: Rich formulas, formal definitions, and mathematical notation.
- **Presentation Deck**: Full-screen 5-slide classroom slideshow (Arrow keys / Spacebar navigation) optimized for projector presentations.

### 9. 💾 Data Persistence & Export
- Automatic LocalStorage synchronization.
- **Export Graph (JSON)**: Full graph schema and mathematical metadata.
- **Export Relation (CSV)**: Standard tabular format (`User A,User B,Type`).
- 8 pre-built academic scenarios (1. Discrete Math Chain Presentation Dataset [A-B-C-D-E], 2. Campus Network [13 Users · 18 Friendships · 3 Communities · 1 Isolated], 3. College Bridge Node Demo, 4. Large Multi-Department Network, 5. Reflexive Demo, 6. One-Way / Non-Symmetric Relation Demo, 7. Non-Transitive Triad, 8. Isolated Clusters).

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS (Dark Navy & Charcoal academic theme)
- **Visualization**: D3.js (Force-directed simulation, Zoom, Pan, Drag)
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage

---

## 🏛️ Academic Takeaway

> *"A real-world social friendship network is typically symmetric, but almost never reflexive or transitive. It partitions into clustered communities with bridges and isolated vertices rather than uniform equivalence classes."*
