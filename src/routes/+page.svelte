<script lang="ts">
    import { onDestroy } from 'svelte';
    import { writable } from 'svelte/store';
    import { fade, fly } from 'svelte/transition';
    import { runCppCode } from '$lib/codeRunner';

    // Vibrant color palette
    const colors = {
        primary: '#3B82F6',      // Bright Blue
        secondary: '#10B981',    // Emerald Green
        danger: '#EF4444',       // Vibrant Red
        warning: '#F59E0B',      // Amber
        background: '#F3F4F6',   // Light Gray
        text: '#1F2937'          // Dark Gray
    };

    // Meta-inspired design colors
    const metaBackground = '#F0F2F5';
    const metaTextPrimary = '#1F2937';
    const metaPrimary = '#1877F2';
    const metaSecondary = '#34C759';
    const metaBorder = '#D1D5DB';

    // Interview questions with more context
    const questions = [
        {
            id: 1,
            title: 'Data Structure Mastery',
            description: 'Craft a robust Stack implementation in C++ showcasing advanced memory management techniques.',
            difficulty: 'Medium',
            points: 40,
            icon: '📦',
            hints: [
                'Implement dynamic memory allocation',
                'Create deep copy constructor',
                'Handle edge cases elegantly'
            ],
            tags: ['Memory Management', 'OOP']
        },
        {
            id: 2,
            title: 'Algorithmic Challenge',
            description: 'Develop an optimized algorithm to find the longest palindromic substring with minimal time complexity.',
            difficulty: 'Hard',
            points: 50,
            icon: '🧩',
            hints: [
                'Explore dynamic programming',
                'Consider center expansion',
                'Optimize time complexity'
            ],
            tags: ['Algorithms', 'Dynamic Programming']
        },
        {
            id: 3,
            title: 'Object-Oriented Design',
            description: 'Engineer a comprehensive Library Management System demonstrating SOLID principles and advanced C++ concepts.',
            difficulty: 'Medium',
            points: 40,
            icon: '📚',
            hints: [
                'Implement polymorphic behavior',
                'Design clean, extensible classes',
                'Add robust error handling'
            ],
            tags: ['System Design', 'OOP']
        }
    ];

    // State management
    const totalTime = 90 * 60;
    const timeRemaining = writable(totalTime);
    const selectedQuestions = writable<number[]>([]);
    const submittedCode = writable<{[key: number]: string}>({});
    const isTestStarted = writable(false);
    const isTestCompleted = writable(false);
    const showHints = writable<{[key: number]: boolean}>({});

    let timerInterval: number;

    function startTest() {
        isTestStarted.set(true);
        timerInterval = setInterval(() => {
            timeRemaining.update(time => {
                if (time <= 0) {
                    clearInterval(timerInterval);
                    isTestCompleted.set(true);
                    return 0;
                }
                return time - 1;
            });
        }, 1000);
    }

    function formatTime(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function selectQuestion(questionId: number) {
        selectedQuestions.update(selected => 
            selected.includes(questionId) 
                ? selected.filter(id => id !== questionId)
                : [...selected, questionId]
        );
    }

    function submitCode(questionId: number, code: string) {
        submittedCode.update(submitted => ({
            ...submitted,
            [questionId]: code
        }));
    }

    function submitTest() {
        clearInterval(timerInterval);
        isTestCompleted.set(true);
    }

    function toggleHints(questionId: number) {
        showHints.update(hints => ({
            ...hints,
            [questionId]: !hints[questionId]
        }));
    }

    onDestroy(() => {
        if (timerInterval) clearInterval(timerInterval);
    });

    let selectedProblem = null;
  
    const codingProblems = [
      {
        id: 1,
        title: "Advanced Graph Pathfinding",
        difficulty: "Hard",
        description: "Design an optimal pathfinding algorithm that can efficiently navigate through a complex weighted graph with multiple constraints. Your solution must handle dynamic graph modifications, support multiple path optimization criteria, and demonstrate advanced algorithmic thinking.",
        example: `
Input: 
- Graph: Weighted directed graph with 10,000 nodes
- Start Node: 0
- End Node: 9999
- Constraints: 
  1. Minimize total path weight
  2. Avoid nodes with specific attributes
  3. Support real-time graph updates

Expected Output:
- Optimal path considering multiple constraints
- Path weight
- Modification timestamp
        `,
        constraints: [
          "Graph size: 10^4 nodes, 10^5 edges",
          "Time Complexity: Better than O(E log V)",
          "Space Complexity: O(V + E)",
          "Must support concurrent graph modifications",
          "Handle disconnected graph scenarios"
        ],
        starterCode: `class AdvancedPathfinder {
public:
    // Advanced graph representation
    struct GraphNode {
        int id;
        vector<pair<int, int>> edges; // {destination, weight}
        unordered_map<string, bool> attributes;
    };

    vector<int> findOptimalPath(
        unordered_map<int, GraphNode>& graph, 
        int startNode, 
        int endNode, 
        vector<string> restrictedAttributes
    ) {
        // Implement your advanced pathfinding algorithm
        // Consider multiple optimization criteria
    }
};`
      },
      {
        id: 2,
        title: "Distributed Consensus Simulator",
        difficulty: "Expert",
        description: "Implement a distributed consensus algorithm that can simulate a robust, fault-tolerant system capable of maintaining data consistency across multiple nodes with Byzantine fault tolerance.",
        example: `
Scenario:
- 7-node distributed system
- Simulate Practical Byzantine Fault Tolerance (PBFT)
- Handle node failures, network partitions
- Maintain consensus with 2f+1 nodes

Expected Behaviors:
- Consistent state across nodes
- Tolerate up to f malicious/failed nodes
- Provide proof of consensus
- Minimal communication overhead
        `,
        constraints: [
          "Implement PBFT or Raft consensus",
          "Support dynamic node addition/removal",
          "Handle network latency and packet loss",
          "Provide cryptographic verification",
          "Time Complexity: O(n^2) message complexity",
          "Demonstrate leader election mechanism"
        ],
        starterCode: `class DistributedConsensusNode {
public:
    enum class NodeState {
        FOLLOWER,
        CANDIDATE,
        LEADER
    };

    struct Message {
        string type;
        int term;
        int candidateId;
        vector<uint8_t> payload;
        vector<uint8_t> signature;
    };

    class ConsensusProtocol {
    public:
        // Implement distributed consensus logic
        bool proposeTransaction(const vector<uint8_t>& transaction) {
            // Byzantine fault-tolerant consensus mechanism
        }

    private:
        // Advanced consensus state management
        vector<DistributedConsensusNode> clusterNodes;
        int currentTerm = 0;
        NodeState currentState = NodeState::FOLLOWER;
    };
};`
      },
      {
        id: 3,
        title: "Machine Learning Optimization Framework",
        difficulty: "Expert",
        description: "Create a high-performance machine learning optimization framework that can efficiently implement and compare multiple gradient descent algorithms with advanced regularization techniques.",
        example: `
Optimization Challenges:
- Implement adaptive learning rate methods
- Support multiple regularization techniques
- Handle sparse and dense tensor operations
- Provide performance benchmarking

Performance Metrics:
- Convergence speed
- Memory efficiency
- Numerical stability
- Generalization capability
        `,
        constraints: [
          "Support SGD, Adam, RMSprop algorithms",
          "Implement L1/L2 regularization",
          "Handle large-scale tensor operations",
          "Provide compile-time optimization",
          "Support heterogeneous computing",
          "Minimal runtime overhead"
        ],
        starterCode: `template <typename T, size_t Dimensions>
class MLOptimizationFramework {
public:
    enum class OptimizerType {
        STOCHASTIC_GRADIENT_DESCENT,
        ADAM,
        RMSPROP
    };

    enum class RegularizationType {
        L1,
        L2,
        ELASTIC_NET
    };

    class TensorOperations {
    public:
        // Advanced tensor manipulation
        static Tensor<T, Dimensions> computeGradient(
            const Tensor<T, Dimensions>& parameters,
            const Tensor<T, Dimensions>& loss,
            OptimizerType optimizer,
            RegularizationType regularization
        ) {
            // Implement high-performance gradient computation
        }
    };
};`
      }
    ];

    // Code execution and testing state
    const executionResult = writable({
      status: 'not_run',
      output: '',
      error: '',
      loading: false
    });

    const testCaseStore = writable([
      { input: [], expectedOutput: [], description: '' }
    ]);

    let userCode = '';
    let testCases = [];
    let testResults = [];

    $: if (selectedProblem) {
      userCode = selectedProblem.starterCode;
    }

    async function runCode() {
      // Reset previous result and set loading
      executionResult.set({
        status: 'running',
        output: '',
        error: '',
        loading: true
      });

      try {
        // Validate code is not empty
        if (!userCode.trim()) {
          executionResult.set({
            status: 'error',
            output: '',
            error: 'Please write some code before running.',
            loading: false
          });
          return;
        }

        // Run the code using the code runner
        const result = await runCppCode(userCode);

        if (result.success) {
          executionResult.set({
            status: 'success',
            output: result.output,
            error: '',
            loading: false
          });
        } else {
          executionResult.set({
            status: 'error',
            output: '',
            error: result.output || 'Execution failed',
            loading: false
          });
        }
      } catch (error) {
        executionResult.set({
          status: 'error',
          output: '',
          error: error instanceof Error ? error.message : 'Unknown error',
          loading: false
        });
      }
    }

    function submitSolution() {
      // Validate solution before submission
      if (!userCode.trim()) {
        alert('Please write a solution before submitting.');
        return;
      }

      // Simulate solution submission
      const submissionResult = {
        success: true,
        message: 'Solution submitted successfully!',
        score: calculateScore()
      };

      alert(submissionResult.message);
    }

    function calculateScore() {
      // Basic scoring mechanism
      const complexityScore = userCode.length < 50 ? 'Low' : 
                               userCode.length < 100 ? 'Medium' : 'High';
      return {
        complexity: complexityScore,
        efficiency: 'Pending review'
      };
    }
</script>

<div class="min-h-screen bg-meta-background text-meta-text-primary">
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-12 gap-6">
      <!-- Problem List Sidebar -->
      <div class="col-span-3 bg-white rounded-meta shadow-meta-light p-4">
        <h2 class="text-xl font-bold mb-4">Coding Problems</h2>
        <div class="space-y-4">
          {#each codingProblems as problem}
            <button 
              type="button"
              class="w-full text-left bg-meta-background p-3 rounded-meta hover:shadow-meta-light transition-shadow cursor-pointer"
              class:bg-meta-primary={selectedProblem?.id === problem.id}
              class:text-white={selectedProblem?.id === problem.id}
              on:click={() => selectedProblem = problem}
              on:keydown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  selectedProblem = problem;
                }
              }}
              role="option"
              aria-selected={selectedProblem?.id === problem.id}
            >
              <h3 class="font-semibold">{problem.title}</h3>
              <span class="text-sm" 
                class:text-green-600={problem.difficulty === 'Easy'}
                class:text-yellow-600={problem.difficulty === 'Medium'}
                class:text-red-600={problem.difficulty === 'Hard'}
              >
                {problem.difficulty}
              </span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Problem Details and Code Editor -->
      <div class="col-span-9">
        {#if selectedProblem}
          <div class="bg-white rounded-meta shadow-meta-light p-6">
            <h1 class="text-2xl font-bold mb-4 text-meta-text-primary">
              {selectedProblem.title}
            </h1>
            
            <div class="bg-meta-background p-4 rounded-meta mb-4">
              <h3 class="font-bold mb-2">Problem Description</h3>
              <p>{selectedProblem.description}</p>
            </div>

            <div class="bg-meta-background p-4 rounded-meta mb-4">
              <h3 class="font-bold mb-2">Example</h3>
              <pre class="bg-white p-3 rounded-meta text-sm">{selectedProblem.example}</pre>
            </div>

            <div class="bg-meta-background p-4 rounded-meta mb-4">
              <h3 class="font-bold mb-2">Constraints</h3>
              <ul class="list-disc pl-5">
                {#each selectedProblem.constraints as constraint}
                  <li>{constraint}</li>
                {/each}
              </ul>
            </div>

            <h3 class="font-bold mb-2">Your Solution</h3>
            <textarea 
              bind:value={userCode}
              class="w-full min-h-[300px] p-4 border border-meta-border rounded-meta focus:outline-none focus:ring-2 focus:ring-meta-primary font-mono"
              placeholder="Write your C++ solution here..."
            ></textarea>

            <!-- Execution Results -->
            {#if $executionResult.status !== 'not_run'}
              <div 
                class="mt-4 p-4 rounded-meta"
                class:bg-green-100={$executionResult.status === 'success'}
                class:bg-red-100={$executionResult.status === 'error'}
                class:bg-yellow-100={$executionResult.loading}
              >
                <h3 class="font-bold mb-2">
                  {#if $executionResult.loading}
                    Running Code...
                  {:else if $executionResult.status === 'success'}
                    Execution Successful
                  {:else}
                    Execution Error
                  {/if}
                </h3>
                
                {#if $executionResult.error}
                  <pre class="text-red-600 text-sm">{$executionResult.error}</pre>
                {/if}
                
                {#if $executionResult.output}
                  <div class="bg-white p-3 rounded-meta mt-2">
                    <h4 class="font-semibold mb-2">Output:</h4>
                    <pre class="text-sm overflow-x-auto">{$executionResult.output}</pre>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="bg-white rounded-meta shadow-meta-light p-6 text-center">
            <p class="text-meta-text-secondary">Select a problem to get started</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  /* Meta-inspired design styles */
  .bg-meta-background {
    background-color: #F0F2F5;
  }
  .text-meta-text-primary {
    color: #1F2937;
  }
  .bg-meta-primary {
    background-color: #1877F2;
  }
  .border-meta-border {
    border-color: #D1D5DB;
  }
  .rounded-meta {
    border-radius: 0.5rem;
  }
  .shadow-meta-light {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
</style>
