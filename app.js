/**
 * Ensemble Learning Programme - Core Application Logic
 * Implements portal security key verification, role-based views, local storage database management,
 * and academic dashboard progression charts.
 */

// 1. Data Schema & Instrument Configuration
const GROUPS = {
  NUSSO: [
    'Flute', 'Clarinet', 'Oboe', 'Bassoon', 'Horn', 'Trumpet', 'Trombone', 
    'Tuba', 'Percussion', 'Violin 1', 'Violin 2', 'Viola', 'Cello', 'Double Bass'
  ],
  NUSWS: [
    'Flute', 'Clarinet', 'Oboe', 'Bassoon', 'Saxophone', 'Horn', 'Trumpet', 
    'Trombone', 'Euphonium', 'Tuba', 'Percussion'
  ]
};

// Seed Data (Used if LocalStorage is empty)
const SEED_TUTTI_REHEARSALS = [
  {
    id: 'tutti-1',
    date: '2026-08-23',
    repertoire: 'Carmen Suite No. 1',
    generalSummary: 'Strong energy in the opening Prélude. Rhythms are locking in. Main issues are string-woodwind balance in quieter sections and brass entry precision.',
    observations: [
      {
        id: 'obs-1',
        group: 'NUSSO',
        section: 'Horn',
        content: 'Unstable pitch and tuning drift during unison shifts in the Intermezzo (bars 24-32). Tutors, please review breath support.',
        status: 'Requires attention'
      },
      {
        id: 'obs-2',
        group: 'NUSSO',
        section: 'Trumpet',
        content: 'Double-tonguing articulation needs to be crisper to match woodwind attacks in the Aragonaise (bars 57-72).',
        status: 'In Progress'
      }
    ]
  },
  {
    id: 'tutti-2',
    date: '2026-08-25',
    repertoire: 'First Suite',
    generalSummary: 'Excellent session. Dynamic range was impressive. Percussion cues were clean. We need to work on syncopated subdivision in the winds.',
    observations: [
      {
        id: 'obs-3',
        group: 'NUSWS',
        section: 'Clarinet',
        content: 'Syncopated passages must align precisely with the percussion section (Mvt III · bars 142–150). Practice subdivision of eighth notes.',
        status: 'Requires attention'
      },
      {
        id: 'obs-4',
        group: 'NUSSO',
        section: 'Percussion',
        content: 'Snare principal should conduct transition cues more visibly during tutti tempo changes (bar 221).',
        status: 'Resolved'
      }
    ]
  }
];

const SEED_LESSON_PLANS = [
  {
    id: 'plan-1',
    group: 'NUSSO',
    section: 'Horn',
    piece: 'New Work',
    parts: [
      { location: 'Mvt II · 113–128', goal: 'Practice playing these chords slow and check pitch accuracy with drone cues. Work on physical posture.' }
    ],
    createdAt: '2026-08-19'
  },
  {
    id: 'plan-2',
    group: 'NUSSO',
    section: 'Trumpet',
    piece: 'First Suite',
    parts: [
      { location: 'Mvt I · 57-72', goal: 'Start sectional with slow metronome matching length of notes, slow ramp up to target speed.' }
    ],
    createdAt: '2026-08-20'
  }
];

const SEED_SESSION_LOGS = [
  {
    id: 'log-1',
    group: 'NUSSO',
    section: 'Horn',
    piece: 'New Work',
    generalFeedback: 'Worked on unison notes. Pitch stability remains inconsistent after two sectional sessions. Horns are tending sharp on the top register.',
    parts: [
      { location: 'Mvt II · 113–128', status: 'Requires further development', notes: 'Top register is still sharp. Focus on embouchure relaxation.' }
    ],
    createdAt: '2026-08-20'
  },
  {
    id: 'log-2',
    group: 'NUSSO',
    section: 'Trumpet',
    piece: 'First Suite',
    generalFeedback: 'Improved consistency in repeated quavers. Worked with slow metronome and matched note length.',
    parts: [
      { location: 'Mvt I · 57-72', status: 'Progressing', notes: 'Not yet fully stable at performance tempo, but ready for tutti integration.' }
    ],
    createdAt: '2026-08-20'
  },
  {
    id: 'log-3',
    group: 'NUSWS',
    section: 'Clarinet',
    piece: 'First Suite',
    generalFeedback: 'Woodwinds aligned to percussion downbeats. Syncopation rhythm demonstrated perfectly.',
    parts: [
      { location: '142–150', status: 'Demonstrated', notes: 'Tempo is highly stable.' }
    ],
    createdAt: '2026-08-19'
  }
];

const SEED_QA_THREADS = [
  {
    id: 'thread-1',
    group: 'NUSSO',
    section: 'Horn',
    piece: 'New Work',
    question: 'Could the conductor clarify the tempo transition at bar 120? Is it a sudden accelerando or a gradual one?',
    createdAt: '2026-08-27',
    replies: [
      {
        author: 'Conductor',
        content: 'It should be a gradual accelerando over 4 bars starting from bar 116. Woodwinds will lead it, horns join at bar 120.',
        createdAt: '2026-08-28'
      }
    ]
  }
];

const SEED_REPERTOIRE = [
  { id: 'rep-1', title: 'First Suite in Eb', group: 'NUSWS' },
  { id: 'rep-2', title: 'New Work', group: 'All' },
  { id: 'rep-3', title: 'Tchaikovsky Symphony No. 5', group: 'NUSSO' },
  { id: 'rep-4', title: 'Mahler Symphony No. 1', group: 'NUSSO' },
  { id: 'rep-5', title: 'Holst Suite in F', group: 'NUSWS' }
];

const SEED_STUDENT_REFLECTIONS = [
  {
    id: 'ref-1',
    group: 'NUSSO',
    section: 'Horn',
    logId: 'log-1',
    piece: 'New Work (bars 113–128)',
    rating: 3,
    challenges: 'Struggled to maintain pitch stability in high register when playing pianissimo.',
    content: 'The long-tone practice with drone support was helpful, but I need to do more embouchure relaxation exercises.',
    studentName: 'Alex Tan',
    createdAt: '2026-08-21'
  },
  {
    id: 'ref-2',
    group: 'NUSSO',
    section: 'Trumpet',
    logId: 'log-2',
    piece: 'First Suite (Mvt I · 57–72)',
    rating: 4,
    challenges: 'Matching length of staccatos with woodwind section.',
    content: 'Slow practice really helped lock in the tempo. Ready for the next tutti rehearsal.',
    studentName: 'Chloe Lim',
    createdAt: '2026-08-21'
  }
];

// 2. LocalStorage Database Wrapper
class DB {
  static get(key, seed = []) {
    const data = localStorage.getItem(`cfa_db_${key}`);
    if (!data) {
      this.set(key, seed);
      return seed;
    }
    return JSON.parse(data);
  }

  static set(key, value) {
    localStorage.setItem(`cfa_db_${key}`, JSON.stringify(value));
  }

  static init() {
    this.get('tutti_rehearsals', SEED_TUTTI_REHEARSALS);
    this.get('lesson_plans', SEED_LESSON_PLANS);
    this.get('session_logs', SEED_SESSION_LOGS);
    this.get('repertoire', SEED_REPERTOIRE);
    this.get('student_reflections', SEED_STUDENT_REFLECTIONS);
    this.get('qa_threads', SEED_QA_THREADS);
  }

  static reset() {
    localStorage.removeItem('cfa_db_tutti_rehearsals');
    localStorage.removeItem('cfa_db_lesson_plans');
    localStorage.removeItem('cfa_db_session_logs');
    localStorage.removeItem('cfa_db_repertoire');
    localStorage.removeItem('cfa_db_student_reflections');
    localStorage.removeItem('cfa_db_qa_threads');
    this.init();
  }
}

// Initialize database
DB.init();

// 3. Application State (Logged user persists in localStorage session cache)
const state = {
  activeUser: null, // { role: 'coordinator'|'tutor'|'student', group: 'NUSSO'|'NUSWS', section: string|null }
  activePanel: 'coord-overview',
  activeCoordinatorGroup: 'NUSSO', // Filters overview workspace for coordinators
};

// 4. DOM Elements cache
const dom = {
  // Login Screen elements
  loginScreen: document.getElementById('loginScreen'),
  loginForm: document.getElementById('loginForm'),
  loginRole: document.getElementById('loginRole'),
  tutorFields: document.getElementById('tutorFields'),
  loginGroup: document.getElementById('loginGroup'),
  loginSection: document.getElementById('loginSection'),
  loginPassword: document.getElementById('loginPassword'),
  
  // App structure elements
  appLayout: document.getElementById('appLayout'),
  signOutBtn: document.getElementById('signOutBtn'),
  sidebarTitle: document.getElementById('sidebarTitle'),
  sidebarSubtitle: document.getElementById('sidebarSubtitle'),
  sidebarNav: document.getElementById('sidebarNav'),
  
  headerEyebrow: document.getElementById('headerEyebrow'),
  headerTitle: document.getElementById('headerTitle'),
  headerGroupIndicator: document.getElementById('headerGroupIndicator'),
  
  // Coordinator Overview Panel Elements
  metricRequires: document.getElementById('metricRequires'),
  metricProgressing: document.getElementById('metricProgressing'),
  metricDemonstrated: document.getElementById('metricDemonstrated'),
  metricTotalLogs: document.getElementById('metricTotalLogs'),
  synthesisContent: document.getElementById('synthesisContent'),
  moreSynthesis: document.getElementById('moreSynthesis'),
  toggleSynthesis: document.getElementById('toggleSynthesis'),
  overviewSectionFilter: document.getElementById('overviewSectionFilter'),
  prioritiesTable: document.getElementById('prioritiesTable'),
  dbQueryInput: document.getElementById('dbQueryInput'),
  searchDbBtn: document.getElementById('searchDbBtn'),
  queryResponsePanel: document.getElementById('queryResponsePanel'),
  
  // Coordinator Rehearsal Notes Elements
  tuttiNotesForm: document.getElementById('tuttiNotesForm'),
  notesDate: document.getElementById('notesDate'),
  notesRepertoireSelect: document.getElementById('notesRepertoireSelect'),
  notesRepertoireCustom: document.getElementById('notesRepertoireCustom'),
  notesGeneralSummary: document.getElementById('notesGeneralSummary'),
  addObservationRowBtn: document.getElementById('addObservationRowBtn'),
  notesObservationsContainer: document.getElementById('notesObservationsContainer'),
  notesCountBadge: document.getElementById('notesCountBadge'),
  tuttiRehearsalsList: document.getElementById('tuttiRehearsalsList'),
  
  // Coordinator Global Explorer Elements
  explorerSearch: document.getElementById('explorerSearch'),
  explorerGroupFilter: document.getElementById('explorerGroupFilter'),
  explorerSectionFilter: document.getElementById('explorerSectionFilter'),
  explorerLogsList: document.getElementById('explorerLogsList'),
  
  // Tutor Sectional Hub Elements
  tutorTuttiAlertContainer: document.getElementById('tutorTuttiAlertContainer'),
  tutorTuttiObservations: document.getElementById('tutorTuttiObservations'),
  
  // Tutor Lesson Planner Elements
  lessonPlanForm: document.getElementById('lessonPlanForm'),
  planRepertoireSelect: document.getElementById('planRepertoireSelect'),
  planRepertoireCustom: document.getElementById('planRepertoireCustom'),
  planPartsContainer: document.getElementById('planPartsContainer'),
  addPlanPartBtn: document.getElementById('addPlanPartBtn'),
  tutorPlansList: document.getElementById('tutorPlansList'),
  
  // Tutor Session Logger Elements
  sessionLogForm: document.getElementById('sessionLogForm'),
  logRepertoireSelect: document.getElementById('logRepertoireSelect'),
  logRepertoireCustom: document.getElementById('logRepertoireCustom'),
  logGeneralFeedback: document.getElementById('logGeneralFeedback'),
  logPartsContainer: document.getElementById('logPartsContainer'),
  addLogPartBtn: document.getElementById('addLogPartBtn'),
  logPlanSelect: document.getElementById('logPlanSelect'),
  
  // Tutor Logs Archive Elements
  tutorLogsList: document.getElementById('tutorLogsList'),



  // Tutor check-in reminders
  tutorCheckinReminders: document.getElementById('tutorCheckinReminders'),

  // Coordinator reflections
  coordReflectionsSearch: document.getElementById('coordReflectionsSearch'),
  coordReflectionsSectionFilter: document.getElementById('coordReflectionsSectionFilter'),
  coordReflectionsList: document.getElementById('coordReflectionsList'),

  // Student viewport elements
  studentTutorLogsList: document.getElementById('studentTutorLogsList'),
  studentSyllabusList: document.getElementById('studentTuttiObservations'),
  studentReflectionForm: document.getElementById('studentReflectionForm'),
  reflectorLogSelect: document.getElementById('reflectorLogSelect'),
  reflectorName: document.getElementById('reflectorName'),
  reflectorRating: document.getElementById('reflectorRating'),
  reflectorChallenges: document.getElementById('reflectorChallenges'),
  reflectorContent: document.getElementById('reflectorContent'),
  studentReflectionsList: document.getElementById('studentReflectionsList'),

  // Tutor Q&A Elements
  tutorQaForm: document.getElementById('tutorQaForm'),
  qaRepertoireSelect: document.getElementById('qaRepertoireSelect'),
  qaRepertoireCustom: document.getElementById('qaRepertoireCustom'),
  qaQuestionText: document.getElementById('qaQuestionText'),
  tutorQaList: document.getElementById('tutorQaList'),

  // Coordinator Q&A Elements
  coordQaSearch: document.getElementById('coordQaSearch'),
  coordQaSectionFilter: document.getElementById('coordQaSectionFilter'),
  coordQaList: document.getElementById('coordQaList'),
};

// 5. App Core Initializer
function initApp() {
  setupEventListeners();
  checkPersistedLogin();
}

// Check if user has an active session
function checkPersistedLogin() {
  const cachedUser = localStorage.getItem('cfa_session_user');
  if (cachedUser) {
    state.activeUser = JSON.parse(cachedUser);
    showPortalInterface();
  } else {
    showLoginInterface();
  }
}

// Reveal login card, hide portal
function showLoginInterface() {
  dom.loginScreen.style.display = 'flex';
  dom.appLayout.style.display = 'none';
  dom.loginPassword.value = '';
}

// Reveal main workspace
function showPortalInterface() {
  dom.loginScreen.style.display = 'none';
  dom.appLayout.style.display = 'grid';
  syncIdentity();
}

// Setup Event Listeners
function setupEventListeners() {
  // Login Role Change triggers Tutor/Student sections
  dom.loginRole.addEventListener('change', (e) => {
    if (e.target.value === 'tutor' || e.target.value === 'student') {
      dom.tutorFields.style.display = 'flex';
      populateFormSections(dom.loginGroup.value, dom.loginSection);
    } else {
      dom.tutorFields.style.display = 'none';
    }
  });

  // Login Group Change updates instrument options
  dom.loginGroup.addEventListener('change', (e) => {
    populateFormSections(e.target.value, dom.loginSection);
  });

  // Login Form Submission
  dom.loginForm.addEventListener('submit', handleLoginSubmit);

  // Sign Out Button click
  dom.signOutBtn.addEventListener('click', () => {
    localStorage.removeItem('cfa_session_user');
    state.activeUser = null;
    showLoginInterface();
  });

  // AI Synthesis text expander toggle
  dom.toggleSynthesis.addEventListener('click', () => {
    const hidden = dom.moreSynthesis.hidden;
    dom.moreSynthesis.hidden = !hidden;
    dom.toggleSynthesis.textContent = hidden ? 'Hide detailed synthesis' : 'Read full detailed synthesis';
  });

  // Database query search trigger
  dom.searchDbBtn.addEventListener('click', handleDatabaseQuery);

  // Form Submissions
  dom.tuttiNotesForm.addEventListener('submit', handleTuttiNotesSubmit);
  dom.addObservationRowBtn.addEventListener('click', () => createObservationRow());

  dom.lessonPlanForm.addEventListener('submit', handleLessonPlanSubmit);
  dom.addPlanPartBtn.addEventListener('click', () => createPlanPartRow());
  dom.sessionLogForm.addEventListener('submit', handleSessionLogSubmit);
  dom.logPlanSelect.addEventListener('change', handleLogPlanSelectChange);
  dom.addLogPartBtn.addEventListener('click', () => createLogPartRow());
  dom.studentReflectionForm.addEventListener('submit', handleStudentReflectionSubmit);

  // Filter Event Handlers
  dom.overviewSectionFilter.addEventListener('change', renderOverviewPriorities);
  dom.explorerGroupFilter.addEventListener('change', handleExplorerFiltersChange);
  dom.explorerSectionFilter.addEventListener('change', renderGlobalLogsExplorer);
  dom.explorerSearch.addEventListener('input', renderGlobalLogsExplorer);
  dom.coordReflectionsSectionFilter.addEventListener('change', renderCoordinatorReflections);
  dom.coordReflectionsSearch.addEventListener('input', renderCoordinatorReflections);

  // Q&A Event Handlers
  if (dom.tutorQaForm) {
    dom.tutorQaForm.addEventListener('submit', handleTutorQaSubmit);
    dom.qaRepertoireSelect.addEventListener('change', (e) => {
      dom.qaRepertoireCustom.style.display = e.target.value === '__custom__' ? 'block' : 'none';
      dom.qaRepertoireCustom.required = e.target.value === '__custom__';
    });
  }
  if (dom.coordQaSearch && dom.coordQaSectionFilter) {
    dom.coordQaSearch.addEventListener('input', renderCoordinatorQaExplorer);
    dom.coordQaSectionFilter.addEventListener('change', renderCoordinatorQaExplorer);
  }
}

// Login verification logic
function handleLoginSubmit(e) {
  e.preventDefault();
  
  const role = dom.loginRole.value;
  const password = dom.loginPassword.value.trim();
  
  if (!password) {
    alert('Please enter a secure password.');
    return;
  }
  
  if (role === 'coordinator') {
    state.activeUser = {
      role: 'coordinator',
      group: 'NUSSO', // Default view filter
      section: null
    };
  } else {
    // Tutor setup
    const group = dom.loginGroup.value;
    const section = dom.loginSection.value;
    state.activeUser = { role, group, section };
  }
  
  // Cache user login
  localStorage.setItem('cfa_session_user', JSON.stringify(state.activeUser));
  showPortalInterface();
}

// 6. Identity & View Switch Sync
function syncIdentity() {
  const u = state.activeUser;
  if (!u) return;
  
  if (u.role === 'coordinator') {
    // Set Sidebar headers
    dom.sidebarTitle.textContent = 'CFA Ensemble';
    dom.sidebarSubtitle.textContent = 'Coordinator Portal';
    
    // Set up Coordinator Sidebar Navigation
    dom.sidebarNav.innerHTML = `
      <a class="nav-item active" data-panel="coord-overview">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        Overview Dashboard
      </a>
      <a class="nav-item" data-panel="coord-notes">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        Tutti Rehearsal Notes
      </a>
      <a class="nav-item" data-panel="coord-reflections">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        Student Reflections
      </a>
      <a class="nav-item" data-panel="coord-explorer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        Logs Explorer
      </a>
      <a class="nav-item" data-panel="coord-qa">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        Tutor Questions
      </a>
    `;

    // Group toggle buttons in header (NUSSO / NUSWS)
    dom.headerGroupIndicator.style.display = 'flex';
    dom.headerGroupIndicator.innerHTML = `
      <button class="group-toggle-btn ${state.activeCoordinatorGroup === 'NUSSO' ? 'active' : ''}" id="toggleGroupNusso">NUSSO</button>
      <button class="group-toggle-btn ${state.activeCoordinatorGroup === 'NUSWS' ? 'active' : ''}" id="toggleGroupNusws">NUSWS</button>
    `;
    
    // Add toggling events
    document.getElementById('toggleGroupNusso').addEventListener('click', () => switchCoordinatorGroup('NUSSO'));
    document.getElementById('toggleGroupNusws').addEventListener('click', () => switchCoordinatorGroup('NUSWS'));

    // Populate Repertoire dropdowns for the coordinator
    populateRepertoireDropdown(state.activeCoordinatorGroup, dom.notesRepertoireSelect, dom.notesRepertoireCustom);
    
    // Add initial clean observation row
    dom.notesObservationsContainer.innerHTML = '';
    createObservationRow();
    
    // Set active panel to default coordinator overview
    switchPanel('coord-overview');

  } else if (u.role === 'tutor') {
    // Tutor view Setup
    dom.sidebarTitle.textContent = u.group;
    dom.sidebarSubtitle.textContent = `${u.section} Sectional`;

    // Set up Tutor Sidebar Navigation
    dom.sidebarNav.innerHTML = `
      <a class="nav-item active" data-panel="tutor-hub">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        Sectional Hub
      </a>
      <a class="nav-item" data-panel="tutor-planner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        Lesson Planner
      </a>
      <a class="nav-item" data-panel="tutor-logger">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        Sectional Log
      </a>
      <a class="nav-item" data-panel="tutor-logs">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        Log Archive
      </a>
      <a class="nav-item" data-panel="tutor-qa">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        Conductor Q&A
      </a>
    `;

    // Hard-lock group switcher in header to simple badge text
    dom.headerGroupIndicator.style.display = 'flex';
    dom.headerGroupIndicator.innerHTML = `<span class="badge badge-accent">${u.group} · ${u.section} ONLY</span>`;

    // Populate Repertoire dropdowns for the tutor
    populateRepertoireDropdown(u.group, dom.planRepertoireSelect, dom.planRepertoireCustom);
    populateRepertoireDropdown(u.group, dom.logRepertoireSelect, dom.logRepertoireCustom);
    populateRepertoireDropdown(u.group, dom.qaRepertoireSelect, dom.qaRepertoireCustom);

    // Initialize dynamic containers with a clean starting row
    dom.planPartsContainer.innerHTML = '';
    createPlanPartRow();
    dom.logPartsContainer.innerHTML = '';
    createLogPartRow();

    switchPanel('tutor-hub');
  } else if (u.role === 'student') {
    // Student view Setup
    dom.sidebarTitle.textContent = u.group;
    dom.sidebarSubtitle.textContent = `${u.section} Student`;

    // Set up Student Sidebar Navigation
    dom.sidebarNav.innerHTML = `
      <a class="nav-item active" data-panel="student-hub">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        Student Hub
      </a>
      <a class="nav-item" data-panel="student-reflector">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        Submit Reflection
      </a>
      <a class="nav-item" data-panel="student-reflections">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        Reflection History
      </a>
    `;

    // Hard-lock group switcher in header to simple badge text
    dom.headerGroupIndicator.style.display = 'flex';
    dom.headerGroupIndicator.innerHTML = `<span class="badge badge-accent">${u.group} · ${u.section} STUDENT</span>`;

    switchPanel('student-hub');
  }

  // Bind panel clicks for sidebar items
  const navItems = dom.sidebarNav.querySelectorAll('.nav-item');
  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      navItems.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      switchPanel(btn.dataset.panel);
    });
  });
}

// Switch view panels
function switchPanel(panelId) {
  state.activePanel = panelId;
  const panels = document.querySelectorAll('.panel');
  panels.forEach(p => p.classList.remove('active'));
  
  const target = document.getElementById(panelId);
  if (target) {
    target.classList.add('active');
  }

  // Update header descriptions based on view panel
  updateHeaderContent(panelId);
  
  // Render details relative to the loaded viewport
  renderCurrentViewportData();
}

// Dynamic header descriptions
function updateHeaderContent(panelId) {
  const u = state.activeUser;
  const labels = {
    'coord-overview': { title: `${state.activeCoordinatorGroup} Overview`, eyebrow: 'Coordinator Portal · Bird\'s Eye View' },
    'coord-notes': { title: 'Tutti Rehearsal Notes', eyebrow: 'Coordinator Portal · Conductor Rehearsal Notes' },
    'coord-explorer': { title: 'Tutor Logs Explorer', eyebrow: 'Coordinator Portal · Global Submissions' },
    'coord-reflections': { title: 'Student Reflections Feed', eyebrow: 'Coordinator Portal · Student Feedback' },
    'tutor-hub': { title: 'Sectional Hub', eyebrow: `${u.group} · ${u.section} Workspace` },
    'tutor-planner': { title: 'Lesson Planner', eyebrow: `${u.group} · ${u.section} Workspace` },
    'tutor-logger': { title: 'Log Sectional Outcome', eyebrow: `${u.group} · ${u.section} Workspace` },
    'tutor-logs': { title: 'Section Logs Archive', eyebrow: `${u.group} · ${u.section} Workspace` },
    'tutor-qa': { title: 'Conductor Q&A', eyebrow: `${u.group} · ${u.section} Workspace` },
    'coord-qa': { title: 'Tutor Questions Feed', eyebrow: 'Coordinator Portal · Q&A Discussions' },
    'student-hub': { title: 'Student Hub', eyebrow: `${u.group} · ${u.section} Student Portal` },
    'student-reflector': { title: 'Submit Reflection', eyebrow: `${u.group} · ${u.section} Student Portal` },
    'student-reflections': { title: 'Reflection History', eyebrow: `${u.group} · ${u.section} Student Portal` },
  };

  if (labels[panelId]) {
    dom.headerTitle.textContent = labels[panelId].title;
    dom.headerEyebrow.textContent = labels[panelId].eyebrow;
  }
}

// Coordinator Switch Active Group Filters
function switchCoordinatorGroup(grp) {
  state.activeCoordinatorGroup = grp;
  // Re-sync UI state
  const btnNusso = document.getElementById('toggleGroupNusso');
  const btnNusws = document.getElementById('toggleGroupNusws');
  
  if (btnNusso && btnNusws) {
    btnNusso.className = `group-toggle-btn ${grp === 'NUSSO' ? 'active' : ''}`;
    btnNusws.className = `group-toggle-btn ${grp === 'NUSWS' ? 'active' : ''}`;
  }

  dom.headerTitle.textContent = `${grp} Overview`;
  
  // Load new priorities select options
  populateSectionOptions(grp, dom.overviewSectionFilter);
  populateSectionOptions(grp, dom.coordReflectionsSectionFilter);
  
  // Populate Repertoire dropdowns for the group
  populateRepertoireDropdown(grp, dom.notesRepertoireSelect, dom.notesRepertoireCustom);
  
  renderCurrentViewportData();
}

// Helper to fill target sections based on Group
function populateFormSections(group, targetSelect) {
  const instruments = GROUPS[group] || [];
  targetSelect.innerHTML = instruments.map(i => `<option value="${i}">${i}</option>`).join('');
}

// Helper to populate section selector with an "All" choice first
function populateSectionOptions(group, targetSelect) {
  const instruments = GROUPS[group] || [];
  targetSelect.innerHTML = `<option value="all">All Sections</option>` + 
    instruments.map(i => `<option value="${i}">${i}</option>`).join('');
}

// 7. Data Render Engines
function renderCurrentViewportData() {
  const panel = state.activePanel;
  
  if (panel === 'coord-overview') {
    renderOverviewMetrics();
    renderOverviewPriorities();
    renderOverviewSynthesis();
  } else if (panel === 'coord-notes') {
    renderCoordinatorNotes();
  } else if (panel === 'coord-explorer') {
    // Populate explorer sections filter if needed
    if (dom.explorerSectionFilter.children.length <= 1) {
      populateSectionOptions(dom.explorerGroupFilter.value === 'all' ? 'NUSSO' : dom.explorerGroupFilter.value, dom.explorerSectionFilter);
    }
    renderGlobalLogsExplorer();
  } else if (panel === 'coord-reflections') {
    if (dom.coordReflectionsSectionFilter.children.length <= 1) {
      populateSectionOptions(state.activeCoordinatorGroup, dom.coordReflectionsSectionFilter);
    }
    renderCoordinatorReflections();
  } else if (panel === 'tutor-hub') {
    renderTutorHub();
  } else if (panel === 'tutor-planner') {
    renderTutorPlansList();
  } else if (panel === 'tutor-logger') {
    renderTutorLoggerAssistant();
  } else if (panel === 'tutor-logs') {
    renderTutorLogsArchive();
  } else if (panel === 'tutor-qa') {
    renderTutorQaArchive();
  } else if (panel === 'coord-qa') {
    if (dom.coordQaSectionFilter.children.length <= 1) {
      populateSectionOptions(state.activeCoordinatorGroup, dom.coordQaSectionFilter);
    }
    renderCoordinatorQaExplorer();
  } else if (panel === 'student-hub') {
    renderStudentHub();
  } else if (panel === 'student-reflector') {
    renderStudentReflector();
  } else if (panel === 'student-reflections') {
    renderStudentReflectionsArchive();
  }
}

// Helper to compute overall status of a sectional log based on its parts
function getLogOverallStatus(log) {
  if (!log.parts || log.parts.length === 0) return 'Progressing';
  const statuses = log.parts.map(p => p.status);
  if (statuses.every(s => s === 'Demonstrated')) return 'Demonstrated';
  if (statuses.some(s => s === 'Requires further development')) return 'Requires further development';
  return 'Progressing';
}

// == Coordinator Dashboard Overview ==
function renderOverviewMetrics() {
  const logs = DB.get('session_logs');
  const group = state.activeCoordinatorGroup;
  
  // Filter logs based on active Coordinator group toggle
  const filteredLogs = logs.filter(log => log.group === group);
  
  let requires = 0;
  let progressing = 0;
  let demonstrated = 0;
  
  // Determine latest status of each section in the active group
  const sections = GROUPS[group] || [];
  sections.forEach(sec => {
    // Find the latest log for this section
    const secLogs = filteredLogs.filter(l => l.section === sec);
    if (secLogs.length > 0) {
      // Sort to get the latest one
      secLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const latestStatus = getLogOverallStatus(secLogs[0]);
      if (latestStatus === 'Requires further development') requires++;
      else if (latestStatus === 'Progressing') progressing++;
      else if (latestStatus === 'Demonstrated') demonstrated++;
    }
  });
  
  dom.metricRequires.textContent = requires;
  dom.metricProgressing.textContent = progressing;
  dom.metricDemonstrated.textContent = demonstrated;
  dom.metricTotalLogs.textContent = filteredLogs.length;
}

function renderOverviewSynthesis() {
  const group = state.activeCoordinatorGroup;
  const logs = DB.get('session_logs').filter(l => l.group === group);
  const feedbacks = DB.get('tutti_feedback').filter(f => f.group === group);

  // Generate a dynamic synthesis description based on mock logs
  if (group === 'NUSSO') {
    const hornLogs = logs.filter(l => l.section === 'Horn' && l.status === 'Requires further development');
    const trumpetLogs = logs.filter(l => l.section === 'Trumpet' && l.status === 'Progressing');
    
    let summary = `Intonation and ensemble cohesion remain the primary targets for <strong>NUSSO</strong> sectionals. `;
    if (hornLogs.length > 0) {
      summary += `Horn intonation in <em>${hornLogs[0].piece}</em> is flagged as a key development concern due to pitch drift in high registers. `;
    } else {
      summary += `Wind intonation has shown standard stability this week. `;
    }
    
    if (trumpetLogs.length > 0) {
      summary += `Trumpet articulation in <em>${trumpetLogs[0].piece}</em> is progressing nicely and is ready for further assessment in the next tutti rehearsal.`;
    }
    
    dom.synthesisContent.innerHTML = summary;
  } else {
    // NUSWS Synthesis
    const clLogs = logs.filter(l => l.section === 'Clarinet' && l.status === 'Demonstrated');
    const tubaLogs = feedbacks.filter(f => f.section === 'Tuba' && f.status === 'Requires further development');
    
    let summary = `Rhythmic precision is highly stable in <strong>NUSWS</strong> woodwinds this week. `;
    if (clLogs.length > 0) {
      summary += `Clarinet syncopation alignment in <em>${clLogs[0].piece}</em> has been fully demonstrated in sectionals. `;
    }
    
    if (tubaLogs.length > 0) {
      summary += `However, rehearsal logs note that the low brass section (Tuba/Euphonium) needs to correct a half-beat lag in tempo synchronization.`;
    } else {
      summary += `Low brass sections are coordinating well with the conductor tempo.`;
    }
    dom.synthesisContent.innerHTML = summary;
  }
}

function renderOverviewPriorities() {
  const logs = DB.get('session_logs');
  const group = state.activeCoordinatorGroup;
  const sectionFilter = dom.overviewSectionFilter.value;
  
  // Filter for active group
  let filtered = logs.filter(log => log.group === group);
  
  // Filter by selected section
  if (sectionFilter !== 'all') {
    filtered = filtered.filter(l => l.section === sectionFilter);
  }
  
  // Sort latest first
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  if (filtered.length === 0) {
    dom.prioritiesTable.innerHTML = `<div class="table-row muted small justify-between">No active priorities found for these criteria.</div>`;
    return;
  }
  
  dom.prioritiesTable.innerHTML = filtered.map(item => {
    const overallStatus = getLogOverallStatus(item);
    let badgeClass = 'badge-yellow';
    if (overallStatus === 'Requires further development') badgeClass = 'badge-red';
    if (overallStatus === 'Demonstrated') badgeClass = 'badge-green';
    
    return `
      <div class="table-row">
        <div>
          <div class="row-primary-text">${item.section} · ${item.piece}</div>
          <div class="row-sub-text">${item.createdAt}</div>
          <div class="small muted" style="margin-top: 6px; font-style: italic;">"${item.generalFeedback}"</div>
        </div>
        <span class="badge ${badgeClass}">${overallStatus}</span>
      </div>
    `;
  }).join('');
}



// == Conductor Tutti Rehearsal Notes ==
function createObservationRow(group = 'NUSSO', section = '', domain = 'Intonation and Sound', content = '') {
  const rowId = 'obs-row-' + Date.now() + Math.random().toString(36).substr(2, 5);
  const row = document.createElement('div');
  row.id = rowId;
  row.className = 'observation-row flex-column gap-8';
  row.style.cssText = 'border: 1px solid var(--border-subtle); padding: 10px; border-radius: var(--radius-sm); background-color: rgba(255,255,255,0.01);';
  
  row.innerHTML = `
    <div class="grid-layout grid-2 gap-10">
      <div class="form-field">
        <label style="font-size: 0.75rem; margin-bottom: 2px;">Ensemble</label>
        <select class="row-group input-control" required style="padding: 4px 8px; font-size: 0.8rem; height: 32px;">
          <option value="NUSSO" ${group === 'NUSSO' ? 'selected' : ''}>NUSSO</option>
          <option value="NUSWS" ${group === 'NUSWS' ? 'selected' : ''}>NUSWS</option>
        </select>
      </div>
      <div class="form-field">
        <label style="font-size: 0.75rem; margin-bottom: 2px;">Section</label>
        <select class="row-section input-control" required style="padding: 4px 8px; font-size: 0.8rem; height: 32px;">
        </select>
      </div>
    </div>
    <div class="form-field">
      <label style="font-size: 0.75rem; margin-bottom: 2px;">Observation Details</label>
      <div class="flex-row gap-10 items-end">
        <textarea class="row-content textarea-control" style="height: 60px; min-height: 60px; font-size: 0.85rem;" placeholder="What should this section work on? (e.g. tuning in bars 24-32)..." required>${content}</textarea>
        <button type="button" class="btn btn-xs btn-outline text-red" onclick="this.closest('.observation-row').remove()" style="height: 32px;">Delete</button>
      </div>
    </div>
  `;
  
  dom.notesObservationsContainer.appendChild(row);
  
  const groupSelect = row.querySelector('.row-group');
  const sectionSelect = row.querySelector('.row-section');
  
  const updateSections = (g) => {
    populateFormSections(g, sectionSelect);
    if (section && g === group) {
      sectionSelect.value = section;
    }
  };
  
  groupSelect.addEventListener('change', (e) => updateSections(e.target.value));
  updateSections(group);
}

function renderCoordinatorNotes() {
  const list = DB.get('tutti_rehearsals');
  list.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  dom.notesCountBadge.textContent = `${list.length} Logs`;
  
  if (list.length === 0) {
    dom.tuttiRehearsalsList.innerHTML = `<p class="muted small">No tutti rehearsal logs recorded yet.</p>`;
    return;
  }
  
  dom.tuttiRehearsalsList.innerHTML = list.map(item => `
    <article class="item-card bg-glass animate-fade-in">
      <div class="item-card-header">
        <div>
          <strong class="item-card-title">${item.repertoire}</strong>
          <span class="xs muted" style="margin-left: 8px;">Date: ${item.date}</span>
        </div>
        <button class="btn btn-xs btn-outline text-red" onclick="deleteTuttiRehearsal('${item.id}')">Delete</button>
      </div>
      <p class="item-card-body small" style="background-color: rgba(255,255,255,0.02); padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-top: 6px;">
        <strong>General Rehearsal Summary:</strong><br>
        ${item.generalSummary}
      </p>
      <div class="flex-column gap-6" style="margin-top: 10px;">
        <strong>Feedback for Section:</strong>
        ${item.observations.length === 0 ? '<span class="xs muted">None recorded.</span>' : item.observations.map(obs => {
          let statusClass = 'badge-yellow';
          if (obs.status === 'Resolved') statusClass = 'badge-green';
          if (obs.status === 'Requires attention') statusClass = 'badge-red';
          return `
            <div class="table-row justify-between" style="padding: 6px 8px; background-color: rgba(0,0,0,0.02); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); font-size: 0.8rem;">
              <div style="flex: 1; padding-right: 12px;">
                <strong class="text-cyan">[${obs.group} ${obs.section}]</strong><br>
                <span class="muted">${obs.content}</span>
              </div>
              <span class="badge ${statusClass}" style="align-self: center;">${obs.status}</span>
            </div>
          `;
        }).join('')}
      </div>
    </article>
  `).join('');
}

// == Coordinator Logs Explorer Page ==
function handleExplorerFiltersChange() {
  const group = dom.explorerGroupFilter.value;
  populateSectionOptions(group === 'all' ? 'NUSSO' : group, dom.explorerSectionFilter);
function renderGlobalLogsExplorer() {
  let logs = DB.get('session_logs');
  let plans = DB.get('lesson_plans');
  const searchVal = dom.explorerSearch.value.toLowerCase();
  const groupFilter = dom.explorerGroupFilter.value;
  const sectionFilter = dom.explorerSectionFilter.value;
  
  if (groupFilter !== 'all') {
    logs = logs.filter(l => l.group === groupFilter);
    plans = plans.filter(p => p.group === groupFilter);
  }
  
  if (sectionFilter !== 'all') {
    logs = logs.filter(l => l.section === sectionFilter);
    plans = plans.filter(p => p.section === sectionFilter);
  }
  
  const planItems = plans.map(p => ({ ...p, type: 'plan' }));
  const logItems = logs.map(l => ({ ...l, type: 'log' }));
  let filtered = [...planItems, ...logItems];
  
  if (searchVal) {
    filtered = filtered.filter(item => {
      const pieceMatch = item.piece.toLowerCase().includes(searchVal);
      const sectionMatch = item.section.toLowerCase().includes(searchVal);
      if (item.type === 'plan') {
        const goalMatch = item.parts.some(p => p.goal.toLowerCase().includes(searchVal) || p.location.toLowerCase().includes(searchVal));
        return pieceMatch || sectionMatch || goalMatch;
      } else {
        const feedbackMatch = item.generalFeedback && item.generalFeedback.toLowerCase().includes(searchVal);
        const notesMatch = item.parts.some(p => p.notes.toLowerCase().includes(searchVal) || p.location.toLowerCase().includes(searchVal));
        return pieceMatch || sectionMatch || feedbackMatch || notesMatch;
      }
    });
  }
  
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  if (filtered.length === 0) {
    dom.explorerLogsList.innerHTML = `<p class="muted small">No sectional rehearsal logs or lesson plans found matching filters.</p>`;
    return;
  }
  
  dom.explorerLogsList.innerHTML = filtered.map(item => {
    if (item.type === 'plan') {
      return `
        <article class="item-card bg-glass animate-fade-in" style="margin-top: 10px; border-left: 3px solid var(--status-yellow);">
          <div class="item-card-header">
            <div>
              <span class="badge badge-accent" style="margin-right: 6px;">${item.group}</span>
              <span class="badge badge-yellow" style="margin-right: 6px;">Lesson Plan</span>
              <strong class="item-card-title">${item.section} Section</strong>
            </div>
            <span class="xs muted">Date: ${item.createdAt}</span>
          </div>
          <div class="item-card-meta">
            Repertoire: <strong>${item.piece}</strong>
          </div>
          <div class="flex-column gap-6" style="margin-top: 10px;">
            <strong>Target Sections:</strong>
            ${item.parts.map(part => `
              <div style="font-size: 0.8rem; border-left: 2px solid var(--accent); padding-left: 6px; margin-top: 4px;">
                <strong>${part.location}:</strong> <span class="muted">${part.goal}</span>
              </div>
            `).join('')}
          </div>
        </article>
      `;
    }
    
    return `
      <article class="item-card bg-glass animate-fade-in" style="margin-top: 10px; border-left: 3px solid var(--accent);">
        <div class="item-card-header">
          <div>
            <span class="badge badge-accent" style="margin-right: 6px;">${item.group}</span>
            <span class="badge badge-accent" style="margin-right: 6px;">Sectional Log</span>
            <strong class="item-card-title">${item.section} Section</strong>
          </div>
          <span class="xs muted">Date: ${item.createdAt}</span>
        </div>
        <div class="item-card-meta">
          Repertoire: <strong>${item.piece}</strong>
        </div>
        <p class="item-card-body small" style="background-color: rgba(255,255,255,0.02); padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-top: 6px;">
          <strong>General Feedback:</strong><br>
          ${item.generalFeedback}
        </p>
        <div class="flex-column gap-6" style="margin-top: 10px;">
          <strong>Section Progress:</strong>
          ${item.parts.map(part => {
            let badgeClass = 'badge-yellow';
            if (part.status === 'Requires further development') badgeClass = 'badge-red';
            if (part.status === 'Demonstrated') badgeClass = 'badge-green';
            return `
              <div class="table-row justify-between" style="padding: 6px 8px; background-color: rgba(0,0,0,0.02); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); font-size: 0.8rem; margin-top: 4px;">
                <div style="flex: 1; padding-right: 12px;">
                  <strong class="text-cyan">${part.location}</strong><br>
                  <span class="muted">${part.notes}</span>
                </div>
                <span class="badge ${badgeClass}" style="align-self: center;">${part.status}</span>
              </div>
            `;
          }).join('')}
        </div>
      </article>
    `;
  }).join('');
}


// == Tutor Section Hub ==
function renderTutorHub() {
  const u = state.activeUser;
  if (!u) return;

  const rehearsals = DB.get('tutti_rehearsals');
  
  // Find all observations matching this tutor's section
  const myObservations = [];
  rehearsals.forEach(reh => {
    reh.observations.forEach(obs => {
      if (obs.group === u.group && obs.section === u.section) {
        myObservations.push({
          rehearsalId: reh.id,
          date: reh.date,
          repertoire: reh.repertoire,
          generalSummary: reh.generalSummary,
          ...obs
        });
      }
    });
  });

  // Render Tutti alerts: if there are observations marked 'Requires attention'
  const urgentObs = myObservations.filter(o => o.status === 'Requires attention');
  if (urgentObs.length > 0) {
    dom.tutorTuttiAlertContainer.innerHTML = `
      <div class="rehearsal-alert">
        <div class="alert-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <div class="alert-body">
          <h4>Conductor Attention Required</h4>
          <p>Tutti rehearsal on <strong>${urgentObs[0].date}</strong> highlights: <em>"${urgentObs[0].content}"</em></p>
        </div>
      </div>
    `;
  } else {
    dom.tutorTuttiAlertContainer.innerHTML = '';
  }

  // Render Conductor's Observations List
  if (myObservations.length === 0) {
    dom.tutorTuttiObservations.innerHTML = `<p class="muted small">No rehearsal observations logged by the conductor for the ${u.section} section.</p>`;
  } else {
    myObservations.sort((a, b) => new Date(b.date) - new Date(a.date));
    dom.tutorTuttiObservations.innerHTML = myObservations.map(obs => {
      let statusClass = 'badge-yellow';
      if (obs.status === 'Resolved') statusClass = 'badge-green';
      if (obs.status === 'Requires attention') statusClass = 'badge-red';
      if (obs.status === 'In Progress') statusClass = 'badge-yellow';
      
      return `
        <div class="item-card bg-glass" style="margin-top: 8px;">
          <div class="item-card-header">
            <div>
              <strong class="item-card-title">${obs.repertoire}</strong>
              <span class="xs muted" style="margin-left: 8px;">Tutti Date: ${obs.date}</span>
            </div>
            <div class="flex-row items-center gap-10">
              <span class="badge ${statusClass}">${obs.status}</span>
              ${obs.status !== 'Resolved' ? `<button class="btn btn-xs btn-primary" onclick="prefillPlannerFromObservation('${obs.id}')">Plan Sectional</button>` : ''}
            </div>
          </div>

          <p class="small" style="margin-top: 6px;"><strong>Conductor's Feedback:</strong><br> ${obs.content}</p>
          <div class="xs muted" style="margin-top: 8px; font-style: italic; border-top: 1px dashed var(--border-subtle); padding-top: 4px;">
            General Rehearsal Context: "${obs.generalSummary.slice(0, 120)}..."
          </div>
        </div>
      `;
    }).join('');
  }



  // Render check-in reminders
  renderTutorCheckinReminders();
}

// Helper to add a dynamic plan part row
function createPlanPartRow(location = '', goal = '') {
  const rowId = 'plan-part-row-' + Date.now() + Math.random().toString(36).substr(2, 5);
  const row = document.createElement('div');
  row.id = rowId;
  row.className = 'plan-part-row flex-row gap-10 items-center';
  row.style.cssText = 'margin-top: 6px;';
  
  row.innerHTML = `
    <input type="text" class="row-part-location input-control" style="flex: 2; font-size: 0.85rem; height: 32px;" placeholder="e.g. Section A (bars 24-32)" value="${location}" required />
    <input type="text" class="row-part-goal input-control" style="flex: 3; font-size: 0.85rem; height: 32px;" placeholder="e.g. Lock unison pitch stability" value="${goal}" required />
    <button type="button" class="btn btn-xs btn-outline text-red" onclick="this.closest('.plan-part-row').remove()" style="height: 32px; flex: 0.5;">Delete</button>
  `;
  dom.planPartsContainer.appendChild(row);
}

// Helper to add a dynamic log part row
function createLogPartRow(location = '', status = 'Progressing', notes = '') {
  const rowId = 'log-part-row-' + Date.now() + Math.random().toString(36).substr(2, 5);
  const row = document.createElement('div');
  row.id = rowId;
  row.className = 'log-part-row flex-column gap-6';
  row.style.cssText = 'border: 1px solid var(--border-subtle); padding: 8px; border-radius: var(--radius-sm); background-color: rgba(255,255,255,0.01); margin-top: 6px;';
  
  row.innerHTML = `
    <div class="flex-row gap-10 items-center">
      <input type="text" class="row-log-location input-control" style="flex: 3; font-size: 0.85rem; height: 32px;" placeholder="Section (e.g. Section A / bars 24-32)" value="${location}" required />
      <select class="row-log-status input-control" style="flex: 2; font-size: 0.85rem; height: 32px;" required>
        <option value="Requires further development" ${status === 'Requires further development' ? 'selected' : ''}>Requires further development</option>
        <option value="Progressing" ${status === 'Progressing' ? 'selected' : ''}>Progressing</option>
        <option value="Demonstrated" ${status === 'Demonstrated' ? 'selected' : ''}>Demonstrated</option>
      </select>
      <button type="button" class="btn btn-xs btn-outline text-red" onclick="this.closest('.log-part-row').remove()" style="height: 32px;">Delete</button>
    </div>
    <input type="text" class="row-log-notes input-control" style="font-size: 0.85rem; height: 32px;" placeholder="Outcome notes for this section..." value="${notes}" required />
  `;
  dom.logPartsContainer.appendChild(row);
}

// == Tutor Lesson Planner ==
function renderTutorPlansList() {
  const u = state.activeUser;
  const plans = DB.get('lesson_plans').filter(p => p.group === u.group && p.section === u.section);
  
  if (plans.length === 0) {
    dom.tutorPlansList.innerHTML = `<p class="muted small">No rehearsal plans created yet. Write one using the planner form.</p>`;
    return;
  }
  
  dom.tutorPlansList.innerHTML = plans.map(plan => `
    <div class="item-card bg-glass">
      <div class="item-card-header">
        <strong class="item-card-title">${plan.piece}</strong>
        <button class="btn btn-xs btn-outline text-red" onclick="deleteLessonPlan('${plan.id}')">Delete</button>
      </div>
      <div class="flex-column gap-6" style="margin-top: 8px;">
        <strong>Target Sections:</strong>
        ${plan.parts.map(part => `
          <div style="font-size: 0.8rem; border-left: 2px solid var(--accent); padding-left: 6px; margin-top: 4px;">
            <strong>${part.location}:</strong> <span class="muted">${part.goal}</span>
          </div>
        `).join('')}
      </div>
      <div class="xs muted" style="margin-top: 10px;">Plan established: ${plan.createdAt}</div>
    </div>
  `).join('');
}

// == Tutor Rehearsal Session Logger ==
function renderTutorLoggerAssistant() {
  const u = state.activeUser;
  const plans = DB.get('lesson_plans').filter(p => p.group === u.group && p.section === u.section);
  
  // Sort plans by date descending
  plans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  dom.logPlanSelect.innerHTML = `
    <option value="">-- No Plan / Custom Log --</option>
    ${plans.map(p => `<option value="${p.id}">${p.piece} (Plan from ${p.createdAt})</option>`).join('')}
  `;
}

// Handle change on integrated lesson plan selector dropdown
function handleLogPlanSelectChange(e) {
  const planId = e.target.value;
  if (!planId) {
    // Clear and add a default row
    dom.logRepertoireSelect.value = '';
    dom.logRepertoireCustom.value = '';
    dom.logRepertoireCustom.style.display = 'none';
    dom.logRepertoireCustom.required = false;
    dom.logPartsContainer.innerHTML = '';
    createLogPartRow();
    return;
  }
  
  const plans = DB.get('lesson_plans');
  const plan = plans.find(p => p.id === planId);
  if (plan) {
    // Fill Repertoire
    let found = false;
    for (let i = 0; i < dom.logRepertoireSelect.options.length; i++) {
      if (dom.logRepertoireSelect.options[i].value === plan.piece) {
        dom.logRepertoireSelect.value = plan.piece;
        found = true;
        break;
      }
    }
    
    if (!found) {
      dom.logRepertoireSelect.value = '__custom__';
      dom.logRepertoireCustom.style.display = 'block';
      dom.logRepertoireCustom.required = true;
      dom.logRepertoireCustom.value = plan.piece;
    } else {
      dom.logRepertoireCustom.style.display = 'none';
      dom.logRepertoireCustom.required = false;
    }
    
    // Clear and populate sections from the lesson plan
    dom.logPartsContainer.innerHTML = '';
    plan.parts.forEach(part => {
      createLogPartRow(part.location, 'Progressing', '');
    });
  }
}

function prefillLoggerForm(repertoire) {
  // Find option matching repertoire title
  let found = false;
  for (let i = 0; i < dom.logRepertoireSelect.options.length; i++) {
    if (dom.logRepertoireSelect.options[i].value === repertoire) {
      dom.logRepertoireSelect.value = repertoire;
      found = true;
      break;
    }
  }
  
  if (!found) {
    dom.logRepertoireSelect.value = '__custom__';
    dom.logRepertoireCustom.style.display = 'block';
    dom.logRepertoireCustom.required = true;
    dom.logRepertoireCustom.value = repertoire;
  } else {
    dom.logRepertoireCustom.style.display = 'none';
    dom.logRepertoireCustom.required = false;
  }
  
  // Prefill parts from the latest matching lesson plan
  const u = state.activeUser;
  if (u) {
    const plans = DB.get('lesson_plans').filter(p => p.group === u.group && p.section === u.section && p.piece === repertoire);
    if (plans.length > 0) {
      plans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const latestPlan = plans[0];
      
      // Select the plan in our integrated selector dropdown
      dom.logPlanSelect.value = latestPlan.id;
      
      dom.logPartsContainer.innerHTML = '';
      latestPlan.parts.forEach(part => {
        createLogPartRow(part.location, 'Progressing', '');
      });
    } else {
      dom.logPlanSelect.value = '';
    }
  }
  
  dom.logGeneralFeedback.focus();
}

// function renderTutorLogsArchive() {
  const u = state.activeUser;
  const plans = DB.get('lesson_plans').filter(p => p.group === u.group && p.section === u.section);
  const logs = DB.get('session_logs').filter(l => l.group === u.group && l.section === u.section);
  
  const planItems = plans.map(p => ({ ...p, type: 'plan' }));
  const logItems = logs.map(l => ({ ...l, type: 'log' }));
  const allItems = [...planItems, ...logItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  if (allItems.length === 0) {
    dom.tutorLogsList.innerHTML = `<p class="muted small">No submitted sectional logs or lesson plans found for your section.</p>`;
    return;
  }
  
  dom.tutorLogsList.innerHTML = allItems.map(item => {
    if (item.type === 'plan') {
      return `
        <div class="item-card bg-glass animate-fade-in" style="margin-top: 10px; border-left: 3px solid var(--status-yellow);">
          <div class="item-card-header">
            <div>
              <span class="badge badge-yellow" style="margin-right: 6px;">Lesson Plan</span>
              <strong class="item-card-title">${item.piece}</strong>
            </div>
            <button class="btn btn-xs btn-outline text-red" onclick="deleteLessonPlan('${item.id}')">Delete</button>
          </div>
          <div class="flex-column gap-6" style="margin-top: 8px;">
            <strong>Target Sections:</strong>
            ${item.parts.map(part => `
              <div style="font-size: 0.8rem; border-left: 2px solid var(--accent); padding-left: 6px; margin-top: 4px;">
                <strong>${part.location}:</strong> <span class="muted">${part.goal}</span>
              </div>
            `).join('')}
          </div>
          <div class="item-card-footer" style="margin-top: 10px;">
            <span>Planned on: ${item.createdAt}</span>
          </div>
        </div>
      `;
    }
    
    return `
      <div class="item-card bg-glass animate-fade-in" style="margin-top: 10px; border-left: 3px solid var(--accent);">
        <div class="item-card-header">
          <div>
            <span class="badge badge-accent" style="margin-right: 6px;">Sectional Log</span>
            <strong class="item-card-title">${item.piece}</strong>
          </div>
          <button class="btn btn-xs btn-outline text-red" onclick="deleteSessionLog('${item.id}')">Delete</button>
        </div>
        <p class="item-card-body small" style="background-color: rgba(255,255,255,0.02); padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-top: 6px;">
          <strong>General Sectional Feedback:</strong><br>
          ${item.generalFeedback}
        </p>
        <div class="flex-column gap-6" style="margin-top: 10px;">
          <strong>Section Progress:</strong>
          ${item.parts.map(part => {
            let badgeClass = 'badge-yellow';
            if (part.status === 'Requires further development') badgeClass = 'badge-red';
            if (part.status === 'Demonstrated') badgeClass = 'badge-green';
            return `
              <div class="table-row justify-between" style="padding: 6px 8px; background-color: rgba(0,0,0,0.02); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); font-size: 0.8rem; margin-top: 4px;">
                <div style="flex: 1; padding-right: 12px;">
                  <strong class="text-cyan">${part.location}</strong><br>
                  <span class="muted">${part.notes}</span>
                </div>
                <span class="badge ${badgeClass}" style="align-self: center;">${part.status}</span>
              </div>
            `;
          }).join('')}
        </div>
        <div class="item-card-footer" style="margin-top: 8px;">
          <span>Submitted on: ${item.createdAt}</span>
          <span>Privacy Locked</span>
        </div>
      </div>
    `;
  }).join('');
}


// 8. Form Submission Handlers
function handleTuttiNotesSubmit(e) {
  e.preventDefault();
  
  const pieceTitle = getSubmittedRepertoire(dom.notesRepertoireSelect, dom.notesRepertoireCustom, state.activeCoordinatorGroup);
  if (!pieceTitle) {
    alert('Please select or specify a repertoire title.');
    return;
  }

  const observations = [];
  const rows = dom.notesObservationsContainer.querySelectorAll('.observation-row');
  rows.forEach(row => {
    const g = row.querySelector('.row-group').value;
    const s = row.querySelector('.row-section').value;
    const c = row.querySelector('.row-content').value.trim();
    if (c) {
      observations.push({
        id: 'obs-' + Date.now() + Math.random().toString(36).substr(2, 5),
        group: g,
        section: s,
        content: c,
        status: 'Requires attention'
      });
    }
  });

  const newItem = {
    id: 'tutti-' + Date.now(),
    date: dom.notesDate.value,
    repertoire: pieceTitle,
    generalSummary: dom.notesGeneralSummary.value.trim(),
    observations: observations
  };

  const current = DB.get('tutti_rehearsals');
  current.push(newItem);
  DB.set('tutti_rehearsals', current);

  // Clear Form
  dom.notesDate.value = '';
  dom.notesGeneralSummary.value = '';
  dom.notesObservationsContainer.innerHTML = '';
  createObservationRow(); // Add one clean row

  populateRepertoireDropdown(state.activeCoordinatorGroup, dom.notesRepertoireSelect, dom.notesRepertoireCustom);
  renderCoordinatorNotes();
  alert('Conductor rehearsal notes published successfully!');
}

function handleLessonPlanSubmit(e) {
  e.preventDefault();
  const u = state.activeUser;
  
  const pieceTitle = getSubmittedRepertoire(dom.planRepertoireSelect, dom.planRepertoireCustom, u.group);
  if (!pieceTitle) {
    alert('Please select or specify a repertoire title.');
    return;
  }

  const parts = [];
  const rows = dom.planPartsContainer.querySelectorAll('.plan-part-row');
  rows.forEach(row => {
    const loc = row.querySelector('.row-part-location').value.trim();
    const goal = row.querySelector('.row-part-goal').value.trim();
    if (loc && goal) {
      parts.push({ location: loc, goal: goal });
    }
  });

  if (parts.length === 0) {
    alert('Please specify at least one part/location for the lesson plan.');
    return;
  }

  const newItem = {
    id: 'plan-' + Date.now(),
    group: u.group,
    section: u.section,
    piece: pieceTitle,
    parts: parts,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  const current = DB.get('lesson_plans');
  current.push(newItem);
  DB.set('lesson_plans', current);
  
  // Clear Form
  dom.planRepertoireSelect.value = '';
  dom.planRepertoireCustom.value = '';
  dom.planRepertoireCustom.style.display = 'none';
  dom.planPartsContainer.innerHTML = '';
  createPlanPartRow();
  
  populateRepertoireDropdown(u.group, dom.planRepertoireSelect, dom.planRepertoireCustom);
  renderTutorPlansList();
  alert('Lesson plan added successfully!');
}

function handleSessionLogSubmit(e) {
  e.preventDefault();
  const u = state.activeUser;
  
  const pieceTitle = getSubmittedRepertoire(dom.logRepertoireSelect, dom.logRepertoireCustom, u.group);
  if (!pieceTitle) {
    alert('Please select or specify a repertoire title.');
    return;
  }

  const parts = [];
  const rows = dom.logPartsContainer.querySelectorAll('.log-part-row');
  rows.forEach(row => {
    const loc = row.querySelector('.row-log-location').value.trim();
    const status = row.querySelector('.row-log-status').value;
    const notes = row.querySelector('.row-log-notes').value.trim();
    if (loc) {
      parts.push({ location: loc, status: status, notes: notes });
    }
  });

  if (parts.length === 0) {
    alert('Please specify at least one part/location for the sectional log.');
    return;
  }

  const newItem = {
    id: 'log-' + Date.now(),
    group: u.group,
    section: u.section,
    piece: pieceTitle,
    generalFeedback: dom.logGeneralFeedback.value.trim(),
    parts: parts,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  const current = DB.get('session_logs');
  current.push(newItem);
  DB.set('session_logs', current);

  // Update matching conductor observations in DB
  const rehearsals = DB.get('tutti_rehearsals');
  let updated = false;
  
  // Resolve if any part was Demonstrated
  const hasDemonstrated = parts.some(p => p.status === 'Demonstrated');
  const targetStatus = hasDemonstrated ? 'Resolved' : 'In Progress';
  
  rehearsals.forEach(reh => {
    if (reh.repertoire === pieceTitle) {
      reh.observations.forEach(obs => {
        if (obs.group === u.group && obs.section === u.section) {
          obs.status = targetStatus;
          updated = true;
        }
      });
    }
  });
  if (updated) {
    DB.set('tutti_rehearsals', rehearsals);
  }
  
  // Clear Form
  dom.logPlanSelect.value = '';
  dom.logRepertoireSelect.value = '';
  dom.logRepertoireCustom.value = '';
  dom.logRepertoireCustom.style.display = 'none';
  dom.logGeneralFeedback.value = '';
  dom.logPartsContainer.innerHTML = '';
  createLogPartRow();
  
  populateRepertoireDropdown(u.group, dom.logRepertoireSelect, dom.logRepertoireCustom);
  renderTutorLoggerAssistant();
  alert('Rehearsal progress logged and transmitted to coordinators!');
}


// 9. Deletion Actions (Globals defined on window for onclick calls)
window.deleteTuttiRehearsal = function(id) {
  if (confirm('Delete this tutti rehearsal notes log?')) {
    const list = DB.get('tutti_rehearsals').filter(item => item.id !== id);
    DB.set('tutti_rehearsals', list);
    renderCoordinatorNotes();
  }
};

window.deleteSyllabusItem = function(id) {
  if (confirm('Delete this syllabus objective?')) {
    const list = DB.get('syllabus').filter(item => item.id !== id);
    DB.set('syllabus', list);
    renderCoordinatorSyllabusList();
  }
};

window.deleteTuttiItem = function(id) {
  if (confirm('Delete this tutti feedback log?')) {
    const list = DB.get('tutti_feedback').filter(item => item.id !== id);
    DB.set('tutti_feedback', list);
    renderCoordinatorTuttiList();
  }
};

window.deleteLessonPlan = function(id) {
  if (confirm('Remove this lesson plan?')) {
    const list = DB.get('lesson_plans').filter(item => item.id !== id);
    DB.set('lesson_plans', list);
    renderTutorPlansList();
    renderTutorLoggerAssistant();
    renderTutorLogsArchive();
  }
};

window.deleteSessionLog = function(id) {
  if (confirm('Delete this session log?')) {
    const list = DB.get('session_logs').filter(item => item.id !== id);
    DB.set('session_logs', list);
    renderTutorLogsArchive();
  }
};

window.prefillLoggerForm = prefillLoggerForm;


// 10. Rehearsal Record Search & Analysis
function handleDatabaseQuery() {
  const query = dom.dbQueryInput.value.trim().toLowerCase();
  
  if (!query) {
    dom.queryResponsePanel.hidden = false;
    dom.queryResponsePanel.innerHTML = '<span class="text-red">Please specify a search term or query criteria.</span>';
    return;
  }
  
  const logs = DB.get('session_logs');
  const syllabus = DB.get('syllabus');
  const feedback = DB.get('tutti_feedback');
  const reflections = DB.get('student_reflections');
  
  let matchLogs = [];
  let matchSyllabus = [];
  let matchFeedback = [];
  let matchReflections = [];
  
  const keywords = query.split(' ').filter(k => k.length > 2);
  
  if (keywords.length > 0) {
    matchLogs = logs.filter(l => keywords.some(k => 
      l.piece.toLowerCase().includes(k) || 
      l.observations.toLowerCase().includes(k) ||
      l.section.toLowerCase().includes(k) ||
      l.domain.toLowerCase().includes(k)
    ));
    
    matchSyllabus = syllabus.filter(s => keywords.some(k => 
      s.piece.toLowerCase().includes(k) || 
      s.notes.toLowerCase().includes(k) ||
      s.section.toLowerCase().includes(k) ||
      s.domain.toLowerCase().includes(k)
    ));
    
    matchFeedback = feedback.filter(f => keywords.some(k => 
      f.piece.toLowerCase().includes(k) || 
      f.content.toLowerCase().includes(k) ||
      f.section.toLowerCase().includes(k)
    ));

    matchReflections = reflections.filter(r => keywords.some(k =>
      r.piece.toLowerCase().includes(k) ||
      r.challenges.toLowerCase().includes(k) ||
      r.content.toLowerCase().includes(k) ||
      r.studentName.toLowerCase().includes(k) ||
      r.section.toLowerCase().includes(k)
    ));
  }
  
  dom.queryResponsePanel.hidden = false;
  
  if (matchLogs.length === 0 && matchSyllabus.length === 0 && matchFeedback.length === 0 && matchReflections.length === 0) {
    dom.queryResponsePanel.innerHTML = `
      <strong>No database records found matching these criteria.</strong><br>
      <span class="small muted">Try querying terms like: "Horn", "Clarinet", "Intonation", "First Suite", "Requires development".</span>
    `;
    return;
  }
  
  // Synthesize results in academic phrasing
  let html = `<strong>Rehearsal Record Synthesis Results:</strong><br><br>`;
  
  if (matchSyllabus.length > 0) {
    html += `• <strong>${matchSyllabus.length} Curricular Directive(s) Located:</strong><br>`;
    matchSyllabus.forEach(s => {
      html += `<span class="xs muted">[${s.group} ${s.section}]</span> ${s.piece} (${s.domain}) - <em>"${s.notes.slice(0, 80)}..."</em><br>`;
    });
    html += `<br>`;
  }
  
  if (matchFeedback.length > 0) {
    html += `• <strong>${matchFeedback.length} Tutti Rehearsal Feedback Entry(s) Located:</strong><br>`;
    matchFeedback.forEach(f => {
      html += `<span class="xs muted">[${f.group} ${f.section}]</span> Priority: ${f.status} - <em>"${f.content.slice(0, 80)}..."</em><br>`;
    });
    html += `<br>`;
  }
  
  if (matchLogs.length > 0) {
    html += `• <strong>${matchLogs.length} Sectional Log Submission(s) Located:</strong><br>`;
    matchLogs.forEach(l => {
      html += `<span class="xs muted">[${l.group} ${l.section}]</span> Progress: ${l.status} - <em>"${l.observations.slice(0, 80)}..."</em><br>`;
    });
    html += `<br>`;
  }

  if (matchReflections.length > 0) {
    html += `• <strong>${matchReflections.length} Student Reflection(s) Located:</strong><br>`;
    matchReflections.forEach(r => {
      html += `<span class="xs muted">[${r.group} ${r.section} - ${r.studentName}]</span> Confidence: ${r.rating}/5 - <em>"${r.content.slice(0, 80)}..."</em><br>`;
    });
  }
  
  dom.queryResponsePanel.innerHTML = html;
}

// 11. Repertoire Management Helpers
function populateRepertoireDropdown(group, selectEl, customEl) {
  const repertoireList = DB.get('repertoire');
  const matching = repertoireList.filter(r => r.group === 'All' || r.group === group);
  
  selectEl.innerHTML = `
    <option value="" disabled selected>-- Select Repertoire --</option>
    ${matching.map(r => `<option value="${r.title}">${r.title}</option>`).join('')}
    <option value="__custom__">+ Add Custom Repertoire...</option>
  `;
  
  customEl.style.display = 'none';
  customEl.required = false;
  
  selectEl.onchange = (e) => {
    if (e.target.value === '__custom__') {
      customEl.style.display = 'block';
      customEl.required = true;
      customEl.focus();
    } else {
      customEl.style.display = 'none';
      customEl.required = false;
    }
  };
}

function getSubmittedRepertoire(selectEl, customEl, group) {
  if (selectEl.value === '__custom__') {
    const title = customEl.value.trim();
    if (!title) return '';
    
    const repertoireList = DB.get('repertoire');
    const exists = repertoireList.some(r => r.title.toLowerCase() === title.toLowerCase());
    if (!exists) {
      repertoireList.push({
        id: 'rep-' + Date.now(),
        title: title,
        group: group
      });
      DB.set('repertoire', repertoireList);
    }
    return title;
  }
  return selectEl.value;
}

// == Student Hub ==
function renderStudentHub() {
  const u = state.activeUser;
  if (!u) return;

  // 1. Render Conductor Rehearsal Observations
  const rehearsals = DB.get('tutti_rehearsals');
  const myObservations = [];
  rehearsals.forEach(reh => {
    reh.observations.forEach(obs => {
      if (obs.group === u.group && obs.section === u.section) {
        myObservations.push({
          date: reh.date,
          repertoire: reh.repertoire,
          ...obs
        });
      }
    });
  });

  if (myObservations.length === 0) {
    dom.studentSyllabusList.innerHTML = `<p class="muted small">No rehearsal observations logged by the conductor for the ${u.section} section.</p>`;
  } else {
    myObservations.sort((a, b) => new Date(b.date) - new Date(a.date));
    dom.studentSyllabusList.innerHTML = myObservations.map(obs => {
      let statusClass = 'badge-yellow';
      if (obs.status === 'Resolved') statusClass = 'badge-green';
      if (obs.status === 'Requires attention') statusClass = 'badge-red';
      if (obs.status === 'In Progress') statusClass = 'badge-yellow';
      
      return `
        <div class="item-card bg-glass animate-fade-in">
          <div class="item-card-header">
            <div>
              <strong class="item-card-title">${obs.repertoire}</strong>
              <span class="xs muted" style="margin-left: 8px;">Tutti Date: ${obs.date}</span>
            </div>
            <span class="badge ${statusClass}">${obs.status}</span>
          </div>
          <p class="small" style="margin-top: 6px;"><strong>Conductor Observation:</strong><br> ${obs.content}</p>
        </div>
      `;
    }).join('');
  }

  // 2. Render tutor session logs & plans
  const plans = DB.get('lesson_plans').filter(p => p.group === u.group && p.section === u.section);
  const logs = DB.get('session_logs').filter(l => l.group === u.group && l.section === u.section);
  
  const planItems = plans.map(p => ({ ...p, type: 'plan' }));
  const logItems = logs.map(l => ({ ...l, type: 'log' }));
  const allItems = [...planItems, ...logItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  if (allItems.length === 0) {
    dom.studentTutorLogsList.innerHTML = `<p class="muted small">No recent rehearsals planned or logged by your section tutor.</p>`;
  } else {
    dom.studentTutorLogsList.innerHTML = allItems.map(item => {
      if (item.type === 'plan') {
        return `
          <div class="item-card bg-glass animate-fade-in" style="margin-top: 10px; border-left: 3px solid var(--status-yellow);">
            <div class="item-card-header">
              <div>
                <span class="badge badge-yellow" style="margin-right: 6px;">Lesson Plan</span>
                <strong class="item-card-title">${item.piece}</strong>
              </div>
            </div>
            <div class="flex-column gap-6" style="margin-top: 8px;">
              <strong>Target Sections:</strong>
              ${item.parts.map(part => `
                <div style="font-size: 0.8rem; border-left: 2px solid var(--accent); padding-left: 6px; margin-top: 4px;">
                  <strong>${part.location}:</strong> <span class="muted">${part.goal}</span>
                </div>
              `).join('')}
            </div>
            <div class="item-card-footer" style="margin-top: 10px;">
              <span>Planned on: ${item.createdAt}</span>
            </div>
          </div>
        `;
      }
      
      return `
        <div class="item-card bg-glass animate-fade-in" style="margin-top: 10px; border-left: 3px solid var(--accent);">
          <div class="item-card-header">
            <div>
              <span class="badge badge-accent" style="margin-right: 6px;">Sectional Log</span>
              <strong class="item-card-title">${item.piece}</strong>
            </div>
            <button class="btn btn-xs btn-primary" onclick="prefillStudentReflector('${item.id}')">Reflect on this Rehearsal</button>
          </div>
          <p class="item-card-body small" style="background-color: rgba(255,255,255,0.02); padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-top: 6px;">
            <strong>Tutor General Feedback:</strong><br>
            ${item.generalFeedback}
          </p>
          <div class="flex-column gap-6" style="margin-top: 10px;">
            <strong>Section Progress:</strong>
            ${item.parts.map(part => {
              let badgeClass = 'badge-yellow';
              if (part.status === 'Requires further development') badgeClass = 'badge-red';
              if (part.status === 'Demonstrated') badgeClass = 'badge-green';
              return `
                <div class="table-row justify-between" style="padding: 6px 8px; background-color: rgba(0,0,0,0.02); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); font-size: 0.8rem; margin-top: 4px;">
                  <div style="flex: 1; padding-right: 12px;">
                    <strong class="text-cyan">${part.location}</strong><br>
                    <span class="muted">${part.notes}</span>
                  </div>
                  <span class="badge ${badgeClass}" style="align-self: center;">${part.status}</span>
                </div>
              `;
            }).join('')}
          </div>
          <div class="item-card-footer" style="margin-top: 10px;">
            <span>Logged on: ${item.createdAt}</span>
          </div>
        </div>
      `;
    }).join('');
  }
}

// Prefill student reflection form and redirect
window.prefillStudentReflector = function(logId) {
  const u = state.activeUser;
  if (!u) return;
  
  // Set panel active in sidebar
  const navItems = dom.sidebarNav.querySelectorAll('.nav-item');
  navItems.forEach(b => b.classList.remove('active'));
  const btnReflector = dom.sidebarNav.querySelector('[data-panel="student-reflector"]');
  if (btnReflector) btnReflector.classList.add('active');
  
  switchPanel('student-reflector');
  
  // Render reflector log selector options
  renderStudentReflector();
  
  // Pre-select logId
  dom.reflectorLogSelect.value = logId;
};

// == Student Reflection Form ==
function renderStudentReflector() {
  const u = state.activeUser;
  if (!u) return;

  const logs = DB.get('session_logs').filter(log => log.group === u.group && log.section === u.section);
  dom.reflectorLogSelect.innerHTML = `
    <option value="" disabled selected>-- Select Rehearsal Log --</option>
    ${logs.map(log => `<option value="${log.id}">${log.piece} (${log.createdAt})</option>`).join('')}
  `;
}

// Handle Student Reflection Form Submit
function handleStudentReflectionSubmit(e) {
  e.preventDefault();
  const u = state.activeUser;
  if (!u) return;

  const logId = dom.reflectorLogSelect.value;
  const logs = DB.get('session_logs');
  const matchedLog = logs.find(l => l.id === logId);
  
  if (!matchedLog) {
    alert('Please select a valid rehearsal session to reflect on.');
    return;
  }

  const name = dom.reflectorName.value.trim() || 'Anonymous';
  const rating = parseInt(dom.reflectorRating.value);
  const challenges = dom.reflectorChallenges.value.trim();
  const content = dom.reflectorContent.value.trim();

  const newReflection = {
    id: 'ref-' + Date.now(),
    group: u.group,
    section: u.section,
    logId: logId,
    piece: matchedLog.piece,
    rating: rating,
    challenges: challenges,
    content: content,
    studentName: name,
    createdAt: new Date().toISOString().split('T')[0]
  };

  const reflections = DB.get('student_reflections');
  reflections.push(newReflection);
  DB.set('student_reflections', reflections);

  // Clear Form
  dom.reflectorLogSelect.value = '';
  dom.reflectorName.value = '';
  dom.reflectorRating.value = '3';
  dom.reflectorChallenges.value = '';
  dom.reflectorContent.value = '';

  // Redirect to Reflection History
  const navItems = dom.sidebarNav.querySelectorAll('.nav-item');
  navItems.forEach(b => b.classList.remove('active'));
  const btnHistory = dom.sidebarNav.querySelector('[data-panel="student-reflections"]');
  if (btnHistory) btnHistory.classList.add('active');
  
  switchPanel('student-reflections');
  alert('Reflection submitted successfully!');
}

// == Student Reflections Archive ==
function renderStudentReflectionsArchive() {
  const u = state.activeUser;
  if (!u) return;

  const reflections = DB.get('student_reflections').filter(r => r.group === u.group && r.section === u.section);
  
  if (reflections.length === 0) {
    dom.studentReflectionsList.innerHTML = `<p class="muted small">No submitted reflections found for your section.</p>`;
    return;
  }

  dom.studentReflectionsList.innerHTML = reflections.map(r => `
    <div class="item-card bg-glass animate-fade-in">
      <div class="item-card-header">
        <strong class="item-card-title">${r.piece}</strong>
        <div class="flex-row gap-10 items-center">
          <span class="badge badge-accent">Confidence: ${r.rating}/5</span>
          <button class="btn btn-xs btn-outline text-red" onclick="deleteStudentReflection('${r.id}')">Delete</button>
        </div>
      </div>
      <div class="item-card-meta">
        Submitted by: <strong>${r.studentName}</strong> on ${r.createdAt}
      </div>
      <div class="item-card-body small" style="background-color: rgba(0,0,0,0.01); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-top: 8px;">
        <div style="margin-bottom: 6px;"><strong>Key Challenges:</strong> <span class="muted">${r.challenges}</span></div>
        <div><strong>Reflection:</strong> <em>"${r.content}"</em></div>
      </div>
    </div>
  `).join('');
}

window.deleteStudentReflection = function(id) {
  if (confirm('Delete this reflection?')) {
    const list = DB.get('student_reflections').filter(item => item.id !== id);
    DB.set('student_reflections', list);
    renderStudentReflectionsArchive();
  }
};

// == Coordinator Reflections Feed ==
function renderCoordinatorReflections() {
  const group = state.activeCoordinatorGroup;
  const reflections = DB.get('student_reflections');
  const searchVal = dom.coordReflectionsSearch.value.toLowerCase();
  const sectionFilter = dom.coordReflectionsSectionFilter.value;

  // Filter for active group
  let filtered = reflections.filter(r => r.group === group);

  // Filter by selected section
  if (sectionFilter !== 'all') {
    filtered = filtered.filter(r => r.section === sectionFilter);
  }

  // Filter by search text
  if (searchVal) {
    filtered = filtered.filter(r => 
      r.piece.toLowerCase().includes(searchVal) || 
      r.challenges.toLowerCase().includes(searchVal) ||
      r.content.toLowerCase().includes(searchVal) ||
      r.studentName.toLowerCase().includes(searchVal) ||
      r.section.toLowerCase().includes(searchVal)
    );
  }

  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (filtered.length === 0) {
    dom.coordReflectionsList.innerHTML = `<p class="muted small">No student reflections found matching filters.</p>`;
    return;
  }

  dom.coordReflectionsList.innerHTML = filtered.map(r => `
    <article class="item-card bg-glass animate-fade-in">
      <div class="item-card-header">
        <div>
          <span class="badge badge-accent" style="margin-right: 6px;">${r.group}</span>
          <strong class="item-card-title">${r.section} Section Reflection</strong>
        </div>
        <div class="flex-row gap-10 items-center">
          <span class="badge badge-accent">Confidence: ${r.rating}/5</span>
          <button class="btn btn-xs btn-outline text-red" onclick="deleteCoordinatorReflection('${r.id}')">Delete</button>
        </div>
      </div>
      <div class="item-card-meta">
        Rehearsal piece: <strong>${r.piece}</strong> <br>
        Submitted by: <strong>${r.studentName}</strong> on ${r.createdAt}
      </div>
      <div class="item-card-body small" style="background-color: rgba(255,255,255,0.01); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-top: 8px;">
        <div style="margin-bottom: 6px;"><strong>Challenges Faced:</strong> <span class="muted">${r.challenges}</span></div>
        <div><strong>Reflection Content:</strong> <em>"${r.content}"</em></div>
      </div>
    </article>
  `).join('');
}

window.deleteCoordinatorReflection = function(id) {
  if (confirm('Delete this student reflection as Coordinator?')) {
    const list = DB.get('student_reflections').filter(item => item.id !== id);
    DB.set('student_reflections', list);
    renderCoordinatorReflections();
  }
};

// == Tutor Check-in Reminders ==
function renderTutorCheckinReminders() {
  const u = state.activeUser;
  if (!u) return;

  const logs = DB.get('session_logs').filter(l => l.group === u.group && l.section === u.section);
  
  // Group by piece and find the latest log for each piece
  const latestLogsMap = {};
  logs.forEach(log => {
    const key = log.piece;
    if (!latestLogsMap[key] || new Date(log.createdAt) > new Date(latestLogsMap[key].createdAt)) {
      latestLogsMap[key] = log;
    }
  });

  // Filter logs where the latest status is in-progress ('Progressing' or 'Requires further development')
  const inProgressLogs = Object.values(latestLogsMap).filter(log => getLogOverallStatus(log) !== 'Demonstrated');

  if (inProgressLogs.length === 0) {
    dom.tutorCheckinReminders.innerHTML = `<p class="muted small">All caught up! No active check-in reminders for your section.</p>`;
    return;
  }

  dom.tutorCheckinReminders.innerHTML = inProgressLogs.map(log => `
    <div class="table-row justify-between animate-fade-in" style="margin-top: 8px;">
      <div>
        <div class="row-primary-text" style="font-weight: 600;">${log.piece}</div>
        <div class="row-sub-text">Last status: <strong class="text-${getLogOverallStatus(log) === 'Requires further development' ? 'red' : 'yellow'}">${getLogOverallStatus(log)}</strong></div>
        <div class="xs muted">Last log: ${log.createdAt}</div>
      </div>
      <button class="btn btn-xs btn-primary" onclick="prefillCheckinForm('${log.piece.replace(/'/g, "\\'")}')">Check-in & Log</button>
    </div>
  `).join('');
}

// Prefill form for check-in and switch to logger
window.prefillCheckinForm = function(repertoire) {
  const u = state.activeUser;
  if (!u) return;

  // Set logger panel active in sidebar
  const navItems = dom.sidebarNav.querySelectorAll('.nav-item');
  navItems.forEach(b => b.classList.remove('active'));
  const btnLogger = dom.sidebarNav.querySelector('[data-panel="tutor-logger"]');
  if (btnLogger) btnLogger.classList.add('active');

  switchPanel('tutor-logger');

  // Use prefillLoggerForm helper
  prefillLoggerForm(repertoire);
};

window.prefillPlannerFromObservation = function(obsId) {
  const u = state.activeUser;
  if (!u) return;

  const rehearsals = DB.get('tutti_rehearsals');
  let matchedObs = null;
  rehearsals.forEach(reh => {
    reh.observations.forEach(obs => {
      if (obs.id === obsId) {
        matchedObs = { ...obs, date: reh.date, repertoire: reh.repertoire };
      }
    });
  });

  if (!matchedObs) {
    alert('Conductor observation not found.');
    return;
  }

  // Switch to Planner panel
  const navItems = dom.sidebarNav.querySelectorAll('.nav-item');
  navItems.forEach(b => b.classList.remove('active'));
  const btnPlanner = dom.sidebarNav.querySelector('[data-panel="tutor-planner"]');
  if (btnPlanner) btnPlanner.classList.add('active');
  switchPanel('tutor-planner');
  
  // Prefill repertoire select
  let found = false;
  for (let i = 0; i < dom.planRepertoireSelect.options.length; i++) {
    if (dom.planRepertoireSelect.options[i].value === matchedObs.repertoire) {
      dom.planRepertoireSelect.value = matchedObs.repertoire;
      found = true;
      break;
    }
  }
  
  if (!found) {
    dom.planRepertoireSelect.value = '__custom__';
    dom.planRepertoireCustom.style.display = 'block';
    dom.planRepertoireCustom.required = true;
    dom.planRepertoireCustom.value = matchedObs.repertoire;
  } else {
    dom.planRepertoireCustom.style.display = 'none';
    dom.planRepertoireCustom.required = false;
  }

  dom.planLocation.value = 'Bars/Mvt matching rehearsal notes';
  dom.planStrategy.value = `Focus: Address Conductor Feedback from ${matchedObs.date}\nFeedback context: "${matchedObs.content}"\n\nSectional strategy:\n`;
  dom.planStrategy.focus();
};


// == Tutor Conductor Q&A handlers ==
function handleTutorQaSubmit(e) {
  e.preventDefault();
  const u = state.activeUser;
  if (!u) return;

  let pieceTitle = dom.qaRepertoireSelect.value;
  if (pieceTitle === '__custom__') {
    pieceTitle = dom.qaRepertoireCustom.value.trim();
  }
  
  if (!pieceTitle) {
    alert('Please select or specify a repertoire.');
    return;
  }

  const questionText = dom.qaQuestionText.value.trim();
  if (!questionText) return;

  const newItem = {
    id: 'qa-' + Date.now(),
    group: u.group,
    section: u.section,
    piece: pieceTitle,
    question: questionText,
    createdAt: new Date().toISOString().split('T')[0],
    replies: []
  };

  const threads = DB.get('qa_threads');
  threads.push(newItem);
  DB.set('qa_threads', threads);

  // Clear form
  dom.qaRepertoireSelect.value = '';
  dom.qaRepertoireCustom.value = '';
  dom.qaRepertoireCustom.style.display = 'none';
  dom.qaQuestionText.value = '';

  renderTutorQaArchive();
  alert('Question transmitted to the conductor!');
}

function renderTutorQaArchive() {
  const u = state.activeUser;
  if (!u) return;

  const threads = DB.get('qa_threads').filter(t => t.group === u.group && t.section === u.section);
  threads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (threads.length === 0) {
    dom.tutorQaList.innerHTML = `<p class="muted small">No questions submitted yet. Use the form above to reach the conductor.</p>`;
    return;
  }

  dom.tutorQaList.innerHTML = threads.map(t => {
    const statusBadge = t.replies.length > 0 ? '<span class="badge badge-green">Answered</span>' : '<span class="badge badge-yellow">Awaiting Reply</span>';
    
    const repliesHTML = t.replies.map(r => `
      <div class="flex-column gap-4" style="background-color: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 8px 10px; border-radius: var(--radius-sm); margin-top: 6px; align-self: flex-end; width: 90%; border-left: 3px solid var(--accent);">
        <div class="flex-row justify-between" style="font-size: 0.75rem;">
          <strong class="text-cyan">${r.author}</strong>
          <span class="muted">${r.createdAt}</span>
        </div>
        <p class="small mb-0" style="white-space: pre-wrap;">${r.content}</p>
      </div>
    `).join('');

    return `
      <div class="item-card bg-glass animate-fade-in" style="margin-top: 10px; border-left: 3px solid var(--accent);">
        <div class="item-card-header">
          <div>
            ${statusBadge}
            <span class="muted small" style="margin-left: 8px;">Repertoire: <strong>${t.piece}</strong></span>
          </div>
          <span class="xs muted">Asked on: ${t.createdAt}</span>
        </div>
        <p class="small" style="font-weight: 500; margin: 8px 0; background: rgba(0,0,0,0.05); padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); white-space: pre-wrap;">Question: "${t.question}"</p>
        
        ${t.replies.length > 0 ? `
          <div class="flex-column gap-6" style="margin-top: 10px; border-top: 1px dashed var(--border-subtle); padding-top: 8px;">
            <strong style="font-size: 0.8rem;">Conductor Responses:</strong>
            ${repliesHTML}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}


// == Coordinator Tutor Questions handlers ==
function renderCoordinatorQaExplorer() {
  const group = state.activeCoordinatorGroup;
  const sectionFilter = dom.coordQaSectionFilter.value;
  const searchVal = dom.coordQaSearch.value.toLowerCase();

  let threads = DB.get('qa_threads').filter(t => t.group === group);

  if (sectionFilter !== 'all') {
    threads = threads.filter(t => t.section === sectionFilter);
  }

  if (searchVal) {
    threads = threads.filter(t => 
      t.piece.toLowerCase().includes(searchVal) || 
      t.question.toLowerCase().includes(searchVal) ||
      t.section.toLowerCase().includes(searchVal)
    );
  }

  threads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (threads.length === 0) {
    dom.coordQaList.innerHTML = `<p class="muted small">No questions found matching criteria.</p>`;
    return;
  }

  dom.coordQaList.innerHTML = threads.map(t => {
    const statusBadge = t.replies.length > 0 ? '<span class="badge badge-green">Answered</span>' : '<span class="badge badge-yellow">Awaiting Reply</span>';
    
    const repliesHTML = t.replies.map(r => `
      <div class="flex-column gap-4" style="background-color: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 8px 10px; border-radius: var(--radius-sm); margin-top: 6px; border-left: 3px solid var(--accent); max-width: 90%;">
        <div class="flex-row justify-between" style="font-size: 0.75rem;">
          <strong class="text-cyan">${r.author}</strong>
          <span class="muted">${r.createdAt}</span>
        </div>
        <p class="small mb-0" style="white-space: pre-wrap;">${r.content}</p>
      </div>
    `).join('');

    return `
      <article class="item-card bg-glass animate-fade-in" style="margin-top: 10px;">
        <div class="item-card-header">
          <div>
            <span class="badge badge-accent">${t.section}</span>
            ${statusBadge}
          </div>
          <span class="xs muted">Date: ${t.createdAt}</span>
        </div>
        <div class="item-card-meta">
          Repertoire Context: <strong>${t.piece}</strong>
        </div>
        <p class="small" style="font-weight: 500; margin: 8px 0; background: rgba(0,0,0,0.05); padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); white-space: pre-wrap;">Question: "${t.question}"</p>
        
        <div class="flex-column gap-6" style="margin-top: 10px; border-top: 1px dashed var(--border-subtle); padding-top: 8px;">
          ${t.replies.length > 0 ? `
            <strong style="font-size: 0.8rem;">Discussion History:</strong>
            ${repliesHTML}
          ` : ''}
          
          <div class="flex-column gap-6" style="margin-top: 8px;">
            <textarea class="textarea-control reply-textarea-${t.id}" style="font-size: 0.8rem; min-height: 50px;" placeholder="Type reply as Conductor..."></textarea>
            <button class="btn btn-xs btn-primary align-self-end" onclick="submitConductorReply('${t.id}')">Submit Reply</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

window.submitConductorReply = function(threadId) {
  const textarea = document.querySelector(`.reply-textarea-${threadId}`);
  if (!textarea) return;
  const content = textarea.value.trim();
  if (!content) {
    alert('Reply text cannot be empty.');
    return;
  }

  const threads = DB.get('qa_threads');
  const thread = threads.find(t => t.id === threadId);
  if (thread) {
    thread.replies.push({
      author: 'Conductor',
      content: content,
      createdAt: new Date().toISOString().split('T')[0]
    });
    DB.set('qa_threads', threads);
    renderCoordinatorQaExplorer();
    alert('Reply sent successfully!');
  }
};


// Kickstart on document load
document.addEventListener('DOMContentLoaded', initApp);
initApp();
