// Shared analyzer utility database and algorithms for ExamInsight
// Categorized by Subject and Unit

export const SUBJECT_TOPICS = {
  "Database Management Systems": [
    { name: "ER Diagram modeling of entities", unit: 1, weightage: 10, difficulty: "Easy", difficultyColor: "#10B981", hours: 4, keywords: ["er", "diagram", "entity", "relationship", "mapping"] },
    { name: "Relational mapping of weak entities", unit: 1, weightage: 8, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 4, keywords: ["weak", "mapping", "table", "schema", "foreign key"] },
    { name: "First & Second Normal Forms (1NF, 2NF)", unit: 2, weightage: 10, difficulty: "Easy", difficultyColor: "#10B981", hours: 3, keywords: ["1nf", "2nf", "first normal", "second normal"] },
    { name: "Third Normal Form & BCNF decomposition", unit: 2, weightage: 14, difficulty: "Hard", difficultyColor: "#EF4444", hours: 7, keywords: ["3nf", "bcnf", "normalization", "closure", "candidate key"] },
    { name: "SQL Joins & aggregation functions", unit: 3, weightage: 12, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 5, keywords: ["sql", "join", "select", "group by", "query"] },
    { name: "ACID properties of Transactions", unit: 4, weightage: 10, difficulty: "Easy", difficultyColor: "#10B981", hours: 3, keywords: ["acid", "transaction", "commit", "rollback", "atomicity"] },
    { name: "Concurrency lock protocols (2PL)", unit: 4, weightage: 16, difficulty: "Hard", difficultyColor: "#EF4444", hours: 6, keywords: ["concurrency", "lock", "2pl", "serializability", "deadlock"] },
    { name: "B+ Tree Indexing Node splits", unit: 5, weightage: 12, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 5, keywords: ["b+ tree", "index", "b tree", "pointer", "search"] },
    { name: "RAID Disk configurations", unit: 5, weightage: 8, difficulty: "Easy", difficultyColor: "#10B981", hours: 3, keywords: ["raid", "disk", "striping", "parity", "storage"] }
  ],
  "Computer Networks": [
    { name: "Physical Layer signaling & transmission", unit: 1, weightage: 8, difficulty: "Easy", difficultyColor: "#10B981", hours: 3, keywords: ["physical", "signaling", "cable", "bandwidth", "modulation"] },
    { name: "Data Link layer framing & sliding window", unit: 1, weightage: 12, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 5, keywords: ["framing", "sliding window", "mac", "ethernet", "flow control"] },
    { name: "CIDR Subnet mask IP split calculations", unit: 2, weightage: 16, difficulty: "Hard", difficultyColor: "#EF4444", hours: 6, keywords: ["cidr", "subnet", "ip address", "mask", "host"] },
    { name: "Distance Vector & Link State routing protocols", unit: 2, weightage: 14, difficulty: "Hard", difficultyColor: "#EF4444", hours: 6, keywords: ["routing", "dijkstra", "rip", "ospf", "distance vector"] },
    { name: "TCP 3-Way Handshake connection state", unit: 3, weightage: 10, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 4, keywords: ["handshake", "syn", "ack", "tcp connection", "state"] },
    { name: "TCP congestion control window sliding", unit: 3, weightage: 15, difficulty: "Hard", difficultyColor: "#EF4444", hours: 6, keywords: ["congestion", "slow start", "avoidance", "threshold"] },
    { name: "Application protocols (DNS, HTTP, DHCP)", unit: 4, weightage: 15, difficulty: "Easy", difficultyColor: "#10B981", hours: 4, keywords: ["dns", "http", "dhcp", "application", "client", "server"] },
    { name: "Cryptography & SSL/TLS handshake", unit: 5, weightage: 10, difficulty: "Hard", difficultyColor: "#EF4444", hours: 5, keywords: ["ssl", "tls", "cryptography", "encrypt", "public key"] }
  ],
  "Operating Systems": [
    { name: "Process states & Thread structures", unit: 1, weightage: 10, difficulty: "Easy", difficultyColor: "#10B981", hours: 3, keywords: ["process state", "thread", "pcb", "context switch"] },
    { name: "Process Synchronization & Semaphores", unit: 1, weightage: 15, difficulty: "Hard", difficultyColor: "#EF4444", hours: 6, keywords: ["synchronization", "semaphore", "mutex", "critical section", "producer"] },
    { name: "CPU scheduling (Round Robin, SJF, Gantt)", unit: 2, weightage: 12, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 5, keywords: ["scheduling", "round robin", "sjf", "gantt", "waiting time"] },
    { name: "Deadlock Banker's matrix safe state check", unit: 2, weightage: 13, difficulty: "Hard", difficultyColor: "#EF4444", hours: 5, keywords: ["banker", "deadlock", "safe state", "allocation", "resource"] },
    { name: "Virtual memory paging & LRU replacement", unit: 3, weightage: 20, difficulty: "Hard", difficultyColor: "#EF4444", hours: 7, keywords: ["paging", "lru", "page fault", "replacement", "segmentation"] },
    { name: "File systems & Disk head movement (SSTF)", unit: 4, weightage: 12, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 4, keywords: ["disk", "sstf", "scan", "file system", "inode"] },
    { name: "Virtualization & Hypervisor configurations", unit: 5, weightage: 8, difficulty: "Easy", difficultyColor: "#10B981", hours: 3, keywords: ["hypervisor", "virtualization", "vm", "container", "docker"] }
  ],
  "Algorithms": [
    { name: "Asymptotic notation bounds (Big-O, Omega)", unit: 1, weightage: 8, difficulty: "Easy", difficultyColor: "#10B981", hours: 3, keywords: ["asymptotic", "big-o", "omega", "complexity", "bound"] },
    { name: "Master Method recurrence solving", unit: 1, weightage: 12, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 4, keywords: ["master method", "recurrence", "recursion tree", "solve"] },
    { name: "Sorting algorithms (Merge & Quick Sort)", unit: 2, weightage: 12, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 4, keywords: ["merge", "quick sort", "pivot", "heap sort"] },
    { name: "0/1 Knapsack & LCS dynamic programming", unit: 3, weightage: 20, difficulty: "Very Hard", difficultyColor: "#A855F7", hours: 7, keywords: ["knapsack", "lcs", "dynamic programming", "memoization", "dp"] },
    { name: "Shortest path (Dijkstra) & MST (Kruskal)", unit: 4, weightage: 18, difficulty: "Hard", difficultyColor: "#EF4444", hours: 6, keywords: ["dijkstra", "kruskal", "prim", "shortest path", "mst", "graph"] },
    { name: "NP-Completeness theory (P vs NP classes)", unit: 5, weightage: 10, difficulty: "Easy", difficultyColor: "#10B981", hours: 4, keywords: ["np-complete", "p vs np", "polynomial", "reduction"] }
  ],
  "JEE Mathematics": [
    { name: "Matrices, Determinants & Inverse formulas", unit: 1, weightage: 14, difficulty: "Easy", difficultyColor: "#10B981", hours: 4, keywords: ["matrix", "determinant", "inverse", "adjoint", "cramer"] },
    { name: "Limits, Continuity & L'Hopital rule", unit: 2, weightage: 18, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 5, keywords: ["limit", "continuity", "differentiability", "derivative", "l'hopital"] },
    { name: "Definite & Indefinite Integrals calculus", unit: 3, weightage: 22, difficulty: "Hard", difficultyColor: "#EF4444", hours: 7, keywords: ["integral", "calculus", "integration", "area under curve"] },
    { name: "3D Geometry, Lines & Planes equations", unit: 4, weightage: 26, difficulty: "Hard", difficultyColor: "#EF4444", hours: 6, keywords: ["3d geometry", "vector", "plane", "line", "shortest distance"] },
    { name: "Probability distribution & Bayes theorem", unit: 5, weightage: 20, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 5, keywords: ["probability", "bayes", "conditional", "variance"] }
  ],
  "NEET Chemistry": [
    { name: "Solid state unit cells & Solutions density", unit: 1, weightage: 15, difficulty: "Easy", difficultyColor: "#10B981", hours: 4, keywords: ["solid state", "solution", "colligative", "raoult", "osmotic"] },
    { name: "Electrochemistry cells & Kinetics equations", unit: 2, weightage: 25, difficulty: "Hard", difficultyColor: "#EF4444", hours: 7, keywords: ["electrochemistry", "nernst", "kinetics", "half life", "arrhenius"] },
    { name: "Coordination chemistry isomers & ligands", unit: 3, weightage: 20, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 5, keywords: ["coordination", "isomer", "ligand", "hybridization", "crystal field"] },
    { name: "Organic Haloalkanes substitutions SN1 SN2", unit: 4, weightage: 22, difficulty: "Hard", difficultyColor: "#EF4444", hours: 6, keywords: ["sn1", "sn2", "haloalkane", "organic", "mechanism", "substitution"] },
    { name: "Biomolecules, Carbohydrates & everyday chemistry", unit: 5, weightage: 18, difficulty: "Easy", difficultyColor: "#10B981", hours: 4, keywords: ["biomolecule", "carbohydrate", "amino acid", "protein", "polymer"] }
  ],
  "UPSC Government Exams": [
    { name: "Ancient Indian civilizations & Vedic period", unit: 1, weightage: 16, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 5, keywords: ["ancient", "harappan", "vedic", "buddhism", "mauryan"] },
    { name: "Indian National Movement & British Raj", unit: 2, weightage: 24, difficulty: "Easy", difficultyColor: "#10B981", hours: 4, keywords: ["national movement", "gandhi", "british raj", "1857", "congress"] },
    { name: "Indian Constitution & Fundamental Rights articles", unit: 3, weightage: 26, difficulty: "Hard", difficultyColor: "#EF4444", hours: 6, keywords: ["constitution", "fundamental rights", "parliament", "amendment", "article"] },
    { name: "Economic Planning, Inflation & Banking sectors", unit: 4, weightage: 20, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 5, keywords: ["economic", "inflation", "banking", "rbi", "budget", "planning"] },
    { name: "Environmental Ecology & Climate change accords", unit: 5, weightage: 14, difficulty: "Easy", difficultyColor: "#10B981", hours: 4, keywords: ["ecology", "climate change", "biodiversity", "accord", "kyoto"] }
  ],
  "UKG English & Math": [
    { name: "Alphabet Basics (capital & small A-Z)", unit: 1, weightage: 20, difficulty: "Easy", difficultyColor: "#10B981", hours: 2, keywords: ["alphabet", "letters", "writing", "alphabets"] },
    { name: "Phonics & three-letter sight words (cat, dog)", unit: 2, weightage: 20, difficulty: "Easy", difficultyColor: "#10B981", hours: 3, keywords: ["phonics", "sight words", "reading", "words"] },
    { name: "Simple Numbers counting & writing (1 to 20)", unit: 3, weightage: 20, difficulty: "Easy", difficultyColor: "#10B981", hours: 2, keywords: ["numbers", "counting", "maths", "count"] },
    { name: "Addition with visual pictures (ball, apples)", unit: 4, weightage: 20, difficulty: "Easy", difficultyColor: "#10B981", hours: 2, keywords: ["addition", "plus", "pictures", "adding"] },
    { name: "Basic Shapes & Primary Colors identification", unit: 5, weightage: 20, difficulty: "Easy", difficultyColor: "#10B981", hours: 2, keywords: ["shapes", "colors", "drawing", "blue", "red", "circle"] }
  ],
  "Class 5 Environmental Studies": [
    { name: "Our Senses & Organ Systems", unit: 1, weightage: 18, difficulty: "Easy", difficultyColor: "#10B981", hours: 3, keywords: ["senses", "organs", "body", "eye", "ear"] },
    { name: "Seeds Germination & Agricultural Stages", unit: 2, weightage: 22, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 4, keywords: ["seeds", "germination", "agriculture", "plants", "growing"] },
    { name: "Water Resources, Dams & Rainwater Harvesting", unit: 3, weightage: 20, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 4, keywords: ["water", "harvesting", "conservation", "rain", "dams"] },
    { name: "Types of Shelters & Adapting to Climates", unit: 4, weightage: 20, difficulty: "Easy", difficultyColor: "#10B981", hours: 3, keywords: ["shelter", "climate", "adaptation", "house", "desert"] },
    { name: "Forest Resources & Tribal Livelihoods", unit: 5, weightage: 20, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 4, keywords: ["forest", "tribals", "wood", "nature", "trees"] }
  ],
  "Class 8 Mathematics": [
    { name: "Rational Numbers properties & operations", unit: 1, weightage: 15, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 4, keywords: ["rational", "number", "associative", "commutative", "fractions"] },
    { name: "Linear Equations in One Variable problems", unit: 2, weightage: 25, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 5, keywords: ["linear", "equation", "solve", "variable", "algebra"] },
    { name: "Understanding Quadrilaterals & angles", unit: 3, weightage: 20, difficulty: "Easy", difficultyColor: "#10B981", hours: 4, keywords: ["quadrilateral", "parallelogram", "rectangle", "angle", "polygon"] },
    { name: "Square Roots & Cube Roots calculations", unit: 4, weightage: 20, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 5, keywords: ["square root", "cube root", "exponent", "power", "factorization"] },
    { name: "Algebraic Expressions & standard Identities", unit: 5, weightage: 20, difficulty: "Hard", difficultyColor: "#EF4444", hours: 6, keywords: ["algebraic", "identity", "expression", "polynomial", "identities"] }
  ],
  "Class 10 General Science": [
    { name: "Chemical Reactions & balancing Equations", unit: 1, weightage: 18, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 5, keywords: ["chemical", "equation", "balancing", "reaction", "displacement", "reactants"] },
    { name: "Life Processes (Nutrition, Respiration)", unit: 2, weightage: 22, difficulty: "Easy", difficultyColor: "#10B981", hours: 4, keywords: ["life process", "nutrition", "respiration", "heart", "kidney", "digestion"] },
    { name: "Light Reflection, Mirrors & Refraction", unit: 3, weightage: 24, difficulty: "Hard", difficultyColor: "#EF4444", hours: 6, keywords: ["reflection", "refraction", "lens", "mirror", "focal length", "glass"] },
    { name: "Electricity, Ohm's law & Circuit heating", unit: 4, weightage: 20, difficulty: "Hard", difficultyColor: "#EF4444", hours: 6, keywords: ["electricity", "ohm", "resistor", "heating", "watt", "current"] },
    { name: "Carbon compounds & Covalent Bonding", unit: 5, weightage: 16, difficulty: "Hard", difficultyColor: "#EF4444", hours: 5, keywords: ["carbon", "compound", "bonding", "covalent", "isomer", "alkane"] }
  ],
  "Class 12 Physics": [
    { name: "Electrostatics, Coulomb's Law & Gauss Theorem", unit: 1, weightage: 18, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 5, keywords: ["electrostatics", "coulomb", "charge", "gauss", "electric field"] },
    { name: "Current Electricity, Ohm's Law & Kirchhoff's", unit: 2, weightage: 20, difficulty: "Medium", difficultyColor: "#F59E0B", hours: 5, keywords: ["kirchhoff", "electricity", "resistors", "potentiometer", "meter bridge"] },
    { name: "Electromagnetic Induction & Alternating Current", unit: 3, weightage: 22, difficulty: "Hard", difficultyColor: "#EF4444", hours: 7, keywords: ["emi", "alternating current", "transformer", "faraday", "lenz"] },
    { name: "Wave Optics, Interference & Young's Double Slit", unit: 4, weightage: 24, difficulty: "Hard", difficultyColor: "#EF4444", hours: 7, keywords: ["wave optics", "interference", "diffraction", "young's", "slit"] },
    { name: "Semiconductor Electronic Devices, Diodes & Gates", unit: 5, weightage: 16, difficulty: "Easy", difficultyColor: "#10B981", hours: 4, keywords: ["semiconductor", "diode", "logic gates", "transistor", "junction"] }
  ]
};

export const UNIT_NAMES = {
  "Database Management Systems": {
    1: "ER Modeling & Mapping",
    2: "Relational Normalization",
    3: "SQL Queries & Aggregates",
    4: "Transactions & Concurrency",
    5: "Storage, Trees & Indexing"
  },
  "Computer Networks": {
    1: "Physical & Link Layers",
    2: "Routing & Subnetting",
    3: "TCP/UDP & Congestion",
    4: "DNS, HTTP & Applications",
    5: "Network Security & Crypto"
  },
  "Operating Systems": {
    1: "Process states & Sync",
    2: "CPU Scheduling & Deadlocks",
    3: "Paging & Virtual Memory",
    4: "File Systems & Disk Head",
    5: "VMs & Virtualization"
  },
  "Algorithms": {
    1: "Notation & Recurrences",
    2: "Sort, Search & Divide",
    3: "Greedy & Dynamic Prog",
    4: "Graph Traversals & MST",
    5: "NP-Completeness Theory"
  },
  "JEE Mathematics": {
    1: "Matrices & Cramer's Rules",
    2: "Limits & Differentiation",
    3: "Calculus & Integrals",
    4: "Vectors & 3D Planes",
    5: "Bayes & Probability"
  },
  "NEET Chemistry": {
    1: "Solids & Solutions",
    2: "Cells & Rate Kinetics",
    3: "Ligands & Crystal Field",
    4: "SN1 & SN2 Mechanisms",
    5: "Proteins & everyday Chem"
  },
  "UPSC Government Exams": {
    1: "Ancient civilizations History",
    2: "Modern National Movement",
    3: "Constitution Articles & Rights",
    4: "Banking, Budget & Economic Planning",
    5: "Ecology & Climate change"
  },
  "UKG English & Math": {
    1: "Alphabet Basics",
    2: "Phonics & Sight Words",
    3: "Numbers 1-20",
    4: "Visual Addition",
    5: "Shapes & Colors"
  },
  "Class 5 Environmental Studies": {
    1: "Body Organs & Senses",
    2: "Seeds & Germination",
    3: "Water Resources",
    4: "Shelter & Adaptation",
    5: "Forests & Tribals"
  },
  "Class 8 Mathematics": {
    1: "Rational Operations",
    2: "Linear Equations",
    3: "Quadrilaterals & Angles",
    4: "Roots & Exponents",
    5: "Algebraic Identities"
  },
  "Class 10 General Science": {
    1: "Reactions & Equations",
    2: "Life Processes & Biology",
    3: "Light Reflection & Lenses",
    4: "Electricity Circuits",
    5: "Carbon Chemistry"
  },
  "Class 12 Physics": {
    1: "Electrostatics & Charge",
    2: "Current & Kirchhoff's",
    3: "EMI & Alternating Current",
    4: "Wave Optics & Slits",
    5: "Semiconductors & Gates"
  }
};

export function cleanSubjectName(name) {
  if (!name) return "Custom Subject";
  let cleaned = name.replace(/\.[a-zA-Z0-9]+$/, ""); // remove extension
  cleaned = cleaned.replace(/[\-_]+/g, " "); // replace underscores/dashes with space
  // capitalize words
  cleaned = cleaned.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return cleaned.trim() || "Custom Subject";
}

export function recalculateAnalysis(currentAnalysis, updatedTopicsList) {
  const subject = currentAnalysis.subject;

  // Identify Unit 1 topics dynamically (by matching unit property or fallbacks)
  const unit1Topics = updatedTopicsList.filter(t => {
    const unitVal = t.unit;
    if (unitVal === 1 || unitVal === "Unit 1" || String(unitVal).toLowerCase().includes("unit 1")) {
      return true;
    }
    const lowerName = t.name.toLowerCase();
    return lowerName.includes("unit 1") || 
           lowerName.includes("er diagram") || 
           lowerName.includes("relational mapping") ||
           lowerName.includes("physical layer") || 
           lowerName.includes("data link") ||
           lowerName.includes("process state") || 
           lowerName.includes("synchronization") || 
           lowerName.includes("semaphore") ||
           lowerName.includes("asymptotic") || 
           lowerName.includes("master method");
  });

  const totalHours = updatedTopicsList.reduce((acc, t) => {
    const hrs = t.difficulty === "Easy" ? 3 : t.difficulty === "Medium" ? 5 : t.difficulty === "Hard" ? 7 : 8;
    return acc + hrs;
  }, 0);

  const unit1StudyHours = unit1Topics.reduce((acc, t) => {
    const hrs = t.difficulty === "Easy" ? 3 : t.difficulty === "Medium" ? 5 : t.difficulty === "Hard" ? 7 : 8;
    return acc + hrs;
  }, 0);

  const unit1Weightage = unit1Topics.reduce((acc, t) => {
    return acc + (parseInt(t.weightage) || 0);
  }, 0);

  const avgUnit1Difficulty = unit1Topics.some(t => t.difficulty === "Hard" || t.difficulty === "Very Hard") ? "Hard" : "Medium";
  const unit1PossibilityColor = avgUnit1Difficulty === "Hard" ? "#F59E0B" : "#10B981";

  let unit1PossibilityText = "";
  let unit1LikelihoodPercentage = 85;

  if (subject === "Database Management Systems") {
    unit1PossibilityText = "High Chance. ER diagrams and schemas are visual and logical. Securing marks here is straightforward since it maps direct constraints without code dependencies.";
    unit1LikelihoodPercentage = 90;
  } else if (subject === "Computer Networks") {
    unit1PossibilityText = "Moderate Chance. Physical line signaling and sliding-window frame arithmetic are formula-driven but require careful calculations.";
    unit1LikelihoodPercentage = 78;
  } else if (subject === "Operating Systems") {
    unit1PossibilityText = "Challenging Chance. Process states are simple, but semaphore coordination is tricky. Success requires tracing states to avoid deadlocks.";
    unit1LikelihoodPercentage = 65;
  } else if (subject === "Algorithms") {
    unit1PossibilityText = "High Chance. Big-O math and recursion parameters are mechanical. Once standard rules are mastered, obtaining full marks is highly likely.";
    unit1LikelihoodPercentage = 84;
  } else {
    // Custom general subjects
    unit1PossibilityText = `Good Chance. Unit 1 covers introductory and foundation concepts for ${subject}. Mastery here builds the baseline needed for subsequent chapters.`;
    unit1LikelihoodPercentage = 80;
  }

  // Success multiplier based on hours
  if (unit1StudyHours >= 8) {
    unit1LikelihoodPercentage = Math.min(98, unit1LikelihoodPercentage + 5);
  } else if (unit1StudyHours < 4) {
    unit1LikelihoodPercentage = Math.max(40, unit1LikelihoodPercentage - 15);
  }

  const unit1Roadmap = unit1Topics.length > 0 ? [
    { step: `Step 1: Read standard notes and definitions for: ${unit1Topics[0].name.split("(")[0]}`, duration: "Hours 1-2" },
    { step: `Step 2: Solve past question worksheets for: ${unit1Topics[Math.min(unit1Topics.length - 1, 1)].name.split("(")[0]}`, duration: "Hours 3-5" },
    { step: "Step 3: Self-test with short-answer questions & error log check", duration: "Hours 6-8" }
  ] : [
    { step: "Step 1: No Unit 1 topics matched. Add a Unit 1 topic to generate a roadmap.", duration: "0 Hours" }
  ];

  let globalDifficulty = "Medium";
  let globalDifficultyColor = "#F59E0B";
  const hardCount = updatedTopicsList.filter(t => t.difficulty === "Hard" || t.difficulty === "Very Hard").length;
  if (updatedTopicsList.length === 0) {
    globalDifficulty = "Medium";
    globalDifficultyColor = "#F59E0B";
  } else if (hardCount >= updatedTopicsList.length * 0.4) {
    globalDifficulty = "Hard";
    globalDifficultyColor = "#EF4444";
  } else if (hardCount === 0) {
    globalDifficulty = "Easy";
    globalDifficultyColor = "#10B981";
  }

  const globalRoadmap = updatedTopicsList.length > 0 ? [
    { 
      step: `Phase 1: Foundation concepts (${updatedTopicsList.slice(0, Math.ceil(updatedTopicsList.length / 3)).map(t => t.name.split("(")[0].trim()).join(", ") || "No topics"})`, 
      duration: "First 30%" 
    },
    { 
      step: `Phase 2: Practice & Core problem solving (${updatedTopicsList.slice(Math.ceil(updatedTopicsList.length / 3), Math.ceil(updatedTopicsList.length * 2 / 3)).map(t => t.name.split("(")[0].trim()).join(", ") || "No topics"})`, 
      duration: "Middle 40%" 
    },
    { 
      step: `Phase 3: Revision & Advanced topics (${updatedTopicsList.slice(Math.ceil(updatedTopicsList.length * 2 / 3)).map(t => t.name.split("(")[0].trim()).join(", ") || "No topics"})`, 
      duration: "Final 30%" 
    }
  ] : [
    { step: "Phase 1: No topics found. Upload a syllabus or add custom topics to populate your learning path.", duration: "0 Hours" }
  ];

  let insights = "";
  if (updatedTopicsList.length > 0) {
    const hardTopics = updatedTopicsList.filter(t => t.difficulty === "Hard" || t.difficulty === "Very Hard");
    if (hardTopics.length > 0) {
      insights = `This resource contains ${updatedTopicsList.length} topics, including ${hardTopics.length} highly challenging areas (such as ${hardTopics.slice(0, 2).map(t => t.name.split("(")[0].trim()).join(" and ")}). Focus your early efforts here to maximize understanding.`;
    } else {
      insights = `All ${updatedTopicsList.length} topics in this resource are rated Easy or Medium difficulty. Systematically cover each area to ensure a very high score on the exam.`;
    }
  } else {
    insights = "No topics have been parsed for this subject yet. Upload a syllabus file or paste text to generate automated study guidelines and strategies.";
  }

  return {
    ...currentAnalysis,
    difficulty: globalDifficulty,
    difficultyColor: globalDifficultyColor,
    timeToMaster: `${totalHours} hours`,
    topics: updatedTopicsList,
    roadmap: globalRoadmap,
    insights: insights,
    unit1: {
      topics: unit1Topics.map(t => t.name),
      studyHours: unit1StudyHours,
      weightage: unit1Weightage,
      possibilityColor: unit1PossibilityColor,
      possibilityText: unit1PossibilityText,
      likelihoodPercentage: unit1LikelihoodPercentage,
      roadmap: unit1Roadmap
    }
  };
}

export const PREDEFINED_QUESTIONS = {
  "Database Management Systems": [
    { questionText: "Explain ER Diagram modeling of entities, relationships, attributes, and mapping rules to tables.", repetitions: 5, unit: 1, topicName: "ER Diagram modeling of entities", priority: "High", weightage: 10, pastExams: ["2024 April", "2024 December", "2025 April", "2025 December", "2026 April"] },
    { questionText: "Compare 3NF and BCNF. Explain normalization decomposition with an example functional dependency.", repetitions: 6, unit: 2, topicName: "Third Normal Form & BCNF decomposition", priority: "High", weightage: 14, pastExams: ["2024 April", "2024 December", "2025 April", "2025 December", "2026 April"] },
    { questionText: "Write SQL queries demonstrating INNER, LEFT, and RIGHT Joins with aggregation on Employee-Department tables.", repetitions: 6, unit: 3, topicName: "SQL Joins & aggregation functions", priority: "Medium", weightage: 12, pastExams: ["2024 April", "2024 December", "2025 April", "2025 December", "2026 April"] },
    { questionText: "What is Strict Two-Phase Locking (Strict 2PL)? How does it prevent cascading rollbacks during transaction failure?", repetitions: 4, unit: 4, topicName: "Concurrency lock protocols (2PL)", priority: "High", weightage: 16, pastExams: ["2024 December", "2025 April", "2025 December", "2026 April"] },
    { questionText: "Explain B+ Tree Indexing Node splits and how node fan-out reduces the number of disk search operations.", repetitions: 3, unit: 5, topicName: "B+ Tree Indexing Node splits", priority: "Medium", weightage: 12, pastExams: ["2024 April", "2025 April", "2026 April"] },
    { questionText: "Describe ACID properties of Transactions, highlighting Atomicity and Durability implementation techniques.", repetitions: 5, unit: 4, topicName: "ACID properties of Transactions", priority: "High", weightage: 10, pastExams: ["2024 April", "2024 December", "2025 April", "2025 December", "2026 April"] },
    { questionText: "Compare RAID level 0, 1, and 5 disk mirroring and striping configurations, explaining storage efficiency.", repetitions: 2, unit: 5, topicName: "RAID Disk configurations", priority: "Low", weightage: 8, pastExams: ["2024 December", "2025 December"] }
  ],
  "Computer Networks": [
    { questionText: "Explain sliding window flow control protocols. Compare the performance of Go-Back-N and Selective Repeat.", repetitions: 4, unit: 1, topicName: "Data Link layer framing & sliding window", priority: "Medium", weightage: 12, pastExams: ["2024 April", "2025 April", "2025 December", "2026 April"] },
    { questionText: "Solve CIDR Subnet mask IP split calculations for 192.168.1.0/24 when dividing into 4 equal subnets.", repetitions: 5, unit: 2, topicName: "CIDR Subnet mask IP split calculations", priority: "High", weightage: 16, pastExams: ["2024 April", "2024 December", "2025 April", "2025 December", "2026 April"] },
    { questionText: "Describe Distance Vector routing protocol and explain the count-to-infinity problem with an example network.", repetitions: 3, unit: 2, topicName: "Distance Vector & Link State routing protocols", priority: "High", weightage: 14, pastExams: ["2024 December", "2025 December", "2026 April"] },
    { questionText: "Explain the TCP 3-Way Handshake connection state sequence and the SYN flooding vulnerability.", repetitions: 5, unit: 3, topicName: "TCP 3-Way Handshake connection state", priority: "Medium", weightage: 10, pastExams: ["2024 April", "2024 December", "2025 April", "2025 December", "2026 April"] },
    { questionText: "Detail the TCP congestion control mechanism, focusing on Slow Start, Congestion Avoidance, and Fast Recovery.", repetitions: 4, unit: 3, topicName: "TCP congestion control window sliding", priority: "High", weightage: 15, pastExams: ["2024 December", "2025 April", "2025 December", "2026 April"] }
  ],
  "Operating Systems": [
    { questionText: "Explain Process Synchronization using Semaphores and solve the classic Bounded Buffer Producer-Consumer problem.", repetitions: 5, unit: 1, topicName: "Process Synchronization & Semaphores", priority: "High", weightage: 15, pastExams: ["2024 April", "2024 December", "2025 April", "2025 December", "2026 April"] },
    { questionText: "Illustrate CPU scheduling algorithms (Round Robin, Shortest Job First) and draw Gantt charts to compare average waiting times.", repetitions: 4, unit: 2, topicName: "CPU scheduling (Round Robin, SJF, Gantt)", priority: "High", weightage: 12, pastExams: ["2024 December", "2025 April", "2025 December", "2026 April"] },
    { questionText: "Detail the Banker's deadlock avoidance algorithm. Perform a safe state check given allocation and request matrices.", repetitions: 3, unit: 2, topicName: "Deadlock Banker's matrix safe state check", priority: "High", weightage: 13, pastExams: ["2024 April", "2025 April", "2026 April"] },
    { questionText: "Explain Virtual memory paging, page faults, and demonstrate the LRU page replacement algorithm on a reference string.", repetitions: 6, unit: 3, topicName: "Virtual memory paging & LRU replacement", priority: "High", weightage: 20, pastExams: ["2024 April", "2024 December", "2025 April", "2025 December", "2026 April"] },
    { questionText: "Discuss Disk head movement algorithms (SSTF, SCAN, C-SCAN) with tracks and compute total cylinder travel.", repetitions: 3, unit: 4, topicName: "File systems & Disk head movement (SSTF)", priority: "Medium", weightage: 12, pastExams: ["2024 April", "2025 December", "2026 April"] }
  ],
  "Algorithms": [
    { questionText: "Solve the recurrence relation using the Master Method for T(n) = 2T(n/2) + n and prove asymptotic bounds.", repetitions: 5, unit: 1, topicName: "Master Method recurrence solving", priority: "Medium", weightage: 12, pastExams: ["2024 April", "2024 December", "2025 April", "2025 December", "2026 April"] },
    { questionText: "Compare Merge Sort and Quick Sort worst-case bounds. Explain pivot selection and partitioning steps.", repetitions: 4, unit: 2, topicName: "Sorting algorithms (Merge & Quick Sort)", priority: "Medium", weightage: 12, pastExams: ["2024 December", "2025 April", "2025 December", "2026 April"] },
    { questionText: "Explain the 0/1 Knapsack problem using Dynamic Programming, showing the tabular grid cell calculation.", repetitions: 6, unit: 3, topicName: "0/1 Knapsack & LCS dynamic programming", priority: "High", weightage: 20, pastExams: ["2024 April", "2024 December", "2025 April", "2025 December", "2026 April"] },
    { questionText: "Apply Dijkstra's algorithm to find single-source shortest path and Kruskal's algorithm for Minimum Spanning Tree.", repetitions: 5, unit: 4, topicName: "Shortest path (Dijkstra) & MST (Kruskal)", priority: "High", weightage: 18, pastExams: ["2024 April", "2024 December", "2025 April", "2025 December", "2026 April"] },
    { questionText: "Explain the P vs NP classes. Define NP-Completeness and outline polynomial-time reduction steps.", repetitions: 3, unit: 5, topicName: "NP-Completeness theory (P vs NP classes)", priority: "Low", weightage: 10, pastExams: ["2024 April", "2025 April", "2026 April"] }
  ],
  "UKG English & Math": [
    { questionText: "Draw and write all Alphabet Basics capital and small letters from A to Z.", repetitions: 5, unit: 1, topicName: "Alphabet Basics (capital & small A-Z)", priority: "Medium", weightage: 20, pastExams: ["Term 1", "Term 2", "Final Exam"] },
    { questionText: "Read and write phonics sounds and simple three-letter sight words like cat, dog, and run.", repetitions: 4, unit: 2, topicName: "Phonics & three-letter sight words (cat, dog)", priority: "High", weightage: 20, pastExams: ["Term 2", "Final Exam"] },
    { questionText: "Count and write numbers from 1 to 20 without missing any sequence.", repetitions: 5, unit: 3, topicName: "Simple Numbers counting & writing (1 to 20)", priority: "High", weightage: 20, pastExams: ["Term 1", "Term 2", "Final Exam"] }
  ],
  "Class 5 Environmental Studies": [
    { questionText: "Explain how our five senses work and what organs are part of the nervous system.", repetitions: 4, unit: 1, topicName: "Our Senses & Organ Systems", priority: "Medium", weightage: 18, pastExams: ["Unit Test 1", "Half Yearly", "Annual 2025"] },
    { questionText: "Describe the process of seed germination and what factors are necessary for plants to grow.", repetitions: 5, unit: 2, topicName: "Seeds Germination & Agricultural Stages", priority: "High", weightage: 22, pastExams: ["Half Yearly", "Annual 2025"] },
    { questionText: "What are water resources? Discuss dams, rivers, and methods of rainwater harvesting.", repetitions: 4, unit: 3, topicName: "Water Resources, Dams & Rainwater Harvesting", priority: "High", weightage: 20, pastExams: ["Unit Test 2", "Annual 2025"] }
  ],
  "Class 8 Mathematics": [
    { questionText: "Verify commutative and associative properties of rational numbers under addition and multiplication.", repetitions: 4, unit: 1, topicName: "Rational Numbers properties & operations", priority: "Medium", weightage: 15, pastExams: ["Periodic Test 1", "Term 1", "Finals 2025"] },
    { questionText: "Solve the linear equation for the variable x: 3x - 5 = 2x + 7, showing each step clearly.", repetitions: 6, unit: 2, topicName: "Linear Equations in One Variable problems", priority: "High", weightage: 25, pastExams: ["Periodic Test 1", "Term 1", "Finals 2025"] },
    { questionText: "Explain the properties of a parallelogram and find the values of missing angles inside a quadrilateral.", repetitions: 4, unit: 3, topicName: "Understanding Quadrilaterals & angles", priority: "Medium", weightage: 20, pastExams: ["Term 1", "Finals 2025"] }
  ],
  "Class 10 General Science": [
    { questionText: "Balance the chemical equation: Fe + H2O -> Fe3O4 + H2, and define a displacement reaction.", repetitions: 5, unit: 1, topicName: "Chemical Reactions & balancing Equations", priority: "High", weightage: 18, pastExams: ["Board Exam 2024", "Pre-Board", "Board Exam 2025"] },
    { questionText: "Describe the double circulation of blood in the human heart with a labeled diagram.", repetitions: 4, unit: 2, topicName: "Life Processes (Nutrition, Respiration)", priority: "Medium", weightage: 22, pastExams: ["Board Exam 2024", "Board Exam 2025"] },
    { questionText: "Derive the mirror formula 1/f = 1/v + 1/u, and explain refraction through a glass slab.", repetitions: 6, unit: 3, topicName: "Light Reflection, Mirrors & Refraction", priority: "High", weightage: 24, pastExams: ["Board Exam 2024", "Pre-Board", "Board Exam 2025"] }
  ],
  "Class 12 Physics": [
    { questionText: "State Gauss's Law and use it to find the electric field intensity due to an infinitely long charged wire.", repetitions: 5, unit: 1, topicName: "Electrostatics, Coulomb's Law & Gauss Theorem", priority: "High", weightage: 18, pastExams: ["CBSE Board 2024", "Half Yearly", "CBSE Board 2025"] },
    { questionText: "State Kirchhoff's Rules and apply them to analyze resistors in a Wheatstone Bridge circuit.", repetitions: 4, unit: 2, topicName: "Current Electricity, Ohm's Law & Kirchhoff's", priority: "Medium", weightage: 20, pastExams: ["CBSE Board 2024", "CBSE Board 2025"] },
    { questionText: "State Faraday's laws of electromagnetic induction and explain the working principle of an AC generator.", repetitions: 5, unit: 3, topicName: "Electromagnetic Induction & Alternating Current", priority: "High", weightage: 22, pastExams: ["CBSE Board 2024", "CBSE Board 2025"] }
  ]
};

// Calculate simple keyword set
function getKeywords(text) {
  const words = text.toLowerCase()
    .replace(/[?,.:;()\-]/g, "")
    .split(/\s+/);
  const stopWords = new Set(["what", "explain", "describe", "how", "show", "prove", "compare", "discuss", "write", "define", "calculate", "design", "derive", "and", "the", "a", "of", "to", "in", "is", "for", "with", "on", "using", "using:", "an", "their", "process", "rules", "by", "given", "find", "method", "steps"]);
  return words.filter(w => w.length > 2 && !stopWords.has(w));
}

// Simple keyword Jaccard overlap similarity
function calculateSimilarity(text1, text2) {
  const kw1 = new Set(getKeywords(text1));
  const kw2 = new Set(getKeywords(text2));
  if (kw1.size === 0 || kw2.size === 0) return 0;
  
  let intersection = 0;
  kw1.forEach(w => {
    if (kw2.has(w)) intersection++;
  });
  
  const union = kw1.size + kw2.size - intersection;
  return intersection / union;
}

export function getAnalysisForResource(name, type, rawText = "") {
  const combinedText = (name + " " + rawText).toLowerCase();

  // 1. Identify Subject based on text matches
  let subject = "";
  if (
    combinedText.includes("subnet") ||
    combinedText.includes("network") ||
    combinedText.includes("ip ") ||
    combinedText.includes("tcp") ||
    combinedText.includes("routing") ||
    combinedText.includes("protocol") ||
    combinedText.includes("dns") ||
    combinedText.includes("http") ||
    combinedText.includes("framing")
  ) {
    subject = "Computer Networks";
  } else if (
    combinedText.includes("process") ||
    combinedText.includes("thread") ||
    combinedText.includes("scheduling") ||
    combinedText.includes("paging") ||
    combinedText.includes("deadlock") ||
    combinedText.includes("os") ||
    combinedText.includes("semaphore") ||
    combinedText.includes("mutex")
  ) {
    subject = "Operating Systems";
  } else if (
    combinedText.includes("sort") ||
    combinedText.includes("tree") ||
    combinedText.includes("graph") ||
    combinedText.includes("algorithm") ||
    combinedText.includes("complexity") ||
    combinedText.includes("dp") ||
    combinedText.includes("kruskal") ||
    combinedText.includes("knapsack") ||
    combinedText.includes("asymptotic") ||
    combinedText.includes("recurrence")
  ) {
    subject = "Algorithms";
  } else if (
    combinedText.includes("sql") ||
    combinedText.includes("database") ||
    combinedText.includes("dbms") ||
    combinedText.includes("query") ||
    combinedText.includes("normalization") ||
    combinedText.includes("acid") ||
    combinedText.includes("lock") ||
    combinedText.includes("er diagram")
  ) {
    subject = "Database Management Systems";
  }

  // Fallback to cleaned filename if no subject matches
  if (!subject) {
    subject = cleanSubjectName(name);
  }

  const difficultyColors = {
    "Easy": "#10B981",
    "Medium": "#F59E0B",
    "Hard": "#EF4444",
    "Very Hard": "#A855F7"
  };

  let extractedTopics = [];
  let customQuestions = [];

  // Parse actual questions from pasted text or document text
  if (rawText && rawText.trim().length > 10) {
    const lines = rawText.split(/\r?\n/);
    let currentUnit = 1;
    let index = 0;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Match Unit X declarations (Unit 1, Chapter 1, etc.)
      const unitMatch = trimmed.match(/(?:unit|chapter|ch|part)\s*(\d+)/i);
      if (unitMatch) {
        currentUnit = Math.min(5, Math.max(1, parseInt(unitMatch[1])));
      }

      // Check if it's a question (ends with '?' or starts with typical question verbs)
      const isQuestion = trimmed.endsWith("?") || 
                         /^(?:what|explain|describe|how|show|prove|compare|discuss|write|define|calculate|design|derive)\s+/i.test(trimmed);

      if (isQuestion && trimmed.length > 15 && trimmed.length < 250) {
        customQuestions.push({
          questionText: trimmed,
          unit: currentUnit
        });
      }

      // Identify topic lines (filter out very short/long lines and Unit labels)
      if (trimmed.length > 4 && trimmed.length < 120 && !isQuestion) {
        if (/^(?:unit|chapter|ch|part)\s+\d+[:\-]?\s*$/i.test(trimmed)) {
          return;
        }

        let topicName = trimmed.replace(/^[\d\.\-\*\s•\)]+\s*/, "");
        topicName = topicName.replace(/^(?:unit|chapter|ch)\s*\d+[:\-]?\s*/i, "");

        if (topicName.length > 3) {
          const hash = topicName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const difficultiesList = ["Easy", "Medium", "Hard", "Very Hard"];
          const diff = difficultiesList[hash % 4];
          const weight = 8 + (hash % 15);
          const priority = weight >= 14 ? "High" : weight <= 9 ? "Low" : "Medium";
          const importance = Math.min(98, weight * 5 + (priority === "High" ? 30 : 15));

          extractedTopics.push({
            id: `t_parsed_${index++}_${Date.now()}`,
            name: topicName,
            unit: currentUnit,
            difficulty: diff,
            difficultyColor: difficultyColors[diff],
            weightage: `${weight}%`,
            priority,
            hours: diff === "Easy" ? 3 : diff === "Medium" ? 5 : diff === "Hard" ? 7 : 8,
            freq: Math.max(1, Math.round(weight / 3)),
            totalExams: 6,
            avgMarks: weight,
            lastSeen: "Recent",
            importance,
            history: [1, 0, 1, 1, 0, 1]
          });
        }
      }
    });
  }

  // If we couldn't parse any topics from the rawText, or no rawText was provided
  if (extractedTopics.length === 0) {
    // If the detected subject is predefined, load mock topics for it
    const predefinedSubjects = ["Database Management Systems", "Computer Networks", "Operating Systems", "Algorithms"];
    if (predefinedSubjects.includes(subject)) {
      const allTopics = SUBJECT_TOPICS[subject];
      let matchedTopics = allTopics.filter(topic => {
        return topic.keywords.some(keyword => combinedText.includes(keyword));
      });

      if (matchedTopics.length === 0) {
        matchedTopics = allTopics.slice(0, 4);
      }

      // Ensure Unit 1 topics are present for the advisor
      let unit1Topics = matchedTopics.filter(t => t.unit === 1);
      if (unit1Topics.length === 0) {
        unit1Topics = allTopics.filter(t => t.unit === 1);
        unit1Topics.forEach(ut => {
          if (!matchedTopics.some(mt => mt.name === ut.name)) {
            matchedTopics.push(ut);
          }
        });
      }

      extractedTopics = matchedTopics.map((t, idx) => {
        const priority = t.weightage >= 14 ? "High" : t.weightage <= 9 ? "Low" : "Medium";
        const importance = Math.min(98, t.weightage * 5 + (priority === "High" ? 30 : 15));
        return {
          id: `t_${idx}_${Date.now()}`,
          name: t.name,
          unit: t.unit,
          difficulty: t.difficulty,
          difficultyColor: t.difficultyColor,
          weightage: `${t.weightage}%`,
          priority,
          hours: t.hours || (t.difficulty === "Easy" ? 3 : t.difficulty === "Medium" ? 5 : t.difficulty === "Hard" ? 7 : 8),
          freq: Math.max(1, Math.round(t.weightage / 3)),
          totalExams: 6,
          avgMarks: t.weightage,
          lastSeen: "2026 Apr",
          importance,
          history: [1, 1, 0, 1, 1, 1]
        };
      });
    } else {
      // Fallback: check filename keywords for general subjects
      const filenameLower = name.toLowerCase();
      let customTopics = [];
      if (filenameLower.includes("physics")) {
        customTopics = [
          { name: "Electrostatics & Coulomb's Law", unit: 1, weight: 12, diff: "Easy" },
          { name: "Electric Potential & Gauss Theorem", unit: 1, weight: 10, diff: "Medium" },
          { name: "Ohm's Law & Kirchhoff's Rules", unit: 2, weight: 14, diff: "Medium" },
          { name: "Ampere's Law & Magnetic Dipole", unit: 3, weight: 18, diff: "Hard" },
          { name: "Faraday's Law & Self Induction", unit: 4, weight: 16, diff: "Hard" },
          { name: "Wave Optics, Huygens & Young's DS", unit: 4, weight: 15, diff: "Very Hard" },
          { name: "Semiconductor Logic Gates & Diodes", unit: 5, weight: 15, diff: "Easy" }
        ];
      } else if (filenameLower.includes("chem")) {
        customTopics = [
          { name: "Crystalline & Amorphous Solids", unit: 1, weight: 10, diff: "Easy" },
          { name: "Solutions, Raoult's Law & Colligative", unit: 2, weight: 12, diff: "Medium" },
          { name: "Nernst Equation & Fuel Cells", unit: 3, weight: 18, diff: "Hard" },
          { name: "Chemical Kinetics & Arrhenius Equation", unit: 4, weight: 14, diff: "Medium" },
          { name: "Haloalkanes & Carbon Substitutions", unit: 5, weight: 18, diff: "Very Hard" },
          { name: "Alcohols, Phenols & Dehydration Reactions", unit: 5, weight: 16, diff: "Hard" }
        ];
      } else if (filenameLower.includes("math") || filenameLower.includes("calculus") || filenameLower.includes("algebra")) {
        customTopics = [
          { name: "Relations, Functions & Inverse Trigonometry", unit: 1, weight: 12, diff: "Medium" },
          { name: "Matrices & Determinants Properties", unit: 2, weight: 14, diff: "Easy" },
          { name: "Limits, Continuity & Integrals Calculus", unit: 3, weight: 22, diff: "Very Hard" },
          { name: "Vector Dot/Cross Products & Lines", unit: 4, weight: 15, diff: "Medium" },
          { name: "Three Dimensional Planes & Angles", unit: 4, weight: 18, diff: "Hard" },
          { name: "Probability Distribution & Bayes Theorem", unit: 5, weight: 14, diff: "Hard" }
        ];
      } else if (filenameLower.includes("12") || filenameLower.includes("syllabus")) {
        customTopics = [
          { name: "Unit 1 Fundamental Concepts & Scope", unit: 1, weight: 12, diff: "Easy" },
          { name: "Unit 2 Key Methods and Processes", unit: 2, weight: 15, diff: "Medium" },
          { name: "Unit 3 Core Exercises & Analysis", unit: 3, weight: 20, diff: "Hard" },
          { name: "Unit 4 Performance Evaluation & Assessment", unit: 4, weight: 18, diff: "Medium" },
          { name: "Unit 5 Practical Projects & Revision Problems", unit: 5, weight: 15, diff: "Easy" }
        ];
      } else {
        customTopics = [
          { name: "Chapter 1: Principles and Definitions", unit: 1, weight: 15, diff: "Easy" },
          { name: "Chapter 2: Essential Operations & Methods", unit: 2, weight: 20, diff: "Medium" },
          { name: "Chapter 3: System Implementations", unit: 3, weight: 25, diff: "Hard" },
          { name: "Chapter 4: Performance Audits", unit: 4, weight: 20, diff: "Medium" },
          { name: "Chapter 5: Case Study Analyses", unit: 5, weight: 20, diff: "Hard" }
        ];
      }

      extractedTopics = customTopics.map((t, idx) => {
        const priority = t.weight >= 14 ? "High" : t.weight <= 9 ? "Low" : "Medium";
        const importance = Math.min(98, t.weight * 5 + (priority === "High" ? 30 : 15));
        return {
          id: `t_fall_${idx}_${Date.now()}`,
          name: t.name,
          unit: t.unit,
          difficulty: t.diff || t.difficulty || "Medium",
          difficultyColor: difficultyColors[t.diff || t.difficulty || "Medium"],
          weightage: `${t.weight || t.weightage}%`,
          priority,
          hours: (t.diff || t.difficulty) === "Easy" ? 3 : (t.diff || t.difficulty) === "Medium" ? 5 : (t.diff || t.difficulty) === "Hard" ? 7 : 8,
          freq: Math.max(1, Math.round((t.weight || t.weightage) / 3)),
          totalExams: 6,
          avgMarks: t.weight || t.weightage || 10,
          lastSeen: "Recent",
          importance,
          history: [1, 1, 0, 1, 1, 1]
        };
      });
    }
  }

  const initialAnalysis = {
    subject,
    difficulty: "Medium",
    difficultyColor: "#F59E0B",
    timeToMaster: "0 hours",
    topics: extractedTopics
  };

  const finalAnalysis = recalculateAnalysis(initialAnalysis, extractedTopics);

  // If we extracted custom questions, let's cluster them or append them
  if (customQuestions.length > 0) {
    const finalPredicted = [...finalAnalysis.predictedQuestions];
    
    customQuestions.forEach((cq) => {
      // Find if we have a highly similar question already in predictions
      let bestMatchIdx = -1;
      let maxSim = 0;
      
      finalPredicted.forEach((pq, index) => {
        const sim = calculateSimilarity(cq.questionText, pq.questionText);
        if (sim > maxSim) {
          maxSim = sim;
          bestMatchIdx = index;
        }
      });
      
      if (maxSim > 0.45 && bestMatchIdx !== -1) {
        // Increment repetition count of existing matching question
        const matchedQ = finalPredicted[bestMatchIdx];
        matchedQ.repetitions += 1;
        matchedQ.likelihood = Math.min(95, matchedQ.likelihood + 8);
        matchedQ.reason = `Extracted from multiple sources. Highly repeated question (found ${matchedQ.repetitions} times) with overlapping context: "${cq.questionText.substring(0, 50)}..."`;
        if (!matchedQ.pastExams.includes("Uploaded Paper")) {
          matchedQ.pastExams.push("Uploaded Paper");
        }
      } else {
        // Create new dynamic predicted question
        const textKeywords = getKeywords(cq.questionText);
        const weightage = 5 + (textKeywords.length % 11);
        const studyHours = weightage > 10 ? 6 : 4;
        const efficiency = ((weightage / studyHours) * 2.5).toFixed(1);
        
        finalPredicted.push({
          questionText: cq.questionText,
          repetitions: 1,
          unit: cq.unit,
          topicName: cq.questionText.substring(0, 30),
          priority: weightage >= 12 ? "High" : weightage >= 8 ? "Medium" : "Low",
          weightage,
          pastExams: ["Uploaded Paper"],
          id: `custom_pred_${Date.now()}_${Math.random()}`,
          likelihood: 70,
          reason: "Identified directly from uploaded exam material as a key assessment candidate.",
          efficiencyIndex: efficiency,
          studyHours
        });
      }
    });
    
    finalAnalysis.predictedQuestions = finalPredicted.sort((a, b) => b.likelihood - a.likelihood);
  }

  return finalAnalysis;
}

export function generateDailyRoadmap(topicsList, predictedQuestions, durationWeeks) {
  const totalDays = durationWeeks * 7;
  const roadmapDays = [];
  
  if (topicsList.length === 0) {
    return Array.from({ length: totalDays }, (_, i) => ({
      day: i + 1,
      title: "No Topics Loaded",
      description: "Upload question papers or add custom topics to schedule your study plan.",
      hours: 2,
      isPredicted: false,
      checklist: ["Upload materials in subject analyzer", "Verify topic weightages"],
      done: false
    }));
  }

  // Select questions/topics to allocate
  // Place predicted questions on earlier days since they have the highest ROI!
  const highYieldQueue = [...predictedQuestions].sort((a, b) => b.likelihood - a.likelihood);
  const generalTopicQueue = [...topicsList].sort((a, b) => {
    const aPriority = a.priority === "High" ? 3 : a.priority === "Medium" ? 2 : 1;
    const bPriority = b.priority === "High" ? 3 : b.priority === "Medium" ? 2 : 1;
    return bPriority - aPriority;
  });

  // Calculate split: revision days at the end
  const revisionStartDay = Math.max(totalDays - 2, Math.floor(totalDays * 0.85));

  for (let d = 1; d <= totalDays; d++) {
    let title = "";
    let description = "";
    let hours = 2;
    let isPredicted = false;
    let checklist = [];
    
    if (d >= revisionStartDay) {
      // Revision Phase
      const revIndex = d - revisionStartDay + 1;
      if (revIndex === 1) {
        title = "Mock Exam Practice & Time Drilling";
        description = "Take a full-length past year paper from your database. Set a strict 3-hour timer.";
        hours = 4;
        checklist = [
          "Choose a paper from the Material List",
          "Solve under strict exam conditions (no notes)",
          "Grade yourself using the Pass Strategy guide",
          "Log incorrect answers in your error book"
        ];
      } else {
        title = "Weak Topic Polish & Cheat Sheet Review";
        description = "Review items in your error log. Memorize high-yield formulas and definitions.";
        hours = 3;
        checklist = [
          "Re-solve questions missed in yesterday's mock",
          "Read key normalization rules & database locking phases",
          "Perform a final 15-minute quick flashcard recall test"
        ];
      }
    } else {
      // Study Phase - pick from predicted questions or general topics
      if (highYieldQueue.length > 0 && d % 2 === 1) {
        // Allocate a predicted question
        const pq = highYieldQueue.shift();
        title = `Solve: ${pq.questionText}`;
        description = `Master this high-yield predicted question (${pq.likelihood}% Likelihood). It represents a critical core topic.`;
        hours = pq.studyHours;
        isPredicted = true;
        checklist = [
          `Read concept overview: ${pq.topicName}`,
          `Solve similar past questions from exams: ${pq.pastExams.join(", ")}`,
          `Write down the final answer from memory & compare with solutions`,
          `Review difficulty level: ${pq.priority} priority`
        ];
      } else if (generalTopicQueue.length > 0) {
        // Allocate a general topic
        const gt = generalTopicQueue.shift();
        title = `Study: ${gt.name}`;
        description = `Focus on understanding the core theoretical foundation and structural constraints.`;
        hours = gt.difficulty === "Easy" ? 2 : gt.difficulty === "Medium" ? 3 : 4;
        checklist = [
          `Review textbook chapter / slides for Unit ${gt.unit}`,
          `Solve matching concept worksheet problems`,
          `Summarize formulas & key definitions in 1 page`
        ];
      } else {
        // Fallback if queues empty but days remain
        title = "Self-Directed Question Review";
        description = "Pick any topic from your list to revise or practice coding questions.";
        hours = 2;
        checklist = ["Review active recall summaries", "Practice SQL join questions on paper"];
      }
    }

    roadmapDays.push({
      day: d,
      title,
      description,
      hours,
      isPredicted,
      checklist,
      done: false
    });
  }

  return roadmapDays;
}

export function getInitialPapers(subjectName) {
  let prefix = "DBMS";
  if (subjectName === "Computer Networks") prefix = "CN";
  else if (subjectName === "Operating Systems") prefix = "OS";
  else if (subjectName === "Algorithms") prefix = "Algorithms";
  else prefix = cleanSubjectName(subjectName);

  const list = [
    { name: `${prefix}_Sem4_2026_April.pdf`, type: "file", uploaded: "2 days ago", status: "Processed" },
    { name: `${prefix}_Sem4_2025_December.pdf`, type: "file", uploaded: "5 months ago", status: "Processed" },
    { name: `${prefix}_Sem4_2025_April.pdf`, type: "file", uploaded: "1 year ago", status: "Processed" }
  ];
  
  return list.map(item => {
    const analysisDetails = getAnalysisForResource(item.name, item.type, "");
    return {
      ...item,
      analysis: analysisDetails,
      topics: analysisDetails.topics.length
    };
  });
}
