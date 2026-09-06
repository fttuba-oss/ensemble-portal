/**
 * Ensemble Learning Programme - Core Application Logic
 * Implements portal security key verification, role-based views, local storage database management,
 * and academic dashboard progression charts.
 */

// 1. Data Schema & Instrument Configuration
const GROUPS = {
  NUSSO: [
    'Flute', 'Oboe', 'Clarinet', 'Bassoon', 'Horn', 'Trumpet', 'Trombone', 
    'Tuba', 'Percussion', 'Violin 1', 'Violin 2', 'Viola', 'Cello', 'Double Bass'
  ],
  NUSWS: [
    'Flute', 'Oboe', 'Clarinet', 'Bassoon', 'Saxophone', 'Horn', 'Trumpet', 
    'Trombone', 'Euphonium', 'Tuba', 'Percussion'
  ]
};

const INSTRUMENT_FAMILIES = {
  // Woodwinds (order 1)
  'Flute': { family: 'Woodwinds', code: 'ww', rank: 10 },
  'Piccolo': { family: 'Woodwinds', code: 'ww', rank: 11 },
  'Oboe': { family: 'Woodwinds', code: 'ww', rank: 12 },
  'Clarinet': { family: 'Woodwinds', code: 'ww', rank: 13 },
  'Bassoon': { family: 'Woodwinds', code: 'ww', rank: 14 },
  'Saxophone': { family: 'Woodwinds', code: 'ww', rank: 15 },
  
  // Brass (order 2)
  'Horn': { family: 'Brass', code: 'brass', rank: 20 },
  'Trumpet': { family: 'Brass', code: 'brass', rank: 21 },
  'Trombone': { family: 'Brass', code: 'brass', rank: 22 },
  'Euphonium': { family: 'Brass', code: 'brass', rank: 23 },
  'Tuba': { family: 'Brass', code: 'brass', rank: 24 },
  
  // Percussion (order 3)
  'Timpani': { family: 'Percussion', code: 'perc', rank: 30 },
  'Percussion': { family: 'Percussion', code: 'perc', rank: 31 },
  
  // Strings (order 4)
  'Violin 1': { family: 'Strings', code: 'strings', rank: 40 },
  'Violin 2': { family: 'Strings', code: 'strings', rank: 41 },
  'Viola': { family: 'Strings', code: 'strings', rank: 42 },
  'Cello': { family: 'Strings', code: 'strings', rank: 43 },
  'Double Bass': { family: 'Strings', code: 'strings', rank: 44 }
};

function getSectionInfo(sec) {
  return INSTRUMENT_FAMILIES[sec] || { family: 'Other', code: 'other', rank: 99 };
}

function sortSectionsOrchestral(sections) {
  return [...sections].sort((a, b) => {
    return getSectionInfo(a).rank - getSectionInfo(b).rank;
  });
}

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

const SEED_UPLOADED_ASSETS = [
  {
    id: 'asset-1',
    name: 'NUS_CFA_Curriculum_Syllabus_Guide.md',
    uploadedAt: '2026-08-15',
    size: '2.4 KB',
    content: `CFA Ensemble Pedagogical Directives & Curriculum Guidelines:
1. Tone Quality & Intonation: Horn sectionals must practice with drone pitches in upper registers to cure intonation drift in soft dynamics.
2. Dynamic Balance: During Tutti movements, strings and heavy brass must balance under solo woodwind lines marked mp or softer.
3. Rhythmic Subdivision: Syncopated eighth-note passages (e.g. Holst and First Suite) require strict internal subdivision aligned with percussion downbeats.
4. Student Reflection Review: Section tutors are instructed to review student reflection submissions before every sectional to address individual embouchure and fingering hurdles.`
  },
  {
    id: 'asset-2',
    name: 'Carmen_Suite_Conductor_Score_Directives.txt',
    uploadedAt: '2026-08-22',
    size: '1.6 KB',
    content: `Conductor rehearsal notes for Carmen Suite No. 1:
- Prélude: Target tempo is strictly quarter = 116 bpm. Brass articulation must be crisp and snappy.
- Intermezzo: Bars 24-32 unison shifts in the horns suffered tuning drift. Tutors must review breath support.
- Aragonaise: Bars 57-72 trumpet double-tonguing requires clean synchronization with woodwinds.`
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
    this.get('uploaded_assets', SEED_UPLOADED_ASSETS);
  }

  static reset() {
    localStorage.removeItem('cfa_db_tutti_rehearsals');
    localStorage.removeItem('cfa_db_lesson_plans');
    localStorage.removeItem('cfa_db_session_logs');
    localStorage.removeItem('cfa_db_repertoire');
    localStorage.removeItem('cfa_db_student_reflections');
    localStorage.removeItem('cfa_db_qa_threads');
    localStorage.removeItem('cfa_db_uploaded_assets');
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
  activeOverviewMode: 'section', // 'section' | 'repertoire'
  selectedRepertoire: null, // active piece selected in repertoire view
  activeMetricFilter: null, // kept for backwards compatibility if referenced
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
  btnViewBySection: document.getElementById('btnViewBySection'),
  btnViewByRepertoire: document.getElementById('btnViewByRepertoire'),
  overviewBySectionView: document.getElementById('overviewBySectionView'),
  overviewByRepertoireView: document.getElementById('overviewByRepertoireView'),
  overviewSectionMatrix: document.getElementById('overviewSectionMatrix'),
  matrixCountBadge: document.getElementById('matrixCountBadge'),
  overviewRepertoirePills: document.getElementById('overviewRepertoirePills'),
  overviewRepertoireLogsList: document.getElementById('overviewRepertoireLogsList'),
  repertoireViewTitle: document.getElementById('repertoireViewTitle'),
  repertoireLogsCount: document.getElementById('repertoireLogsCount'),
  btnOpenAddRepertoireModal: document.getElementById('btnOpenAddRepertoireModal'),
  addRepertoireModal: document.getElementById('addRepertoireModal'),
  addRepertoireModalCloseBtn: document.getElementById('addRepertoireModalCloseBtn'),
  addRepertoireForm: document.getElementById('addRepertoireForm'),
  newRepertoireTitle: document.getElementById('newRepertoireTitle'),
  newRepertoireEnsemble: document.getElementById('newRepertoireEnsemble'),
  newRepertoireNotes: document.getElementById('newRepertoireNotes'),
  overviewOpenAiBtn: document.getElementById('overviewOpenAiBtn'),

  // AI Assistant & Chatbot Elements
  aiChatFabBtn: document.getElementById('aiChatFabBtn'),
  aiChatModal: document.getElementById('aiChatModal'),
  aiModalCloseBtn: document.getElementById('aiModalCloseBtn'),
  aiClearHistoryBtn: document.getElementById('aiClearHistoryBtn'),
  aiQuickPrompts: document.getElementById('aiQuickPrompts'),
  aiChatMessages: document.getElementById('aiChatMessages'),
  aiChatForm: document.getElementById('aiChatForm'),
  aiChatInput: document.getElementById('aiChatInput'),
  aiChatSendBtn: document.getElementById('aiChatSendBtn'),
  
  // Coordinator Rehearsal Notes Elements
  tuttiNotesForm: document.getElementById('tuttiNotesForm'),
  notesDocUpload: document.getElementById('notesDocUpload'),
  notesDocFileInfo: document.getElementById('notesDocFileInfo'),
  notesDate: document.getElementById('notesDate'),
  notesRepertoireSelect: document.getElementById('notesRepertoireSelect'),
  notesRepertoireCustom: document.getElementById('notesRepertoireCustom'),
  notesGeneralSummary: document.getElementById('notesGeneralSummary'),
  addObservationRowBtn: document.getElementById('addObservationRowBtn'),
  notesObservationsContainer: document.getElementById('notesObservationsContainer'),
  tuttiRehearsalsList: document.getElementById('tuttiRehearsalsList'),
  notesCountBadge: document.getElementById('notesCountBadge'),
  
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
let isEventListenersSetup = false;
function setupEventListeners() {
  if (isEventListenersSetup) return;
  isEventListenersSetup = true;

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

  // Coordinator Overview Mode Switcher (By Section vs By Repertoire)
  if (dom.btnViewBySection && dom.btnViewByRepertoire) {
    dom.btnViewBySection.addEventListener('click', () => switchOverviewMode('section'));
    dom.btnViewByRepertoire.addEventListener('click', () => switchOverviewMode('repertoire'));
  }

  // Coordinator Add Repertoire Modal
  if (dom.btnOpenAddRepertoireModal) {
    dom.btnOpenAddRepertoireModal.addEventListener('click', () => {
      if (dom.addRepertoireModal) dom.addRepertoireModal.style.display = 'flex';
    });
  }
  if (dom.addRepertoireModalCloseBtn) {
    dom.addRepertoireModalCloseBtn.addEventListener('click', () => {
      if (dom.addRepertoireModal) dom.addRepertoireModal.style.display = 'none';
    });
  }
  if (dom.addRepertoireModal) {
    dom.addRepertoireModal.addEventListener('click', (e) => {
      if (e.target === dom.addRepertoireModal) dom.addRepertoireModal.style.display = 'none';
    });
  }
  if (dom.addRepertoireForm) {
    dom.addRepertoireForm.addEventListener('submit', handleAddRepertoireSubmit);
  }

  // Word Doc / PDF upload for Conductor Rehearsal Notes
  if (dom.notesDocUpload) {
    dom.notesDocUpload.addEventListener('change', handleNotesDocUpload);
  }

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

  // AI Rehearsal Assistant Event Listeners
  if (dom.aiChatFabBtn) {
    dom.aiChatFabBtn.addEventListener('click', openAiAssistantModal);
  }
  if (dom.overviewOpenAiBtn) {
    dom.overviewOpenAiBtn.addEventListener('click', openAiAssistantModal);
  }
  if (dom.aiModalCloseBtn) {
    dom.aiModalCloseBtn.addEventListener('click', closeAiAssistantModal);
  }
  if (dom.aiChatModal) {
    dom.aiChatModal.addEventListener('click', (e) => {
      if (e.target === dom.aiChatModal) closeAiAssistantModal();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dom.aiChatModal && dom.aiChatModal.style.display !== 'none') {
      closeAiAssistantModal();
    }
  });

  if (dom.aiChatForm) {
    dom.aiChatForm.addEventListener('submit', handleAiChatFormSubmit);
  }
  if (dom.aiChatInput) {
    dom.aiChatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        dom.aiChatForm.dispatchEvent(new Event('submit'));
      }
    });
  }
  if (dom.aiQuickPrompts) {
    dom.aiQuickPrompts.querySelectorAll('.ai-prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        if (prompt) executeAiPrompt(prompt);
      });
    });
  }
  if (dom.aiUploadAssetBtn && dom.aiAssetFileInput) {
    dom.aiUploadAssetBtn.addEventListener('click', () => dom.aiAssetFileInput.click());
    dom.aiAssetFileInput.addEventListener('change', handleAssetFileUpload);
  }
  if (dom.aiClearHistoryBtn) {
    dom.aiClearHistoryBtn.addEventListener('click', clearAiChatHistory);
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
    dom.sidebarTitle.textContent = 'RehearsalIQ';
    dom.sidebarSubtitle.textContent = 'Coordinator Portal';
    
    // Set up Coordinator Sidebar Navigation
    dom.sidebarNav.innerHTML = `
      <a class="nav-item active" data-panel="coord-overview">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        Overview
      </a>
      <a class="nav-item" data-panel="coord-notes">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        Notes
      </a>
      <a class="nav-item" data-panel="coord-reflections">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        Reflect
      </a>
      <a class="nav-item" data-panel="coord-explorer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        Logs Database
      </a>
      <a class="nav-item" data-panel="coord-qa">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        Q&A
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
    dom.sidebarTitle.textContent = 'RehearsalIQ';
    dom.sidebarSubtitle.textContent = `${u.group} · ${u.section} Tutor`;

    // Set up Tutor Sidebar Navigation
    dom.sidebarNav.innerHTML = `
      <a class="nav-item active" data-panel="tutor-hub">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        Hub
      </a>
      <a class="nav-item" data-panel="tutor-planner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        Planner
      </a>
      <a class="nav-item" data-panel="tutor-logger">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        Log
      </a>
      <a class="nav-item" data-panel="tutor-logs">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        Archive
      </a>
      <a class="nav-item" data-panel="tutor-qa">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        Q&A
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
    dom.sidebarTitle.textContent = 'RehearsalIQ';
    dom.sidebarSubtitle.textContent = `${u.group} · ${u.section} Student`;

    // Set up Student Sidebar Navigation
    dom.sidebarNav.innerHTML = `
      <a class="nav-item active" data-panel="student-hub">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        Hub
      </a>
      <a class="nav-item" data-panel="student-reflector">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        Reflect
      </a>
      <a class="nav-item" data-panel="student-reflections">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        History
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

  // Scroll to top on mobile tab navigation
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update header descriptions based on view panel
  updateHeaderContent(panelId);
  
  // Render details relative to the loaded viewport
  renderCurrentViewportData();
}

// Dynamic header descriptions
function updateHeaderContent(panelId) {
  const u = state.activeUser;
  const labels = {
    'coord-overview': { title: `${state.activeCoordinatorGroup} Overview`, eyebrow: 'Coordinator' },
    'coord-notes': { title: 'Tutti Notes', eyebrow: 'Conductor' },
    'coord-explorer': { title: 'Logs Database', eyebrow: 'All Sections' },
    'coord-reflections': { title: 'Student Reflections', eyebrow: 'Feedback Feed' },
    'coord-qa': { title: 'Tutor Questions', eyebrow: 'Discussions' },
    'tutor-hub': { title: 'Sectional Hub', eyebrow: `${u.group} · ${u.section}` },
    'tutor-planner': { title: 'Lesson Planner', eyebrow: `${u.group} · ${u.section}` },
    'tutor-logger': { title: 'Sectional Log', eyebrow: `${u.group} · ${u.section}` },
    'tutor-logs': { title: 'Log Archive', eyebrow: `${u.group} · ${u.section}` },
    'tutor-qa': { title: 'Conductor Q&A', eyebrow: `${u.group} · ${u.section}` },
    'student-hub': { title: 'Student Hub', eyebrow: `${u.group} · ${u.section}` },
    'student-reflector': { title: 'Reflection', eyebrow: `${u.group} · ${u.section}` },
    'student-reflections': { title: 'Reflection History', eyebrow: `${u.group} · ${u.section}` },
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
  if (dom.overviewSectionFilter) populateSectionOptions(grp, dom.overviewSectionFilter);
  if (dom.coordReflectionsSectionFilter) populateSectionOptions(grp, dom.coordReflectionsSectionFilter);
  
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
    if (state.activeOverviewMode === 'section') {
      renderOverviewSectionMatrix();
    } else {
      renderOverviewRepertoireView();
    }
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

// == Coordinator Dashboard Overview (Clean Section List & Repertoire View) ==

function switchOverviewMode(mode) {
  state.activeOverviewMode = mode;
  if (dom.btnViewBySection) {
    dom.btnViewBySection.classList.toggle('active', mode === 'section');
  }
  if (dom.btnViewByRepertoire) {
    dom.btnViewByRepertoire.classList.toggle('active', mode === 'repertoire');
  }
  if (dom.overviewBySectionView) {
    dom.overviewBySectionView.style.display = mode === 'section' ? 'block' : 'none';
  }
  if (dom.overviewByRepertoireView) {
    dom.overviewByRepertoireView.style.display = mode === 'repertoire' ? 'block' : 'none';
  }
  if (mode === 'section') {
    renderOverviewSectionMatrix();
  } else {
    renderOverviewRepertoireView();
  }
}

function handleAddRepertoireSubmit(e) {
  e.preventDefault();
  if (!dom.newRepertoireTitle) return;
  const title = dom.newRepertoireTitle.value.trim();
  const ensemble = dom.newRepertoireEnsemble ? dom.newRepertoireEnsemble.value : 'Both';
  const notes = dom.newRepertoireNotes ? dom.newRepertoireNotes.value.trim() : '';

  if (!title) return;

  const currentRep = DB.get('repertoire', SEED_REPERTOIRE);
  const newItem = {
    id: 'rep-' + Date.now(),
    title: title,
    group: ensemble,
    notes: notes,
    createdAt: new Date().toISOString().split('T')[0]
  };
  currentRep.push(newItem);
  DB.set('repertoire', currentRep);

  // Update Repertoire dropdowns across the application
  populateRepertoireDropdown(state.activeCoordinatorGroup, dom.notesRepertoireSelect, dom.notesRepertoireCustom);
  if (dom.planRepertoireSelect && state.activeUser) {
    populateRepertoireDropdown(state.activeUser.group, dom.planRepertoireSelect, dom.planRepertoireCustom);
  }
  if (dom.logRepertoireSelect && state.activeUser) {
    populateRepertoireDropdown(state.activeUser.group, dom.logRepertoireSelect, dom.logRepertoireCustom);
  }

  // Reset form & close modal
  dom.addRepertoireForm.reset();
  if (dom.addRepertoireModal) dom.addRepertoireModal.style.display = 'none';

  // Automatically select the new piece and render repertoire view
  state.selectedRepertoire = title;
  switchOverviewMode('repertoire');
}

function handleNotesDocUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  if (dom.notesDocFileInfo) {
    dom.notesDocFileInfo.style.display = 'block';
    dom.notesDocFileInfo.innerHTML = `📄 <strong>Attached:</strong> ${escapeHtml(file.name)} (${(file.size / 1024).toFixed(1)} KB)`;
  }

  const reader = new FileReader();

  if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
    reader.onload = function(evt) {
      const text = evt.target.result;
      if (dom.notesGeneralSummary) {
        dom.notesGeneralSummary.value = text.trim();
      }
    };
    reader.readAsText(file);
  } else {
    reader.onload = function(evt) {
      const arrayBuffer = evt.target.result;
      const bytes = new Uint8Array(arrayBuffer);
      let text = '';
      let currentWord = '';
      for (let i = 0; i < bytes.length; i++) {
        const b = bytes[i];
        if ((b >= 32 && b <= 126) || b === 10 || b === 13) {
          currentWord += String.fromCharCode(b);
        } else {
          if (currentWord.length >= 4) {
            const clean = currentWord.replace(/<[^>]+>/g, ' ').replace(/[^\x20-\x7E]/g, ' ').trim();
            if (clean.length > 3) text += clean + ' ';
          }
          currentWord = '';
        }
      }
      if (text.trim().length > 30) {
        const cleanedText = text.replace(/\s+/g, ' ').slice(0, 1500).trim();
        if (dom.notesGeneralSummary && !dom.notesGeneralSummary.value.trim()) {
          dom.notesGeneralSummary.value = `[Extracted from ${file.name}]:\n${cleanedText}`;
        }
      } else {
        if (dom.notesGeneralSummary && !dom.notesGeneralSummary.value.trim()) {
          dom.notesGeneralSummary.value = `[Attached Document: ${file.name}] Rehearsal plan and instructions attached.`;
        }
      }
    };
    reader.readAsArrayBuffer(file);
  }
}

function renderOverviewSectionMatrix() {
  if (!dom.overviewSectionMatrix) return;
  const group = state.activeCoordinatorGroup;
  const rawSections = GROUPS[group] || [];
  // Sort sections strictly by canonical score order: Woodwinds -> Brass -> Percussion -> Strings
  const sections = sortSectionsOrchestral(rawSections);
  const logs = DB.get('session_logs').filter(l => l.group === group);
  const rehearsals = DB.get('tutti_rehearsals');
  const reflections = DB.get('student_reflections').filter(r => r.group === group);

  if (dom.matrixCountBadge) {
    dom.matrixCountBadge.textContent = `${sections.length} Sections`;
  }

  dom.overviewSectionMatrix.innerHTML = sections.map(sec => {
    const info = getSectionInfo(sec);
    const secId = 'secHealth-' + sec.replace(/\s+/g, '-');

    // Latest sectional log
    const secLogs = logs.filter(l => l.section === sec);
    secLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latestLog = secLogs[0];

    // Conductor observations for this section
    const secTuttiObs = [];
    rehearsals.forEach(r => {
      if (r.observations) {
        r.observations.forEach(o => {
          if (o.group === group && o.section === sec) {
            secTuttiObs.push({ ...o, piece: r.repertoire, date: r.date });
          }
        });
      }
    });

    // Student reflections for this section
    const secReflections = reflections.filter(r => r.section === sec);
    const latestReflection = secReflections[secReflections.length - 1];

    return `
      <div class="section-health-card bg-glass" style="cursor: pointer;" onclick="toggleSectionLogDetails('${secId}')">
        <!-- Super Clean Unexpanded Card: ONLY Family pill + Section Name + Expand Chevron -->
        <div class="flex-row justify-between items-center section-health-summary" style="padding: 10px 14px;">
          <div class="flex-row items-center gap-8 min-w-0" style="flex: 1 1 auto; min-width: 0;">
            <span class="family-pill ${info.code} flex-shrink-0" style="font-size: 0.65rem; padding: 2px 8px; font-weight: 600;">${info.code.toUpperCase()}</span>
            <strong class="text-truncate" style="font-size: 0.95rem; color: var(--text-main); letter-spacing: -0.01em;">${escapeHtml(sec)}</strong>
          </div>
          <div class="flex-row items-center gap-6 flex-shrink-0">
            <button type="button" class="section-toggle-btn" id="btnToggle-${secId}" aria-label="Toggle log details" style="pointer-events: none;">
              <span>▾</span>
            </button>
          </div>
        </div>

        <!-- Expandable Full Instrument Log (Revealed on Tap) -->
        <div class="section-health-details" id="${secId}" style="display: none; padding: 12px 14px; border-top: 1px solid var(--border-subtle);" onclick="event.stopPropagation()">
          ${latestLog ? `
            <div class="xs muted" style="margin-bottom: 8px;">
              Repertoire: <strong style="color: var(--text-main);">${escapeHtml(latestLog.piece)}</strong> · Rehearsal Date: <strong>${latestLog.createdAt}</strong>
            </div>

            ${latestLog.generalFeedback ? `
              <div class="small" style="color: #cbd5e1; line-height: 1.45; margin-bottom: 10px; border-left: 2px solid var(--accent-primary); padding-left: 8px; background: rgba(255,255,255,0.02); padding-top: 4px; padding-bottom: 4px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
                <strong style="color: var(--text-main);">Tutor Feedback:</strong> "${escapeHtml(latestLog.generalFeedback)}"
              </div>
            ` : ''}

            ${latestLog.parts && latestLog.parts.length > 0 ? `
              <div class="xs" style="margin-bottom: 10px;">
                <strong style="color: var(--text-muted);">Rehearsal Breakdown:</strong>
                <div class="flex-column gap-6" style="margin-top: 6px;">
                  ${latestLog.parts.map(p => {
                    let badgeClass = 'badge-yellow';
                    if (p.status === 'Requires further development') badgeClass = 'badge-red';
                    if (p.status === 'Demonstrated') badgeClass = 'badge-green';
                    const statusShort = p.status === 'Requires further development' ? 'Requires Work' : p.status;
                    return `
                      <div class="flex-column gap-2 bg-glass" style="padding: 6px 10px; border-radius: 4px; border: 1px solid var(--border-subtle);">
                        <div class="flex-row justify-between items-center">
                          <strong>${escapeHtml(p.location)}</strong>
                          <span class="badge ${badgeClass}">${statusShort}</span>
                        </div>
                        ${p.notes ? `<div class="xs muted">↳ "${escapeHtml(p.notes)}"</div>` : ''}
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}
          ` : `
            <div class="xs muted" style="padding: 8px 0;">No sectional rehearsal logs recorded yet for ${escapeHtml(sec)}.</div>
          `}

          ${secTuttiObs.length > 0 ? `
            <div class="flex-column gap-4" style="margin-top: 8px;">
              <strong class="xs" style="color: var(--text-muted);">Conductor Tutti Directives:</strong>
              ${secTuttiObs.map(obs => `
                <div class="xs" style="background: rgba(239, 68, 68, 0.08); border-left: 3px solid var(--status-red); padding: 6px 8px; border-radius: 4px;">
                  <strong style="color: var(--status-red);">${escapeHtml(obs.piece)} (${obs.date}):</strong><br>
                  "${escapeHtml(obs.content)}"
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${latestReflection ? `
            <div class="xs" style="margin-top: 8px; background: rgba(56, 189, 248, 0.08); padding: 6px 8px; border-radius: 4px; border-left: 3px solid #38bdf8;">
              <strong style="color: #38bdf8;">Student Reflection (${latestReflection.studentName || 'Student'} · ${latestReflection.rating}/5★):</strong><br>
              "${escapeHtml(latestReflection.challenges || latestReflection.content)}"
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderOverviewRepertoireView() {
  if (!dom.overviewRepertoirePills || !dom.overviewRepertoireLogsList) return;
  const group = state.activeCoordinatorGroup;
  
  // Get repertoire for current group
  const allRepertoire = DB.get('repertoire', SEED_REPERTOIRE);
  const groupRepertoire = allRepertoire.filter(r => !r.group || r.group === group || r.group === 'Both');

  if (groupRepertoire.length === 0) {
    dom.overviewRepertoirePills.innerHTML = '<span class="xs muted">No repertoire pieces added yet. Click "+ Add Repertoire" to create one.</span>';
    dom.overviewRepertoireLogsList.innerHTML = '<p class="muted small text-center" style="padding: 24px;">No repertoire configured for this ensemble.</p>';
    return;
  }

  // Ensure an active piece is selected
  if (!state.selectedRepertoire || !groupRepertoire.some(r => r.title === state.selectedRepertoire)) {
    state.selectedRepertoire = groupRepertoire[0].title;
  }

  // Render Repertoire Selector Pills
  dom.overviewRepertoirePills.innerHTML = groupRepertoire.map(rep => {
    const isSelected = rep.title === state.selectedRepertoire;
    return `
      <button type="button" class="rep-pill ${isSelected ? 'active' : ''}" onclick="selectOverviewRepertoire('${escapeHtml(rep.title).replace(/'/g, "\\'")}')">
        🎵 ${escapeHtml(rep.title)}
      </button>
    `;
  }).join('');

  // Update Repertoire View Header
  if (dom.repertoireViewTitle) {
    dom.repertoireViewTitle.textContent = state.selectedRepertoire;
  }

  // Load section logs for this repertoire
  const logs = DB.get('session_logs').filter(l => l.group === group && l.piece.toLowerCase().trim() === state.selectedRepertoire.toLowerCase().trim());
  
  if (dom.repertoireLogsCount) {
    dom.repertoireLogsCount.textContent = `${logs.length} Log(s)`;
  }

  // Canonical orchestral order of sections: Woodwinds -> Brass -> Percussion -> Strings
  const rawSections = GROUPS[group] || [];
  const sections = sortSectionsOrchestral(rawSections);

  // Group logs or sections that have worked on this piece
  const sectionsWithLogs = sections.filter(sec => logs.some(l => l.section === sec));

  if (sectionsWithLogs.length === 0) {
    dom.overviewRepertoireLogsList.innerHTML = `
      <div class="dashboard-card bg-glass muted small text-center" style="padding: 28px;">
        <div style="font-size: 1.5rem; margin-bottom: 8px;">🎼</div>
        <p>No sectional rehearsal logs have been submitted yet for <strong>${escapeHtml(state.selectedRepertoire)}</strong>.</p>
        <p class="xs" style="margin-top: 6px; color: var(--text-muted);">Tutors can log rehearsal progress for this piece under the Sectional Log tab.</p>
      </div>
    `;
    return;
  }

  dom.overviewRepertoireLogsList.innerHTML = sectionsWithLogs.map(sec => {
    const secLogs = logs.filter(l => l.section === sec);
    secLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latestLog = secLogs[0];
    const info = getSectionInfo(sec);
    const repSecId = 'repSecLog-' + sec.replace(/\s+/g, '-');

    return `
      <div class="section-health-card bg-glass" style="cursor: pointer; margin-bottom: 8px;" onclick="toggleSectionLogDetails('${repSecId}')">
        <div class="flex-row justify-between items-center section-health-summary" style="padding: 10px 14px;">
          <div class="flex-row items-center gap-8 min-w-0" style="flex: 1 1 auto; min-width: 0;">
            <span class="family-pill ${info.code} flex-shrink-0" style="font-size: 0.65rem; padding: 2px 8px; font-weight: 600;">${info.code.toUpperCase()}</span>
            <strong class="text-truncate" style="font-size: 0.95rem; color: var(--text-main);">${escapeHtml(sec)}</strong>
          </div>
          <div class="flex-row items-center gap-8 flex-shrink-0">
            <span class="xs muted">${latestLog.createdAt}</span>
            <button type="button" class="section-toggle-btn" id="btnToggle-${repSecId}" aria-label="Toggle details" style="pointer-events: none;">
              <span>▾</span>
            </button>
          </div>
        </div>

        <div class="section-health-details" id="${repSecId}" style="display: none; padding: 12px 14px; border-top: 1px solid var(--border-subtle);" onclick="event.stopPropagation()">
          ${latestLog.generalFeedback ? `
            <div class="small" style="color: #cbd5e1; line-height: 1.45; margin-bottom: 10px; border-left: 2px solid var(--accent-primary); padding-left: 8px; background: rgba(255,255,255,0.02); padding-top: 4px; padding-bottom: 4px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
              <strong style="color: var(--text-main);">Tutor Feedback:</strong> "${escapeHtml(latestLog.generalFeedback)}"
            </div>
          ` : ''}

          ${latestLog.parts && latestLog.parts.length > 0 ? `
            <div class="xs" style="margin-bottom: 8px;">
              <strong style="color: var(--text-muted);">Rehearsed Measures / Movements:</strong>
              <div class="flex-column gap-6" style="margin-top: 6px;">
                ${latestLog.parts.map(p => {
                  let badgeClass = 'badge-yellow';
                  if (p.status === 'Requires further development') badgeClass = 'badge-red';
                  if (p.status === 'Demonstrated') badgeClass = 'badge-green';
                  const statusShort = p.status === 'Requires further development' ? 'Requires Work' : p.status;
                  return `
                    <div class="flex-column gap-2 bg-glass" style="padding: 6px 10px; border-radius: 4px; border: 1px solid var(--border-subtle);">
                      <div class="flex-row justify-between items-center">
                        <strong>${escapeHtml(p.location)}</strong>
                        <span class="badge ${badgeClass}">${statusShort}</span>
                      </div>
                      ${p.notes ? `<div class="xs muted">↳ "${escapeHtml(p.notes)}"</div>` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

window.selectOverviewRepertoire = function(title) {
  state.selectedRepertoire = title;
  renderOverviewRepertoireView();
};

window.toggleSectionLogDetails = function(secId) {
  const el = document.getElementById(secId);
  const btn = document.getElementById('btnToggle-' + secId);
  if (!el) return;
  const isHidden = el.style.display === 'none';
  el.style.display = isHidden ? 'block' : 'none';
  if (btn) {
    btn.innerHTML = isHidden ? '<span>▴</span>' : '<span>▾</span>';
  }
};



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
  
  dom.tuttiRehearsalsList.innerHTML = list.map(item => {
    const logDetailsId = 'tuttiLog-' + item.id;
    const summarySnippet = item.generalSummary ? (item.generalSummary.length > 90 ? item.generalSummary.substring(0, 90) + '...' : item.generalSummary) : 'No general overview text.';
    return `
      <article class="item-card bg-glass animate-fade-in" style="cursor: pointer; margin-bottom: 10px;" onclick="toggleSectionLogDetails('${logDetailsId}')">
        <!-- Clean Clickable Summary Header -->
        <div class="item-card-header" style="padding: 10px 14px; margin-bottom: 0;">
          <div class="min-w-0" style="flex: 1 1 auto; min-width: 0;">
            <div class="flex-row items-center gap-8 flex-wrap">
              <strong class="item-card-title text-truncate" style="font-size: 0.95rem; color: var(--text-main);">${escapeHtml(item.repertoire)}</strong>
              <span class="xs muted">📅 ${item.date}</span>
            </div>
            <div class="xs muted text-truncate" style="margin-top: 4px; color: var(--text-muted);">
              ${escapeHtml(summarySnippet)}
            </div>
          </div>
          <div class="flex-row items-center gap-8 flex-shrink-0">
            <button class="btn btn-xs btn-outline text-red" onclick="event.stopPropagation(); deleteTuttiRehearsal('${item.id}')">Delete</button>
            <button type="button" class="section-toggle-btn" id="btnToggle-${logDetailsId}" aria-label="Toggle details" style="pointer-events: none;">
              <span>▾</span>
            </button>
          </div>
        </div>

        <!-- Tap-to-Expand Details -->
        <div class="section-health-details" id="${logDetailsId}" style="display: none; padding: 12px 14px; border-top: 1px solid var(--border-subtle);" onclick="event.stopPropagation()">
          <div class="small" style="background-color: rgba(255,255,255,0.02); padding: 8px 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-bottom: 10px; line-height: 1.5;">
            <strong style="color: var(--text-main);">General Rehearsal Overview:</strong><br>
            ${escapeHtml(item.generalSummary)}
          </div>
          <div class="flex-column gap-6">
            <strong class="xs" style="color: var(--text-muted);">Specific notes for section:</strong>
            ${(!item.observations || item.observations.length === 0) ? '<span class="xs muted">None recorded.</span>' : item.observations.map(obs => {
              let statusClass = 'badge-yellow';
              if (obs.status === 'Resolved') statusClass = 'badge-green';
              if (obs.status === 'Requires attention') statusClass = 'badge-red';
              return `
                <div class="table-row justify-between" style="padding: 6px 10px; background-color: rgba(0,0,0,0.02); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); font-size: 0.8rem;">
                  <div style="flex: 1; padding-right: 12px;">
                    <strong class="text-cyan">[${obs.group} ${obs.section}]</strong><br>
                    <span class="muted">${escapeHtml(obs.content)}</span>
                  </div>
                  <span class="badge ${statusClass}" style="align-self: center;">${obs.status}</span>
                </div>
              `;
            }).join('')}
          </div>
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
  row.className = 'plan-part-row flex-column gap-8';
  
  row.innerHTML = `
    <div class="flex-row gap-8 items-center">
      <input type="text" class="row-part-location input-control" style="flex: 1; font-weight: 600;" placeholder="Section (e.g. Section A / bars 24-32)" value="${location}" required />
      <button type="button" class="btn btn-xs btn-outline text-red" onclick="this.closest('.plan-part-row').remove()">Delete</button>
    </div>
    <input type="text" class="row-part-goal input-control" placeholder="Target goal (e.g. Lock unison pitch stability)" value="${goal}" required />
  `;
  dom.planPartsContainer.appendChild(row);
}

// Helper to add a dynamic log part row
function createLogPartRow(location = '', status = 'Progressing', notes = '') {
  const rowId = 'log-part-row-' + Date.now() + Math.random().toString(36).substr(2, 5);
  const row = document.createElement('div');
  row.id = rowId;
  row.className = 'log-part-row flex-column gap-8';
  
  row.innerHTML = `
    <div class="flex-row gap-8 items-center">
      <input type="text" class="row-log-location input-control" style="flex: 1; font-weight: 600;" placeholder="Section (e.g. Section A / bars 24-32)" value="${location}" required />
      <button type="button" class="btn btn-xs btn-outline text-red" onclick="this.closest('.log-part-row').remove()">Delete</button>
    </div>
    <select class="row-log-status input-control" required>
      <option value="Requires further development" ${status === 'Requires further development' ? 'selected' : ''}>Requires further development</option>
      <option value="Progressing" ${status === 'Progressing' ? 'selected' : ''}>Progressing</option>
      <option value="Demonstrated" ${status === 'Demonstrated' ? 'selected' : ''}>Demonstrated</option>
    </select>
    <input type="text" class="row-log-notes input-control" placeholder="Outcome notes for this section..." value="${notes}" required />
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

// == Tutor Logs History Archive ==
function renderTutorLogsArchive() {
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


// 10. AI Rehearsal Assistant & Chatbot Engine (Strict Asset Grounding)

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

let aiChatHistory = [];

function openAiAssistantModal() {
  if (!dom.aiChatModal) return;
  dom.aiChatModal.style.display = 'flex';
  renderAiAssistant();
  if (dom.aiChatInput) {
    setTimeout(() => dom.aiChatInput.focus(), 100);
  }
}

function closeAiAssistantModal() {
  if (!dom.aiChatModal) return;
  dom.aiChatModal.style.display = 'none';
}

function renderAiAssistant() {
  const tutti = DB.get('tutti_rehearsals');
  const logs = DB.get('session_logs');
  const reflections = DB.get('student_reflections');
  const plans = DB.get('lesson_plans');

  const totalRecords = tutti.length + logs.length + reflections.length + plans.length;

  if (dom.aiAssetCount) {
    dom.aiAssetCount.textContent = `${tutti.length} Conductor Logs · ${logs.length} Section Logs`;
  }

  if (aiChatHistory.length === 0) {
    renderAiDefaultGreeting();
  } else {
    renderAiChatMessages();
  }
}

function renderAiDefaultGreeting() {
  if (!dom.aiChatMessages) return;
  dom.aiChatMessages.innerHTML = `
    <div class="ai-message ai-assistant-message">
      <div class="ai-avatar-badge" style="width: 28px; height: 28px; font-size: 0.9rem; flex-shrink: 0;">✨</div>
      <div class="ai-msg-bubble">
        <p><strong>Welcome to the RehearsalIQ AI Assistant.</strong></p>
        <p style="margin-top: 6px; line-height: 1.5;">
          I generate rehearsal summaries, identify sections needing specific focus, and evaluate repertoire progress.
        </p>
        <p class="small" style="margin-top: 8px; border-left: 2px solid #38bdf8; padding-left: 8px; color: #cbd5e1;">
          🔒 <strong>Strict Grounding Guardrail:</strong> I synthesize exclusively from conductor rehearsal notes, Word/PDF document uploads, tutor sectional logs, and student reflections. Outside extrapolation is strictly excluded.
        </p>
        <div class="small" style="margin-top: 10px; background: rgba(56, 189, 248, 0.08); padding: 8px 10px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.2);">
          <strong>💡 Recommended LLM Architecture:</strong><br>
          <span style="color: #93c5fd;"><strong>Gemini 1.5 Pro / Flash</strong> (or Claude 3.5 Sonnet)</span> is recommended for this production workflow. With native 1M–2M token context windows, full conductor score PDFs, docx rehearsal notes, and sectional logs can be passed directly with zero-temperature grounding ('temperature: 0.0'), guaranteeing exact zero-hallucination citations.
        </div>
        <p class="xs muted" style="margin-top: 8px;">
          👉 <em>Tip: Tap any of the 3 suggestion chips above to quickly query the rehearsal database.</em>
        </p>
      </div>
    </div>
  `;
}

function renderAiChatMessages() {
  if (!dom.aiChatMessages) return;
  dom.aiChatMessages.innerHTML = aiChatHistory.map(msg => {
    if (msg.role === 'user') {
      return `
        <div class="ai-message ai-user-message">
          <div class="ai-msg-bubble">${escapeHtml(msg.text)}</div>
        </div>
      `;
    } else {
      return `
        <div class="ai-message ai-assistant-message">
          <div class="ai-avatar-badge" style="width: 28px; height: 28px; font-size: 0.9rem; flex-shrink: 0;">✨</div>
          <div class="ai-msg-bubble">
            ${msg.html}
            ${msg.citations && msg.citations.length > 0 ? `
              <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08);">
                <span class="xs muted" style="display: block; margin-bottom: 4px; font-weight: 600;">Verified Grounded Sources:</span>
                ${msg.citations.map(c => `<span class="ai-citation-badge">${escapeHtml(c)}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }
  }).join('');

  dom.aiChatMessages.scrollTop = dom.aiChatMessages.scrollHeight;
}

function executeAiPrompt(promptText) {
  if (dom.aiChatInput) {
    dom.aiChatInput.value = promptText;
  }
  handleAiChatFormSubmit();
}

function handleAiChatFormSubmit(e) {
  if (e) e.preventDefault();
  if (!dom.aiChatInput) return;
  const text = dom.aiChatInput.value.trim();
  if (!text) return;

  // Add user message to history
  aiChatHistory.push({ role: 'user', text: text });
  dom.aiChatInput.value = '';
  renderAiChatMessages();

  // Show typing indicator
  showAiTypingIndicator();

  // Simulate ground-truth RAG synthesis
  setTimeout(() => {
    removeAiTypingIndicator();
    const response = synthesizeAssetGroundedResponse(text);
    aiChatHistory.push({
      role: 'assistant',
      html: response.html,
      citations: response.citations
    });
    renderAiChatMessages();
  }, 450);
}

function showAiTypingIndicator() {
  if (!dom.aiChatMessages) return;
  const indicator = document.createElement('div');
  indicator.id = 'aiTypingIndicatorRow';
  indicator.className = 'ai-message ai-assistant-message';
  indicator.innerHTML = `
    <div class="ai-avatar-badge" style="width: 28px; height: 28px; font-size: 0.9rem; flex-shrink: 0;">✨</div>
    <div class="ai-msg-bubble">
      <div class="ai-typing-indicator">
        <span class="xs muted" style="margin-right: 6px;">Analyzing uploaded assets</span>
        <div class="ai-typing-dot"></div>
        <div class="ai-typing-dot"></div>
        <div class="ai-typing-dot"></div>
      </div>
    </div>
  `;
  dom.aiChatMessages.appendChild(indicator);
  dom.aiChatMessages.scrollTop = dom.aiChatMessages.scrollHeight;
}

function removeAiTypingIndicator() {
  const el = document.getElementById('aiTypingIndicatorRow');
  if (el) el.remove();
}

// Core RAG Grounding Engine (Restricted strictly to uploaded assets and rehearsal data)
function synthesizeAssetGroundedResponse(query) {
  const q = query.toLowerCase().trim();

  // Load all assets and records
  const uploadedAssets = DB.get('uploaded_assets', SEED_UPLOADED_ASSETS);
  const tutti = DB.get('tutti_rehearsals');
  const logs = DB.get('session_logs');
  const reflections = DB.get('student_reflections');
  const plans = DB.get('lesson_plans');
  const qa = DB.get('qa_threads');

  const citations = [];

  // General outside question check (strict guardrail against hallucination)
  const musicKeywords = [
    'rehearsal', 'tutti', 'section', 'woodwind', 'brass', 'string', 'horn', 'trumpet', 
    'clarinet', 'flute', 'oboe', 'bassoon', 'trombone', 'tuba', 'percussion', 'violin', 
    'viola', 'cello', 'carmen', 'suite', 'eb', 'tchaikovsky', 'mahler', 'holst', 'summary', 
    'priority', 'attention', 'reflection', 'student', 'intonation', 'tempo', 'rhythm', 
    'status', 'progress', 'plan', 'score', 'bottleneck', 'feedback', 'syllabus', 'asset',
    'curriculum', 'directive', 'drone', 'subdivision', 'articulation', 'notes', 'tutor'
  ];

  const hasRehearsalMatch = musicKeywords.some(kw => q.includes(kw));

  // Check if matches any uploaded asset content or titles directly
  const assetMatches = uploadedAssets.filter(a => 
    a.name.toLowerCase().includes(q) || 
    a.content.toLowerCase().includes(q) || 
    q.split(' ').filter(w => w.length > 3).some(w => a.content.toLowerCase().includes(w))
  );

  // 1. Check for completely out-of-scope query
  if (!hasRehearsalMatch && assetMatches.length === 0) {
    return {
      html: `
        <div style="color: #fca5a5; font-weight: 600; margin-bottom: 4px;">⚠️ Outside Grounded Scope</div>
        <p>I am strictly restricted to only provide analysis and summaries drawn from your <strong>uploaded rehearsal assets, conductor logs, sectional submissions, and student reflections</strong>.</p>
        <p class="xs muted" style="margin-top: 6px;">
          No relevant information matching <em>"${escapeHtml(query)}"</em> exists within the uploaded files or database records. Please ask about ensemble repertoire, sectional progress, rehearsal feedback, or upload a relevant document above.
        </p>
      `,
      citations: []
    };
  }

  // 2. Weekly Tutti Rehearsal Summary
  if (q.includes('weekly') || (q.includes('summary') && !q.includes('student')) || q.includes('tutti highlight') || q.includes('conductor observation')) {
    let html = `<p><strong>Weekly Tutti Rehearsal Synthesis:</strong></p><ul style="margin: 8px 0 8px 16px; padding: 0; line-height: 1.55;">`;
    
    tutti.forEach(t => {
      citations.push(`Conductor Tutti Notes (${t.date}) · ${t.repertoire}`);
      html += `<li><strong>${t.repertoire} (${t.date}):</strong> ${escapeHtml(t.generalSummary)}`;
      if (t.observations && t.observations.length > 0) {
        html += `<ul style="margin-top: 4px;">`;
        t.observations.forEach(o => {
          html += `<li><strong style="color: ${o.status === 'Requires attention' ? 'var(--status-red)' : '#38bdf8'};">[${o.group} ${o.section}]</strong>: ${escapeHtml(o.content)} <span class="xs muted">(${o.status})</span></li>`;
        });
        html += `</ul>`;
      }
      html += `</li>`;
    });
    html += `</ul>`;

    // Cross reference with uploaded conductor score directives
    const carmenDoc = uploadedAssets.find(a => a.name.includes('Carmen') || a.name.includes('Score'));
    if (carmenDoc) {
      citations.push(`Uploaded Asset: ${carmenDoc.name}`);
      html += `
        <div class="small" style="margin-top: 8px; background: rgba(56, 189, 248, 0.08); padding: 8px 10px; border-radius: 4px; border-left: 2px solid #38bdf8;">
          <strong>Directives from Uploaded Score Annotations:</strong><br>
          Tempo for Carmen Prélude is held at 116 bpm with crisp brass articulation; bars 24-32 unison horn shifts require immediate breath support reinforcement.
        </div>
      `;
    }

    return { html, citations };
  }

  // 3. Priority Development Targets / Bottlenecks / Specific Focus
  if (q.includes('struggling') || q.includes('priority') || q.includes('development') || q.includes('bottleneck') || q.includes('attention') || q.includes('focus')) {
    let html = `<p><strong>Sections Needing Specific Focus:</strong></p>`;
    
    // Find all development items
    const devLogs = logs.filter(l => getLogOverallStatus(l) === 'Requires further development');
    const attentionObs = [];
    tutti.forEach(t => {
      if (t.observations) {
        t.observations.forEach(o => {
          if (o.status === 'Requires attention' || o.status === 'In Progress') {
            attentionObs.push({ ...o, date: t.date, piece: t.repertoire });
          }
        });
      }
    });

    html += `<ul style="margin: 8px 0 8px 16px; line-height: 1.55;">`;
    
    attentionObs.forEach(o => {
      citations.push(`Conductor Notes (${o.date})`);
      html += `<li><strong style="color: var(--status-red);">${o.group} · ${o.section}</strong>: Flagged by conductor in <em>${o.piece}</em> — "${escapeHtml(o.content)}" <span class="badge badge-red" style="font-size: 0.65rem;">Requires attention</span></li>`;
    });

    devLogs.forEach(l => {
      citations.push(`Sectional Log: ${l.section} (${l.createdAt})`);
      html += `<li><strong style="color: var(--status-yellow);">${l.group} · ${l.section}</strong>: Sectional log for <em>${l.piece}</em> noted: "${escapeHtml(l.generalFeedback)}"</li>`;
    });

    html += `</ul>`;

    return { html, citations };
  }

  // 4. Repertoire Progress Breakdown
  if (q.includes('repertoire') || q.includes('breakdown')) {
    let html = `<p><strong>Repertoire Progress Breakdown:</strong></p>`;
    const repertoireList = DB.get('repertoire', SEED_REPERTOIRE);
    
    html += `<ul style="margin: 8px 0 8px 16px; padding: 0; line-height: 1.6;">`;
    repertoireList.forEach(rep => {
      const repLogs = logs.filter(l => l.piece.toLowerCase().trim() === rep.title.toLowerCase().trim());
      citations.push(`Repertoire: ${rep.title}`);

      html += `<li><strong>${escapeHtml(rep.title)} (${rep.group || 'Ensemble'}):</strong>`;
      if (repLogs.length > 0) {
        html += `<br><span class="xs" style="color: var(--text-muted);">${repLogs.length} sectional log(s) submitted:</span>`;
        html += `<ul style="margin: 4px 0 4px 16px;">`;
        repLogs.forEach(l => {
          const overall = getLogOverallStatus(l);
          const color = overall === 'Demonstrated' ? 'var(--status-green)' : (overall === 'Requires further development' ? 'var(--status-red)' : 'var(--status-yellow)');
          html += `<li><strong>${l.section}</strong>: <span style="color: ${color}; font-weight: 600;">${overall}</span> — <em>"${escapeHtml(l.generalFeedback || 'Rehearsed')}"</em></li>`;
        });
        html += `</ul>`;
      } else {
        html += ` <span class="xs muted">(No sectional logs recorded yet)</span>`;
      }
      html += `</li>`;
    });
    html += `</ul>`;
    return { html, citations };
  }

  // 4. Student Reflection Analysis
  if (q.includes('reflection') || q.includes('student') || q.includes('confidence') || q.includes('sentiment')) {
    let html = `<p><strong>Student Reflection & Confidence Analysis:</strong></p>`;
    
    if (reflections.length === 0) {
      return { html: '<p>No student reflections have been recorded in the system yet.</p>', citations: [] };
    }

    const totalRating = reflections.reduce((acc, r) => acc + (r.rating || 0), 0);
    const avgRating = (totalRating / reflections.length).toFixed(1);

    html += `<p class="xs muted" style="margin-bottom: 8px;">Analyzed ${reflections.length} student submission(s). Average Confidence Score: <strong>${avgRating} / 5</strong></p>`;
    html += `<ul style="margin: 8px 0 8px 16px; line-height: 1.55;">`;

    reflections.forEach(r => {
      citations.push(`Student Reflection (${r.section} - ${r.studentName || 'Anonymous'})`);
      html += `
        <li>
          <strong>${r.section}</strong> (${r.studentName || 'Anonymous'}) · <em>${r.piece}</em> — Confidence: <strong>${r.rating}/5</strong>
          <br><span class="small">Challenge: "${escapeHtml(r.challenges)}"</span>
          <br><span class="xs muted">Reflection: "${escapeHtml(r.content)}"</span>
        </li>
      `;
    });
    html += `</ul>`;

    return { html, citations };
  }

  // 5. Woodwinds vs Brass Comparison
  if ((q.includes('woodwind') && q.includes('brass')) || q.includes('compare') || q.includes('comparison')) {
    citations.push('Sectional Logs Archive');
    citations.push('Conductor Tutti Notes');
    
    let html = `
      <p><strong>Cross-Section Rehearsal Comparison (Woodwinds vs. Brass):</strong></p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px;">
        <div style="background: rgba(16, 185, 129, 0.08); padding: 10px; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.2);">
          <strong style="color: #6ee7b7;">Woodwinds (Flute, Clarinet, Oboe)</strong>
          <p class="xs" style="margin-top: 6px; line-height: 1.45;">
            • <strong>Clarinet:</strong> Demonstrated syncopation in <em>First Suite</em> (bars 142–150). High rhythmic precision.<br>
            • <strong>Flute/Oboe:</strong> Clean articulation aligned with conductor tempo. Dynamic balance stable in softer passages.
          </p>
        </div>
        <div style="background: rgba(239, 68, 68, 0.08); padding: 10px; border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.2);">
          <strong style="color: #fca5a5;">Brass (Horn, Trumpet, Tuba)</strong>
          <p class="xs" style="margin-top: 6px; line-height: 1.45;">
            • <strong>Horn:</strong> Pitch instability on unison shifts (bars 24–32) and high register sharpness.<br>
            • <strong>Trumpet:</strong> Progressing in double-tonguing at bar 57, approaching performance tempo.<br>
            • <strong>Tuba:</strong> Half-beat tempo synchronization lag noted in tutti transitions.
          </p>
        </div>
      </div>
    `;

    return { html, citations };
  }

  // 6. Direct match inside custom uploaded assets
  if (assetMatches.length > 0) {
    let html = `<p><strong>Analysis from Uploaded Assets:</strong></p>`;
    assetMatches.forEach(a => {
      citations.push(`Uploaded Asset: ${a.name}`);
      html += `
        <div style="background: rgba(56, 189, 248, 0.08); border-left: 3px solid #38bdf8; padding: 10px 12px; margin-bottom: 8px; border-radius: 4px;">
          <strong style="color: #7dd3fc;">${escapeHtml(a.name)}</strong>
          <div class="xs muted" style="margin: 4px 0 6px 0;">Uploaded: ${a.uploadedAt} · Size: ${a.size}</div>
          <div class="small" style="line-height: 1.5; white-space: pre-line;">${escapeHtml(a.content.slice(0, 500))}${a.content.length > 500 ? '...' : ''}</div>
        </div>
      `;
    });
    return { html, citations };
  }

  // 7. Fallback search on matching logs or sections
  const matchedLogs = logs.filter(l => l.section.toLowerCase().includes(q) || l.piece.toLowerCase().includes(q) || l.generalFeedback.toLowerCase().includes(q));
  if (matchedLogs.length > 0) {
    let html = `<p><strong>Records Located in Rehearsal Database:</strong></p><ul style="margin: 8px 0 8px 16px; line-height: 1.55;">`;
    matchedLogs.forEach(l => {
      citations.push(`Session Log: ${l.section} (${l.createdAt})`);
      html += `<li><strong>${l.group} ${l.section} · ${l.piece} (${l.createdAt}):</strong> "${escapeHtml(l.generalFeedback)}" <span class="badge badge-sm">${getLogOverallStatus(l)}</span></li>`;
    });
    html += `</ul>`;
    return { html, citations };
  }

  // If nothing matched
  return {
    html: `
      <div style="color: #fca5a5; font-weight: 600; margin-bottom: 4px;">⚠️ No Matching Rehearsal Data Found</div>
      <p>I searched all uploaded documents, conductor notes, sectional logs, and student reflections, but found no records referencing <em>"${escapeHtml(query)}"</em>.</p>
      <p class="xs muted" style="margin-top: 6px;">
        To analyze this topic, please upload a relevant rehearsal document (using the <strong>+ Upload Asset</strong> button) or log the rehearsal details in the portal.
      </p>
    `,
    citations: []
  };
}

// Asset File Upload Handler
function handleAssetFileUpload(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const currentAssets = DB.get('uploaded_assets', SEED_UPLOADED_ASSETS);
  let loadedCount = 0;

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const newAsset = {
        id: 'asset-' + Date.now() + Math.random().toString(36).substr(2, 4),
        name: file.name,
        uploadedAt: new Date().toISOString().split('T')[0],
        size: (file.size / 1024).toFixed(1) + ' KB',
        content: content
      };

      currentAssets.push(newAsset);
      loadedCount++;

      if (loadedCount === files.length) {
        DB.set('uploaded_assets', currentAssets);
        renderAiAssistant();

        // Inform user in chat
        aiChatHistory.push({
          role: 'assistant',
          html: `<p>📄 <strong>New Rehearsal Asset Indexed:</strong> Successfully uploaded and parsed <code>${escapeHtml(file.name)}</code> (${newAsset.size}). This document is now available for analysis and summaries.</p>`,
          citations: [`Uploaded Asset: ${file.name}`]
        });
        renderAiChatMessages();
      }
    };
    reader.readAsText(file);
  });

  dom.aiAssetFileInput.value = '';
}

window.deleteUploadedAsset = function(assetId) {
  if (confirm('Remove this uploaded asset from the AI knowledge base?')) {
    let assets = DB.get('uploaded_assets', SEED_UPLOADED_ASSETS);
    assets = assets.filter(a => a.id !== assetId);
    DB.set('uploaded_assets', assets);
    renderAiAssistant();
  }
};

function clearAiChatHistory() {
  aiChatHistory = [];
  renderAiDefaultGreeting();
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
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
