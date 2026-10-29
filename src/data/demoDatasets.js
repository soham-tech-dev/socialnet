/**
 * Pre-built Demo Datasets for SOCIALNET
 * Covers academic cases:
 * 1. Default Campus Network (12 users, 18 friendships, 3 communities, 1 isolated)
 * 2. Section 16 Core Problem Relation (5 users: A, B, C, D, E)
 * 3. College Campus Social (10 users)
 * 4. Large Social Network (24 users)
 * 5. Reflexive Relation Demo (Identity self-loops)
 * 6. Symmetric vs Asymmetric Demo (Directed / One-way relationships)
 * 7. Non-Transitive Classic Counterexample Triad
 * 8. Isolated Users & Disconnected Clusters Demo
 */

/** Helper to generate mutual (symmetric) relation pairs */
function createMutualPair(u1, u2) {
  return [
    { id: `${u1}-${u2}`, source: u1, target: u2, isMutual: true },
    { id: `${u2}-${u1}`, source: u2, target: u1, isMutual: true }
  ];
}

/** Helper to generate directed (one-way) relation pair */
function createDirectedPair(u1, u2) {
  return [{ id: `${u1}-${u2}`, source: u1, target: u2, isMutual: false }];
}

// -------------------------------------------------------------
// 1. DEFAULT CAMPUS NETWORK (Matches Prompt Section 5 & 28)
// 12 Users, 18 Friendships (36 relations in R), 3 Communities, 1 Isolated, Alex = 6 connections
// -------------------------------------------------------------
const defaultCampusUsers = [
  // Community 1: Computer Science & Tech (7 users)
  { id: 'alex', name: 'Alex', avatar: '👨‍💻', major: 'Computer Science', role: 'Highly Connected Lead', group: 'Technology' },
  { id: 'rahul', name: 'Rahul', avatar: '🧑‍💻', major: 'Data Science', role: 'Active Member', group: 'Technology' },
  { id: 'priya', name: 'Priya', avatar: '👩‍💻', major: 'Software Eng', role: 'Active Member', group: 'Technology' },
  { id: 'maya', name: 'Maya', avatar: '👩‍🔬', major: 'AI & Robotics', role: 'Active Member', group: 'Technology' },
  { id: 'sam', name: 'Sam', avatar: '🧑‍💼', major: 'Information Sys', role: 'Active Member', group: 'Technology' },
  { id: 'lucas', name: 'Lucas', avatar: '👨‍🎓', major: 'Cybersecurity', role: 'Active Member', group: 'Technology' },
  { id: 'nina', name: 'Nina', avatar: '👩‍🎓', major: 'Computer Eng', role: 'Active Member', group: 'Technology' },

  // Community 2: Design & Fine Arts (3 users)
  { id: 'david', name: 'David', avatar: '🎨', major: 'Graphic Design', role: 'Design Lead', group: 'Design' },
  { id: 'elena', name: 'Elena', avatar: '🖌️', major: 'Digital Media', role: 'Art Director', group: 'Design' },
  { id: 'jordan', name: 'Jordan', avatar: '🎭', major: 'Animation', role: 'Member', group: 'Design' },

  // Community 3: Athletics & Sports (2 users)
  { id: 'marcus', name: 'Marcus', avatar: '🏀', major: 'Kinesiology', role: 'Athletic Captain', group: 'Athletics' },
  { id: 'chloe', name: 'Chloe', avatar: '⚽', major: 'Sports Mgmt', role: 'Sports Rep', group: 'Athletics' },

  // Isolated User (1 user)
  { id: 'leo', name: 'Leo', avatar: '🎧', major: 'Music Production', role: 'Isolated User', group: 'Independent' }
];

const defaultCampusRelations = [
  // Alex connected to 6 users in Technology community
  ...createMutualPair('alex', 'rahul'),
  ...createMutualPair('alex', 'priya'),
  ...createMutualPair('alex', 'maya'),
  ...createMutualPair('alex', 'sam'),
  ...createMutualPair('alex', 'lucas'),
  ...createMutualPair('alex', 'nina'),

  // Internal connections in Technology community (9 more friendships)
  ...createMutualPair('rahul', 'priya'),
  ...createMutualPair('priya', 'maya'),
  ...createMutualPair('maya', 'sam'),
  ...createMutualPair('sam', 'lucas'),
  ...createMutualPair('lucas', 'nina'),
  ...createMutualPair('nina', 'rahul'),
  ...createMutualPair('rahul', 'sam'),
  ...createMutualPair('priya', 'lucas'),
  ...createMutualPair('maya', 'nina'),

  // Community 2: Design (2 friendships)
  ...createMutualPair('david', 'elena'),
  ...createMutualPair('elena', 'jordan'),

  // Community 3: Athletics (1 friendship)
  ...createMutualPair('marcus', 'chloe')
];

// -------------------------------------------------------------
// 2. SMALL 5-USER NETWORK (Prompt Section 16 Default Discrete Math Example)
// Users: A, B, C, D, E
// Relations: (A,B), (B,A), (B,C), (C,B), (C,D), (D,C), (D,E), (E,D)
// -------------------------------------------------------------
const small5Users = [
  { id: 'A', name: 'A', avatar: '🅰️', major: 'Math', role: 'Node A', group: 'Linear Chain' },
  { id: 'B', name: 'B', avatar: '🅱️', major: 'Math', role: 'Node B', group: 'Linear Chain' },
  { id: 'C', name: 'C', avatar: '🅲', major: 'Math', role: 'Node C', group: 'Linear Chain' },
  { id: 'D', name: 'D', avatar: '🅳', major: 'Math', role: 'Node D', group: 'Linear Chain' },
  { id: 'E', name: 'E', avatar: '🅴', major: 'Math', role: 'Node E', group: 'Linear Chain' },
];

const small5Relations = [
  ...createMutualPair('A', 'B'),
  ...createMutualPair('B', 'C'),
  ...createMutualPair('C', 'D'),
  ...createMutualPair('D', 'E')
];

// -------------------------------------------------------------
// 3. COLLEGE CAMPUS NETWORK (10 Users, Bridge Users, Articulation points)
// -------------------------------------------------------------
const college10Users = [
  { id: 'c1', name: 'Alex', avatar: '👨‍💻', major: 'Computer Science', role: 'CS President', group: 'STEM' },
  { id: 'c2', name: 'Bella', avatar: '👩‍🔬', major: 'Biotech', role: 'Lab Assistant', group: 'STEM' },
  { id: 'c3', name: 'Carlos', avatar: '🧑‍💻', major: 'Software Eng', role: 'Hackathon Lead', group: 'STEM' },
  { id: 'c4', name: 'Diana', avatar: '👩‍🏫', major: 'Mathematics', role: 'Bridge Connector', group: 'Bridge' },
  { id: 'c5', name: 'Ethan', avatar: '🎨', major: 'Fine Arts', role: 'Exhibition Head', group: 'Arts' },
  { id: 'c6', name: 'Fiona', avatar: '🎭', major: 'Theater', role: 'Stage Director', group: 'Arts' },
  { id: 'c7', name: 'George', avatar: '📚', major: 'Literature', role: 'Editor', group: 'Arts' },
  { id: 'c8', name: 'Hannah', avatar: '🏀', major: 'Kinesiology', role: 'Team Captain', group: 'Athletics' },
  { id: 'c9', name: 'Ian', avatar: '⚽', major: 'Sports Mgmt', role: 'Vice Captain', group: 'Athletics' },
  { id: 'c10', name: 'Jack', avatar: '🎧', major: 'Audio Eng', role: 'Quiet Observer', group: 'Independent' }
];

const college10Relations = [
  // STEM triangle
  ...createMutualPair('c1', 'c2'),
  ...createMutualPair('c2', 'c3'),
  ...createMutualPair('c1', 'c3'),
  // Diana connects STEM to Arts (Bridge user!)
  ...createMutualPair('c1', 'c4'),
  ...createMutualPair('c4', 'c5'),
  // Arts triangle
  ...createMutualPair('c5', 'c6'),
  ...createMutualPair('c6', 'c7'),
  ...createMutualPair('c5', 'c7'),
  // Athletics
  ...createMutualPair('c8', 'c9'),
  // Bridge between Diana and Hannah
  ...createMutualPair('c4', 'c8')
];

// -------------------------------------------------------------
// 4. REFLEXIVE RELATION DEMONSTRATION
// Every user has (a, a) ∈ R to verify Reflexivity ✅
// -------------------------------------------------------------
const reflexiveUsers = [
  { id: 'r1', name: 'Alice', avatar: '👩', major: 'Philosophy', role: 'Self-Aware Node', group: 'Self-Loop Network' },
  { id: 'r2', name: 'Bob', avatar: '👨', major: 'Logic', role: 'Self-Aware Node', group: 'Self-Loop Network' },
  { id: 'r3', name: 'Charlie', avatar: '🧑', major: 'Mathematics', role: 'Self-Aware Node', group: 'Self-Loop Network' },
  { id: 'r4', name: 'Diana', avatar: '👩', major: 'Cognitive Sci', role: 'Self-Aware Node', group: 'Self-Loop Network' }
];

const reflexiveRelations = [
  // Reflexive self-loops
  { id: 'r1-r1', source: 'r1', target: 'r1', isMutual: true },
  { id: 'r2-r2', source: 'r2', target: 'r2', isMutual: true },
  { id: 'r3-r3', source: 'r3', target: 'r3', isMutual: true },
  { id: 'r4-r4', source: 'r4', target: 'r4', isMutual: true },
  // Mutual friendships
  ...createMutualPair('r1', 'r2'),
  ...createMutualPair('r2', 'r3'),
  ...createMutualPair('r3', 'r4'),
  ...createMutualPair('r1', 'r4'),
  ...createMutualPair('r1', 'r3'),
  ...createMutualPair('r2', 'r4')
];

// -------------------------------------------------------------
// 5. ASYMMETRIC / ONE-WAY RELATION DEMO ("Social Following")
// Demonstrates (A, B) ∈ R but (B, A) ∉ R
// -------------------------------------------------------------
const asymmetricUsers = [
  { id: 'u1', name: 'Celebrity Sarah', avatar: '⭐', major: 'Influencer', role: 'Popular Followee', group: 'Public Figures' },
  { id: 'u2', name: 'Fan Felix', avatar: '🙋', major: 'Media Studies', role: 'Active Follower', group: 'Followers' },
  { id: 'u3', name: 'Fan Grace', avatar: '🙋‍♀️', major: 'Communications', role: 'Active Follower', group: 'Followers' },
  { id: 'u4', name: 'Friend Luke', avatar: '🤝', major: 'Journalism', role: 'Mutual Colleague', group: 'Peers' },
  { id: 'u5', name: 'Friend Mia', avatar: '🤝', major: 'PR', role: 'Mutual Colleague', group: 'Peers' }
];

const asymmetricRelations = [
  // One-way follower relations (Felix -> Sarah, Grace -> Sarah)
  ...createDirectedPair('u2', 'u1'),
  ...createDirectedPair('u3', 'u1'),
  // Mutual friendships between peers
  ...createMutualPair('u4', 'u5'),
  // One-way from Luke to Sarah
  ...createDirectedPair('u4', 'u1')
];

// -------------------------------------------------------------
// 6. CLASSIC NON-TRANSITIVE TRIAD DEMO
// (A, B) ∈ R and (B, C) ∈ R, but (A, C) ∉ R
// -------------------------------------------------------------
const triadUsers = [
  { id: 'tA', name: 'User A', avatar: '🅰️', major: 'Computer Science', role: 'Endpoint 1', group: 'Triad Demo' },
  { id: 'tB', name: 'User B', avatar: '🅱️', major: 'Information Tech', role: 'Mutual Bridge', group: 'Triad Demo' },
  { id: 'tC', name: 'User C', avatar: '🅲', major: 'Data Analytics', role: 'Endpoint 2', group: 'Triad Demo' }
];

const triadRelations = [
  ...createMutualPair('tA', 'tB'),
  ...createMutualPair('tB', 'tC')
  // Note: (A, C) is deliberately missing to show transitivity counterexample!
];

// -------------------------------------------------------------
// 7. ISOLATED USERS & FRAGMENTED COMMUNITIES DEMO
// -------------------------------------------------------------
const fragmentedUsers = [
  { id: 'f1', name: 'Campus Group A1', avatar: '👥', major: 'Law', role: 'Cluster 1', group: 'Law Society' },
  { id: 'f2', name: 'Campus Group A2', avatar: '👥', major: 'Law', role: 'Cluster 1', group: 'Law Society' },
  { id: 'f3', name: 'Campus Group B1', avatar: '🔬', major: 'Chemistry', role: 'Cluster 2', group: 'Chemistry Club' },
  { id: 'f4', name: 'Campus Group B2', avatar: '🔬', major: 'Biochem', role: 'Cluster 2', group: 'Chemistry Club' },
  { id: 'iso1', name: 'Solo Student Kevin', avatar: '🧘', major: 'Astronomy', role: 'Isolated', group: 'Solo' },
  { id: 'iso2', name: 'Transfer Student Maya', avatar: '🎒', major: 'History', role: 'Isolated', group: 'Solo' },
  { id: 'iso3', name: 'Remote Learner Liam', avatar: '💻', major: 'Philosophy', role: 'Isolated', group: 'Solo' }
];

const fragmentedRelations = [
  ...createMutualPair('f1', 'f2'),
  ...createMutualPair('f3', 'f4')
];

// -------------------------------------------------------------
// 8. LARGE SCALE NETWORK (24 Users across 4 Departments)
// -------------------------------------------------------------
const large24Users = [
  // Tech
  { id: 'T1', name: 'Aiden', avatar: '👨‍💻', major: 'CS', role: 'Dev', group: 'Engineering' },
  { id: 'T2', name: 'Brooke', avatar: '👩‍💻', major: 'CS', role: 'Dev', group: 'Engineering' },
  { id: 'T3', name: 'Carter', avatar: '🧑‍💻', major: 'Cyber', role: 'Dev', group: 'Engineering' },
  { id: 'T4', name: 'Daisy', avatar: '👩‍🔬', major: 'AI', role: 'Dev', group: 'Engineering' },
  { id: 'T5', name: 'Eli', avatar: '👨‍🎓', major: 'SE', role: 'Dev', group: 'Engineering' },
  { id: 'T6', name: 'Freya', avatar: '👩‍🎓', major: 'Data', role: 'Dev', group: 'Engineering' },
  // Business
  { id: 'B1', name: 'Gavin', avatar: '👔', major: 'Finance', role: 'Lead', group: 'Business' },
  { id: 'B2', name: 'Harper', avatar: '💼', major: 'Marketing', role: 'Member', group: 'Business' },
  { id: 'B3', name: 'Isaac', avatar: '📈', major: 'Econ', role: 'Member', group: 'Business' },
  { id: 'B4', name: 'Jade', avatar: '📊', major: 'Accounting', role: 'Member', group: 'Business' },
  { id: 'B5', name: 'Kobe', avatar: '🤝', major: 'Mgmt', role: 'Member', group: 'Business' },
  { id: 'B6', name: 'Luna', avatar: '📁', major: 'HR', role: 'Member', group: 'Business' },
  // Arts & Media
  { id: 'A1', name: 'Miles', avatar: '🎨', major: 'Art', role: 'Artist', group: 'Arts' },
  { id: 'A2', name: 'Nora', avatar: '📸', major: 'Photo', role: 'Artist', group: 'Arts' },
  { id: 'A3', name: 'Owen', avatar: '🎬', major: 'Cinema', role: 'Artist', group: 'Arts' },
  { id: 'A4', name: 'Piper', avatar: '🎙️', major: 'Audio', role: 'Artist', group: 'Arts' },
  { id: 'A5', name: 'Quinn', avatar: '✒️', major: 'Writing', role: 'Artist', group: 'Arts' },
  { id: 'A6', name: 'Ruby', avatar: '🎭', major: 'Theater', role: 'Artist', group: 'Arts' },
  // Science & Med
  { id: 'S1', name: 'Silas', avatar: '🧬', major: 'Bio', role: 'Researcher', group: 'Science' },
  { id: 'S2', name: 'Tessa', avatar: '⚗️', major: 'Chem', role: 'Researcher', group: 'Science' },
  { id: 'S3', name: 'Uri', avatar: '🔭', major: 'Physics', role: 'Researcher', group: 'Science' },
  { id: 'S4', name: 'Vera', avatar: '🧫', major: 'Microbio', role: 'Researcher', group: 'Science' },
  // Solos
  { id: 'Z1', name: 'Wyatt', avatar: '🚶', major: 'Env Sci', role: 'Solo', group: 'Unconnected' },
  { id: 'Z2', name: 'Xena', avatar: '🎧', major: 'Linguistics', role: 'Solo', group: 'Unconnected' }
];

const large24Relations = [
  // Tech cluster
  ...createMutualPair('T1', 'T2'),
  ...createMutualPair('T2', 'T3'),
  ...createMutualPair('T3', 'T4'),
  ...createMutualPair('T4', 'T5'),
  ...createMutualPair('T5', 'T6'),
  ...createMutualPair('T1', 'T6'),
  ...createMutualPair('T1', 'T4'),
  // Business cluster
  ...createMutualPair('B1', 'B2'),
  ...createMutualPair('B2', 'B3'),
  ...createMutualPair('B3', 'B4'),
  ...createMutualPair('B4', 'B5'),
  ...createMutualPair('B5', 'B6'),
  ...createMutualPair('B1', 'B5'),
  // Arts cluster
  ...createMutualPair('A1', 'A2'),
  ...createMutualPair('A2', 'A3'),
  ...createMutualPair('A3', 'A4'),
  ...createMutualPair('A4', 'A5'),
  ...createMutualPair('A5', 'A6'),
  ...createMutualPair('A1', 'A5'),
  // Science cluster
  ...createMutualPair('S1', 'S2'),
  ...createMutualPair('S2', 'S3'),
  ...createMutualPair('S3', 'S4'),
  ...createMutualPair('S1', 'S4'),
  // Inter-cluster bridges
  ...createMutualPair('T1', 'B1'),
  ...createMutualPair('B3', 'A1'),
  ...createMutualPair('A4', 'S1')
];

export const DEMO_DATASETS = [
  {
    id: 'discrete-math-5',
    name: '1. Discrete Math Chain (Presentation Dataset)',
    badge: 'Presentation Dataset',
    description: 'U = {A, B, C, D, E}, A-B-C-D-E. Reflexive: NO · Symmetric: YES · Transitive: NO.',
    users: small5Users,
    relations: small5Relations
  },
  {
    id: 'default-campus',
    name: '2. Campus Social Network (13 Users, 18 Friendships)',
    badge: '13 Users',
    description: '13 Users · 18 Friendships · 3 Communities · 1 Isolated',
    users: defaultCampusUsers,
    relations: defaultCampusRelations
  },
  {
    id: 'college-10',
    name: '3. College Campus Network (10 Users + Bridge Node)',
    badge: 'Bridge Analysis',
    description: '10 users with STEM and Arts clusters connected via Diana (articulation point bridge node).',
    users: college10Users,
    relations: college10Relations
  },
  {
    id: 'large-network-24',
    name: '4. Large Multi-Department Network (24 Users)',
    badge: 'Scale Test',
    description: '24 users divided into 4 departments (Engineering, Business, Arts, Science) with inter-club bridges.',
    users: large24Users,
    relations: large24Relations
  },
  {
    id: 'reflexive-demo',
    name: '5. Reflexive Relation Demo (Self-Loops Present)',
    badge: 'Reflexive: YES',
    description: 'All users have (a, a) ∈ R self-friendships, demonstrating a verified reflexive relation.',
    users: reflexiveUsers,
    relations: reflexiveRelations
  },
  {
    id: 'asymmetric-demo',
    name: '6. One-Way / Non-Symmetric Relation Demo',
    badge: 'Non-Symmetric',
    description: 'Contains both one-way and mutual relationships, breaking the symmetric condition.',
    users: asymmetricUsers,
    relations: asymmetricRelations
  },
  {
    id: 'non-transitive-triad',
    name: '7. Non-Transitive Triad Demo (Open Triangle)',
    badge: 'Transitive: NO',
    description: '3 users showing A-B and B-C without A-C to clearly explain why friendship is not transitive.',
    users: triadUsers,
    relations: triadRelations
  },
  {
    id: 'isolated-demo',
    name: '8. Isolated Users & Fragmented Clusters',
    badge: 'Multiple Isolated',
    description: 'Multiple disconnected components and 3 completely isolated users with zero connections.',
    users: fragmentedUsers,
    relations: fragmentedRelations
  }
];

export const PRESENTATION_DATASET = DEMO_DATASETS[0];
export const DEFAULT_NETWORK = DEMO_DATASETS[1]; // default 13-user campus network

