from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import math
import random
import time

router = APIRouter()

# Mock RAG database containing rich content, quiz questions, and prerequisites
RAG_DATABASE = {
    "Database Management Systems": {
        "concepts": {
            "ER Modeling & Relational Mapping": (
                "Entity-Relationship (ER) model describes data as entities, relationships, and attributes. "
                "Entity sets can be strong or weak. Mapping rules: Strong entity sets become tables with corresponding attributes. "
                "Weak entity sets become tables with a composite primary key consisting of the owner's primary key and the weak entity's discriminator. "
                "For 1:N relationships, the primary key of the '1'-side is mapped as a foreign key into the 'N'-side table. "
                "For M:N relationships, a new join-table is created containing the primary keys of both participating entity sets."
            ),
            "Normalization (1NF to BCNF)": (
                "Normalization is the process of structuring relational databases to reduce data redundancy and improve data integrity. "
                "First Normal Form (1NF) requires all attribute values to be atomic. "
                "Second Normal Form (2NF) requires a table to be in 1NF and have no partial dependencies (every non-prime attribute must depend on the whole candidate key). "
                "Third Normal Form (3NF) requires a table to be in 2NF and have no transitive dependencies (X -> Y and Y -> Z where Z depends on X transitively). "
                "Boyce-Codd Normal Form (BCNF) is a stronger version of 3NF: for every non-trivial functional dependency X -> Y, X must be a superkey."
            ),
            "SQL Queries & Joins": (
                "Structured Query Language (SQL) uses joins to combine records from multiple tables. "
                "INNER JOIN returns rows when there is a match in both tables. "
                "LEFT OUTER JOIN returns all rows from the left table, and matched rows from the right table; unmatched right columns are NULL. "
                "RIGHT OUTER JOIN is the reverse. FULL OUTER JOIN returns all rows when there is a match in either table. "
                "Subqueries are nested queries inside a larger query, often used in WHERE, FROM, or SELECT clauses. "
                "GROUP BY aggregates data, and HAVING filters aggregated groups, unlike WHERE which filters raw rows."
            ),
            "Transactions & Concurrency Control": (
                "A transaction is a single logical unit of database work. Transactions must satisfy ACID properties: "
                "Atomicity (all or nothing), Consistency (preserves database integrity), Isolation (transactions execute independently), and Durability (survives crashes). "
                "Concurrency control avoids anomalies like dirty reads, non-repeatable reads, and phantom reads. "
                "Two-Phase Locking (2PL) has a Growing phase (locks acquired) and a Shrinking phase (locks released). "
                "Strict 2PL releases all exclusive locks only at transaction commit/abort, which prevents cascading rollbacks. "
                "Deadlocks occur when transactions wait in a cyclic queue; resolved by detection (wait-for graphs) or prevention (timestamp ordering, wound-wait)."
            ),
            "Storage & B+ Tree Indexing": (
                "Indexing reduces the number of disk accesses. B+ Tree is an N-ary self-balancing search tree. "
                "In a B+ Tree, leaf nodes contain all data records (or pointers to them) and are linked sequentially for fast range scans. "
                "Internal nodes store only keys and child pointers, maximizing fan-out and keeping depth low (typically 3-4 levels for millions of records). "
                "This ensures O(log N) lookup, insertion, and deletion times, making B+ Trees highly efficient for large database files."
            )
        },
        "quizzes": [
            {
                "topic": "ER Modeling & Relational Mapping",
                "question": "How is a weak entity set mapped into a relational schema?",
                "options": [
                    "A) As a standalone table with a simple auto-incremented primary key.",
                    "B) As a table with a composite primary key consisting of the owner's primary key and the weak entity's discriminator.",
                    "C) It is merged directly into the owner entity's table as nullable columns.",
                    "D) As a separate table, but it does not have any foreign key references."
                ],
                "answer": "B",
                "explanation": "Weak entities do not have sufficient attributes to form a primary key. They require the owner entity's primary key along with their own discriminator (partial key) to create a composite primary key."
            },
            {
                "topic": "Normalization (1NF to BCNF)",
                "question": "A relation R(A, B, C, D) has functional dependencies A -> B and B -> C. If the primary key is A, is R in 3NF or BCNF?",
                "options": [
                    "A) Yes, it is in both 3NF and BCNF because A is a superkey.",
                    "B) It is in 3NF but not BCNF because B is not a superkey.",
                    "C) It is not in 3NF (and therefore not in BCNF) because of the transitive dependency A -> B -> C.",
                    "D) It is in 2NF only, as there are no partial dependencies."
                ],
                "answer": "C",
                "explanation": "Because A -> B and B -> C hold, non-prime attribute C transitively depends on primary key A via B. This violates 3NF, which prohibits transitive dependencies."
            },
            {
                "topic": "Transactions & Concurrency Control",
                "question": "Why does Strict Two-Phase Locking (Strict 2PL) prevent cascading aborts?",
                "options": [
                    "A) It prevents all concurrent executions entirely.",
                    "B) It releases shared locks early before acquiring exclusive locks.",
                    "C) It holds all exclusive (write) locks until the transaction commits or aborts, ensuring no other transaction reads uncommitted data.",
                    "D) It dynamically checks for deadlock cycles."
                ],
                "answer": "C",
                "explanation": "By holding exclusive write locks until commit/abort, other transactions cannot read dirty (uncommitted) data, eliminating the need to rollback dependent transactions if the original transaction aborts."
            }
        ]
    },
    "Computer Networks": {
        "concepts": {
            "Physical Layer & Data Link Protocols": (
                "The Physical Layer transmits raw bits over physical mediums. Data Link Layer groups bits into frames and handles hop-to-hop delivery. "
                "Flow control ensures a fast sender doesn't overwhelm a slow receiver. Error control uses CRC checksums or parity. "
                "Protocols include Stop-and-Wait, Go-Back-N (sliding window with cumulative ACKs), and Selective Repeat (buffers out-of-order frames, resends only NAK'd ones). "
                "CSMA/CD is used in Ethernet for collision detection, while CSMA/CA is used in Wi-Fi for collision avoidance."
            ),
            "IP Addressing & Routing Protocols": (
                "IP layer manages host-to-host delivery. IPv4 uses 32-bit addresses. Subnetting uses CIDR masks (e.g. 192.168.1.0/24). "
                "NAT allows private IP networks to share a single public IP. Routing protocols determine paths. "
                "Intradomain: Link-State (OSPF, uses Dijkstra's algorithm, builds full topology maps) and Distance-Vector (RIP, uses Bellman-Ford, shares routing tables with neighbors). "
                "Interdomain: BGP (Path Vector protocol, manages routing between autonomous systems based on policies)."
            ),
            "TCP/UDP & Congestion Control": (
                "Transport layer handles process-to-process delivery. UDP is connectionless, unreliable, and fast. "
                "TCP is connection-oriented, reliable, and byte-stream based. TCP connection is established via 3-way handshake (SYN, SYN-ACK, ACK) and terminated via 4-way handshake. "
                "TCP Congestion Control prevents network collapse using: Slow Start (double congestion window cwnd every RTT), "
                "Congestion Avoidance (increase cwnd by 1 MSS per RTT once ssthresh is reached), Fast Retransmit (resend after 3 duplicate ACKs), and Fast Recovery."
            )
        },
        "quizzes": [
            {
                "topic": "IP Addressing & Routing Protocols",
                "question": "Which of the following describes OSPF (Open Shortest Path First)?",
                "options": [
                    "A) Distance-vector protocol that uses hop count as metric.",
                    "B) Link-state protocol that uses Dijkstra's algorithm to compute the shortest path tree.",
                    "C) Path-vector protocol used to route traffic between autonomous systems.",
                    "D) Application layer protocol for host auto-configuration."
                ],
                "answer": "B",
                "explanation": "OSPF is a link-state routing protocol. Every router floods link-state advertisements (LSAs) to build a complete network topology map, then executes Dijkstra's algorithm locally."
            },
            {
                "topic": "TCP/UDP & Congestion Control",
                "question": "During TCP congestion control, what happens immediately upon receiving 3 duplicate ACKs?",
                "options": [
                    "A) TCP enters Slow Start, resetting congestion window (cwnd) to 1.",
                    "B) TCP halts communication and waits for a timeout.",
                    "C) TCP triggers Fast Retransmit: resends the missing segment, sets ssthresh to cwnd/2, and enters Fast Recovery.",
                    "D) TCP increases the window exponentially."
                ],
                "answer": "C",
                "explanation": "Receiving 3 duplicate ACKs indicates that a segment was lost but subsequent segments arrived. TCP resends the lost packet immediately (Fast Retransmit) and adjusts window sizes without resetting to 1."
            }
        ]
    },
    "Operating Systems": {
        "concepts": {
            "Process Synchronization & Semaphores": (
                "Processes interact via IPC. Synchronization prevents race conditions in critical sections. "
                "Criteria: Mutual Exclusion, Progress, and Bounded Waiting. Semaphores are integer variables accessed via atomic wait() / signal() operations. "
                "Binary semaphore (mutex) is 0 or 1. Counting semaphore ranges arbitrarily. "
                "Classic synchronization problems: Producer-Consumer (bounded buffer), Readers-Writers (starvation risk), and Dining Philosophers."
            ),
            "CPU Scheduling & Deadlock Prevention": (
                "CPU Scheduling selects ready processes. Algorithms: FCFS, SJF (optimal average wait time), Round Robin (time slices, good responsiveness), Priority. "
                "Deadlocks occur when processes hold resources while waiting for others in a cycle. "
                "Four necessary conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. "
                "Deadlock Prevention breaks one condition. Deadlock Avoidance uses Banker's Algorithm (checks if allocating resources leaves database/system in a safe state)."
            ),
            "Paging, Segmentation & VM": (
                "Memory management. Paging divides memory into fixed-size frames and process address spaces into pages. "
                "Page table maps pages to frames; TLB is a fast hardware cache for page translation. Page faults load missing pages from disk. "
                "Page replacement algorithms: FIFO, Optimal (replace page unused for longest time), and LRU (Least Recently Used). "
                "Thrashing occurs when a process spends more time paging than executing, resolved by working-set models."
            )
        },
        "quizzes": [
            {
                "topic": "CPU Scheduling & Deadlock Prevention",
                "question": "What is the primary criteria checked by the Banker's Algorithm during deadlock avoidance?",
                "options": [
                    "A) Whether there is enough physical memory to load the process.",
                    "B) If the allocation of resources will keep the system in a 'safe state' where all processes can eventually complete.",
                    "C) If a circular wait cycle exists in the allocation graph.",
                    "D) Whether preemption can be applied to the resource."
                ],
                "answer": "B",
                "explanation": "Banker's Algorithm dynamically simulates the allocation of requested resources. It checks if there exists an execution sequence that allows all processes to finish safely. If yes, the state is safe and allocation is granted."
            },
            {
                "topic": "Paging, Segmentation & VM",
                "question": "What is thrashing in virtual memory systems?",
                "options": [
                    "A) When a process runs out of stack memory and aborts.",
                    "B) When a hard drive fails due to excessive reads.",
                    "C) When a process spends more time swapping pages in and out of disk than executing instructions, caused by insufficient physical frames.",
                    "D) High-speed caching of page translation tables."
                ],
                "answer": "C",
                "explanation": "Thrashing occurs when the total size of active pages (working set) exceeds physical memory. The OS constantly experiences page faults and swaps frames, leading to near-zero CPU throughput."
            }
        ]
    },
    "Algorithms": {
        "concepts": {
            "Asymptotic Notation & Recurrences": (
                "Algorithm analysis. Big-O describes upper bounds, Omega lower bounds, Theta tight bounds. "
                "Recurrences express running time of recursive functions (e.g. T(N) = 2T(N/2) + O(N) for Merge Sort). "
                "Master Theorem solves recurrences of form T(N) = aT(N/b) + f(N). "
                "Three cases compare f(N) with N^(log_b a) to find dominant terms."
            ),
            "Greedy & Dynamic Programming": (
                "Optimization techniques. Greedy makes locally optimal choices at each step, hoping for a global optimum (e.g., Huffman Coding, Kruskal's MST). "
                "Dynamic Programming (DP) solves problems with overlapping subproblems and optimal substructure. "
                "DP stores subproblem solutions (memoization or tabulation) to avoid redundant computations. "
                "Examples: Longest Common Subsequence (LCS), 0/1 Knapsack, Matrix Chain Multiplication."
            ),
            "Graph Traversals & MSTs": (
                "Breadth-First Search (BFS) uses a queue, finds shortest paths in unweighted graphs. "
                "Depth-First Search (DFS) uses a stack/recursion, useful for topological sorting and strongly connected components. "
                "Minimum Spanning Trees (MST) connect all vertices with minimum total edge weight. "
                "Kruskal's Algorithm: sorts edges, uses Disjoint-Set union-find to avoid cycles. "
                "Prim's Algorithm: grows tree from a start vertex, uses a priority queue."
            )
        },
        "quizzes": [
            {
                "topic": "Asymptotic Notation & Recurrences",
                "question": "Using the Master Theorem, what is the asymptotic complexity of T(N) = 4T(N/2) + O(N)?",
                "options": [
                    "A) O(N)",
                    "B) O(N log N)",
                    "C) O(N^2)",
                    "D) O(2^N)"
                ],
                "answer": "C",
                "explanation": "Here, a=4, b=2. N^(log_b a) = N^(log_2 4) = N^2. Since f(N) = O(N) is polynomially smaller than N^2, Case 1 of Master Theorem applies, and T(N) = Theta(N^2)."
            },
            {
                "topic": "Greedy & Dynamic Programming",
                "question": "What is the key difference between Dynamic Programming and Divide-and-Conquer?",
                "options": [
                    "A) Dynamic Programming solves problems with overlapping subproblems, whereas Divide-and-Conquer partitions into disjoint subproblems.",
                    "B) Divide-and-Conquer uses tabulation, Dynamic Programming does not.",
                    "C) Dynamic Programming is always faster than Divide-and-Conquer.",
                    "D) Divide-and-Conquer is only used for sorting."
                ],
                "answer": "A",
                "explanation": "Dynamic programming is optimized for problems where subproblems share common subproblems (overlapping). By caching results, DP avoids re-solving them. Divide-and-Conquer solves independent (disjoint) subproblems (e.g. Merge Sort)."
            }
        ]
    }
}


# Pydantic Schemas for Requests and Responses
class SimulationRequest(BaseModel):
    subject: str = Field(..., description="Subject domain, e.g., 'Database Management Systems'")
    architecture: str = Field("linear", description="Agent architecture: 'linear', 'orchestrator', or 'collaborative'")
    max_tokens: int = Field(2000, description="Token budget (N) set by user")
    student_gap: Optional[str] = Field(None, description="Focus topic or perceived gap, e.g., 'weak in Normalization'")
    difficulty: Optional[str] = Field("Medium", description="Target level: 'Beginner', 'Medium', or 'Hard'")

class DoubtRequest(BaseModel):
    subject: str
    guide_context: str = Field(..., description="The synthesized guide text")
    doubt: str = Field(..., description="Student's query or doubt")
    remaining_tokens: int = Field(..., description="The remaining token budget")

# Helper function to generate simulated token usage and logs
def create_agent_step(
    agent_name: str,
    action: str,
    rag_query: Optional[str],
    retrieved_content: Optional[str],
    thoughts: str,
    output: str,
    accumulated_tokens: int,
    max_tokens: int
) -> Dict[str, Any]:
    # Formulate a mock prompt payload that would be sent to the LLM
    system_prompt = f"You are the {agent_name} specializing in {action}. Align with student needs."
    user_payload = f"Context: {retrieved_content or 'None'}. Gaps & Goals. Generate detailed insights."
    full_prompt = f"SYSTEM: {system_prompt}\nUSER: {user_payload}"
    
    prompt_tokens = math.ceil(len(full_prompt) / 4)
    completion_tokens = math.ceil((len(thoughts) + len(output)) / 4)
    step_tokens = prompt_tokens + completion_tokens
    
    is_halted = (accumulated_tokens + step_tokens) > max_tokens
    
    if is_halted:
        # Exceeded token limits - truncate output, simulate overflow
        allowable_tokens = max_tokens - accumulated_tokens
        completion_allowed = max(0, allowable_tokens - prompt_tokens)
        truncated_output = output[:completion_allowed * 4] + "... [TRUNCATED - TOKEN LIMIT EXCEEDED]"
        step_tokens = prompt_tokens + completion_allowed
        
        return {
            "agent": agent_name,
            "action": action,
            "rag_query": rag_query,
            "retrieved_chunk": retrieved_content[:200] + "..." if retrieved_content else None,
            "prompt_snippet": full_prompt[:250] + "...",
            "thoughts": thoughts[:100] + "... [Halted]",
            "output": truncated_output,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_allowed,
            "step_tokens": step_tokens,
            "exceeded": True
        }
    
    return {
        "agent": agent_name,
        "action": action,
        "rag_query": rag_query,
        "retrieved_chunk": retrieved_content,
        "prompt_snippet": full_prompt,
        "thoughts": thoughts,
        "output": output,
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
        "step_tokens": step_tokens,
        "exceeded": False
    }


@router.post("/simulate")
def simulate_agent_pipeline(req: SimulationRequest):
    subject = req.subject
    arch = req.architecture.lower()
    max_tokens = req.max_tokens
    student_gap = req.student_gap or "General subject review"
    difficulty = req.difficulty or "Medium"
    
    # Verify subject exists in database, fallback to DBMS
    if subject not in RAG_DATABASE:
        subject = "Database Management Systems"
        
    db = RAG_DATABASE[subject]
    
    # Setup step lists
    steps = []
    total_prompt_tokens = 0
    total_completion_tokens = 0
    accumulated_tokens = 0
    
    # Extract topics list for plan sequencing
    topics_list = list(db["concepts"].keys())
    
    # ----------------------------------------------------
    # PHASE 1: ASSESSMENT AGENT
    # ----------------------------------------------------
    # RAG lookup for quizzes and concept maps
    rag_query_1 = f"Fetch active diagnostic questions and learning criteria for {student_gap} in {subject}."
    retrieved_content_1 = f"Concept definitions: {db['concepts'][topics_list[0]]}. Quiz banks count: {len(db['quizzes'])}."
    
    assessment_thoughts = (
        f"Identifying student gaps regarding '{student_gap}' at {difficulty} difficulty. "
        "Evaluating prior knowledge. Formulating assessment questions. "
        "Based on RAG, I will select relevant diagnostic questions to probe depth."
    )
    
    # Generate quiz question list
    quiz_items = []
    for q in db["quizzes"]:
        quiz_items.append({
            "topic": q["topic"],
            "question": q["question"],
            "options": q["options"],
            "answer": q["answer"],
            "explanation": q["explanation"]
        })
        
    assessment_output = (
        f"DIAGNOSTIC REPORT\n"
        f"Student Interest: {student_gap}\n"
        f"Target Difficulty: {difficulty}\n"
        f"Identified Gap: Student demonstrates weak retention in '{topics_list[0]}' and '{topics_list[1] if len(topics_list)>1 else student_gap}'. "
        f"Here are the diagnostic items pulled from RAG to assess these gaps."
    )
    
    step_1 = create_agent_step(
        agent_name="Assessment Agent 🕵️",
        action="Knowledge Gap Analysis",
        rag_query=rag_query_1,
        retrieved_content=retrieved_content_1,
        thoughts=assessment_thoughts,
        output=assessment_output,
        accumulated_tokens=accumulated_tokens,
        max_tokens=max_tokens
    )
    
    steps.append(step_1)
    accumulated_tokens += step_1["step_tokens"]
    total_prompt_tokens += step_1["prompt_tokens"]
    total_completion_tokens += step_1["completion_tokens"]
    
    if step_1["exceeded"]:
        return {
            "success": False,
            "status": "token_limit_exceeded",
            "total_tokens_used": accumulated_tokens,
            "prompt_tokens": total_prompt_tokens,
            "completion_tokens": total_completion_tokens,
            "steps": steps,
            "final_output": None
        }

    # ----------------------------------------------------
    # PHASE 2: PLANNER AGENT
    # ----------------------------------------------------
    # Planner queries RAG for prerequisites to sequence curriculum
    rag_query_2 = f"Retrieve prerequisite trees and structure path templates for {subject} based on diagnosed gaps."
    retrieved_content_2 = f"Prerequisite rules: Topics sequence: {', '.join(topics_list)}. Priority order: High weightage first."
    
    planner_thoughts = (
        f"Assessment reports gaps in '{topics_list[0]}'. I must design a step-by-step sequencing plan. "
        "I'll search RAG database for prerequisites. 'Normalization' requires 'ER modeling'. "
        "Sequencing must put fundamentals first, then build up to advanced nodes."
    )
    
    # Build plan output
    study_plan_modules = []
    for idx, topic in enumerate(topics_list):
        study_plan_modules.append({
            "module_id": f"M{idx+1}",
            "topic": topic,
            "duration": "1.5 weeks" if idx < 2 else "1 week",
            "priority": "High" if idx < 2 else "Medium",
            "focus": f"Review key definitions of {topic} and practice core problems."
        })
        
    planner_output = (
        f"CURRICULUM SEQUENCING PLAN\n"
        f"Suggested Path:\n"
        + "\n".join([f"- Step {i+1}: {m['topic']} ({m['duration']}) [Priority: {m['priority']}]" for i, m in enumerate(study_plan_modules)])
    )
    
    step_2 = create_agent_step(
        agent_name="Planner Agent 📅",
        action="Curriculum Sequencing",
        rag_query=rag_query_2,
        retrieved_content=retrieved_content_2,
        thoughts=planner_thoughts,
        output=planner_output,
        accumulated_tokens=accumulated_tokens,
        max_tokens=max_tokens
    )
    
    steps.append(step_2)
    accumulated_tokens += step_2["step_tokens"]
    total_prompt_tokens += step_2["prompt_tokens"]
    total_completion_tokens += step_2["completion_tokens"]
    
    if step_2["exceeded"]:
        return {
            "success": False,
            "status": "token_limit_exceeded",
            "total_tokens_used": accumulated_tokens,
            "prompt_tokens": total_prompt_tokens,
            "completion_tokens": total_completion_tokens,
            "steps": steps,
            "final_output": None
        }

    # ----------------------------------------------------
    # PHASE 3: CONTENT SYNTHESIS AGENT
    # ----------------------------------------------------
    # Content synthesis queries RAG for reference paragraphs and simplifies them
    rag_query_3 = f"Pull detailed textbooks paragraphs and tutorial templates for '{topics_list[0]}'."
    retrieved_content_3 = db["concepts"].get(topics_list[0], "No concept text available.")
    
    synthesis_thoughts = (
        f"Retrieving standard text for '{topics_list[0]}' to generate a simplified, high-fidelity guide. "
        "Simplifying academic definitions using relatable analogies, schema examples, and takeaways tailored to "
        f"the {difficulty} level student."
    )
    
    # Synthesize guide
    synthesized_guide = (
        f"# Complete Study Guide: {topics_list[0]}\n\n"
        f"## Conceptual Overview\n"
        f"{retrieved_content_3}\n\n"
        f"## Real-World Analogy\n"
        f"Think of {topics_list[0]} like sorting books in a library. "
        f"Instead of throwing all books onto a single pile (which creates clutter and duplication), "
        f"you classify them by genre and author, ensuring each book has exactly one logical place.\n\n"
        f"## Key Takeaways\n"
        f"- Reduces storage footprint by eliminating redundant data copies.\n"
        f"- Eliminates insertion, deletion, and update anomalies.\n"
        f"- Promotes structural integrity of databases."
    )
    
    step_3 = create_agent_step(
        agent_name="Content Synthesis Agent ✍️",
        action="Tailored Content Generation",
        rag_query=rag_query_3,
        retrieved_content=retrieved_content_3,
        thoughts=synthesis_thoughts,
        output=synthesized_guide,
        accumulated_tokens=accumulated_tokens,
        max_tokens=max_tokens
    )
    
    steps.append(step_3)
    accumulated_tokens += step_3["step_tokens"]
    total_prompt_tokens += step_3["prompt_tokens"]
    total_completion_tokens += step_3["completion_tokens"]
    
    if step_3["exceeded"]:
        return {
            "success": False,
            "status": "token_limit_exceeded",
            "total_tokens_used": accumulated_tokens,
            "prompt_tokens": total_prompt_tokens,
            "completion_tokens": total_completion_tokens,
            "steps": steps,
            "final_output": None
        }

    # ----------------------------------------------------
    # ARCHITECTURE ADJUSTMENTS & ORCHESTRATION EXTRA STEPS
    # ----------------------------------------------------
    if arch == "orchestrator":
        # Orchestrator runs a compilation step
        orchestrator_thoughts = (
            "As the Curriculum Director, I am reviewing the outputs from the Assessment, Planner, and "
            "Content Synthesis workers. I will compile them into a unified, consolidated student workbook."
        )
        orchestrator_output = (
            f"=== CURRICULUM WORKBOOK COMPILATION ===\n"
            f"Director Review: Gap assessment was correct. Plan fits logical dependencies. "
            f"Synthesized explanation maps directly to standard syllabus. Ready to output."
        )
        step_orch = create_agent_step(
            agent_name="Orchestration Director 👑",
            action="Workbook Consolidation",
            rag_query=None,
            retrieved_content=None,
            thoughts=orchestrator_thoughts,
            output=orchestrator_output,
            accumulated_tokens=accumulated_tokens,
            max_tokens=max_tokens
        )
        steps.append(step_orch)
        accumulated_tokens += step_orch["step_tokens"]
        total_prompt_tokens += step_orch["prompt_tokens"]
        total_completion_tokens += step_orch["completion_tokens"]
        
        if step_orch["exceeded"]:
            return {
                "success": False,
                "status": "token_limit_exceeded",
                "total_tokens_used": accumulated_tokens,
                "prompt_tokens": total_prompt_tokens,
                "completion_tokens": total_completion_tokens,
                "steps": steps,
                "final_output": None
            }

    elif arch == "collaborative":
        # Collaborative runs peer review loops
        collab_thoughts_1 = (
            "Assessment Agent peer-reviews the Plan. I suggest allocating more time to the first module "
            "since the student failed the primary normalization diagnostic question."
        )
        collab_output_1 = (
            "Plan Adjusted: M1 duration increased by 0.5 weeks to ensure proper concept foundation."
        )
        step_collab_1 = create_agent_step(
            agent_name="Assessment Agent (Peer Reviewer) 🕵️",
            action="Plan Optimization Loop",
            rag_query=None,
            retrieved_content=None,
            thoughts=collab_thoughts_1,
            output=collab_output_1,
            accumulated_tokens=accumulated_tokens,
            max_tokens=max_tokens
        )
        steps.append(step_collab_1)
        accumulated_tokens += step_collab_1["step_tokens"]
        total_prompt_tokens += step_collab_1["prompt_tokens"]
        total_completion_tokens += step_collab_1["completion_tokens"]
        
        if step_collab_1["exceeded"]:
            return {
                "success": False,
                "status": "token_limit_exceeded",
                "total_tokens_used": accumulated_tokens,
                "prompt_tokens": total_prompt_tokens,
                "completion_tokens": total_completion_tokens,
                "steps": steps,
                "final_output": None
            }
            
        # Collaborative synthesis validation loop
        collab_thoughts_2 = (
            "Planner Agent reviews synthesized guide. Checking alignment against milestones. "
            "I suggest including a short schema example for 3NF vs BCNF."
        )
        collab_output_2 = (
            "Guide Enhanced:\n"
            "Example Added:\n"
            "Table: R(A, B, C) with FDs: A -> B, B -> C (Violates BCNF because B is not a superkey).\n"
            "Solution: Decompose into R1(A, B) and R2(B, C)."
        )
        step_collab_2 = create_agent_step(
            agent_name="Planner Agent (Peer Reviewer) 📅",
            action="Content Integrity Verification",
            rag_query=None,
            retrieved_content=None,
            thoughts=collab_thoughts_2,
            output=collab_output_2,
            accumulated_tokens=accumulated_tokens,
            max_tokens=max_tokens
        )
        steps.append(step_collab_2)
        accumulated_tokens += step_collab_2["step_tokens"]
        total_prompt_tokens += step_collab_2["prompt_tokens"]
        total_completion_tokens += step_collab_2["completion_tokens"]
        
        if step_collab_2["exceeded"]:
            return {
                "success": False,
                "status": "token_limit_exceeded",
                "total_tokens_used": accumulated_tokens,
                "prompt_tokens": total_prompt_tokens,
                "completion_tokens": total_completion_tokens,
                "steps": steps,
                "final_output": None
            }
            
        # Apply the collaborative updates to the synthesized guide
        synthesized_guide += (
            "\n\n## Collaborative Peer-Review Enhancement\n"
            "### Schema Decomposition Example\n"
            "Consider Relation R(A, B, C) with Functional Dependencies: `A -> B` and `B -> C`.\n"
            "- Candidates keys: `A`.\n"
            "- In dependency `B -> C`, `B` is not a superkey. This violates BCNF.\n"
            "- **Decomposition Solution**: Split the relation into R1(A, B) and R2(B, C) to satisfy BCNF."
        )

    # ----------------------------------------------------
    # FINAL SUCCESS RESPONSE
    # ----------------------------------------------------
    return {
        "success": True,
        "status": "completed",
        "total_tokens_used": accumulated_tokens,
        "prompt_tokens": total_prompt_tokens,
        "completion_tokens": total_completion_tokens,
        "steps": steps,
        "final_output": {
            "quiz": quiz_items,
            "plan": study_plan_modules,
            "guide": synthesized_guide
        }
    }


@router.post("/doubt")
def solve_student_doubt(req: DoubtRequest):
    subject = req.subject
    guide_context = req.guide_context
    doubt = req.doubt.strip().lower()
    rem_tokens = req.remaining_tokens

    # Verify subject exists in database
    if subject not in RAG_DATABASE:
        subject = "Database Management Systems"
        
    db = RAG_DATABASE[subject]
    
    # Calculate prompt size
    prompt_payload = f"Context Guide: {guide_context[:400]}. Doubt: {doubt}"
    prompt_tokens = math.ceil(len(prompt_payload) / 4)
    
    if prompt_tokens > rem_tokens:
        raise HTTPException(status_code=400, detail="Token budget fully depleted! Cannot submit prompt.")
        
    # Search RAG database for matching terms in concepts
    retrieved_chunk = ""
    for topic, text in db["concepts"].items():
        # simple keyword match
        keywords = topic.lower().split()
        if any(kw in doubt for kw in keywords if len(kw) > 3) or topic.lower() in doubt:
            retrieved_chunk = text
            break
            
    if not retrieved_chunk:
        # Fallback to first concept
        retrieved_chunk = list(db["concepts"].values())[0]

    # Generate answer
    thoughts = f"Student is asking: '{doubt}'. Searching RAG concepts. Found: {retrieved_chunk[:80]}..."
    
    # Simple templates for answers
    if "bcnf" in doubt or "boyce" in doubt:
        answer = (
            "Boyce-Codd Normal Form (BCNF) requires that for every functional dependency X -> Y, "
            "X must be a superkey of the table. It is stricter than 3NF, which allows X not to be a superkey "
            "if Y is a prime attribute. In BCNF, we eliminate ALL dependencies of prime attributes on non-superkeys."
        )
    elif "2pl" in doubt or "lock" in doubt or "concurrency" in doubt:
        answer = (
            "Two-Phase Locking (2PL) guarantees serializability. It splits locking into a growing phase (acquiring locks) "
            "and a shrinking phase (releasing locks). Strict 2PL prevents cascading aborts by holding all exclusive locks "
            "until commit or abort, so other transactions never read uncommitted data."
        )
    elif "tree" in doubt or "index" in doubt or "b+" in doubt:
        answer = (
            "B+ Trees are balanced search trees. The key reason databases use them is that internal nodes only store keys, "
            "allowing a high branching factor (fan-out) and low tree depth. This minimizes expensive disk reads. "
            "Also, leaf nodes are linked, allowing fast sequential scans."
        )
    elif "routing" in doubt or "ospf" in doubt or "dijkstra" in doubt:
        answer = (
            "OSPF is a Link-State routing protocol. Routers share link states with all other routers. "
            "Each router builds a complete network topology map and runs Dijkstra's algorithm to compute the shortest paths. "
            "Distance-Vector (like RIP) only shares its final routing table with direct neighbors."
        )
    elif "tcp" in doubt or "udp" in doubt or "handshake" in doubt:
        answer = (
            "TCP is a connection-oriented protocol. The 3-Way Handshake establishes a connection via: "
            "1. Client sends SYN (Synchronize seq number).\n"
            "2. Server responds with SYN-ACK.\n"
            "3. Client replies with ACK.\n"
            "This synchronizes packet sequences before actual data flows."
        )
    elif "banker" in doubt or "deadlock" in doubt:
        answer = (
            "The Banker's Algorithm prevents deadlock by checking if allocating resources leaves the system in a safe state. "
            "It checks if there's a sequence of processes that can all successfully complete with their remaining maximum demands "
            "and the currently available resources."
        )
    elif "page" in doubt or "paging" in doubt or "lru" in doubt:
        answer = (
            "Paging splits memory into physical pages (frames). LRU (Least Recently Used) is a page replacement policy "
            "that replaces the page that hasn't been accessed for the longest time, assuming it's the least likely to be needed soon."
        )
    else:
        answer = (
            f"Regarding your query about '{doubt}': In {subject}, it is essential to trace the fundamental concepts. "
            f"Based on RAG references: {retrieved_chunk[:150]}... "
            f"Make sure you solve practice quizzes and verify the prerequisite sequence."
        )
        
    completion_tokens = math.ceil((len(thoughts) + len(answer)) / 4)
    total_tokens = prompt_tokens + completion_tokens
    
    if total_tokens > rem_tokens:
        # Partial response
        allowed_completion = rem_tokens - prompt_tokens
        truncated_answer = answer[:allowed_completion * 4] + "... [TRUNCATED - TOKEN LIMIT EXCEEDED]"
        return {
            "success": False,
            "exceeded": True,
            "tokens_consumed": prompt_tokens + allowed_completion,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": allowed_completion,
            "answer": truncated_answer
        }
        
    return {
        "success": True,
        "exceeded": False,
        "tokens_consumed": total_tokens,
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
        "answer": answer
    }
