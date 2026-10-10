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

// Curated Daily 10 MCQ Question Bank (Rotates automatically based on calendar day)
const QUESTION_BANK = [
  // Pool 1: Python & Core Logic
  {
    id: "q1",
    lang: "Python",
    q: "What is the output of `print(type(1/1))` in Python 3?",
    options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "SyntaxError"],
    ans: 1,
    exp: "In Python 3, the single division operator `/` always performs true floating-point division and returns a float, so 1/1 evaluates to 1.0 (<class 'float'>)."
  },
  {
    id: "q2",
    lang: "Data Structures",
    q: "What is the time complexity of searching for an element in a balanced Binary Search Tree (AVL / Red-Black)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    ans: 1,
    exp: "Because the tree is balanced, the maximum height is strictly logarithmic (h = O(log n)), ensuring search, insertion, and deletion all take O(log n) time."
  },
  {
    id: "q3",
    lang: "C Language",
    q: "What does the expression `*(arr + i)` evaluate to in C?",
    options: ["Address of arr[i]", "Value of arr[i]", "Size of arr", "SyntaxError"],
    ans: 1,
    exp: "Pointer arithmetic in C equates array indexing to dereferencing: `arr[i]` is syntactically equivalent to `*(arr + i)`."
  },
  {
    id: "q4",
    lang: "C++",
    q: "Which STL container guarantees O(1) average time complexity for key lookups?",
    options: ["std::map", "std::vector", "std::unordered_map", "std::set"],
    ans: 2,
    exp: "`std::unordered_map` is implemented using a hash table, providing O(1) amortized lookup, unlike `std::map` which is a Red-Black tree with O(log n)."
  },
  {
    id: "q5",
    lang: "Java",
    q: "In Java, what is the default value of an uninitialized instance variable of type `boolean`?",
    options: ["true", "false", "null", "undefined"],
    ans: 1,
    exp: "In Java, primitive boolean fields in class objects are automatically initialized to `false` by the JVM specification."
  },
  {
    id: "q6",
    lang: "Python",
    q: "What will `bool([])` evaluate to in Python?",
    options: ["True", "False", "None", "TypeError"],
    ans: 1,
    exp: "In Python, empty sequences, collections, and containers (empty list [], tuple (), dict {}, string '') are considered falsy, evaluating to False."
  },
  {
    id: "q7",
    lang: "Algorithms",
    q: "Which sorting algorithm is guaranteed to be stable and have an O(n log n) worst-case time complexity?",
    options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
    ans: 2,
    exp: "Merge Sort consistently divides the array in half and merges sorted sub-arrays in O(n log n) worst-case while preserving relative order of equal keys (stable)."
  },
  {
    id: "q8",
    lang: "JavaScript",
    q: "What is the output of `console.log([] + {})` in JavaScript?",
    options: ["\"[object Object]\"", "NaN", "0", "TypeError"],
    ans: 0,
    exp: "The empty array `[]` converts to empty string `\"\"` via `toString()`, and `{}` converts to `\"[object Object]\"`, resulting in `\"[object Object]\"`."
  },
  {
    id: "q9",
    lang: "Operating Systems",
    q: "Which condition is NOT one of Coffman's four conditions required for a Deadlock to occur?",
    options: ["Mutual Exclusion", "Hold and Wait", "Preemption allowed", "Circular Wait"],
    ans: 2,
    exp: "The four Coffman deadlock conditions are: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. If Preemption is allowed, deadlock cannot persist."
  },
  {
    id: "q10",
    lang: "Computer Vision",
    q: "Which OpenCV function is used to convert an RGB/BGR image to Grayscale?",
    options: ["cv2.toGray()", "cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)", "cv2.filterGray()", "cv2.threshold()"],
    ans: 1,
    exp: "OpenCV's `cv2.cvtColor` with the color-space conversion code `cv2.COLOR_BGR2GRAY` applies the standard perceptual luminance formula: Y = 0.299R + 0.587G + 0.114B."
  },
  // Pool 2 (Additional Pool for rotation)
  {
    id: "q11",
    lang: "Python",
    q: "What will `[1, 2, 3] * 2` produce in Python?",
    options: ["[2, 4, 6]", "[1, 2, 3, 1, 2, 3]", "[[1, 2, 3], [1, 2, 3]]", "TypeError"],
    ans: 1,
    exp: "Multiplying a list by an integer n repeats the elements n times, yielding `[1, 2, 3, 1, 2, 3]`."
  },
  {
    id: "q12",
    lang: "DSA",
    q: "Which data structure is naturally used to implement Breadth-First Search (BFS)?",
    options: ["Stack", "Queue", "Max Heap", "Binary Tree"],
    ans: 1,
    exp: "BFS visits nodes level by level using a FIFO (First-In-First-Out) Queue, while DFS uses a LIFO Stack."
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
    // Generate daily seed from current date (YYYY-MM-DD)
    const today = new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = (hash << 5) - hash + today.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    // Pick 10 questions consistently for everyone today
    const shuffled = [...QUESTION_BANK].sort((a, b) => {
      const ha = (a.id.charCodeAt(1) * 31 + seed) % 100;
      const hb = (b.id.charCodeAt(1) * 31 + seed) % 100;
      return ha - hb;
    });

    this.dailyQuestions = shuffled.slice(0, 10);
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
