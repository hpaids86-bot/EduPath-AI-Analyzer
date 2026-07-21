import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Sparkles,
  Sliders,
  Clock,
  BookOpen,
  Award,
  AlertTriangle,
  Brain,
  Play,
  RotateCcw,
  Terminal,
  Send,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Database,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Cell
} from "recharts";

import Card from "../components/Card.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

// RAG database for client-side fallback simulation (matching Python backend)
const CLIENT_RAG_DATABASE = {
  "Database Management Systems": {
    concepts: {
      "ER Modeling & Relational Mapping":
        "Entity-Relationship (ER) model describes data as entities, relationships, and attributes. Strong entity sets become tables with corresponding attributes. Weak entity sets become tables with a composite primary key consisting of the owner's primary key and the weak entity's discriminator. For 1:N relationships, the primary key of the '1'-side is mapped as a foreign key into the 'N'-side table. For M:N relationships, a new join-table is created containing the primary keys of both participating entity sets.",
      "Normalization (1NF to BCNF)":
        "Normalization is the process of structuring relational databases to reduce data redundancy and improve data integrity. First Normal Form (1NF) requires all attribute values to be atomic. Second Normal Form (2NF) requires a table to be in 1NF and have no partial dependencies (every non-prime attribute must depend on the whole candidate key). Third Normal Form (3NF) requires a table to be in 2NF and have no transitive dependencies (X -> Y and Y -> Z where Z depends on X transitively). Boyce-Codd Normal Form (BCNF) is a stronger version of 3NF: for every non-trivial functional dependency X -> Y, X must be a superkey.",
      "SQL Queries & Joins":
        "Structured Query Language (SQL) uses joins to combine records from multiple tables. INNER JOIN returns rows when there is a match in both tables. LEFT OUTER JOIN returns all rows from the left table, and matched rows from the right table; unmatched right columns are NULL. RIGHT OUTER JOIN is the reverse. FULL OUTER JOIN returns all rows when there is a match in either table. Subqueries are nested queries inside a larger query, often used in WHERE, FROM, or SELECT clauses. GROUP BY aggregates data, and HAVING filters aggregated groups, unlike WHERE which filters raw rows.",
      "Transactions & Concurrency Control":
        "A transaction is a single logical unit of database work. Transactions must satisfy ACID properties: Atomicity, Consistency, Isolation, and Durability. Concurrency control avoids anomalies like dirty reads, non-repeatable reads, and phantom reads. Two-Phase Locking (2PL) has a Growing phase (locks acquired) and a Shrinking phase (locks released). Strict 2PL releases all exclusive locks only at transaction commit/abort, which prevents cascading rollbacks. Deadlocks occur when transactions wait in a cyclic queue; resolved by detection (wait-for graphs) or prevention (timestamp ordering).",
      "Storage & B+ Tree Indexing":
        "Indexing reduces the number of disk accesses. B+ Tree is an N-ary self-balancing search tree. In a B+ Tree, leaf nodes contain all data records (or pointers to them) and are linked sequentially for fast range scans. Internal nodes store only keys and child pointers, maximizing fan-out and keeping depth low (typically 3-4 levels for millions of records). This ensures O(log N) lookup, insertion, and deletion times, making B+ Trees highly efficient for large database files."
    },
    quizzes: [
      {
        topic: "ER Modeling & Relational Mapping",
        question: "How is a weak entity set mapped into a relational schema?",
        options: [
          "A) As a standalone table with a simple auto-incremented primary key.",
          "B) As a table with a composite primary key consisting of the owner's primary key and the weak entity's discriminator.",
          "C) It is merged directly into the owner entity's table as nullable columns.",
          "D) As a separate table, but it does not have any foreign key references."
        ],
        answer: "B",
        explanation: "Weak entities do not have sufficient attributes to form a primary key. They require the owner entity's primary key along with their own discriminator (partial key) to create a composite primary key."
      },
      {
        topic: "Normalization (1NF to BCNF)",
        question: "A relation R(A, B, C, D) has functional dependencies A -> B and B -> C. If the primary key is A, is R in 3NF or BCNF?",
        options: [
          "A) Yes, it is in both 3NF and BCNF because A is a superkey.",
          "B) It is in 3NF but not BCNF because B is not a superkey.",
          "C) It is not in 3NF (and therefore not in BCNF) because of the transitive dependency A -> B -> C.",
          "D) It is in 2NF only, as there are no partial dependencies."
        ],
        answer: "C",
        explanation: "Because A -> B and B -> C hold, non-prime attribute C transitively depends on primary key A via B. This violates 3NF, which prohibits transitive dependencies."
      },
      {
        topic: "Transactions & Concurrency Control",
        question: "Why does Strict Two-Phase Locking (Strict 2PL) prevent cascading aborts?",
        options: [
          "A) It prevents all concurrent executions entirely.",
          "B) It releases shared locks early before acquiring exclusive locks.",
          "C) It holds all exclusive (write) locks until the transaction commits or aborts, ensuring no other transaction reads uncommitted data.",
          "D) It dynamically checks for deadlock cycles."
        ],
        answer: "C",
        explanation: "By holding exclusive write locks until commit/abort, other transactions cannot read dirty (uncommitted) data, eliminating the need to rollback dependent transactions if the original transaction aborts."
      }
    ]
  },
  "Computer Networks": {
    concepts: {
      "Physical Layer & Data Link Protocols":
        "The Physical Layer transmits raw bits over physical mediums. Data Link Layer groups bits into frames and handles hop-to-hop delivery. Flow control ensures a fast sender doesn't overwhelm a slow receiver. Error control uses CRC checksums or parity. Protocols include Stop-and-Wait, Go-Back-N (sliding window with cumulative ACKs), and Selective Repeat (buffers out-of-order frames, resends only NAK'd ones). CSMA/CD is used in Ethernet for collision detection, while CSMA/CA is used in Wi-Fi for collision avoidance.",
      "IP Addressing & Routing Protocols":
        "IP layer manages host-to-host delivery. IPv4 uses 32-bit addresses. Subnetting uses CIDR masks (e.g. 192.168.1.0/24). NAT allows private IP networks to share a single public IP. Routing protocols determine paths. Intradomain: Link-State (OSPF, uses Dijkstra's algorithm, builds full topology maps) and Distance-Vector (RIP, uses Bellman-Ford, shares routing tables with neighbors). Interdomain: BGP (Path Vector protocol, manages routing between autonomous systems based on policies).",
      "TCP/UDP & Congestion Control":
        "Transport layer handles process-to-process delivery. UDP is connectionless, unreliable, and fast. TCP is connection-oriented, reliable, and byte-stream based. TCP connection is established via 3-way handshake (SYN, SYN-ACK, ACK) and terminated via 4-way handshake. TCP Congestion Control prevents network collapse using: Slow Start (double congestion window cwnd every RTT), Congestion Avoidance (increase cwnd by 1 MSS per RTT once ssthresh is reached), Fast Retransmit (resend after 3 duplicate ACKs), and Fast Recovery."
    },
    quizzes: [
      {
        topic: "IP Addressing & Routing Protocols",
        question: "Which of the following describes OSPF (Open Shortest Path First)?",
        options: [
          "A) Distance-vector protocol that uses hop count as metric.",
          "B) Link-state protocol that uses Dijkstra's algorithm to compute the shortest path tree.",
          "C) Path-vector protocol used to route traffic between autonomous systems.",
          "D) Application layer protocol for host auto-configuration."
        ],
        answer: "B",
        explanation: "OSPF is a link-state routing protocol. Every router floods link-state advertisements (LSAs) to build a complete network topology map, then executes Dijkstra's algorithm locally."
      },
      {
        topic: "TCP/UDP & Congestion Control",
        question: "During TCP congestion control, what happens immediately upon receiving 3 duplicate ACKs?",
        options: [
          "A) TCP enters Slow Start, resetting congestion window (cwnd) to 1.",
          "B) TCP halts communication and waits for a timeout.",
          "C) TCP triggers Fast Retransmit: resends the missing segment, sets ssthresh to cwnd/2, and enters Fast Recovery.",
          "D) TCP increases the window exponentially."
        ],
        answer: "C",
        explanation: "Receiving 3 duplicate ACKs indicates that a segment was lost but subsequent segments arrived. TCP resends the lost packet immediately (Fast Retransmit) and adjusts window sizes without resetting to 1."
      }
    ]
  },
  "Operating Systems": {
    concepts: {
      "Process Synchronization & Semaphores":
        "Processes interact via IPC. Synchronization prevents race conditions in critical sections. Criteria: Mutual Exclusion, Progress, and Bounded Waiting. Semaphores are integer variables accessed via atomic wait() / signal() operations. Binary semaphore (mutex) is 0 or 1. Counting semaphore ranges arbitrarily. Classic synchronization problems: Producer-Consumer (bounded buffer), Readers-Writers (starvation risk), and Dining Philosophers.",
      "CPU Scheduling & Deadlock Prevention":
        "CPU Scheduling selects ready processes. Algorithms: FCFS, SJF (optimal average wait time), Round Robin (time slices, good responsiveness), Priority. Deadlocks occur when processes hold resources while waiting for others in a cycle. Four necessary conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Deadlock Prevention breaks one condition. Deadlock Avoidance uses Banker's Algorithm (checks if allocating resources leaves the system in a safe state).",
      "Paging, Segmentation & VM":
        "Memory management. Paging divides memory into fixed-size frames and process address spaces into pages. Page table maps pages to frames; TLB is a fast hardware cache for page translation. Page faults load missing pages from disk. Page replacement algorithms: FIFO, Optimal (replace page unused for longest time), and LRU (Least Recently Used). Thrashing occurs when a process spends more time paging than executing, resolved by working-set models."
    },
    quizzes: [
      {
        topic: "CPU Scheduling & Deadlock Prevention",
        question: "What is the primary criteria checked by the Banker's Algorithm during deadlock avoidance?",
        options: [
          "A) Whether there is enough physical memory to load the process.",
          "B) If the allocation of resources will keep the system in a 'safe state' where all processes can eventually complete.",
          "C) If a circular wait cycle exists in the allocation graph.",
          "D) Whether preemption can be applied to the resource."
        ],
        answer: "B",
        explanation: "Banker's Algorithm dynamically simulates the allocation of requested resources. It checks if there exists an execution sequence that allows all processes to finish safely. If yes, the state is safe and allocation is granted."
      },
      {
        topic: "Paging, Segmentation & VM",
        question: "What is thrashing in virtual memory systems?",
        options: [
          "A) When a process runs out of stack memory and aborts.",
          "B) When a hard drive fails due to excessive reads.",
          "C) When a process spends more time swapping pages in and out of disk than executing instructions, caused by insufficient physical frames.",
          "D) High-speed caching of page translation tables."
        ],
        answer: "C",
        explanation: "Thrashing occurs when the total size of active pages (working set) exceeds physical memory. The OS constantly experiences page faults and swaps frames, leading to near-zero CPU throughput."
      }
    ]
  },
  "Algorithms": {
    concepts: {
      "Asymptotic Notation & Recurrences":
        "Algorithm analysis. Big-O describes upper bounds, Omega lower bounds, Theta tight bounds. Recurrences express running time of recursive functions. Master Theorem solves recurrences of form T(N) = aT(N/b) + f(N). Three cases compare f(N) with N^(log_b a) to find dominant terms.",
      "Greedy & Dynamic Programming":
        "Optimization techniques. Greedy makes locally optimal choices at each step, hoping for a global optimum. Dynamic Programming (DP) solves problems with overlapping subproblems and optimal substructure. DP stores subproblem solutions (memoization or tabulation) to avoid redundant computations. Examples: Longest Common Subsequence (LCS), 0/1 Knapsack, Matrix Chain Multiplication.",
      "Graph Traversals & MSTs":
        "Breadth-First Search (BFS) uses a queue, finds shortest paths in unweighted graphs. Depth-First Search (DFS) uses a stack/recursion, useful for topological sorting and strongly connected components. Minimum Spanning Trees (MST) connect all vertices with minimum total edge weight. Kruskal's Algorithm: sorts edges, uses Disjoint-Set union-find to avoid cycles. Prim's Algorithm: grows tree from a start vertex, uses a priority queue."
    },
    quizzes: [
      {
        topic: "Asymptotic Notation & Recurrences",
        question: "Using the Master Theorem, what is the asymptotic complexity of T(N) = 4T(N/2) + O(N)?",
        options: [
          "A) O(N)",
          "B) O(N log N)",
          "C) O(N^2)",
          "D) O(2^N)"
        ],
        answer: "C",
        explanation: "Here, a=4, b=2. N^(log_b a) = N^(log_2 4) = N^2. Since f(N) = O(N) is polynomially smaller than N^2, Case 1 of Master Theorem applies, and T(N) = Theta(N^2)."
      },
      {
        topic: "Greedy & Dynamic Programming",
        question: "What is the key difference between Dynamic Programming and Divide-and-Conquer?",
        options: [
          "A) Dynamic Programming solves problems with overlapping subproblems, whereas Divide-and-Conquer partitions into disjoint subproblems.",
          "B) Divide-and-Conquer uses tabulation, Dynamic Programming does not.",
          "C) Dynamic Programming is always faster than Divide-and-Conquer.",
          "D) Divide-and-Conquer is only used for sorting."
        ],
        answer: "A",
        explanation: "Dynamic programming is optimized for problems where subproblems share common subproblems (overlapping). By caching results, DP avoids re-solving them. Divide-and-Conquer solves independent (disjoint) subproblems."
      }
    ]
  }
};

const DEFAULT_FOCUS = {
  "Database Management Systems": "Normalization & Concurrency control",
  "Computer Networks": "IP routing arithmetic & OSPF vs RIP",
  "Operating Systems": "Banker's Algorithm & Page replacement",
  "Algorithms": "Recurrence relations & Dynamic programming Grid"
};

export default function AgentPlayground() {
  const [subject, setSubject] = useState("Database Management Systems");
  const [architecture, setArchitecture] = useState("linear");
  const [maxTokens, setMaxTokens] = useState(2500);
  const [studentGap, setStudentGap] = useState(DEFAULT_FOCUS["Database Management Systems"]);
  const [difficulty, setDifficulty] = useState("Medium");

  // Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simSteps, setSimSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [status, setStatus] = useState("idle"); // idle, running, completed, exceeded
  const [tokensUsed, setTokensUsed] = useState(0);
  const [promptTokens, setPromptTokens] = useState(0);
  const [completionTokens, setCompletionTokens] = useState(0);
  
  // Results
  const [finalOutput, setFinalOutput] = useState(null);
  const [activeTab, setActiveTab] = useState("assessment");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [openTrays, setOpenTrays] = useState({});

  // Doubt Chat
  const [doubtText, setDoubtText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Sync default focus when subject changes
  useEffect(() => {
    setStudentGap(DEFAULT_FOCUS[subject] || "");
  }, [subject]);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const toggleTray = (idx) => {
    setOpenTrays(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleQuizAnswer = (quizIdx, optionChar) => {
    if (quizScore !== null) return; // quiz submitted
    setSelectedAnswers(prev => ({ ...prev, [quizIdx]: optionChar }));
  };

  const submitQuiz = (quizzes) => {
    let score = 0;
    quizzes.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        score++;
      }
    });
    setQuizScore(score);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizScore(null);
  };

  // Run Backend or Frontend Simulation
  const triggerSimulation = async () => {
    setIsSimulating(true);
    setSimSteps([]);
    setCurrentStepIndex(-1);
    setStatus("running");
    setTokensUsed(0);
    setPromptTokens(0);
    setCompletionTokens(0);
    setFinalOutput(null);
    setChatMessages([]);
    setSelectedAnswers({});
    setQuizScore(null);

    const payload = {
      subject,
      architecture,
      max_tokens: parseInt(maxTokens),
      student_gap: studentGap,
      difficulty
    };

    try {
      // Attempt backend API call
      const res = await fetch("http://localhost:8000/api/v1/agent/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Backend unavailable, falling back to local simulation");
      }

      const data = await res.json();
      runStepByStepUI(data);
    } catch (err) {
      console.log("Using client-side simulated agent pipeline fallback:", err.message);
      // Run local client-side fallback simulation
      const mockResult = runLocalSimulation(payload);
      runStepByStepUI(mockResult);
    }
  };

  // Run the animated step-by-step UI to mimic agent latency
  const runStepByStepUI = (data) => {
    const totalSteps = data.steps.length;
    let stepIndex = 0;
    
    setSimSteps([]);
    
    const interval = setInterval(() => {
      if (stepIndex < totalSteps) {
        const nextStep = data.steps[stepIndex];
        
        setSimSteps(prev => [...prev, nextStep]);
        setCurrentStepIndex(stepIndex);
        
        // Accumulate tokens live
        let currentPrompt = 0;
        let currentComp = 0;
        for (let i = 0; i <= stepIndex; i++) {
          currentPrompt += data.steps[i].prompt_tokens;
          currentComp += data.steps[i].completion_tokens;
        }
        setPromptTokens(currentPrompt);
        setCompletionTokens(currentComp);
        setTokensUsed(currentPrompt + currentComp);

        // Auto open the current tray
        setOpenTrays(prev => ({ ...prev, [stepIndex]: true }));
        
        if (nextStep.exceeded) {
          setStatus("exceeded");
          setIsSimulating(false);
          clearInterval(interval);
        } else {
          stepIndex++;
        }
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        if (data.success) {
          setStatus("completed");
          setFinalOutput(data.final_output);
          setActiveTab("assessment");
          // Initialize chat
          setChatMessages([
            {
              sender: "agent",
              text: `Hello! I am the Doubt Solver Agent 💬. I have indexed the custom guide on "${topicsList[0]}". You have ${maxTokens - data.total_tokens_used} tokens left in your budget. Ask me any doubts about this subject!`
            }
          ]);
        } else {
          setStatus("exceeded");
        }
      }
    }, 1500); // 1.5 seconds delay per agent step
  };

  // Get topic list based on subject
  const topicsList = useMemo(() => {
    const db = CLIENT_RAG_DATABASE[subject] || CLIENT_RAG_DATABASE["Database Management Systems"];
    return Object.keys(db.concepts);
  }, [subject]);

  // Local Client-Side Agent Simulation logic
  const runLocalSimulation = (payload) => {
    const db = CLIENT_RAG_DATABASE[payload.subject] || CLIENT_RAG_DATABASE["Database Management Systems"];
    const topics = Object.keys(db.concepts);
    const mockSteps = [];
    let accumTokens = 0;
    let totalPrompt = 0;
    let totalComp = 0;
    let success = true;

    const createLocalStep = (agent, action, query, chunk, thoughts, output) => {
      const fullPrompt = `SYSTEM: You are the ${agent} specializing in ${action}. Align with student.\nUSER: Context: ${chunk || "None"}. Gap: ${payload.student_gap}.`;
      const pTokens = Math.ceil(fullPrompt.length / 4);
      const cTokens = Math.ceil((thoughts.length + output.length) / 4);
      const stepTotal = pTokens + cTokens;
      const exceeds = (accumTokens + stepTotal) > payload.max_tokens;

      if (exceeds) {
        success = false;
        const allowed = payload.max_tokens - accumTokens;
        const compAllowed = Math.max(0, allowed - pTokens);
        const truncated = output.substring(0, compAllowed * 4) + "... [TRUNCATED - TOKEN LIMIT EXCEEDED]";
        
        accumTokens += pTokens + compAllowed;
        totalPrompt += pTokens;
        totalComp += compAllowed;
        
        return {
          agent,
          action,
          rag_query: query,
          retrieved_chunk: chunk ? chunk.substring(0, 150) + "..." : null,
          prompt_snippet: fullPrompt.substring(0, 200) + "...",
          thoughts: thoughts.substring(0, 80) + "... [Halted]",
          output: truncated,
          prompt_tokens: pTokens,
          completion_tokens: compAllowed,
          step_tokens: pTokens + compAllowed,
          exceeded: true
        };
      }

      accumTokens += stepTotal;
      totalPrompt += pTokens;
      totalComp += cTokens;

      return {
        agent,
        action,
        rag_query: query,
        retrieved_chunk: chunk,
        prompt_snippet: fullPrompt,
        thoughts,
        output,
        prompt_tokens: pTokens,
        completion_tokens: cTokens,
        step_tokens: stepTotal,
        exceeded: false
      };
    };

    // Step 1: Assessment Agent
    const chunk1 = `Concept definition: ${db.concepts[topics[0]]}. Quizzes: ${db.quizzes.length}`;
    const thoughts1 = `Diagnosing knowledge gaps on '${payload.student_gap}' at ${payload.difficulty} level. Formulating a test pulled from RAG.`;
    const quizList = db.quizzes.map(q => ({
      topic: q.topic,
      question: q.question,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation
    }));
    const out1 = `DIAGNOSTIC REPORT\nStudent Focus: ${payload.student_gap}\nGap: Student shows potential gap in fundamental definitions of '${topics[0]}'. Select questions from RAG index.`;

    const step1 = createLocalStep("Assessment Agent 🕵️", "Knowledge Gap Analysis", `Fetch diagnostic test for ${payload.student_gap}`, chunk1, thoughts1, out1);
    mockSteps.push(step1);

    if (!success) {
      return { success: false, total_tokens_used: accumTokens, prompt_tokens: totalPrompt, completion_tokens: totalComp, steps: mockSteps, final_output: null };
    }

    // Step 2: Planner Agent
    const chunk2 = `Prerequisite rule: Topics sequence: ${topics.join(", ")}. Primary gaps first.`;
    const thoughts2 = `Assessment flagged gaps in '${topics[0]}'. Reaching to RAG for sequencing modules based on logical prerequisites.`;
    const modules = topics.map((t, idx) => ({
      module_id: `M${idx+1}`,
      topic: t,
      duration: idx === 0 ? "1.5 weeks" : "1 week",
      priority: idx < 2 ? "High" : "Medium",
      focus: `Drill core concepts of ${t} with practice problems.`
    }));
    const out2 = `CURRICULUM SEQUENCING PLAN\nRecommended Schedule:\n` + modules.map((m, i) => `${i+1}. ${m.topic} (${m.duration}) [Priority: ${m.priority}]`).join("\n");

    const step2 = createLocalStep("Planner Agent 📅", "Curriculum Sequencing", `Fetch learning path guidelines for ${payload.subject}`, chunk2, thoughts2, out2);
    mockSteps.push(step2);

    if (!success) {
      return { success: false, total_tokens_used: accumTokens, prompt_tokens: totalPrompt, completion_tokens: totalComp, steps: mockSteps, final_output: null };
    }

    // Step 3: Content Synthesis Agent
    const chunk3 = db.concepts[topics[0]] || "Concept data";
    const thoughts3 = `Simplifying textbook content for '${topics[0]}' to create a custom study guide. Adding standard analogies and key takeaways.`;
    let guide = `# Complete Study Guide: ${topics[0]}\n\n## Conceptual Overview\n${chunk3}\n\n## Real-World Analogy\nThink of ${topics[0]} like organizing tools in a workshop. Instead of putting all tools in a single massive drawer (which forces you to dig around and creates duplicates), you distribute them into labeled trays based on function. Each tool has exactly one designated spot.\n\n## Key Takeaways\n- Cuts redundancy and ensures data consistency.\n- Solves common insertion, updates and deletion anomalies.\n- Creates clean structural design.`;
    
    const step3 = createLocalStep("Content Synthesis Agent ✍️", "Tailored Content Generation", `Retrieve textbooks explanation for ${topics[0]}`, chunk3, thoughts3, guide);
    mockSteps.push(step3);

    if (!success) {
      return { success: false, total_tokens_used: accumTokens, prompt_tokens: totalPrompt, completion_tokens: totalComp, steps: mockSteps, final_output: null };
    }

    // Architecture adjustment steps
    if (payload.architecture === "orchestrator") {
      const thoughtsOrch = "Curriculum Director reviewing Assessment gaps, Planner sequencing and Synthesis guide. Merging into student workbook.";
      const outOrch = "=== CURRICULUM WORKBOOK COMPILATION ===\nWorkbook compiled successfully. Verified content sequence. Gap resolved.";
      const stepOrch = createLocalStep("Orchestration Director 👑", "Workbook Consolidation", null, null, thoughtsOrch, outOrch);
      mockSteps.push(stepOrch);
      if (!success) {
        return { success: false, total_tokens_used: accumTokens, prompt_tokens: totalPrompt, completion_tokens: totalComp, steps: mockSteps, final_output: null };
      }
    } else if (payload.architecture === "collaborative") {
      const thoughtsCollab1 = "Assessment Agent reviewing Planner's schedule. Suggesting adding 0.5 weeks to the initial normalization module since the student failed core quiz questions.";
      const outCollab1 = "Adjustment Action: First module extended by 0.5 weeks for foundational concepts mastery.";
      const stepCollab1 = createLocalStep("Assessment Agent (Peer Reviewer) 🕵️", "Plan Optimization Loop", null, null, thoughtsCollab1, outCollab1);
      mockSteps.push(stepCollab1);
      if (!success) {
        return { success: false, total_tokens_used: accumTokens, prompt_tokens: totalPrompt, completion_tokens: totalComp, steps: mockSteps, final_output: null };
      }

      const thoughtsCollab2 = "Planner Agent reviewing Content Synthesis guide. Verifying milestones. Recommending a tabular schema example.";
      const outCollab2 = "Update Action: Guide expanded with detailed table decomposition rules.";
      const stepCollab2 = createLocalStep("Planner Agent (Peer Reviewer) 📅", "Content Integrity Verification", null, null, thoughtsCollab2, outCollab2);
      mockSteps.push(stepCollab2);
      if (!success) {
        return { success: false, total_tokens_used: accumTokens, prompt_tokens: totalPrompt, completion_tokens: totalComp, steps: mockSteps, final_output: null };
      }

      guide += "\n\n## Collaborative Peer-Review Enhancement\n### Table Decomposition Example\nConsider a table schema R(A, B, C) with dependencies `A -> B` and `B -> C`.\n- Candidates key is `A`.\n- Dependency `B -> C` violates BCNF since `B` is not a superkey.\n- **Decomposition**: Splitting into sub-tables R1(A, B) and R2(B, C) satisfies BCNF requirements.";
    }

    return {
      success: true,
      total_tokens_used: accumTokens,
      prompt_tokens: totalPrompt,
      completion_tokens: totalComp,
      steps: mockSteps,
      final_output: {
        quiz: quizList,
        plan: modules,
        guide: guide
      }
    };
  };

  // Submit Doubt to Chat
  const handleAskDoubt = async (e) => {
    e.preventDefault();
    if (!doubtText.trim() || isChatLoading) return;

    const userDoubt = doubtText.trim();
    setDoubtText("");
    
    // Add user message
    setChatMessages(prev => [...prev, { sender: "user", text: userDoubt }]);
    setIsChatLoading(true);

    const remainingBudget = maxTokens - tokensUsed;

    const payload = {
      subject,
      guide_context: finalOutput?.guide || "",
      doubt: userDoubt,
      remaining_tokens: remainingBudget
    };

    try {
      const res = await fetch("http://localhost:8000/api/v1/agent/doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Server error");
      }

      const data = await res.json();
      handleDoubtResponse(data);
    } catch (err) {
      console.log("Local doubt solver fallback:", err.message);
      // Run local doubt solver fallback logic
      const localDoubtRes = runLocalDoubtSolver(payload);
      handleDoubtResponse(localDoubtRes);
    }
  };

  const handleDoubtResponse = (data) => {
    setIsChatLoading(false);
    
    if (data.exceeded) {
      setChatMessages(prev => [
        ...prev,
        { sender: "agent", text: `${data.answer}\n\n⚠️ WARNING: Token budget fully depleted during response generation. Chat disabled.` }
      ]);
      setTokensUsed(prev => prev + data.tokens_consumed);
      setStatus("exceeded");
    } else {
      setChatMessages(prev => [...prev, { sender: "agent", text: data.answer }]);
      
      // Update tokens consumed
      setPromptTokens(prev => prev + data.prompt_tokens);
      setCompletionTokens(prev => prev + data.completion_tokens);
      setTokensUsed(prev => prev + data.tokens_consumed);
    }
  };

  // Local doubt solver logic (matching backend)
  const runLocalDoubtSolver = (payload) => {
    const db = CLIENT_RAG_DATABASE[payload.subject] || CLIENT_RAG_DATABASE["Database Management Systems"];
    const query = payload.doubt.toLowerCase();
    
    const pPayload = `Context: ${payload.guide_context.substring(0, 200)}. Doubt: ${payload.doubt}`;
    const pTokens = Math.ceil(pPayload.length / 4);
    
    if (pTokens > payload.remaining_tokens) {
      return {
        success: false,
        exceeded: true,
        tokens_consumed: payload.remaining_tokens,
        prompt_tokens: payload.remaining_tokens,
        completion_tokens: 0,
        answer: "❌ Unable to process. The prompt itself exceeds the remaining token budget."
      };
    }

    let retrieved = "";
    for (const [topic, text] of Object.entries(db.concepts)) {
      const keys = topic.toLowerCase().split(" ");
      if (keys.some(k => k.length > 3 && query.includes(k))) {
        retrieved = text;
        break;
      }
    }
    if (!retrieved) retrieved = Object.values(db.concepts)[0];

    const thoughts = `Doubt: ${payload.doubt}. RAG result: ${retrieved.substring(0, 50)}...`;
    
    let answer = "";
    if (query.includes("bcnf") || query.includes("boyce")) {
      answer = "Boyce-Codd Normal Form (BCNF) is a database normalization form where for every non-trivial functional dependency X -> Y, X must be a superkey. BCNF addresses redundancies that standard 3NF leaves unresolved, particularly when overlapping candidate keys exist.";
    } else if (query.includes("2pl") || query.includes("concurrency") || query.includes("lock")) {
      answer = "Strict 2-Phase Locking (Strict 2PL) is a concurrency control rule. It mandates that a transaction must acquire a lock before read/write operations and hold all exclusive (write) locks until the final commit or abort phase. This blocks other transactions from reading uncommitted data, preventing cascading rollbacks.";
    } else if (query.includes("tree") || query.includes("index") || query.includes("b+")) {
      answer = "B+ Trees are highly efficient indexes because their internal nodes only store navigation keys (no records), achieving massive branching fan-outs. Leaf nodes contain all record pointers and are chained together in a doubly linked list, enabling fast linear range scans in addition to logarithmic search operations.";
    } else if (query.includes("routing") || query.includes("ospf") || query.includes("dijkstra")) {
      answer = "OSPF is a Link-State routing protocol. Routers use flood updates to synchronize their local link databases, constructing a complete network map. Each router then executes Dijkstra's algorithm to compute shortest routes. RIP is a Distance-Vector protocol, using simple hop-counts and sharing tables only with direct neighbors.";
    } else if (query.includes("tcp") || query.includes("udp") || query.includes("handshake")) {
      answer = "TCP is a connection-oriented, reliable transport protocol. It uses a 3-Way Handshake (SYN, SYN-ACK, ACK) to coordinate packet sequences before exchanging data. UDP is connectionless and lightweight, skipping handshake setup and reliability checks to deliver low latency.";
    } else if (query.includes("banker") || query.includes("deadlock")) {
      answer = "The Banker's Algorithm prevents deadlocks by evaluating resource requests. It checks if granting allocation leaves the system in a safe state, verifying that a potential execution sequence exists where all processes can request their maximum resources and safely finish.";
    } else if (query.includes("page") || query.includes("paging") || query.includes("lru")) {
      answer = "Paging maps process virtual pages into physical memory frames. When memory is full, the Least Recently Used (LRU) algorithm swaps out the frame that hasn't been accessed for the longest time, optimizing hit rates based on temporal locality.";
    } else {
      answer = `Regarding your question about "${payload.doubt}": In ${payload.subject}, standard theory tells us that we must analyze dependencies and prerequisites. According to RAG guidelines: ${retrieved.substring(0, 150)}...`;
    }

    const cTokens = Math.ceil((thoughts.length + answer.length) / 4);
    const total = pTokens + cTokens;

    if (total > payload.remaining_tokens) {
      const allowedC = payload.remaining_tokens - pTokens;
      const truncated = answer.substring(0, allowedC * 4) + "... [TRUNCATED - OUT OF TOKENS]";
      return {
        success: false,
        exceeded: true,
        tokens_consumed: pTokens + allowedC,
        prompt_tokens: pTokens,
        completion_tokens: allowedC,
        answer: truncated
      };
    }

    return {
      success: true,
      exceeded: false,
      tokens_consumed: total,
      prompt_tokens: pTokens,
      completion_tokens: cTokens,
      answer
    };
  };

  // Chart data formatting
  const chartData = useMemo(() => {
    return [
      {
        name: "Token Budget",
        "Tokens Used": tokensUsed,
        "Remaining Tokens": Math.max(0, maxTokens - tokensUsed)
      }
    ];
  }, [tokensUsed, maxTokens]);

  const tokenPercent = Math.min(100, Math.round((tokensUsed / maxTokens) * 100)) || 0;
  const isBudgetExceeded = status === "exceeded";

  return (
    <div className="space-y-6">
      {/* Title Header Card */}
      <Card className="p-5 border border-[#1E293B]/10 bg-gradient-to-r from-[#4F46E5]/10 via-white/40 to-[#4F46E5]/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center border border-[#4F46E5]/30">
              <Brain className="h-5 w-5 text-[#4F46E5] animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif text-lg text-[#1E293B]">Curriculum AI Agent Playground</h2>
              <p className="text-xs text-slate-600/80 mt-0.5">
                Simulate a RAG-powered multi-agent pipeline with custom architectures and token limits.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {status === "running" && (
              <span className="flex items-center gap-1.5 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20 px-3 py-1 text-xs text-[#4F46E5]">
                <span className="h-2 w-2 rounded-full bg-[#4F46E5] animate-ping" />
                Executing Pipeline...
              </span>
            )}
            {status === "completed" && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
                Pipeline Success
              </span>
            )}
            {status === "exceeded" && (
              <span className="flex items-center gap-1.5 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 px-3 py-1 text-xs text-[#EF4444]">
                <AlertTriangle className="h-4 w-4" />
                Token Budget Exceeded
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Configuration Panels (5/12) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Settings Card */}
          <Card className="p-5 space-y-4">
            <SectionHeader title="Configuration Controls" sub="Define agent behaviors & token constraints" />
            
            <div className="space-y-4 pt-1">
              {/* Subject Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80 flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5 text-[#4F46E5]" /> Subject Domain
                </label>
                <select
                  disabled={isSimulating}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/40 text-[#1E293B] border border-[#1E293B]/10 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-semibold"
                >
                  {Object.keys(CLIENT_RAG_DATABASE).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Focus Area Gap */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80 flex items-center gap-1">
                  <Sliders className="h-3.5 w-3.5 text-[#4F46E5]" /> Knowledge Gap Focus
                </label>
                <input
                  disabled={isSimulating}
                  type="text"
                  value={studentGap}
                  onChange={(e) => setStudentGap(e.target.value)}
                  placeholder="e.g. Normalization anomalies, routing protocols..."
                  className="w-full bg-white/40 text-[#1E293B] border border-[#1E293B]/10 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                />
              </div>

              {/* Difficulty Level */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80">
                  Student Level (Difficulty)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Beginner", "Medium", "Hard"].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      disabled={isSimulating}
                      onClick={() => setDifficulty(lvl)}
                      className={`text-xs py-2 rounded-xl border transition-all cursor-pointer font-semibold ${
                        difficulty === lvl
                          ? "bg-[#4F46E5]/10 border-[#4F46E5] text-[#4F46E5]"
                          : "bg-white/40 border-[#1E293B]/10 text-slate-600/80 hover:text-[#1E293B] hover:bg-white/60"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Architecture Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80">
                  Agent Coordination Architecture
                </label>
                <div className="space-y-2">
                  {/* Linear Chain */}
                  <button
                    type="button"
                    disabled={isSimulating}
                    onClick={() => setArchitecture("linear")}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      architecture === "linear"
                        ? "bg-[#4F46E5]/5 border-[#4F46E5]/40 ring-1 ring-[#4F46E5]/20"
                        : "bg-white/30 border-[#1E293B]/10 hover:bg-white/50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="mt-0.5 h-4 w-4 rounded-full border-2 border-[#4F46E5] flex items-center justify-center shrink-0">
                      {architecture === "linear" && <div className="h-2 w-2 rounded-full bg-[#4F46E5]" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1E293B]">Linear Chain</p>
                      <p className="text-[10px] text-slate-600/80 mt-0.5 leading-relaxed">
                        Sequential flow (Assessment ➡️ Planner ➡️ Synthesis). Highly token-efficient with minimal oversight feedback.
                      </p>
                    </div>
                  </button>

                  {/* Orchestrator-Worker */}
                  <button
                    type="button"
                    disabled={isSimulating}
                    onClick={() => setArchitecture("orchestrator")}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      architecture === "orchestrator"
                        ? "bg-[#A855F7]/5 border-[#A855F7]/40 ring-1 ring-[#A855F7]/20"
                        : "bg-white/30 border-[#1E293B]/10 hover:bg-white/50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="mt-0.5 h-4 w-4 rounded-full border-2 border-[#A855F7] flex items-center justify-center shrink-0">
                      {architecture === "orchestrator" && <div className="h-2 w-2 rounded-full bg-[#A855F7]" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1E293B]">Orchestrator-Worker</p>
                      <p className="text-[10px] text-slate-600/80 mt-0.5 leading-relaxed">
                        Orchestration Director 👑 delegates tasks, reviews outputs, and aggregates them into a clean final workbook.
                      </p>
                    </div>
                  </button>

                  {/* Collaborative Multi-Agent */}
                  <button
                    type="button"
                    disabled={isSimulating}
                    onClick={() => setArchitecture("collaborative")}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      architecture === "collaborative"
                        ? "bg-[#10B981]/5 border-[#10B981]/40 ring-1 ring-[#10B981]/20"
                        : "bg-white/30 border-[#1E293B]/10 hover:bg-white/50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="mt-0.5 h-4 w-4 rounded-full border-2 border-[#10B981] flex items-center justify-center shrink-0">
                      {architecture === "collaborative" && <div className="h-2 w-2 rounded-full bg-[#10B981]" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1E293B]">Collaborative Multi-Agent</p>
                      <p className="text-[10px] text-slate-600/80 mt-0.5 leading-relaxed">
                        Interactive peer review loops (🕵️ 🔄 📅 🔄 ✍️). Agents crosscheck outputs to optimize and refine final products. High token cost.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Token Budget Slider */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80 flex items-center gap-1">
                    <Sliders className="h-3 w-3 text-[#4F46E5]" /> Token Budget (N)
                  </label>
                  <span className="text-xs font-bold text-[#4F46E5] font-mono">{maxTokens} tokens</span>
                </div>
                <div className="flex gap-4">
                  <input
                    disabled={isSimulating}
                    type="range"
                    min="500"
                    max="6000"
                    step="100"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="flex-1 h-1.5 bg-[#1E293B]/10 rounded-lg cursor-pointer appearance-none accent-[#4F46E5] self-center"
                  />
                  <input
                    disabled={isSimulating}
                    type="number"
                    min="500"
                    max="8000"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Math.max(500, parseInt(e.target.value) || 500))}
                    className="w-20 bg-white/40 text-[#1E293B] border border-[#1E293B]/10 rounded-xl p-1.5 text-xs text-center font-mono focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <p className="text-[9px] text-slate-600/80">
                  💡 Est. Costs: Linear (~1000–1500), Orchestrator (~1800–2200), Collaborative (~3000–4500).
                </p>
              </div>

              {/* Run Trigger */}
              <button
                type="button"
                onClick={triggerSimulation}
                disabled={isSimulating}
                className="w-full mt-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#3D5FC4] hover:from-[#4F46E5]/90 hover:to-[#3D5FC4]/90 text-[#FDFBF7] py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#4F46E5]/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSimulating ? (
                  <>
                    <RotateCcw className="h-4 w-4 animate-spin" />
                    Simulating Agents...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 shrink-0 fill-current" />
                    Run AI Agent Simulation
                  </>
                )}
              </button>
            </div>
          </Card>

          {/* Coordination Visualizer Card */}
          <Card className="p-5 space-y-4">
            <SectionHeader title="Pipeline Visualizer" sub="Active Agent Node Coordination" />
            
            <div className="border border-[#1E293B]/10 bg-white/30 rounded-xl p-4 flex flex-col items-center justify-center min-h-[180px]">
              {architecture === "linear" && (
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="flex items-center gap-3">
                    <NodeBox label="Assessment Agent" active={currentStepIndex === 0} icon="🕵️" activeColor="border-[#4F46E5]" />
                    <ArrowRight className={`h-4 w-4 ${currentStepIndex >= 1 ? "text-[#4F46E5]" : "text-slate-600/80"}`} />
                    <NodeBox label="Planner Agent" active={currentStepIndex === 1} icon="📅" activeColor="border-[#4F46E5]" />
                    <ArrowRight className={`h-4 w-4 ${currentStepIndex >= 2 ? "text-[#4F46E5]" : "text-slate-600/80"}`} />
                    <NodeBox label="Synthesis Agent" active={currentStepIndex === 2} icon="✍️" activeColor="border-[#4F46E5]" />
                  </div>
                  <p className="text-[10px] text-slate-600/80 text-center">
                    Data flows strictly left to right without cycles.
                  </p>
                </div>
              )}

              {architecture === "orchestrator" && (
                <div className="w-full flex flex-col items-center gap-3 py-1">
                  <NodeBox label="Orchestrator Director" active={currentStepIndex === 3} icon="👑" activeColor="border-[#A855F7] shadow-[#A855F7]/10" />
                  
                  <div className="flex items-center justify-between w-full max-w-[340px] mt-2 relative">
                    <div className="absolute left-[30px] right-[30px] top-0 border-t border-dashed border-[#1E293B]/10" />
                    <NodeBox label="Assessment" active={currentStepIndex === 0} icon="🕵️" activeColor="border-[#A855F7]" />
                    <NodeBox label="Planner" active={currentStepIndex === 1} icon="📅" activeColor="border-[#A855F7]" />
                    <NodeBox label="Synthesis" active={currentStepIndex === 2} icon="✍️" activeColor="border-[#A855F7]" />
                  </div>
                  <p className="text-[10px] text-slate-600/80 text-center mt-1">
                    Director coordinates, assigns tasks, and collects worker outputs.
                  </p>
                </div>
              )}

              {architecture === "collaborative" && (
                <div className="flex flex-col items-center gap-3 py-1 w-full">
                  <div className="flex items-center justify-around w-full max-w-[280px]">
                    <NodeBox label="Assessment Agent" active={currentStepIndex === 0 || currentStepIndex === 3} icon="🕵️" activeColor="border-[#10B981] shadow-[#10B981]/10" />
                    <NodeBox label="Planner Agent" active={currentStepIndex === 1 || currentStepIndex === 4} icon="📅" activeColor="border-[#10B981] shadow-[#10B981]/10" />
                  </div>
                  <div className="h-6 w-32 border-l border-r border-dashed border-[#1E293B]/10 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[#10B981] font-semibold animate-pulse">
                      Peer Review Loop
                    </div>
                  </div>
                  <NodeBox label="Content Synthesis Agent" active={currentStepIndex === 2} icon="✍️" activeColor="border-[#10B981] shadow-[#10B981]/10" />
                  <p className="text-[10px] text-slate-600/80 text-center">
                    Agents verify each other's plans and enhance definitions iteratively.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Dashboards & Runs (7/12) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Token Dashboard & Visual Meter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* circular progress gauge */}
            <Card className="p-4 md:col-span-5 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80 mb-3">Token Usage Gauge</p>
              
              <div className="relative h-28 w-28 flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(30,41,59,0.06)" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={isBudgetExceeded ? "#EF4444" : tokenPercent > 80 ? "#F59E0B" : "#4F46E5"}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - tokenPercent / 100)}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center z-10">
                  <p className="text-xs font-mono text-slate-600/80">Used</p>
                  <p className="text-base font-bold font-mono text-[#1E293B] mt-0.5">{tokensUsed}</p>
                  <p className="text-[9px] text-slate-600/80 mt-0.5 font-mono">{tokenPercent}%</p>
                </div>
              </div>

              <p className="text-[10px] text-slate-600/80 mt-3">
                Budget: <span className="font-mono text-[#1E293B] font-semibold">{maxTokens}</span> tokens
              </p>
            </Card>

            {/* Stacked Bar Chart */}
            <Card className="p-4 md:col-span-7 flex flex-col justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80 mb-1">Token Space Breakdown</p>
              
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis type="number" domain={[0, maxTokens]} hide />
                    <YAxis type="category" dataKey="name" hide />
                    <ChartTooltip
                      cursor={false}
                      contentStyle={{ backgroundColor: "#FDFBF7", border: "1px solid rgba(30,41,59,0.1)", borderRadius: "8px" }}
                      itemStyle={{ color: "#1E293B", fontSize: "11px" }}
                      labelStyle={{ display: "none" }}
                    />
                    <Bar dataKey="Tokens Used" stackId="a" fill={isBudgetExceeded ? "#EF4444" : "#4F46E5"} radius={[0, 0, 0, 0]}>
                      <Cell fill={isBudgetExceeded ? "#EF4444" : "#4F46E5"} />
                    </Bar>
                    <Bar dataKey="Remaining Tokens" stackId="a" fill="rgba(30,41,59,0.06)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between text-center mt-2 border-t border-[#1E293B]/10 pt-2">
                <div>
                  <p className="text-[9px] text-slate-600/80">Prompt</p>
                  <p className="text-xs font-semibold text-[#4F46E5] font-mono">{promptTokens}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-600/80">Completion</p>
                  <p className="text-xs font-semibold text-[#F59E0B] font-mono">{completionTokens}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-600/80">Remaining</p>
                  <p className="text-xs font-semibold text-[#10B981] font-mono">{Math.max(0, maxTokens - tokensUsed)}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Live Terminal & Logs */}
          <Card className="p-5 flex flex-col min-h-[350px] max-h-[500px]">
            <div className="flex items-center justify-between border-b border-[#1E293B]/10 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#4F46E5]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">Agent Execution Terminal</h4>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600/80 font-mono">
                <span className={`h-1.5 w-1.5 rounded-full ${isSimulating ? "bg-[#4F46E5] animate-pulse" : "bg-slate-500"}`} />
                {status === "idle" && "READY"}
                {status === "running" && "SIMULATING..."}
                {status === "completed" && "SUCCESS"}
                {status === "exceeded" && "HALTED"}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-3 font-mono text-xs text-[#1E293B]">
              {simSteps.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-600/80 space-y-2">
                  <Database className="h-8 w-8 opacity-40" />
                  <p>No active session. Select config parameters and launch.</p>
                </div>
              )}

              {simSteps.map((step, idx) => {
                const isOpen = !!openTrays[idx];
                return (
                  <div key={idx} className={`rounded-xl border border-[#1E293B]/10 overflow-hidden bg-white/40 transition-all ${step.exceeded ? "border-[#EF4444]/40" : ""}`}>
                    {/* Header */}
                    <div
                      onClick={() => toggleTray(idx)}
                      className={`flex items-center justify-between p-3 cursor-pointer select-none hover:bg-white/60 ${step.exceeded ? "bg-[#EF4444]/5" : "bg-white/30"}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold">{idx + 1}</span>
                        <div>
                          <p className="font-semibold text-xs text-[#4F46E5]">{step.agent}</p>
                          <p className="text-[10px] text-slate-600/80">{step.action}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] bg-white/40 border border-[#1E293B]/10 rounded px-1.5 py-0.5 text-slate-600/80 font-mono">
                          {step.step_tokens} tokens
                        </span>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-slate-600/80" /> : <ChevronDown className="h-4 w-4 text-slate-600/80" />}
                      </div>
                    </div>

                    {/* Expandable Tray content */}
                    {isOpen && (
                      <div className="p-3.5 border-t border-[#1E293B]/10 space-y-3 bg-white/20">
                        {/* RAG query */}
                        {step.rag_query && (
                          <div className="space-y-1 bg-white/10 border border-[#1E293B]/10 p-2 rounded-lg">
                            <p className="text-[9px] text-[#4F46E5] uppercase tracking-wider font-semibold">🔍 RAG Retrieval Query</p>
                            <p className="text-[10px] text-[#1E293B]">{step.rag_query}</p>
                            {step.retrieved_chunk && (
                              <div className="mt-1.5 border-t border-[#1E293B]/10 pt-1.5">
                                <p className="text-[9px] text-[#10B981] uppercase tracking-wider font-semibold">📂 Retrieved Reference Context</p>
                                <p className="text-[10px] text-slate-600/80 leading-relaxed italic">{step.retrieved_chunk}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Internal Monologue */}
                        <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/10 p-2.5 rounded-lg">
                          <p className="text-[9px] text-[#F59E0B] uppercase tracking-wider font-bold">🧠 Agent Internal Thoughts</p>
                          <p className="text-[10px] text-[#1E293B] leading-relaxed italic mt-0.5">{step.thoughts}</p>
                        </div>

                        {/* Output */}
                        <div className="space-y-1">
                          <p className="text-[9px] text-slate-600/80 uppercase tracking-wider font-semibold">📄 Generated Response</p>
                          <pre className="text-[10px] bg-slate-950 p-3 rounded-lg border border-white/[0.06] text-[#10B981] whitespace-pre-wrap leading-relaxed">
                            {step.output}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {isBudgetExceeded && (
                <div className="rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/10 p-4 space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-[#EF4444]">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="font-bold uppercase tracking-wider">FATAL: Token Limit Exceeded!</p>
                  </div>
                  <p className="text-xs text-[#1E293B] leading-relaxed leading-normal font-sans">
                    The agent pipeline consumed <span className="font-mono text-red-400 font-bold">{tokensUsed}</span> tokens, crossing the budget boundary of <span className="font-mono text-[#EF4444] font-bold">{maxTokens}</span>. Execution has been terminated to prevent unbounded LLM costs.
                  </p>
                  <p className="text-[10px] text-slate-600/80 font-sans">
                    💡 Suggestion: Raise the token limit or switch to a lighter coordination architecture (e.g. Linear Chain).
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Final Workspace Panel (Quiz, Path, Guide, Doubt Solver) */}
      {finalOutput && (
        <Card className="p-5 space-y-4 border border-[#10B981]/25 bg-gradient-to-b from-white/45 to-[#10B981]/[0.02] animate-fade-in">
          <div className="flex items-center gap-2 border-b border-[#1E293B]/10 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab("assessment")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === "assessment"
                  ? "bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20"
                  : "text-slate-600/80 hover:text-[#1E293B]"
              }`}
            >
              📋 Diagnostic Assessment
            </button>
            <button
              onClick={() => setActiveTab("planner")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === "planner"
                  ? "bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20"
                  : "text-slate-600/80 hover:text-[#1E293B]"
              }`}
            >
              🗺️ Learning Schedule
            </button>
            <button
              onClick={() => setActiveTab("guide")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === "guide"
                  ? "bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20"
                  : "text-slate-600/80 hover:text-[#1E293B]"
              }`}
            >
              📘 Custom Synthesized Guide
            </button>
            <button
              onClick={() => setActiveTab("doubt")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === "doubt"
                  ? "bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20"
                  : "text-slate-600/80 hover:text-[#1E293B]"
              }`}
            >
              💬 Doubt Solver Chat
            </button>
          </div>

          <div className="pt-2 min-h-[300px]">
            {/* Tab 1: Diagnostic Quiz */}
            {activeTab === "assessment" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#1E293B]">Diagnostic Evaluation Questions</h3>
                  <p className="text-xs text-slate-600/80 mt-0.5">
                    Quizzes extracted from RAG index based on gaps. Check your level.
                  </p>
                </div>

                <div className="space-y-4">
                  {finalOutput.quiz.map((q, qIdx) => (
                    <div key={qIdx} className="border border-[#1E293B]/10 bg-white/30 p-4 rounded-xl space-y-3">
                      <p className="text-xs font-semibold text-[#1E293B] leading-relaxed">
                        Q{qIdx + 1}: {q.question} <span className="ml-2 text-[10px] text-[#4F46E5] bg-[#4F46E5]/15 px-2 py-0.5 rounded-full font-sans uppercase font-bold">{q.topic}</span>
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const optChar = opt[0];
                          const isSelected = selectedAnswers[qIdx] === optChar;
                          const showCorrect = quizScore !== null && optChar === q.answer;
                          const showIncorrect = quizScore !== null && isSelected && selectedAnswers[qIdx] !== q.answer;
                          
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleQuizAnswer(qIdx, optChar)}
                              className={`p-2.5 rounded-xl border text-left text-xs leading-relaxed transition cursor-pointer font-medium ${
                                showCorrect
                                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 font-semibold"
                                  : showIncorrect
                                  ? "bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444]"
                                  : isSelected
                                  ? "bg-[#4F46E5]/10 border-[#4F46E5] text-[#4F46E5] font-semibold"
                                  : "bg-white/40 border-[#1E293B]/10 text-slate-600/80 hover:bg-white/60"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizScore !== null && (
                        <div className="mt-2 p-3 bg-white/40 border-l-2 border-[#4F46E5] rounded-r-lg text-[11px] text-slate-600/80 leading-relaxed">
                          <strong className="text-[#1E293B]">Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 border-t border-[#1E293B]/10 pt-4">
                  {quizScore === null ? (
                    <button
                      type="button"
                      onClick={() => submitQuiz(finalOutput.quiz)}
                      disabled={Object.keys(selectedAnswers).length < finalOutput.quiz.length}
                      className="px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-[#FDFBF7] font-semibold text-xs shadow-md shadow-[#4F46E5]/10 disabled:opacity-50 cursor-pointer"
                    >
                      Submit Evaluation answers
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 w-full justify-between">
                      <p className="text-xs font-semibold text-[#1E293B]">
                        Your Score: <span className="text-[#4F46E5] font-bold font-mono">{quizScore}</span> / {finalOutput.quiz.length} Correct
                      </p>
                      <button
                        type="button"
                        onClick={resetQuiz}
                        className="px-4 py-2 rounded-xl bg-white/40 border border-[#1E293B]/10 hover:bg-white/60 text-xs font-semibold text-[#1E293B] cursor-pointer"
                      >
                        Reset Quiz
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Study Plan */}
            {activeTab === "planner" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#1E293B]">Sequenced Syllabus Roadmaps</h3>
                  <p className="text-xs text-slate-600/80 mt-0.5">
                    Chronological study paths calculated based on diagnosed gaps.
                  </p>
                </div>

                <div className="relative border-l border-[#1E293B]/10 ml-3 pl-5 py-2 space-y-6">
                  {finalOutput.plan.map((m, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full bg-[#FDFBF7] border-2 border-[#4F46E5] flex items-center justify-center">
                        <span className="h-1 w-1 rounded-full bg-[#4F46E5]" />
                      </span>
                      
                      <div className="border border-[#1E293B]/10 bg-white/30 p-4 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#4F46E5] font-mono">{m.module_id}: {m.topic}</p>
                          <span className={`text-[9px] px-2 py-0.5 font-bold rounded-full uppercase ${
                            m.priority === "High" ? "bg-[#EF4444]/10 text-[#EF4444]" : "bg-[#F59E0B]/10 text-[#F59E0B]"
                          }`}>
                            {m.priority} Priority
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600/80 mt-1">{m.focus}</p>
                        <p className="text-[10px] text-slate-600/80 flex items-center gap-1 font-mono pt-1">
                          <Clock className="h-3 w-3 text-[#4F46E5]" /> Duration: {m.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Synthesized Guide */}
            {activeTab === "guide" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#1E293B]/10 pb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1E293B]">Synthesized Custom Study Guide</h3>
                    <p className="text-xs text-slate-600/80 mt-0.5">
                      Tailored explanations compiled dynamically from RAG textbooks.
                    </p>
                  </div>
                </div>

                <div className="bg-white/30 p-5 rounded-xl border border-[#1E293B]/10 font-sans text-xs text-[#1E293B] leading-relaxed space-y-4 select-text">
                  {finalOutput.guide.split("\n\n").map((para, pIdx) => {
                    if (para.startsWith("# ")) {
                      return <h2 key={pIdx} className="text-sm font-serif font-bold text-[#4F46E5] mt-2 border-b border-[#1E293B]/10 pb-1.5">{para.replace("# ", "")}</h2>;
                    }
                    if (para.startsWith("## ")) {
                      return <h3 key={pIdx} className="text-xs font-semibold text-[#4F46E5] mt-3">{para.replace("## ", "")}</h3>;
                    }
                    if (para.startsWith("### ")) {
                      return <h4 key={pIdx} className="text-xs font-medium text-[#F59E0B] italic mt-2">{para.replace("### ", "")}</h4>;
                    }
                    if (para.startsWith("- ")) {
                      return (
                        <ul key={pIdx} className="list-disc pl-5 space-y-1">
                          {para.split("\n").map((li, lIdx) => (
                            <li key={lIdx}>{li.replace("- ", "")}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={pIdx} className="leading-relaxed">{para}</p>;
                  })}
                </div>
              </div>
            )}

            {/* Tab 4: Doubt Solver Chat */}
            {activeTab === "doubt" && (
              <div className="space-y-4 flex flex-col h-[400px]">
                <div>
                  <h3 className="text-sm font-semibold text-[#1E293B]">Interactive Doubt Solver</h3>
                  <p className="text-xs text-slate-600/80 mt-0.5">
                    Ask follow-up questions about the material. Each query dynamically consumes from the remaining token budget.
                  </p>
                </div>

                {/* Messages bubble box */}
                <div className="flex-1 border border-[#1E293B]/10 bg-white/30 rounded-xl p-4 overflow-y-auto space-y-3 font-sans text-xs">
                  {chatMessages.map((msg, mIdx) => (
                    <div key={mIdx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#4F46E5] text-[#FDFBF7] rounded-br-none"
                          : "bg-white/40 border border-[#1E293B]/10 text-[#1E293B] rounded-bl-none font-mono"
                      }`}>
                        {msg.text.split("\n").map((line, lIdx) => (
                          <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/40 border border-[#1E293B]/10 rounded-xl rounded-bl-none px-4 py-2.5 text-slate-600/80 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5] animate-bounce [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5] animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5] animate-bounce" />
                        Thinking...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input form */}
                <form onSubmit={handleAskDoubt} className="flex gap-2">
                  <input
                    disabled={isChatLoading || isBudgetExceeded}
                    type="text"
                    value={doubtText}
                    onChange={(e) => setDoubtText(e.target.value)}
                    placeholder={
                      isBudgetExceeded
                        ? "OUT OF TOKENS - CHAT DISABLED"
                        : "e.g. Can you explain BCNF candidate keys with an example?..."
                    }
                    className="flex-1 bg-white/40 border border-[#1E293B]/10 rounded-xl px-3 text-xs text-[#1E293B] focus:outline-none focus:border-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  />
                  <button
                    disabled={isChatLoading || isBudgetExceeded || !doubtText.trim()}
                    type="submit"
                    className="h-10 w-10 shrink-0 rounded-xl bg-[#A855F7] hover:bg-[#b567f8] text-white flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

// Simple Helper component for visualizing architecture nodes
function NodeBox({ label, active, icon, activeColor = "border-[#4F46E5]" }) {
  return (
    <div
      className={`border px-3 py-2 rounded-xl text-center select-none shrink-0 transition-all duration-500 flex items-center gap-2 bg-white/40 ${
        active
          ? `border-t-2 ${activeColor} ring-1 ring-[#1E293B]/10 scale-105 bg-white/70 font-semibold`
          : "border-[#1E293B]/10 opacity-50"
      }`}
    >
      <span className="text-xs">{icon}</span>
      <span className="text-[10px] text-[#1E293B] font-mono">{label}</span>
    </div>
  );
}
