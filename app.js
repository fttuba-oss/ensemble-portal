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
const SEED_SYLLABUS = [
  {
    id: 'syll-1',
    group: 'NUSSO',
    section: 'Horn',
    piece: 'New Work',
    location: 'bars 113–128',
    domain: 'Intonation and Sound',
    notes: 'Address pitch stability in the horn section during unison chord shifts. Keep air support consistent and review fingerings for G# transition.',
    createdAt: '2026-08-18'
  },
  {
    id: 'syll-2',
    group: 'NUSSO',
    section: 'Trumpet',
    piece: 'First Suite',
    location: 'Mvt I · bars 57–72',
    domain: 'Articulation',
    notes: 'Staccato articulation needs to be crisp and lightweight, matching the style of the woodwinds. Drill with standard metronome patterns.',
    createdAt: '2026-08-19'
  },
  {
    id: 'syll-3',
    group: 'NUSWS',
    section: 'Clarinet',
    piece: 'First Suite',
    location: 'Mvt III · bars 142–150',
    domain: 'Rhythmic Accuracy',
    notes: 'Syncopated passages must align precisely with the percussion section. Practice subdivision of eighth notes.',
    createdAt: '2026-08-17'
  },
  {
    id: 'syll-4',
    group: 'NUSSO',
    section: 'Percussion',
    piece: 'New Work',
    location: 'bar 221',
    domain: 'Ensemble Coordination',
    notes: 'Transition cues must be clearly conducted by the principal snare. Focus on temporal sync during tutti tempo changes.',
    createdAt: '2026-08-19'
  }
];

const SEED_TUTTI_FEEDBACK = [
  {
    id: 'tutti-1',
    group: 'NUSSO',
    section: 'Horn',
    piece: 'New Work (bars 113–128)',
    status: 'Requires further development',
    content: 'Pitch stability remains inconsistent in the high register. Horns, please coordinate with your tutor on matching vowel placement in sectional rehearsals.',
    createdAt: '2026-08-20'
  },
  {
    id: 'tutti-2',
    group: 'NUSSO',
    section: 'Trumpet',
    piece: 'First Suite (bars 57–72)',
    status: 'Progressing',
    content: 'Articulation showed improvement during the second run-through, but double-tonguing section needs to align closer with woodwind attacks.',
    createdAt: '2026-08-20'
  },
  {
    id: 'tutti-3',
    group: 'NUSWS',
    section: 'Tuba',
    piece: 'Holst Suite (Mvt II)',
    status: 'Requires further development',
    content: 'Bass line sync with low reeds was lagging behind by almost half a beat in bars 30-45. Work on proactive breathing support.',
    createdAt: '2026-08-19'
  }
];

const SEED_LESSON_PLANS = [
  {
    id: 'plan-1',
    group: 'NUSSO',
    section: 'Horn',
    piece: 'New Work',
    location: 'Mvt II · 113–128',
    domain: 'Intonation and Sound',
    strategy: 'Will practice playing these chords slow and out of context, checking pitch accuracy with drone cues. Work on physical posture and breath flow.',
    createdAt: '2026-08-19'
  },
  {
    id: 'plan-2',
    group: 'NUSSO',
    section: 'Trumpet',
    piece: 'First Suite',
    location: 'Mvt I · 57-72',
    domain: 'Articulation',
    strategy: 'Start sectional with slow metronome (tempo 80) matching length of notes. Slowly ramp up by 4bpm increments to target speed.',
    createdAt: '2026-08-20'
  }
];

const SEED_SESSION_LOGS = [
  {
    id: 'log-1',
    group: 'NUSSO',
    section: 'Horn',
    piece: 'New Work (bars 113–128)',
    domain: 'Intonation and Sound',
    intonation: 2,
    coordination: 3,
    status: 'Requires further development',
    observations: 'Worked on unison notes. Pitch stability remains inconsistent after two sectional sessions. Horns are tending sharp on the top register. Need to focus on embouchure relaxation.',
    createdAt: '2026-08-20'
  },
  {
    id: 'log-2',
    group: 'NUSSO',
    section: 'Trumpet',
    piece: 'First Suite (Mvt I · 57–72)',
    domain: 'Articulation',
    intonation: 4,
    coordination: 4,
    status: 'Progressing',
    observations: 'Improved consistency in repeated quavers. Worked with slow metronome and matched note length. Not yet fully stable at performance tempo, but ready for tutti integration.',
    createdAt: '2026-08-20'
  },
  {
    id: 'log-3',
    group: 'NUSWS',
    section: 'Clarinet',
    piece: 'First Suite (142–150)',
    domain: 'Rhythmic Accuracy',
    intonation: 4,
    coordination: 5,
    status: 'Demonstrated',
    observations: 'Syncopation rhythm demonstrated perfectly. Tutors and students aligned to percussion downbeats. Tempo is highly stable.',
    createdAt: '2026-08-19'
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
    this.get('syllabus', SEED_SYLLABUS);
    this.get('tutti_feedback', SEED_TUTTI_FEEDBACK);
    this.get('lesson_plans', SEED_LESSON_PLANS);
    this.get('session_logs', SEED_SESSION_LOGS);
    this.get('repertoire', SEED_REPERTOIRE);
    this.get('student_reflections', SEED_STUDENT_REFLECTIONS);
  }

  static reset() {
    localStorage.removeItem('cfa_db_syllabus');
    localStorage.removeItem('cfa_db_tutti_feedback');
    localStorage.removeItem('cfa_db_lesson_plans');
    localStorage.removeItem('cfa_db_session_logs');
    localStorage.removeItem('cfa_db_repertoire');
    localStorage.removeItem('cfa_db_student_reflections');
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
  overviewDomainFilter: document.getElementById('overviewDomainFilter'),
  prioritiesTable: document.getElementById('prioritiesTable'),
  domainProgressList: document.getElementById('domainProgressList'),
  dbQueryInput: document.getElementById('dbQueryInput'),
  searchDbBtn: document.getElementById('searchDbBtn'),
  queryResponsePanel: document.getElementById('queryResponsePanel'),
  
  // Coordinator Syllabus Elements
  syllabusForm: document.getElementById('syllabusForm'),
  syllabusGroup: document.getElementById('syllabusGroup'),
  syllabusSection: document.getElementById('syllabusSection'),
  syllabusPieceSelect: document.getElementById('syllabusPieceSelect'),
  syllabusPieceCustom: document.getElementById('syllabusPieceCustom'),
  syllabusLocation: document.getElementById('syllabusLocation'),
  syllabusDomain: document.getElementById('syllabusDomain'),
  syllabusNotes: document.getElementById('syllabusNotes'),
  syllabusList: document.getElementById('syllabusList'),
  syllabusCountBadge: document.getElementById('syllabusCountBadge'),
  
  // Coordinator Tutti Feedback Elements
  tuttiFeedbackForm: document.getElementById('tuttiFeedbackForm'),
  tuttiGroup: document.getElementById('tuttiGroup'),
  tuttiSection: document.getElementById('tuttiSection'),
  tuttiRepertoireSelect: document.getElementById('tuttiRepertoireSelect'),
  tuttiRepertoireCustom: document.getElementById('tuttiRepertoireCustom'),
  tuttiStatus: document.getElementById('tuttiStatus'),
  tuttiContent: document.getElementById('tuttiContent'),
  tuttiFeedbacksList: document.getElementById('tuttiFeedbacksList'),
  
  // Coordinator Global Explorer Elements
  explorerSearch: document.getElementById('explorerSearch'),
  explorerGroupFilter: document.getElementById('explorerGroupFilter'),
  explorerSectionFilter: document.getElementById('explorerSectionFilter'),
  explorerLogsList: document.getElementById('explorerLogsList'),
  
  // Tutor Sectional Hub Elements
  tutorTuttiAlertContainer: document.getElementById('tutorTuttiAlertContainer'),
  tutorSectionObjectives: document.getElementById('tutorSectionObjectives'),
  tutorTuttiFeedbacks: document.getElementById('tutorTuttiFeedbacks'),
  
  // Tutor Lesson Planner Elements
  lessonPlanForm: document.getElementById('lessonPlanForm'),
  planRepertoireSelect: document.getElementById('planRepertoireSelect'),
  planRepertoireCustom: document.getElementById('planRepertoireCustom'),
  planLocation: document.getElementById('planLocation'),
  planDomain: document.getElementById('planDomain'),
  planStrategy: document.getElementById('planStrategy'),
  tutorPlansList: document.getElementById('tutorPlansList'),
  
  // Tutor Session Logger Elements
  sessionLogForm: document.getElementById('sessionLogForm'),
  logRepertoireSelect: document.getElementById('logRepertoireSelect'),
  logRepertoireCustom: document.getElementById('logRepertoireCustom'),
  logDomain: document.getElementById('logDomain'),
  logIntonation: document.getElementById('logIntonation'),
  logCoordination: document.getElementById('logCoordination'),
  logLevel: document.getElementById('logLevel'),
  logObservations: document.getElementById('logObservations'),
  tutorLoggerPlanSelector: document.getElementById('tutorLoggerPlanSelector'),
  
  // Tutor Logs Archive Elements
  tutorLogsList: document.getElementById('tutorLogsList'),

  // Tutor student reflections
  tutorStudentReflectionsList: document.getElementById('tutorStudentReflectionsList'),

  // Coordinator reflections
  coordReflectionsSearch: document.getElementById('coordReflectionsSearch'),
  coordReflectionsSectionFilter: document.getElementById('coordReflectionsSectionFilter'),
  coordReflectionsList: document.getElementById('coordReflectionsList'),

  // Student viewport elements
  studentTutorLogsList: document.getElementById('studentTutorLogsList'),
  studentSyllabusList: document.getElementById('studentSyllabusList'),
  studentReflectionForm: document.getElementById('studentReflectionForm'),
  reflectorLogSelect: document.getElementById('reflectorLogSelect'),
  reflectorName: document.getElementById('reflectorName'),
  reflectorRating: document.getElementById('reflectorRating'),
  reflectorChallenges: document.getElementById('reflectorChallenges'),
  reflectorContent: document.getElementById('reflectorContent'),
  studentReflectionsList: document.getElementById('studentReflectionsList'),
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

  // Form updates sections based on group
  dom.syllabusGroup.addEventListener('change', (e) => {
    populateFormSections(e.target.value, dom.syllabusSection);
    populateRepertoireDropdown(e.target.value, dom.syllabusPieceSelect, dom.syllabusPieceCustom);
  });
  dom.tuttiGroup.addEventListener('change', (e) => {
    populateFormSections(e.target.value, dom.tuttiSection);
    populateRepertoireDropdown(e.target.value, dom.tuttiRepertoireSelect, dom.tuttiRepertoireCustom);
  });

  // Form Submissions
  dom.syllabusForm.addEventListener('submit', handleSyllabusSubmit);
  dom.tuttiFeedbackForm.addEventListener('submit', handleTuttiSubmit);
  dom.lessonPlanForm.addEventListener('submit', handleLessonPlanSubmit);
  dom.sessionLogForm.addEventListener('submit', handleSessionLogSubmit);
  dom.studentReflectionForm.addEventListener('submit', handleStudentReflectionSubmit);

  // Filter Event Handlers
  dom.overviewSectionFilter.addEventListener('change', renderOverviewPriorities);
  dom.overviewDomainFilter.addEventListener('change', renderOverviewPriorities);
  dom.explorerGroupFilter.addEventListener('change', handleExplorerFiltersChange);
  dom.explorerSectionFilter.addEventListener('change', renderGlobalLogsExplorer);
  dom.explorerSearch.addEventListener('input', renderGlobalLogsExplorer);
  dom.coordReflectionsSectionFilter.addEventListener('change', renderCoordinatorReflections);
  dom.coordReflectionsSearch.addEventListener('input', renderCoordinatorReflections);
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
      <a class="nav-item" data-panel="coord-syllabus">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
        Syllabus Manager
      </a>
      <a class="nav-item" data-panel="coord-tutti">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        Tutti Rehearsal Feedback
      </a>
      <a class="nav-item" data-panel="coord-reflections">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        Student Reflections
      </a>
      <a class="nav-item" data-panel="coord-explorer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        Logs Explorer
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

    // Populate Section selectors in coordinator forms
    populateFormSections(dom.syllabusGroup.value, dom.syllabusSection);
    populateFormSections(dom.tuttiGroup.value, dom.tuttiSection);
    populateRepertoireDropdown(dom.syllabusGroup.value, dom.syllabusPieceSelect, dom.syllabusPieceCustom);
    populateRepertoireDropdown(dom.tuttiGroup.value, dom.tuttiRepertoireSelect, dom.tuttiRepertoireCustom);
    
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
        Log Session Outcome
      </a>
      <a class="nav-item" data-panel="tutor-logs">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        Log Archive
      </a>
    `;

    // Hard-lock group switcher in header to simple badge text
    dom.headerGroupIndicator.style.display = 'flex';
    dom.headerGroupIndicator.innerHTML = `<span class="badge badge-accent">${u.group} · ${u.section} ONLY</span>`;

    // Populate Repertoire dropdowns for the tutor
    populateRepertoireDropdown(u.group, dom.planRepertoireSelect, dom.planRepertoireCustom);
    populateRepertoireDropdown(u.group, dom.logRepertoireSelect, dom.logRepertoireCustom);

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
    'coord-syllabus': { title: 'Curriculum & Objectives', eyebrow: 'Coordinator Portal · Syllabus Management' },
    'coord-tutti': { title: 'Tutti Rehearsal Feedback', eyebrow: 'Coordinator Portal · Rehearsal Direction' },
    'coord-explorer': { title: 'Tutor Logs Explorer', eyebrow: 'Coordinator Portal · Global Submissions' },
    'coord-reflections': { title: 'Student Reflections Feed', eyebrow: 'Coordinator Portal · Student Feedback' },
    'tutor-hub': { title: 'Sectional Hub', eyebrow: `${u.group} · ${u.section} Workspace` },
    'tutor-planner': { title: 'Lesson Planner', eyebrow: `${u.group} · ${u.section} Workspace` },
    'tutor-logger': { title: 'Log Rehearsal Outcome', eyebrow: `${u.group} · ${u.section} Workspace` },
    'tutor-logs': { title: 'Section Logs Archive', eyebrow: `${u.group} · ${u.section} Workspace` },
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
  populateRepertoireDropdown(grp, dom.syllabusPieceSelect, dom.syllabusPieceCustom);
  populateRepertoireDropdown(grp, dom.tuttiRepertoireSelect, dom.tuttiRepertoireCustom);
  
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
    renderDomainCharts();
    renderOverviewSynthesis();
  } else if (panel === 'coord-syllabus') {
    renderCoordinatorSyllabusList();
  } else if (panel === 'coord-tutti') {
    renderCoordinatorTuttiList();
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
  } else if (panel === 'student-hub') {
    renderStudentHub();
  } else if (panel === 'student-reflector') {
    renderStudentReflector();
  } else if (panel === 'student-reflections') {
    renderStudentReflectionsArchive();
  }
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
      const latestStatus = secLogs[0].status;
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
  const domainFilter = dom.overviewDomainFilter.value;
  
  // Filter for active group
  let filtered = logs.filter(log => log.group === group);
  
  // Filter by selected section
  if (sectionFilter !== 'all') {
    filtered = filtered.filter(l => l.section === sectionFilter);
  }
  
  // Filter by learning domain
  if (domainFilter !== 'all') {
    filtered = filtered.filter(l => l.domain === domainFilter);
  }
  
  // Sort latest first
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  if (filtered.length === 0) {
    dom.prioritiesTable.innerHTML = `<div class="table-row muted small justify-between">No active priorities found for these criteria.</div>`;
    return;
  }
  
  dom.prioritiesTable.innerHTML = filtered.map(item => {
    let badgeClass = 'badge-yellow';
    if (item.status === 'Requires further development') badgeClass = 'badge-red';
    if (item.status === 'Demonstrated') badgeClass = 'badge-green';
    
    return `
      <div class="table-row">
        <div>
          <div class="row-primary-text">${item.section} · ${item.piece}</div>
          <div class="row-sub-text">${item.domain} · ${item.createdAt}</div>
          <div class="small muted" style="margin-top: 6px; font-style: italic;">"${item.observations}"</div>
        </div>
        <span class="badge ${badgeClass}">${item.status}</span>
      </div>
    `;
  }).join('');
}

function renderDomainCharts() {
  const logs = DB.get('session_logs').filter(l => l.group === state.activeCoordinatorGroup);
  
  const domains = [
    { name: 'Technical Proficiency', color: 'fill-indigo' },
    { name: 'Intonation and Sound', color: 'fill-cyan' },
    { name: 'Rhythmic Accuracy', color: 'fill-emerald' },
    { name: 'Ensemble Coordination', color: 'fill-amber' },
    { name: 'Interpretation and Musical Expression', color: 'fill-rose' }
  ];
  
  dom.domainProgressList.innerHTML = domains.map(domItem => {
    const domLogs = logs.filter(l => l.domain === domItem.name);
    let progressPercentage = 30; // Default baseline placeholder
    
    if (domLogs.length > 0) {
      const demCount = domLogs.filter(l => l.status === 'Demonstrated').length;
      const progCount = domLogs.filter(l => l.status === 'Progressing').length;
      progressPercentage = Math.round(((demCount * 1.0 + progCount * 0.5) / domLogs.length) * 100);
      progressPercentage = Math.max(15, Math.min(progressPercentage, 100));
    }
    
    return `
      <div class="progress-item">
        <div class="progress-header">
          <span>${domItem.name}</span>
          <span class="muted">${progressPercentage}% Corrective Stability</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${domItem.color}" style="width: ${progressPercentage}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

// == Coordinator Syllabus Objectives Page ==
function renderCoordinatorSyllabusList() {
  const items = DB.get('syllabus');
  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  dom.syllabusCountBadge.textContent = `${items.length} Directives Active`;
  
  if (items.length === 0) {
    dom.syllabusList.innerHTML = `<p class="muted small">No syllabus objectives established. Create one using the form.</p>`;
    return;
  }
  
  dom.syllabusList.innerHTML = items.map(item => `
    <article class="item-card bg-glass">
      <div class="item-card-header">
        <div>
          <span class="badge badge-accent" style="margin-right: 6px;">${item.group}</span>
          <strong class="item-card-title">${item.section} Section</strong>
        </div>
        <button class="btn btn-xs btn-outline text-red" onclick="deleteSyllabusItem('${item.id}')">Delete</button>
      </div>
      <div class="item-card-meta">
        Repertoire: <strong>${item.piece}</strong> (${item.location}) <br>
        Domain: <strong>${item.domain}</strong>
      </div>
      <p class="item-card-body">${item.notes}</p>
      <div class="item-card-footer">
        <span>Published on: ${item.createdAt}</span>
        <span>Authorized Directive</span>
      </div>
    </article>
  `).join('');
}

// == Coordinator Tutti Rehearsal Feedback ==
function renderCoordinatorTuttiList() {
  const items = DB.get('tutti_feedback');
  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  if (items.length === 0) {
    dom.tuttiFeedbacksList.innerHTML = `<p class="muted small">No tutti feedbacks recorded yet.</p>`;
    return;
  }
  
  dom.tuttiFeedbacksList.innerHTML = items.map(item => {
    let badgeClass = 'badge-yellow';
    if (item.status === 'Requires further development') badgeClass = 'badge-red';
    if (item.status === 'Demonstrated') badgeClass = 'badge-green';
    
    return `
      <article class="item-card bg-glass">
        <div class="item-card-header">
          <div>
            <span class="badge badge-accent" style="margin-right: 6px;">${item.group}</span>
            <strong class="item-card-title">${item.section} Section</strong>
          </div>
          <button class="btn btn-xs btn-outline text-red" onclick="deleteTuttiItem('${item.id}')">Delete</button>
        </div>
        <div class="item-card-meta">
          Focus: <strong>${item.piece}</strong>
        </div>
        <p class="item-card-body">${item.content}</p>
        <div class="item-card-footer">
          <span>Priority: <span class="badge ${badgeClass}">${item.status}</span></span>
          <span>Logged: ${item.createdAt}</span>
        </div>
      </article>
    `;
  }).join('');
}

// == Coordinator Logs Explorer Page ==
function handleExplorerFiltersChange() {
  const group = dom.explorerGroupFilter.value;
  populateSectionOptions(group === 'all' ? 'NUSSO' : group, dom.explorerSectionFilter);
  renderGlobalLogsExplorer();
}

function renderGlobalLogsExplorer() {
  const logs = DB.get('session_logs');
  const searchVal = dom.explorerSearch.value.toLowerCase();
  const groupFilter = dom.explorerGroupFilter.value;
  const sectionFilter = dom.explorerSectionFilter.value;
  
  let filtered = logs;
  
  if (groupFilter !== 'all') {
    filtered = filtered.filter(l => l.group === groupFilter);
  }
  
  if (sectionFilter !== 'all') {
    filtered = filtered.filter(l => l.section === sectionFilter);
  }
  
  if (searchVal) {
    filtered = filtered.filter(l => 
      l.piece.toLowerCase().includes(searchVal) || 
      l.observations.toLowerCase().includes(searchVal) ||
      l.section.toLowerCase().includes(searchVal) ||
      l.domain.toLowerCase().includes(searchVal)
    );
  }
  
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  if (filtered.length === 0) {
    dom.explorerLogsList.innerHTML = `<p class="muted small">No sectional rehearsal logs found matching filters.</p>`;
    return;
  }
  
  dom.explorerLogsList.innerHTML = filtered.map(log => {
    let statusClass = 'badge-yellow';
    if (log.status === 'Requires further development') statusClass = 'badge-red';
    if (log.status === 'Demonstrated') statusClass = 'badge-green';
    
    return `
      <article class="item-card bg-glass">
        <div class="item-card-header">
          <div>
            <span class="badge badge-accent" style="margin-right: 6px;">${log.group}</span>
            <strong class="item-card-title">${log.section} Section Rehearsal Log</strong>
          </div>
          <span class="badge ${statusClass}">${log.status}</span>
        </div>
        <div class="item-card-meta">
          Repertoire focus: <strong>${log.piece}</strong> <br>
          Learning Domain: <strong>${log.domain}</strong>
        </div>
        <div class="item-card-body">
          <p>${log.observations}</p>
          <div class="flex-row gap-16" style="margin-top: 10px; background-color: rgba(255,255,255,0.02); padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div><span class="xs muted">Intonation Score:</span> <strong class="text-cyan">${log.intonation}/5</strong></div>
            <div><span class="xs muted">Cohesion Score:</span> <strong class="text-yellow">${log.coordination}/5</strong></div>
          </div>
        </div>
        <div class="item-card-footer">
          <span>Tutor Log Submission</span>
          <span>Date: ${log.createdAt}</span>
        </div>
      </article>
    `;
  }).join('');
}


// == Tutor Section Hub ==
function renderTutorHub() {
  const u = state.activeUser;
  
  // SECURE PRIVACY FILTERING: Only extract objectives matching tutor's group and section
  const syllabus = DB.get('syllabus').filter(item => item.group === u.group && item.section === u.section);
  const feedback = DB.get('tutti_feedback').filter(item => item.group === u.group && item.section === u.section);
  
  // Render Tutti alerts
  const urgentFeedback = feedback.filter(f => f.status === 'Requires further development');
  if (urgentFeedback.length > 0) {
    dom.tutorTuttiAlertContainer.innerHTML = `
      <div class="rehearsal-alert">
        <div class="alert-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <div class="alert-body">
          <h4>Urgent Tutti Rehearsal Alert</h4>
          <p>Coordinators requested immediate development on <strong>${urgentFeedback[0].piece}</strong>. Coordinator remarks: "${urgentFeedback[0].content}"</p>
        </div>
      </div>
    `;
  } else {
    dom.tutorTuttiAlertContainer.innerHTML = '';
  }

  // Objectives List
  if (syllabus.length === 0) {
    dom.tutorSectionObjectives.innerHTML = `<p class="muted small">No objectives currently set by coordinators for the ${u.section} section.</p>`;
  } else {
    dom.tutorSectionObjectives.innerHTML = syllabus.map(item => `
      <div class="item-card bg-glass">
        <div class="item-card-header">
          <strong class="item-card-title">${item.piece}</strong>
          <span class="badge badge-accent">${item.domain}</span>
        </div>
        <p class="small">${item.notes}</p>
        <div class="xs muted">Target: ${item.location} · Assigned: ${item.createdAt}</div>
      </div>
    `).join('');
  }

  // Tutti Feedback List
  if (feedback.length === 0) {
    dom.tutorTuttiFeedbacks.innerHTML = `<p class="muted small">No tutti feedback logged for your section.</p>`;
  } else {
    dom.tutorTuttiFeedbacks.innerHTML = feedback.map(item => {
      let statusClass = 'badge-yellow';
      if (item.status === 'Requires further development') statusClass = 'badge-red';
      if (item.status === 'Demonstrated') statusClass = 'badge-green';
      
      return `
        <div class="item-card bg-glass">
          <div class="item-card-header">
            <strong>${item.piece}</strong>
            <span class="badge ${statusClass}">${item.status}</span>
          </div>
          <p class="small">${item.content}</p>
          <div class="xs muted">Logged on: ${item.createdAt}</div>
        </div>
      `;
    }).join('');
  }

  // Student Reflections Feed
  const reflections = DB.get('student_reflections').filter(r => r.group === u.group && r.section === u.section);
  if (reflections.length === 0) {
    dom.tutorStudentReflectionsList.innerHTML = `<p class="muted small">No student reflections logged for your section yet.</p>`;
  } else {
    dom.tutorStudentReflectionsList.innerHTML = reflections.map(r => `
      <div class="item-card bg-glass" style="margin-top: 8px;">
        <div class="item-card-header">
          <strong>${r.piece}</strong>
          <span class="badge badge-accent">Confidence: ${r.rating}/5</span>
        </div>
        <div class="item-card-meta">
          Submitted by: <strong>${r.studentName}</strong> on ${r.createdAt}
        </div>
        <p class="small" style="margin-top: 6px;"><strong>Challenges:</strong> ${r.challenges}</p>
        <p class="small" style="font-style: italic; margin-top: 4px;">"${r.content}"</p>
      </div>
    `).join('');
  }
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
        <strong class="item-card-title">${plan.piece} (${plan.location})</strong>
        <button class="btn btn-xs btn-outline text-red" onclick="deleteLessonPlan('${plan.id}')">Delete</button>
      </div>
      <div><span class="badge">${plan.domain}</span></div>
      <p class="item-card-body small" style="background-color: rgba(0,0,0,0.03); padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">${plan.strategy}</p>
      <div class="xs muted">Plan established: ${plan.createdAt}</div>
    </div>
  `).join('');
}

// == Tutor Rehearsal Session Logger ==
function renderTutorLoggerAssistant() {
  const u = state.activeUser;
  const plans = DB.get('lesson_plans').filter(p => p.group === u.group && p.section === u.section);
  
  if (plans.length === 0) {
    dom.tutorLoggerPlanSelector.innerHTML = `<p class="muted small">Create a Lesson Plan first to link it into your logs here.</p>`;
    return;
  }
  
  dom.tutorLoggerPlanSelector.innerHTML = plans.map(p => `
    <div class="table-row justify-between">
      <div>
        <div class="row-primary-text" style="font-size: 0.85rem;">${p.piece}</div>
        <div class="row-sub-text">${p.domain}</div>
      </div>
      <button class="btn btn-xs btn-primary" onclick="prefillLoggerForm('${p.piece}', '${p.domain}')">Link & Fill</button>
    </div>
  `).join('');
}

function prefillLoggerForm(repertoire, domain) {
  dom.logDomain.value = domain;
  
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
  
  dom.logObservations.focus();
}

// == Tutor Logs History Archive ==
function renderTutorLogsArchive() {
  const u = state.activeUser;
  const logs = DB.get('session_logs').filter(l => l.group === u.group && l.section === u.section);
  
  if (logs.length === 0) {
    dom.tutorLogsList.innerHTML = `<p class="muted small">No submitted sectional logs found for your section.</p>`;
    return;
  }
  
  dom.tutorLogsList.innerHTML = logs.map(log => {
    let statusClass = 'badge-yellow';
    if (log.status === 'Requires further development') statusClass = 'badge-red';
    if (log.status === 'Demonstrated') statusClass = 'badge-green';
    
    return `
      <div class="item-card bg-glass">
        <div class="item-card-header">
          <strong class="item-card-title">${log.piece}</strong>
          <div class="flex-row gap-10 items-center">
            <span class="badge ${statusClass}">${log.status}</span>
            <button class="btn btn-xs btn-outline text-red" onclick="deleteSessionLog('${log.id}')">Delete</button>
          </div>
        </div>
        <div class="item-card-meta">
          Domain: <strong>${log.domain}</strong>
        </div>
        <p class="item-card-body small">${log.observations}</p>
        <div class="flex-row gap-14" style="background-color: rgba(0,0,0,0.02); padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-top: 6px;">
          <div class="xs">Intonation: <strong class="text-cyan">${log.intonation}/5</strong></div>
          <div class="xs">Cohesion: <strong class="text-yellow">${log.coordination}/5</strong></div>
        </div>
        <div class="item-card-footer">
          <span>Submitted on: ${log.createdAt}</span>
          <span>Privacy Locked</span>
        </div>
      </div>
    `;
  }).join('');
}


// 8. Form Submission Handlers
function handleSyllabusSubmit(e) {
  e.preventDefault();
  
  const pieceTitle = getSubmittedRepertoire(dom.syllabusPieceSelect, dom.syllabusPieceCustom, dom.syllabusGroup.value);
  if (!pieceTitle) {
    alert('Please select or specify a repertoire title.');
    return;
  }

  const newItem = {
    id: 'syll-' + Date.now(),
    group: dom.syllabusGroup.value,
    section: dom.syllabusSection.value,
    piece: pieceTitle,
    location: dom.syllabusLocation.value.trim(),
    domain: dom.syllabusDomain.value,
    notes: dom.syllabusNotes.value.trim(),
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  const current = DB.get('syllabus');
  current.push(newItem);
  DB.set('syllabus', current);
  
  // Clear Form
  dom.syllabusPieceSelect.value = '';
  dom.syllabusPieceCustom.value = '';
  dom.syllabusPieceCustom.style.display = 'none';
  dom.syllabusLocation.value = '';
  dom.syllabusNotes.value = '';
  
  populateRepertoireDropdown(dom.syllabusGroup.value, dom.syllabusPieceSelect, dom.syllabusPieceCustom);
  renderCoordinatorSyllabusList();
  alert('Objective published successfully to section tutors!');
}

function handleTuttiSubmit(e) {
  e.preventDefault();
  
  const pieceTitle = getSubmittedRepertoire(dom.tuttiRepertoireSelect, dom.tuttiRepertoireCustom, dom.tuttiGroup.value);
  if (!pieceTitle) {
    alert('Please select or specify a repertoire title.');
    return;
  }

  const newItem = {
    id: 'tutti-' + Date.now(),
    group: dom.tuttiGroup.value,
    section: dom.tuttiSection.value,
    piece: pieceTitle,
    status: dom.tuttiStatus.value,
    content: dom.tuttiContent.value.trim(),
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  const current = DB.get('tutti_feedback');
  current.push(newItem);
  DB.set('tutti_feedback', current);
  
  // Clear Form
  dom.tuttiRepertoireSelect.value = '';
  dom.tuttiRepertoireCustom.value = '';
  dom.tuttiRepertoireCustom.style.display = 'none';
  dom.tuttiContent.value = '';
  
  populateRepertoireDropdown(dom.tuttiGroup.value, dom.tuttiRepertoireSelect, dom.tuttiRepertoireCustom);
  renderCoordinatorTuttiList();
  alert('Tutti rehearsal feedback logged successfully!');
}

function handleLessonPlanSubmit(e) {
  e.preventDefault();
  const u = state.activeUser;
  
  const pieceTitle = getSubmittedRepertoire(dom.planRepertoireSelect, dom.planRepertoireCustom, u.group);
  if (!pieceTitle) {
    alert('Please select or specify a repertoire title.');
    return;
  }

  const newItem = {
    id: 'plan-' + Date.now(),
    group: u.group,
    section: u.section,
    piece: pieceTitle,
    location: dom.planLocation.value.trim(),
    domain: dom.planDomain.value,
    strategy: dom.planStrategy.value.trim(),
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  const current = DB.get('lesson_plans');
  current.push(newItem);
  DB.set('lesson_plans', current);
  
  // Clear Form
  dom.planRepertoireSelect.value = '';
  dom.planRepertoireCustom.value = '';
  dom.planRepertoireCustom.style.display = 'none';
  dom.planLocation.value = '';
  dom.planStrategy.value = '';
  
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

  const newItem = {
    id: 'log-' + Date.now(),
    group: u.group,
    section: u.section,
    piece: pieceTitle,
    domain: dom.logDomain.value,
    intonation: parseInt(dom.logIntonation.value),
    coordination: parseInt(dom.logCoordination.value),
    status: dom.logLevel.value,
    observations: dom.logObservations.value.trim(),
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  const current = DB.get('session_logs');
  current.push(newItem);
  DB.set('session_logs', current);
  
  // Clear Form
  dom.logRepertoireSelect.value = '';
  dom.logRepertoireCustom.value = '';
  dom.logRepertoireCustom.style.display = 'none';
  dom.logObservations.value = '';
  
  populateRepertoireDropdown(u.group, dom.logRepertoireSelect, dom.logRepertoireCustom);
  renderTutorLoggerAssistant();
  alert('Rehearsal progress logged and transmitted to coordinators!');
}


// 9. Deletion Actions (Globals defined on window for onclick calls)
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

  // 1. Render coordinator objectives
  const syllabus = DB.get('syllabus').filter(item => item.group === u.group && item.section === u.section);
  if (syllabus.length === 0) {
    dom.studentSyllabusList.innerHTML = `<p class="muted small">No objectives currently set by coordinators for the ${u.section} section.</p>`;
  } else {
    dom.studentSyllabusList.innerHTML = syllabus.map(item => `
      <div class="item-card bg-glass animate-fade-in">
        <div class="item-card-header">
          <strong class="item-card-title">${item.piece}</strong>
          <span class="badge badge-accent">${item.domain}</span>
        </div>
        <p class="small">${item.notes}</p>
        <div class="xs muted">Target: ${item.location} · Assigned: ${item.createdAt}</div>
      </div>
    `).join('');
  }

  // 2. Render tutor session logs
  const logs = DB.get('session_logs').filter(log => log.group === u.group && log.section === u.section);
  if (logs.length === 0) {
    dom.studentTutorLogsList.innerHTML = `<p class="muted small">No recent rehearsals logged by your section tutor.</p>`;
  } else {
    dom.studentTutorLogsList.innerHTML = logs.map(log => `
      <div class="item-card bg-glass animate-fade-in">
        <div class="item-card-header">
          <strong class="item-card-title">${log.piece}</strong>
          <button class="btn btn-xs btn-primary" onclick="prefillStudentReflector('${log.id}')">Reflect on this Rehearsal</button>
        </div>
        <div class="item-card-meta">
          Domain: <strong>${log.domain}</strong> · Status: <span class="badge ${log.status === 'Requires further development' ? 'badge-red' : log.status === 'Demonstrated' ? 'badge-green' : 'badge-yellow'}">${log.status}</span>
        </div>
        <p class="item-card-body small">${log.observations}</p>
        <div class="xs muted">Logged on: ${log.createdAt}</div>
      </div>
    `).join('');
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

// Kickstart on document load
document.addEventListener('DOMContentLoaded', initApp);
initApp();
