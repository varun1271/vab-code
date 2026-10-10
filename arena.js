/**
 * VAB-CODE — GAMIFIED ARENA & USER ACTIVITY SYSTEM
 * Powered by Firebase Auth & Cloud Firestore
 * Features:
 *  - 1-Click Google Sign-In & Profile State
 *  - User Activity Tracking (Streak, Code Runs, Quiz Accuracy)
 *  - Daily 10 MCQ Challenge Arena with Instant Explanations & XP
 *  - Real-time Top 10 Global Leaderboard + Sticky "Your Place" Rank Bar
 *  - Founder / Admin Detection with Exclusive Crown Badge
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC-Z4I_Q7poYS8zYFDMIJnwfSHerlLwc40",
  authDomain: "vab-code.firebaseapp.com",
  projectId: "vab-code",
  storageBucket: "vab-code.firebasestorage.app",
  messagingSenderId: "432586298963",
  appId: "1:432586298963:web:71179d6459f5eefe26d8a6",
  measurementId: "G-3ZFZLNQ9WZ"
};

// Master Admin Whitelist (Founder Varun Reddy)
const ADMIN_EMAILS = [
  "varun1271@gmail.com",
  "yedugurivarun@gmail.com",
  "reddyvarun1271@gmail.com"
];

// Curated Daily MCQ Question Bank (50+ Engineering & Programming Questions)
// Automatically rotates 10 unique questions every 24 hours based on calendar date
const QUESTION_BANK = [
  // --- PYTHON ---
  {
    id: "q1",
    lang: "Python",
    q: "What is the output of `print(type(1/1))` in Python 3?",
    options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "SyntaxError"],
    ans: 1,
    exp: "In Python 3, `/` always performs true floating-point division returning a float (1.0)."
  },
  {
    id: "q2",
    lang: "Python",
    q: "What will `bool([])` evaluate to in Python?",
    options: ["True", "False", "None", "TypeError"],
    ans: 1,
    exp: "In Python, empty collections (lists, tuples, dicts, strings) evaluate to False in boolean context."
  },
  {
    id: "q3",
    lang: "Python",
    q: "What will `[1, 2, 3] * 2` produce in Python?",
    options: ["[2, 4, 6]", "[1, 2, 3, 1, 2, 3]", "[[1, 2, 3], [1, 2, 3]]", "TypeError"],
    ans: 1,
    exp: "Multiplying a list by integer n duplicates the elements n times: [1, 2, 3, 1, 2, 3]."
  },
  {
    id: "q4",
    lang: "Python",
    q: "What is the result of `\"python\"[::-1]` in Python?",
    options: ["\"nohtyp\"", "\"python\"", "IndexError", "\"p\""],
    ans: 0,
    exp: "Negative step slicing `[::-1]` reverses a string in Python."
  },
  {
    id: "q5",
    lang: "Python",
    q: "Which keyword is used to create an anonymous inline function in Python?",
    options: ["def", "inline", "lambda", "func"],
    ans: 2,
    exp: "`lambda` creates small, anonymous single-expression functions in Python."
  },
  {
    id: "q6",
    lang: "Python",
    q: "What is the time complexity of looking up a key in a standard Python dictionary?",
    options: ["O(n)", "O(log n)", "O(1) average", "O(n log n)"],
    ans: 2,
    exp: "Python dicts are implemented as hash tables, providing O(1) average time lookup."
  },

  // --- C LANGUAGE ---
  {
    id: "q7",
    lang: "C Language",
    q: "What does the expression `*(arr + i)` evaluate to in C?",
    options: ["Address of arr[i]", "Value of arr[i]", "Size of arr", "SyntaxError"],
    ans: 1,
    exp: "In C pointer arithmetic, `*(arr + i)` is syntactically equivalent to array indexing `arr[i]`."
  },
  {
    id: "q8",
    lang: "C Language",
    q: "Which function dynamically allocates memory initialized to zero in C?",
    options: ["malloc()", "calloc()", "realloc()", "zalloc()"],
    ans: 1,
    exp: "`calloc(n, size)` allocates contiguous memory and clears all bytes to zero, unlike `malloc()`."
  },
  {
    id: "q9",
    lang: "C Language",
    q: "What is the size of a `char` in C according to the ANSI C standard?",
    options: ["Always 1 byte", "2 bytes", "4 bytes", "Depends on OS"],
    ans: 0,
    exp: "In C, `sizeof(char)` is strictly defined by the ISO standard to be exactly 1 byte."
  },
  {
    id: "q10",
    lang: "C Language",
    q: "What happens if you don't call `free()` on heap memory allocated with `malloc()`?",
    options: ["Segmentation fault", "Memory leak", "Compilation error", "CPU throttling"],
    ans: 1,
    exp: "Failing to release dynamically allocated heap memory leads to a memory leak."
  },
  {
    id: "q11",
    lang: "C Language",
    q: "What does the `static` keyword do to a global variable in C?",
    options: ["Makes it constant", "Limits its scope to the current file", "Allocates it on stack", "Makes it thread-safe"],
    ans: 1,
    exp: "A static global variable has internal linkage, restricting visibility to its source file."
  },

  // --- C++ & OOP ---
  {
    id: "q12",
    lang: "C++",
    q: "Which STL container guarantees O(1) average time complexity for key lookups?",
    options: ["std::map", "std::vector", "std::unordered_map", "std::set"],
    ans: 2,
    exp: "`std::unordered_map` is a hash table offering O(1) average lookup, whereas `std::map` is a Red-Black tree (O(log n))."
  },
  {
    id: "q13",
    lang: "C++",
    q: "What is the purpose of a `virtual` destructor in a base class in C++?",
    options: ["Speed up execution", "Ensure proper derived class cleanup via base pointer", "Prevent inheritance", "Make class abstract"],
    ans: 1,
    exp: "A virtual destructor ensures that deleting a derived object via a base pointer calls the derived destructor first."
  },
  {
    id: "q14",
    lang: "C++",
    q: "What is the time complexity of pushing an element to the back of `std::vector` (amortized)?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    ans: 0,
    exp: "Vector push_back is O(1) amortized because capacity doubles exponentially during reallocations."
  },
  {
    id: "q15",
    lang: "C++",
    q: "What does the `nullptr` keyword represent in modern C++ (C++11 onwards)?",
    options: ["Integer 0", "Typesafe null pointer constant of type nullptr_t", "Void pointer", "Undefined macro"],
    ans: 1,
    exp: "`nullptr` resolves function overload ambiguities that occurred when using integer 0 or NULL."
  },

  // --- JAVA ---
  {
    id: "q16",
    lang: "Java",
    q: "In Java, what is the default value of an uninitialized instance variable of type `boolean`?",
    options: ["true", "false", "null", "undefined"],
    ans: 1,
    exp: "Instance fields of primitive boolean type in Java default to `false`."
  },
  {
    id: "q17",
    lang: "Java",
    q: "Where are `String` literals stored in memory in Java?",
    options: ["Call Stack", "String Constant Pool inside Heap", "Metaspace Code Cache", "CPU Cache"],
    ans: 1,
    exp: "String literals are deduplicated and cached inside the String Constant Pool on the Java Heap."
  },
  {
    id: "q18",
    lang: "Java",
    q: "Can you instantiate an `interface` directly in Java?",
    options: ["Yes, using new Interface()", "No, interfaces cannot be directly instantiated", "Yes, with static keyword", "Only in Java 17+"],
    ans: 1,
    exp: "Interfaces cannot be instantiated directly; they must be implemented by a class or anonymous inner class."
  },
  {
    id: "q19",
    lang: "Java",
    q: "What is the difference between `==` and `.equals()` when comparing two String objects in Java?",
    options: ["No difference", "`==` compares references, `.equals()` compares content", "`.equals()` compares memory addresses", "`==` checks length only"],
    ans: 1,
    exp: "`==` checks if both references point to the exact same memory address; `.equals()` checks string contents."
  },

  // --- DATA STRUCTURES ---
  {
    id: "q20",
    lang: "Data Structures",
    q: "What is the time complexity of searching for an element in a balanced Binary Search Tree (AVL / Red-Black)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    ans: 1,
    exp: "Because the tree height is balanced (h = O(log n)), search operations take logarithmic time O(log n)."
  },
  {
    id: "q21",
    lang: "Data Structures",
    q: "Which data structure operates on a First-In-First-Out (FIFO) basis?",
    options: ["Stack", "Queue", "Binary Heap", "Hash Table"],
    ans: 1,
    exp: "A Queue processes elements FIFO (First In, First Out); a Stack is LIFO."
  },
  {
    id: "q22",
    lang: "Data Structures",
    q: "What is the worst-case time complexity of inserting a node at the head of a Singly Linked List?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    ans: 0,
    exp: "Inserting at the head takes O(1) because you simply update the new node's next pointer and head pointer."
  },
  {
    id: "q23",
    lang: "Data Structures",
    q: "In a Min-Heap, where is the smallest element always located?",
    options: ["At the deepest leaf", "At the root (index 0)", "At index n/2", "At any node"],
    ans: 1,
    exp: "In a Min-Heap, the root element is guaranteed to be the minimum of all keys in the heap."
  },
  {
    id: "q24",
    lang: "Data Structures",
    q: "Which data structure is optimal for evaluating arithmetic expressions in Postfix notation?",
    options: ["Queue", "Stack", "Binary Search Tree", "Linked List"],
    ans: 1,
    exp: "A Stack naturally evaluates postfix expressions by pushing operands and popping two on encountering an operator."
  },

  // --- ALGORITHMS ---
  {
    id: "q25",
    lang: "Algorithms",
    q: "Which sorting algorithm is guaranteed to be stable and have an O(n log n) worst-case time complexity?",
    options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
    ans: 2,
    exp: "Merge Sort consistently divides arrays in half and merges them in O(n log n) time while maintaining stability."
  },
  {
    id: "q26",
    lang: "Algorithms",
    q: "What prerequisite is strictly required before performing Binary Search on an array?",
    options: ["Array must contain unique elements", "Array must be sorted", "Array must be dynamically allocated", "Array size must be power of 2"],
    ans: 1,
    exp: "Binary search eliminates half the search space on each step, requiring monotonic (sorted) order."
  },
  {
    id: "q27",
    lang: "Algorithms",
    q: "What is the worst-case time complexity of standard Quick Sort?",
    options: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"],
    ans: 2,
    exp: "When the selected pivot is repeatedly the smallest or largest element (e.g. sorted array without random pivot), Quick Sort degrades to O(n^2)."
  },
  {
    id: "q28",
    lang: "Algorithms",
    q: "Which graph traversal algorithm uses a Queue and finds the shortest path in an unweighted graph?",
    options: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Prim's Algorithm", "Floyd-Warshall"],
    ans: 1,
    exp: "BFS explores neighbors level-by-level using a FIFO queue, finding the minimum edge distance in unweighted graphs."
  },
  {
    id: "q29",
    lang: "Algorithms",
    q: "Which paradigm does the 0/1 Knapsack problem typically use to achieve an optimal solution?",
    options: ["Greedy approach", "Dynamic Programming", "Divide & Conquer", "Backtracking only"],
    ans: 1,
    exp: "0/1 Knapsack displays overlapping subproblems and optimal substructure, solved in O(n*W) using Dynamic Programming."
  },

  // --- JAVASCRIPT & WEB ---
  {
    id: "q30",
    lang: "JavaScript",
    q: "What is the output of `console.log(typeof NaN)` in JavaScript?",
    options: ["\"undefined\"", "\"number\"", "\"nan\"", "\"object\""],
    ans: 1,
    exp: "In the IEEE 754 floating-point standard and JavaScript specification, NaN is classified as a numerical value (`number`)."
  },
  {
    id: "q31",
    lang: "JavaScript",
    q: "What does the `===` operator check in JavaScript compared to `==`?",
    options: ["Checks value without coercion and type equality", "Checks memory address only", "Checks string length", "Calls custom equals method"],
    ans: 0,
    exp: "The strict equality operator `===` requires both operand type and value to match without implicit type coercion."
  },
  {
    id: "q32",
    lang: "JavaScript",
    q: "Which Web API method is used to store data with no expiration date in the client's browser?",
    options: ["sessionStorage", "localStorage", "cookie with max-age=0", "indexedCache"],
    ans: 1,
    exp: "`localStorage` persists key-value strings until explicitly cleared by the user or web app."
  },

  // --- OPERATING SYSTEMS ---
  {
    id: "q33",
    lang: "Operating Systems",
    q: "Which condition is NOT one of Coffman's four necessary conditions for Deadlock?",
    options: ["Mutual Exclusion", "Hold and Wait", "Preemption allowed", "Circular Wait"],
    ans: 2,
    exp: "Deadlock requires No Preemption. If preemption is allowed, the OS can forcibly reclaim resources, preventing deadlock."
  },
  {
    id: "q34",
    lang: "Operating Systems",
    q: "What is the primary difference between a Process and a Thread?",
    options: ["Processes share memory, threads do not", "Threads share the address space of their parent process", "Threads take more memory than processes", "Processes cannot run in parallel"],
    ans: 1,
    exp: "Threads within the same process share code, data, and open files, but have their own individual registers and call stacks."
  },
  {
    id: "q35",
    lang: "Operating Systems",
    q: "What is 'Thrashing' in an operating system with Virtual Memory?",
    options: ["Hardware CPU failure", "Excessive page faulting where the OS spends more time swapping than executing", "Disk drive fragmentation", "Network packet loss"],
    ans: 1,
    exp: "Thrashing occurs when active working sets exceed physical RAM, causing constant page swapping and crippling CPU throughput."
  },

  // --- DATABASE & SQL ---
  {
    id: "q36",
    lang: "Database",
    q: "Which SQL clause is used to filter aggregated group records produced by `GROUP BY`?",
    options: ["WHERE", "HAVING", "FILTER", "ORDER BY"],
    ans: 1,
    exp: "`WHERE` filters individual rows before grouping; `HAVING` filters aggregate group values (e.g., HAVING COUNT(*) > 5)."
  },
  {
    id: "q37",
    lang: "Database",
    q: "What does the 'A' stand for in the ACID properties of database transactions?",
    options: ["Availability", "Atomicity", "Accuracy", "Asynchronous"],
    ans: 1,
    exp: "Atomicity guarantees that all statements in a transaction either execute completely or roll back entirely (all-or-nothing)."
  },
  {
    id: "q38",
    lang: "Database",
    q: "Which SQL JOIN returns all rows from the left table, and matched rows from the right table?",
    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
    ans: 1,
    exp: "A LEFT JOIN preserves every row from the left table, populating NULLs for right table columns when no match exists."
  },

  // --- COMPUTER VISION & GRAPHICS ---
  {
    id: "q39",
    lang: "Computer Vision",
    q: "Which OpenCV function is used to convert an RGB/BGR image to Grayscale?",
    options: ["cv2.toGray()", "cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)", "cv2.filterGray()", "cv2.threshold()"],
    ans: 1,
    exp: "`cv2.cvtColor` with `cv2.COLOR_BGR2GRAY` applies perceptual luminance weighting (0.299R + 0.587G + 0.114B)."
  },
  {
    id: "q40",
    lang: "Computer Vision",
    q: "What is the primary purpose of Gaussian Blur filtering in Computer Vision?",
    options: ["Detect edges", "Reduce high-frequency image noise before edge detection", "Sharpen blurred details", "Invert colors"],
    ans: 1,
    exp: "Gaussian blur smooths images by convolving with a Gaussian kernel, removing noise before edge detectors like Canny run."
  },
  {
    id: "q41",
    lang: "Computer Vision",
    q: "What morphological operation is defined as an Erosion followed by a Dilation?",
    options: ["Closing", "Opening", "Gradient", "Top Hat"],
    ans: 1,
    exp: "Morphological Opening (Erosion followed by Dilation) removes small white noise spots while preserving object size."
  },

  // --- ADVANCED LOGIC & CORE CS ---
  {
    id: "q42",
    lang: "Python",
    q: "What does the `id()` function return in Python?",
    options: ["The variable name as string", "The unique memory address of the object in CPython", "The data type code", "The hash value"],
    ans: 1,
    exp: "In CPython, `id(obj)` returns the actual integer memory address of the object."
  },
  {
    id: "q43",
    lang: "Data Structures",
    q: "What is the maximum number of nodes on level `k` of a binary tree (root at level 0)?",
    options: ["2k", "2^k", "2^(k+1)", "k^2"],
    ans: 1,
    exp: "Since each node can branch to at most 2 children, level k can hold at most 2^k nodes."
  },
  {
    id: "q44",
    lang: "Algorithms",
    q: "What is the time complexity of the Floyd-Warshall all-pairs shortest path algorithm?",
    options: ["O(V^2)", "O(V^3)", "O(E log V)", "O(V + E)"],
    ans: 1,
    exp: "Floyd-Warshall uses three nested loops over all vertices V, resulting in O(V^3) time complexity."
  },
  {
    id: "q45",
    lang: "C Language",
    q: "What does `argc` represent in `int main(int argc, char *argv[])`?",
    options: ["Argument character", "Number of command-line arguments passed including program name", "Length of argv array in bytes", "Process ID"],
    ans: 1,
    exp: "`argc` (argument count) holds the total count of arguments passed to the binary, starting with argv[0] as executable name."
  },
  {
    id: "q46",
    lang: "Java",
    q: "Which collection class in Java is thread-safe and synchronized by default?",
    options: ["ArrayList", "Vector", "HashSet", "LinkedList"],
    ans: 1,
    exp: "Legacy `Vector` synchronizes all public methods, making it thread-safe, unlike unsynchronized `ArrayList`."
  },
  {
    id: "q47",
    lang: "Algorithms",
    q: "Which algorithm is commonly used to find the Minimum Spanning Tree of a connected weighted graph?",
    options: ["Dijkstra's Algorithm", "Kruskal's Algorithm", "Bellman-Ford", "Tarjan's SCC"],
    ans: 1,
    exp: "Kruskal's algorithm finds an MST by sorting edges and adding non-cyclical edges using Disjoint Set Union (DSU)."
  },
  {
    id: "q48",
    lang: "Operating Systems",
    q: "Which CPU scheduling algorithm gives the minimum average waiting time for a set of processes?",
    options: ["First-Come First-Served (FCFS)", "Shortest Job First (SJF / SRTF)", "Round Robin", "Priority Scheduling"],
    ans: 1,
    exp: "SJF (Shortest Job First) is provably optimal for minimizing average waiting time."
  },
  {
    id: "q49",
    lang: "Database",
    q: "What is a Foreign Key in relational database design?",
    options: ["An encrypted key for remote servers", "A field that uniquely references the Primary Key of another table", "A secondary index", "A composite primary key"],
    ans: 1,
    exp: "A Foreign Key establishes referential integrity by linking to the Primary Key of a parent table."
  },
  {
    id: "q50",
    lang: "C++",
    q: "What does RAII stand for in modern C++ idiom?",
    options: ["Resource Allocation Is Instant", "Resource Acquisition Is Initialization", "Runtime Array Interface Integration", "Recursive Algorithm Iterative Implementation"],
    ans: 1,
    exp: "RAII ties resource lifecycle (memory, file handles, mutexes) to object lifespan via constructors and destructors."
  }
];

class VabArena {
  constructor() {
    this.auth = null;
    this.db = null;
    this.currentUser = null;
    this.userDoc = null;
    this.isAdmin = false;
    this.dailyQuestions = [];
    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizAnswers = [];
    this.topUsers = [];
    this.userRank = null;
    this.isFirebaseReady = false;

    this.init();
  }

  async init() {
    this.initFirebase();
    this.bindEvents();
    this.selectDailyQuestions();
  }

  initFirebase() {
    try {
      if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.isFirebaseReady = true;

        // Auth State Listener
        this.auth.onAuthStateChanged(user => {
          this.handleAuthStateChange(user);
        });
      } else if (typeof firebase !== 'undefined' && firebase.apps.length) {
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.isFirebaseReady = true;
        this.auth.onAuthStateChanged(user => this.handleAuthStateChange(user));
      }
    } catch (err) {
      console.warn('[VAB-ARENA] Firebase initializing in offline fallback mode:', err);
      this.loadLocalProfile();
    }
  }

  selectDailyQuestions() {
    // Generate daily offset based on calendar day of year
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));

    // Rotate 10 completely fresh questions every 24 hours
    const totalQ = QUESTION_BANK.length;
    const startIndex = (dayOfYear * 10) % totalQ;
    const selected = [];
    for (let i = 0; i < 10; i++) {
      selected.push(QUESTION_BANK[(startIndex + i) % totalQ]);
    }

    this.dailyQuestions = selected;
  }

  async handleAuthStateChange(user) {
    this.currentUser = user;
    if (user) {
      this.isAdmin = ADMIN_EMAILS.includes((user.email || '').toLowerCase());
      await this.syncUserProfile(user);
      this.updateHeaderAuthUI(true);
      this.listenToLeaderboard();
    } else {
      this.userDoc = null;
      this.isAdmin = false;
      this.updateHeaderAuthUI(false);
      this.loadLocalLeaderboardFallback();
    }
  }

  async syncUserProfile(user) {
    if (!this.db) return;
    try {
      const userRef = this.db.collection('users').doc(user.uid);
      const snap = await userRef.get();
      const today = new Date().toISOString().slice(0, 10);

      if (!snap.exists) {
        // Initial user registration
        const newDoc = {
          uid: user.uid,
          displayName: user.displayName || 'Coder_' + user.uid.slice(0, 5),
          email: user.email || '',
          photoURL: user.photoURL || '',
          xp: 100, // Starter bonus
          streak: 1,
          lastActiveDate: today,
          codeRuns: 0,
          quizzesCompleted: 0,
          isAdmin: this.isAdmin,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        await userRef.set(newDoc);
        this.userDoc = newDoc;
      } else {
        const data = snap.data();
        let streak = data.streak || 1;
        const lastDate = data.lastActiveDate || '';

        // Calculate Daily Streak
        if (lastDate) {
          const diffDays = Math.round((new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            streak += 1; // Consecutive day!
          } else if (diffDays > 1) {
            streak = 1; // Broken streak reset
          }
        }

        const updates = {
          displayName: user.displayName || data.displayName,
          photoURL: user.photoURL || data.photoURL,
          streak: streak,
          lastActiveDate: today,
          isAdmin: this.isAdmin
        };
        await userRef.update(updates);
        this.userDoc = { ...data, ...updates };
      }
    } catch (err) {
      console.error('[VAB-ARENA] Error syncing user profile:', err);
      this.loadLocalProfile();
    }
  }

  loadLocalProfile() {
    const raw = localStorage.getItem('vab_guest_user');
    if (raw) {
      try { this.userDoc = JSON.parse(raw); } catch (e) {}
    }
    if (!this.userDoc) {
      this.userDoc = {
        uid: 'guest_' + Math.random().toString(36).substring(2, 8),
        displayName: 'Guest Coder',
        xp: 50,
        streak: 1,
        codeRuns: 0,
        quizzesCompleted: 0
      };
      localStorage.setItem('vab_guest_user', JSON.stringify(this.userDoc));
    }
  }

  listenToLeaderboard() {
    if (!this.db) {
      this.loadLocalLeaderboardFallback();
      return;
    }

    try {
      // Query top 10 players ordered by XP descending
      this.db.collection('users')
        .orderBy('xp', 'desc')
        .limit(10)
        .onSnapshot(snap => {
          const list = [];
          snap.forEach(doc => list.push(doc.data()));
          this.topUsers = list;
          this.calculateUserRank();
          this.renderLeaderboard();
        }, err => {
          console.warn('[VAB-ARENA] Leaderboard listener error, using fallback:', err);
          this.loadLocalLeaderboardFallback();
        });
    } catch (err) {
      this.loadLocalLeaderboardFallback();
    }
  }

  loadLocalLeaderboardFallback() {
    // Rich competitive baseline podium for immediate visual excitement
    this.topUsers = [
      { displayName: "Arjun Verma (IIT-B)", xp: 1420, streak: 14, photoURL: "" },
      { displayName: "Sneha Patel (NIT-T)", xp: 1290, streak: 11, photoURL: "" },
      { displayName: "Rahul Sharma (BITS)", xp: 1180, streak: 9, photoURL: "" },
      { displayName: "Divya Nair", xp: 1040, streak: 8, photoURL: "" },
      { displayName: "Karthik R.", xp: 950, streak: 7, photoURL: "" },
      { displayName: "Pooja Reddy", xp: 880, streak: 6, photoURL: "" },
      { displayName: "Ananya Roy", xp: 820, streak: 5, photoURL: "" },
      { displayName: "Vikram S.", xp: 760, streak: 4, photoURL: "" },
      { displayName: "Rohan Gupta", xp: 710, streak: 4, photoURL: "" },
      { displayName: "Manish Kumar", xp: 680, streak: 3, photoURL: "" }
    ];
    this.calculateUserRank();
    this.renderLeaderboard();
  }

  async calculateUserRank() {
    if (!this.userDoc) {
      this.userRank = 42;
      return;
    }

    // Check if in top 10
    const myUid = this.currentUser ? this.currentUser.uid : this.userDoc.uid;
    const index = this.topUsers.findIndex(u => u.uid === myUid);
    if (index !== -1) {
      this.userRank = index + 1;
      return;
    }

    // If outside top 10 and db is active, count users with higher XP
    if (this.db && this.currentUser) {
      try {
        const higherCountSnap = await this.db.collection('users')
          .where('xp', '>', this.userDoc.xp || 0)
          .get();
        this.userRank = higherCountSnap.size + 1;
      } catch (e) {
        this.userRank = 14;
      }
    } else {
      this.userRank = 14;
    }
  }

  renderLeaderboard() {
    const listEl = document.getElementById('leaderboardList');
    const myRankEl = document.getElementById('leaderboardMyRankBox');
    if (!listEl) return;

    listEl.innerHTML = '';

    this.topUsers.forEach((user, idx) => {
      const rankNum = idx + 1;
      const isTop3 = rankNum <= 3;
      const medal = rankNum === 1 ? '🥇' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : `#${rankNum}`;
      const medalClass = rankNum === 1 ? 'gold-rank' : rankNum === 2 ? 'silver-rank' : rankNum === 3 ? 'bronze-rank' : '';

      const row = document.createElement('div');
      row.className = `leaderboard-item ${medalClass}`;
      row.innerHTML = `
        <div class="lb-left">
          <span class="lb-rank-badge ${medalClass}">${medal}</span>
          <div class="lb-avatar">${(user.displayName || 'U')[0].toUpperCase()}</div>
          <div class="lb-user-info">
            <span class="lb-name">${this.escapeHtml(user.displayName || 'Anonymous')}</span>
            ${user.isAdmin ? '<span class="lb-founder-badge">👑 Founder</span>' : ''}
          </div>
        </div>
        <div class="lb-right">
          <span class="lb-streak-badge">🔥 ${user.streak || 1}d</span>
          <span class="lb-xp-badge">🏆 ${user.xp || 0} XP</span>
        </div>
      `;
      listEl.appendChild(row);
    });

    // Render Sticky "Your Place" Rank Bar right below the Top 10
    if (myRankEl) {
      const currentName = this.userDoc ? this.userDoc.displayName : 'Guest User';
      const currentXp = this.userDoc ? (this.userDoc.xp || 0) : 50;
      const currentStreak = this.userDoc ? (this.userDoc.streak || 1) : 1;
      const rankDisplay = this.userRank ? `#${this.userRank}` : '#--';

      myRankEl.innerHTML = `
        <div class="my-rank-inner">
          <div class="my-rank-left">
            <div class="my-rank-pill">
              <span class="my-rank-label">YOUR PLACE</span>
              <span class="my-rank-num">${rankDisplay}</span>
            </div>
            <div class="my-rank-name-box">
              <span class="my-rank-name">${this.escapeHtml(currentName)} (You)</span>
              <span class="my-rank-hint">${this.userRank <= 10 ? '🎉 You are in the Top 10!' : 'Answer Daily MCQs to break into Top 10'}</span>
            </div>
          </div>
          <div class="my-rank-right">
            <span class="lb-streak-badge">🔥 ${currentStreak}d streak</span>
            <span class="lb-xp-badge my-xp">🏆 ${currentXp} XP</span>
          </div>
        </div>
      `;
    }
  }

  updateHeaderAuthUI(isLoggedIn) {
    const authWrapper = document.getElementById('headerAuthWrapper');
    if (!authWrapper) return;

    if (isLoggedIn && this.currentUser) {
      const name = this.currentUser.displayName || 'Coder';
      const streak = this.userDoc ? this.userDoc.streak || 1 : 1;
      const xp = this.userDoc ? this.userDoc.xp || 0 : 0;
      const rank = this.userRank ? `#${this.userRank}` : '';

      authWrapper.innerHTML = `
        <button class="header-profile-btn" id="openDashboardBtn" title="Open Your Activity Dashboard & Rank">
          <span class="profile-streak-chip">🔥 ${streak}d</span>
          <div class="profile-avatar-circle">${name[0].toUpperCase()}</div>
          <div class="profile-text-stack">
            <span class="profile-name-text">${this.escapeHtml(name)}</span>
            <span class="profile-rank-text">${rank} • ${xp} XP</span>
          </div>
          <svg class="chevron-sm" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      `;

      const btn = document.getElementById('openDashboardBtn');
      if (btn) btn.addEventListener('click', () => this.openDashboardModal());
    } else {
      authWrapper.innerHTML = `
        <button class="header-login-btn" id="headerLoginBtn" title="Sign In with Google to Track Activity & Play Daily Game">
          <span class="pulse-dot"></span>
          <span class="login-btn-icon">⚡</span>
          <span>Login / Play</span>
        </button>
      `;

      const loginBtn = document.getElementById('headerLoginBtn');
      if (loginBtn) loginBtn.addEventListener('click', () => this.openAuthGateModal('dashboard'));
    }
  }

  async signInWithGoogle() {
    if (!this.auth) {
      alert("Firebase initializing... Please ensure popups are allowed.");
      return;
    }
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await this.auth.signInWithPopup(provider);
      if (result.user) {
        if (this.pendingTarget === 'game') {
          this.openQuizModal();
        } else if (this.pendingTarget === 'ranking') {
          this.openLeaderboardModal();
        } else {
          this.openDashboardModal();
        }
        this.pendingTarget = null;
      }
    } catch (err) {
      console.error("[VAB-ARENA] Sign-in error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        alert("Sign in note: " + (err.message || "Failed to sign in with Google."));
      }
    }
  }

  async signOut() {
    if (this.auth) {
      await this.auth.signOut();
    }
    this.closeAllModals();
  }

  openAuthGateModal(targetType) {
    this.closeAllModals();
    this.pendingTarget = targetType;
    const modal = document.getElementById('authGateModal');
    if (!modal) return;

    const titleEl = document.getElementById('authGateTitle');
    const descEl = document.getElementById('authGateDesc');
    const badgeEl = document.getElementById('authGateBadge');
    const iconEl = document.getElementById('authGateIcon');

    if (targetType === 'game') {
      if (badgeEl) badgeEl.textContent = '🎮 DAILY 10 MCQ GAME';
      if (titleEl) titleEl.textContent = 'Log in to play';
      if (descEl) descEl.textContent = 'Log in to play today\'s 10 coding MCQs, earn XP points, build your daily streak, and compete on the leaderboard.';
      if (iconEl) iconEl.textContent = '🎮';
    } else if (targetType === 'ranking') {
      if (badgeEl) badgeEl.textContent = '🏆 GLOBAL LEADERBOARD';
      if (titleEl) titleEl.textContent = 'Log in to see';
      if (descEl) descEl.textContent = 'Log in to see the Top 10 Coders leaderboard, view your personal rank, and track where you stand.';
      if (iconEl) iconEl.textContent = '🏆';
    } else {
      if (badgeEl) badgeEl.textContent = '⚡ USER ACTIVITY DASHBOARD';
      if (titleEl) titleEl.textContent = 'Log in to access dashboard';
      if (descEl) descEl.textContent = 'Log in to view your activity dashboard, track your daily coding streaks, and view your stats.';
      if (iconEl) iconEl.textContent = '📊';
    }

    modal.style.display = 'flex';
  }

  openDashboardModal() {
    if (!this.currentUser) {
      this.openAuthGateModal('dashboard');
      return;
    }

    const modal = document.getElementById('dashboardModal');
    if (!modal) return;

    const name = this.userDoc ? this.userDoc.displayName : 'Coder';
    const email = this.currentUser ? this.currentUser.email : '';
    const xp = this.userDoc ? this.userDoc.xp || 0 : 0;
    const streak = this.userDoc ? this.userDoc.streak || 1 : 1;
    const codeRuns = this.userDoc ? this.userDoc.codeRuns || 0 : 0;
    const rank = this.userRank ? `#${this.userRank}` : '#--';

    document.getElementById('dashProfileName').textContent = name;
    document.getElementById('dashProfileEmail').textContent = email || 'Authenticated Player';
    document.getElementById('dashXpVal').textContent = xp + ' XP';
    document.getElementById('dashStreakVal').textContent = streak + ' Days 🔥';
    document.getElementById('dashRunsVal').textContent = codeRuns + ' Runs';
    document.getElementById('dashRankVal').textContent = rank;

    if (this.isAdmin) {
      const adminBadge = document.getElementById('dashAdminBadge');
      if (adminBadge) adminBadge.style.display = 'inline-flex';
    }

    modal.style.display = 'flex';
  }

  openQuizModal() {
    if (!this.currentUser) {
      this.openAuthGateModal('game');
      return;
    }

    const modal = document.getElementById('quizModal');
    if (!modal) return;

    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizAnswers = [];
    this.renderCurrentQuizQuestion();
    modal.style.display = 'flex';
  }

  renderCurrentQuizQuestion() {
    const qData = this.dailyQuestions[this.quizIndex];
    if (!qData) {
      this.finishDailyQuiz();
      return;
    }

    document.getElementById('quizProgText').textContent = `Question ${this.quizIndex + 1} of 10`;
    document.getElementById('quizProgressBar').style.width = `${((this.quizIndex + 1) / 10) * 100}%`;
    document.getElementById('quizLangBadge').textContent = qData.lang;
    document.getElementById('quizQuestionText').textContent = qData.q;

    const optList = document.getElementById('quizOptionsContainer');
    optList.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    qData.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.innerHTML = `
        <span class="opt-letter">${letters[idx]}</span>
        <span class="opt-text">${this.escapeHtml(opt)}</span>
      `;
      btn.addEventListener('click', () => this.handleOptionSelect(idx));
      optList.appendChild(btn);
    });

    const expBox = document.getElementById('quizExpBox');
    if (expBox) expBox.style.display = 'none';

    const nextBtn = document.getElementById('quizNextQuestionBtn');
    if (nextBtn) {
      nextBtn.style.display = 'none';
      nextBtn.textContent = this.quizIndex === 9 ? 'Finish & See Rank 🏆' : 'Next Question ➜';
    }
  }

  handleOptionSelect(selectedIdx) {
    const qData = this.dailyQuestions[this.quizIndex];
    const buttons = document.querySelectorAll('.quiz-opt-btn');
    buttons.forEach(b => b.disabled = true);

    const isCorrect = selectedIdx === qData.ans;
    if (isCorrect) {
      buttons[selectedIdx].classList.add('correct');
      this.quizScore += 10;
    } else {
      buttons[selectedIdx].classList.add('wrong');
      buttons[qData.ans].classList.add('correct');
    }

    // Reveal Explanation
    const expBox = document.getElementById('quizExpBox');
    const expText = document.getElementById('quizExpText');
    if (expBox && expText) {
      expText.textContent = qData.exp;
      expBox.style.display = 'block';
    }

    const nextBtn = document.getElementById('quizNextQuestionBtn');
    if (nextBtn) nextBtn.style.display = 'inline-flex';
  }

  async finishDailyQuiz() {
    const quizArea = document.getElementById('quizActiveArea');
    const finishArea = document.getElementById('quizFinishedArea');
    if (quizArea) quizArea.style.display = 'none';
    if (finishArea) finishArea.style.display = 'block';

    const totalEarned = this.quizScore;
    document.getElementById('quizFinalScore').textContent = `${totalEarned} / 100 XP`;

    // Award XP to user in Firestore
    if (this.db && this.currentUser && this.userDoc) {
      try {
        const userRef = this.db.collection('users').doc(this.currentUser.uid);
        const newXp = (this.userDoc.xp || 0) + totalEarned;
        const newQuizzes = (this.userDoc.quizzesCompleted || 0) + 1;
        await userRef.update({
          xp: newXp,
          quizzesCompleted: newQuizzes
        });
        this.userDoc.xp = newXp;
        this.userDoc.quizzesCompleted = newQuizzes;
        this.calculateUserRank();
      } catch (e) {
        console.error("Score sync error:", e);
      }
    }
  }

  recordCodeExecution() {
    // Called whenever user hits 'Run Code'
    if (this.db && this.currentUser && this.userDoc) {
      const userRef = this.db.collection('users').doc(this.currentUser.uid);
      userRef.update({
        codeRuns: firebase.firestore.FieldValue.increment(1)
      }).catch(() => {});
      this.userDoc.codeRuns = (this.userDoc.codeRuns || 0) + 1;
    }
  }

  openLeaderboardModal() {
    if (!this.currentUser) {
      this.openAuthGateModal('ranking');
      return;
    }

    const modal = document.getElementById('leaderboardModal');
    if (modal) {
      this.renderLeaderboard();
      modal.style.display = 'flex';
    }
  }

  closeAllModals() {
    document.querySelectorAll('.arena-modal-backdrop').forEach(m => m.style.display = 'none');
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  bindEvents() {
    // Modal Close buttons
    document.querySelectorAll('.arena-modal-close').forEach(btn => {
      btn.addEventListener('click', () => this.closeAllModals());
    });

    // Close on backdrop click
    document.querySelectorAll('.arena-modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.closeAllModals();
      });
    });

    // Auth Gate Sign-in Button
    const gateGoogleBtn = document.getElementById('authGateGoogleBtn');
    if (gateGoogleBtn) {
      gateGoogleBtn.addEventListener('click', () => {
        this.closeAllModals();
        this.signInWithGoogle();
      });
    }

    // Auth Gate Dismiss (Continue Free Anonymous Coding)
    const gateDismissBtn = document.getElementById('authGateDismissBtn');
    if (gateDismissBtn) {
      gateDismissBtn.addEventListener('click', () => {
        this.closeAllModals();
      });
    }

    // Dashboard trigger buttons
    const triggerQuizBtn = document.getElementById('dashStartQuizBtn');
    if (triggerQuizBtn) {
      triggerQuizBtn.addEventListener('click', () => {
        this.closeAllModals();
        this.openQuizModal();
      });
    }

    const triggerLbBtn = document.getElementById('dashViewLeaderboardBtn');
    if (triggerLbBtn) {
      triggerLbBtn.addEventListener('click', () => {
        this.closeAllModals();
        this.openLeaderboardModal();
      });
    }

    const headerLbBtn = document.getElementById('headerLeaderboardBtn');
    if (headerLbBtn) {
      headerLbBtn.addEventListener('click', () => this.openLeaderboardModal());
    }

    const headerQuizBtn = document.getElementById('headerDailyQuizBtn');
    if (headerQuizBtn) {
      headerQuizBtn.addEventListener('click', () => this.openQuizModal());
    }

    const heroQuizBtn = document.getElementById('heroQuizBtn');
    if (heroQuizBtn) {
      heroQuizBtn.addEventListener('click', () => this.openQuizModal());
    }

    const logoutBtn = document.getElementById('dashLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.signOut());
    }

    const quizNextBtn = document.getElementById('quizNextQuestionBtn');
    if (quizNextBtn) {
      quizNextBtn.addEventListener('click', () => {
        this.quizIndex++;
        this.renderCurrentQuizQuestion();
      });
    }

    const finishBackBtn = document.getElementById('quizFinishedCloseBtn');
    if (finishBackBtn) {
      finishBackBtn.addEventListener('click', () => {
        this.closeAllModals();
        this.openLeaderboardModal();
      });
    }
  }
}

// Global instance initialized on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  window.vabArena = new VabArena();
});
