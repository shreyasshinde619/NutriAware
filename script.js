/**
 * NutriAware - Smart Nutrition Platform v3.5 (AI 3D & Supabase Cloud Master Edition)
 * Supabase Project URL: https://xhihgjashxqtfdweytsj.supabase.co
 * Three.js 3D DNA Engine, Voice Speech Recognition, WebRTC Live Camera Vision AI, BMR Calculator & Certificate Download
 * Lead Developer: @shreyasshinde619
 */

// SUPABASE CLOUD BACKEND INITIALIZATION
const SUPABASE_URL = 'https://xhihgjashxqtfdweytsj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_aTFHvhLShewz1-PC-MpH5Q_Es5_LAOZ';
let supabaseClient = null;

if (window.supabase && window.supabase.createClient) {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('⚡ Supabase Cloud Backend Connected Successfully!');
  } catch (err) {
    console.warn('Supabase Config Notice:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  init3DBackground();
  initMobileMenu();
  initProgressChart();
  initQuizPortal();
  registerPWA();
  initNotificationSystem();
  initStudentProfile();
  initSpeechRecognition();
  
  // Direct open access - No login portal
  showMainApp();

  // LogicQ-style Onboarding Popover Guide (appears on first visit)
  if (!localStorage.getItem('nutriaware_radial_guide_seen')) {
    setTimeout(() => {
      const popover = document.getElementById('radialGuidePopover');
      if (popover && !isRadialOpen) popover.classList.remove('hidden');
    }, 1500);
  }

  // Pre-load welcome message in Socratic AI Chatbot
  renderWelcomeGreeting();
});

/* Service Worker Registration for PWA */
function registerPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((err) => console.log('SW Registration Failed:', err));
    });
  }
}

/* ==========================================================================
   1. THREE.JS 3D CINEMATIC ECO-NATURE & BIO-HEALTH ENGINE
   ========================================================================== */
let scene3d, camera3d, renderer3d, ecoParticles, natureTorus, bioGroup;

function init3DBackground() {
  const canvas = document.getElementById('bg3dCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  scene3d = new THREE.Scene();
  camera3d = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera3d.position.z = 32;

  renderer3d = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer3d.setSize(window.innerWidth, window.innerHeight);
  renderer3d.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1. Lively Eco-Nature Floating Particle Cloud (Green Spores & Leaves)
  const particleCount = 320;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const emeraldColor = new THREE.Color('#059669');
  const mintColor = new THREE.Color('#34d399');
  const goldColor = new THREE.Color('#fbbf24');

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100;
    positions[i + 1] = (Math.random() - 0.5) * 100;
    positions[i + 2] = (Math.random() - 0.5) * 80;

    const rand = Math.random();
    const c = rand > 0.6 ? mintColor : (rand > 0.2 ? emeraldColor : goldColor);
    colors[i] = c.r;
    colors[i + 1] = c.g;
    colors[i + 2] = c.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  ecoParticles = new THREE.Points(geometry, material);
  scene3d.add(ecoParticles);

  // 2. Rotating 3D Organic Eco-Torus (Sustainable Nutrition Cycle)
  bioGroup = new THREE.Group();
  
  const torusGeo = new THREE.TorusGeometry(9, 0.4, 16, 100);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.35 });
  natureTorus = new THREE.Mesh(torusGeo, torusMat);
  bioGroup.add(natureTorus);

  // Floating Organic Bio-Nodes
  const nodeGeo = new THREE.IcosahedronGeometry(0.7, 1);
  const nodeMat1 = new THREE.MeshBasicMaterial({ color: 0x34d399, wireframe: true });
  const nodeMat2 = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });

  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const mesh = new THREE.Mesh(nodeGeo, i % 2 === 0 ? nodeMat1 : nodeMat2);
    mesh.position.set(Math.cos(angle) * 9, Math.sin(angle) * 9, (Math.random() - 0.5) * 3);
    bioGroup.add(mesh);
  }

  bioGroup.position.set(20, -3, -12);
  bioGroup.rotation.x = Math.PI / 4;
  scene3d.add(bioGroup);

  // Interactive Mouse Parallax
  window.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    const mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;

    if (bioGroup) {
      bioGroup.rotation.y = mouseX * 0.6;
      bioGroup.rotation.x = Math.PI / 4 + mouseY * 0.3;
    }
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    if (ecoParticles) {
      ecoParticles.rotation.y += 0.0008;
      ecoParticles.rotation.x += 0.0004;
    }
    if (bioGroup) {
      bioGroup.rotation.z += 0.005;
    }

    renderer3d.render(scene3d, camera3d);
  }

  animate();

  window.addEventListener('resize', () => {
    camera3d.aspect = window.innerWidth / window.innerHeight;
    camera3d.updateProjectionMatrix();
    renderer3d.setSize(window.innerWidth, window.innerHeight);
  });
}


/* ==========================================================================
   2. AUTHENTICATION, REGISTER & SUPABASE CLOUD BACKEND CONNECTIVITY
   ========================================================================== */
/* Global Registered Users State */
let registeredUsersRegistry = JSON.parse(localStorage.getItem('nutriaware_registered_users') || '[]');

if (registeredUsersRegistry.length === 0) {
  registeredUsersRegistry = [
    { id: 'usr-1', full_name: 'Shreyas Shinde', email: 'shreyasshinde619@gmail.com', provider: 'Google Auth', created_at: new Date().toISOString(), status: 'Active' }
  ];
  localStorage.setItem('nutriaware_registered_users', JSON.stringify(registeredUsersRegistry));
}

function showLoginPortal() {
  // Login portal removed - direct open access
  showMainApp();
}

function showMainApp() {
  const mainApp = document.getElementById('mainApp');
  if (mainApp) mainApp.classList.remove('hidden');
  switchTab('home');
}

function switchTab(tabId) {
  const pages = document.querySelectorAll('.tab-page');
  pages.forEach(p => p.classList.add('hidden'));

  const targetPage = document.getElementById(`view-${tabId}`);
  if (targetPage) {
    targetPage.classList.remove('hidden');
  }

  // Taskbar slots active state management (Sleek High-Tech Taskbar)
  const navBtns = document.querySelectorAll('#appTaskbar button, header nav button');
  navBtns.forEach(btn => {
    btn.classList.remove(
      'text-brand-400', 'text-rose-400', 'font-bold',
      'bg-brand-950/80', 'bg-rose-950/80',
      'border-brand-500/40', 'border-rose-500/40', 'shadow-sm',
      'border-b-2', 'border-brand-400', 'bg-brand-950/60'
    );
    btn.classList.add('text-slate-300', 'border-transparent');
  });

  const activeBtn = document.getElementById(`nav-link-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.remove('text-slate-300', 'border-transparent');
    activeBtn.classList.add('text-brand-400', 'font-bold', 'bg-white/10', 'border-brand-500/40', 'shadow-sm');
  }

  // Mobile dropdown taskbar buttons
  const mobileBtns = document.querySelectorAll('#mobileMenu button');
  mobileBtns.forEach(btn => {
    btn.classList.remove('bg-neutral-800', 'text-brand-400', 'font-bold');
  });
  const activeMobile = document.getElementById(`mobile-link-${tabId}`);
  if (activeMobile) {
    activeMobile.classList.add('bg-neutral-800', 'text-brand-400', 'font-bold');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ==========================================================================
   3. BMR & TDEE HEALTH CALCULATOR ENGINE ("NutriCalc 3D")
   ========================================================================== */
function calculateHealthMetrics(event) {
  if (event) event.preventDefault();

  const age = parseFloat(document.getElementById('calcAge')?.value || 20);
  const gender = document.getElementById('calcGender')?.value || 'male';
  const weight = parseFloat(document.getElementById('calcWeight')?.value || 65);
  const height = parseFloat(document.getElementById('calcHeight')?.value || 170);
  const activity = parseFloat(document.getElementById('calcActivity')?.value || 1.375);

  // Mifflin-St Jeor Formula
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;

  const tdee = Math.round(bmr * activity);
  const proteinTarget = Math.round(weight * 1.5);
  const carbsTarget = Math.round((tdee * 0.5) / 4);
  const fatsTarget = Math.round((tdee * 0.25) / 9);

  const resBox = document.getElementById('calcResultsBox');
  if (resBox) {
    resBox.classList.remove('hidden');
    document.getElementById('calcBmrVal').textContent = `${Math.round(bmr)} kcal`;
    document.getElementById('calcTdeeVal').textContent = `${tdee} kcal`;
    document.getElementById('calcProtTarget').textContent = `${proteinTarget}g`;
    document.getElementById('calcCarbsTarget').textContent = `${carbsTarget}g`;
    document.getElementById('calcFatsTarget').textContent = `${fatsTarget}g`;
  }
}


/* ==========================================================================
   5. VOICE AI SPEECH ASSISTANT (WEB SPEECH API)
   ========================================================================== */
function initSpeechRecognition() {
  const micBtn = document.getElementById('micVoiceBtn');
  if (!micBtn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    micBtn.style.display = 'none';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  micBtn.addEventListener('click', () => {
    micBtn.classList.add('animate-ping', 'text-brand-400');
    showToastNotification('🎙️ Listening...', 'Speak your question out loud!');
    recognition.start();
  });

  recognition.onresult = (event) => {
    micBtn.classList.remove('animate-ping', 'text-brand-400');
    const transcript = event.results[0][0].transcript;
    sendQuickPrompt(transcript);
  };

  recognition.onerror = () => {
    micBtn.classList.remove('animate-ping', 'text-brand-400');
  };
}


/* ==========================================================================
   6. SINGLE STUDENT SESSION (LOGICQ RULE) & HYDRATION & NOTIFICATION SYSTEM
   ========================================================================== */

// LogicQ Single-Student Profile State (Default: Target Persona Aarav Kulkarni)
const DEFAULT_STUDENT_PROFILE = {
  name: "Aarav Kulkarni",
  prn: "24UET101",
  hostel: "Sanjivani Boys Hostel (M.Tech)",
  target: 2500,
  registeredAt: new Date().toISOString()
};

let hydrationSnoozeTimer = null;

function getActiveStudent() {
  try {
    const data = localStorage.getItem('nutriaware_active_student');
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Error reading student profile:', err);
  }
  return DEFAULT_STUDENT_PROFILE;
}

function initStudentProfile() {
  const student = getActiveStudent();
  updateStudentUI(student);
}

function updateStudentUI(student) {
  if (!student) return;
  
  // Header badge
  const headerName = document.getElementById('headerStudentName');
  if (headerName) headerName.textContent = student.name;

  // Hydration card badge
  const badgeEl = document.getElementById('hydrationStudentBadge');
  if (badgeEl) badgeEl.textContent = `Student: ${student.name.split(' ')[0]}`;

  // Modal active student card
  const dispName = document.getElementById('dispStudentName');
  const dispMeta = document.getElementById('dispStudentMeta');
  const dispGoal = document.getElementById('dispStudentGoal');
  if (dispName) dispName.textContent = student.name;
  if (dispMeta) dispMeta.textContent = `PRN: ${student.prn || '24UET101'} • ${student.hostel || 'Hostel Resident'}`;
  if (dispGoal) dispGoal.textContent = `${student.target || 2500} ml / day`;

  // Update target water intake if configured
  if (student.target) {
    window.targetWaterIntake = Number(student.target);
  }
}

function openStudentModal() {
  const modal = document.getElementById('studentSessionModal');
  if (!modal) return;

  const student = getActiveStudent();
  const warning = document.getElementById('studentConflictWarning');
  const activeCard = document.getElementById('activeStudentCard');
  const form = document.getElementById('studentRegistrationForm');

  if (warning) warning.classList.add('hidden');

  // If a student is registered, show active card and hide registration form
  if (student && student.name) {
    if (activeCard) activeCard.classList.remove('hidden');
    if (form) form.classList.add('hidden');
    updateStudentUI(student);
  } else {
    if (activeCard) activeCard.classList.add('hidden');
    if (form) form.classList.remove('hidden');
  }

  modal.classList.remove('hidden');
  playChime('general');
}

function closeStudentModal() {
  const modal = document.getElementById('studentSessionModal');
  if (modal) modal.classList.add('hidden');
}

function showStudentSignupForm(isEdit = false) {
  const student = getActiveStudent();
  const warning = document.getElementById('studentConflictWarning');
  const activeCard = document.getElementById('activeStudentCard');
  const form = document.getElementById('studentRegistrationForm');

  // LogicQ rule: If user tries to create another user without editing/switching
  if (student && student.name && !isEdit) {
    if (warning) {
      warning.classList.remove('hidden');
      warning.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    return;
  }

  if (warning) warning.classList.add('hidden');
  if (activeCard) activeCard.classList.add('hidden');
  if (form) {
    form.classList.remove('hidden');
    if (student) {
      document.getElementById('inputStudentName').value = student.name || '';
      document.getElementById('inputStudentPRN').value = student.prn || '';
      document.getElementById('inputStudentHostel').value = student.hostel || '';
      document.getElementById('inputStudentTarget').value = student.target || 2500;
    }
  }
}

function cancelStudentForm() {
  const student = getActiveStudent();
  const activeCard = document.getElementById('activeStudentCard');
  const form = document.getElementById('studentRegistrationForm');
  const warning = document.getElementById('studentConflictWarning');

  if (warning) warning.classList.add('hidden');

  if (student && student.name) {
    if (activeCard) activeCard.classList.remove('hidden');
    if (form) form.classList.add('hidden');
  } else {
    closeStudentModal();
  }
}

function handleStudentSignup(event) {
  event.preventDefault();

  const name = document.getElementById('inputStudentName')?.value?.trim();
  const prn = document.getElementById('inputStudentPRN')?.value?.trim();
  const hostel = document.getElementById('inputStudentHostel')?.value?.trim() || 'Hostel Resident';
  const target = Number(document.getElementById('inputStudentTarget')?.value) || 2500;

  if (!name || !prn) {
    alert('Please enter your full name and PRN.');
    return;
  }

  const newProfile = {
    name,
    prn,
    hostel,
    target,
    registeredAt: new Date().toISOString()
  };

  localStorage.setItem('nutriaware_active_student', JSON.stringify(newProfile));
  updateStudentUI(newProfile);
  closeStudentModal();

  playChime('success');
  showToastNotification(
    '🎓 Student Profile Active',
    `Session locked for ${name} (${prn}). LogicQ single-student integrity active!`,
    'general'
  );
}

function confirmSwitchStudent() {
  const current = getActiveStudent();
  const confirmed = confirm(
    `LogicQ Single-Student Rule:\nOnly 1 student can be active on this device at a time.\n\nDo you want to end the active session for "${current.name}" and register a new student?`
  );

  if (confirmed) {
    localStorage.removeItem('nutriaware_active_student');
    const warning = document.getElementById('studentConflictWarning');
    const activeCard = document.getElementById('activeStudentCard');
    const form = document.getElementById('studentRegistrationForm');

    if (warning) warning.classList.add('hidden');
    if (activeCard) activeCard.classList.add('hidden');
    if (form) {
      form.reset();
      form.classList.remove('hidden');
    }

    // Default fields to empty
    document.getElementById('inputStudentName').value = '';
    document.getElementById('inputStudentPRN').value = '';
    document.getElementById('inputStudentHostel').value = '';

    playChime('general');
    showToastNotification(
      '🔄 Session Reset',
      'Previous student session ended. Enter details for the new student.',
      'general'
    );
  }
}

// --------------------------------------------------------------------------
// INTERACTIVE HYDRATION SYSTEM WITH 3 USER CHOICES (YES / SNOOZE / NO)
// --------------------------------------------------------------------------
function initNotificationSystem() {
  if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    setTimeout(() => { Notification.requestPermission(); }, 4000);
  }

  // Periodic reminder interval: triggers hydration or protein check
  setInterval(() => {
    Math.random() > 0.4 ? triggerWaterReminder() : triggerProteinReminder();
  }, 240000);

  // Check for 5:00 PM evening snack nudge
  check5PMSnackSchedule();
}

function triggerWaterReminder() {
  const student = getActiveStudent();
  const studentFirst = student ? student.name.split(' ')[0] : 'Student';
  const target = student ? student.target : 2500;
  const currentWater = (typeof waterConsumed !== 'undefined') ? waterConsumed : 1250;
  const percent = Math.min(100, Math.round((currentWater / target) * 100));

  // 1. Activate Full-Screen Strict Hydration Lock (Cannot exit until water is logged)
  const lockScreen = document.getElementById('fullScreenHydrationLock');
  const lockText = document.getElementById('lockWaterText');
  const lockBar = document.getElementById('lockWaterBar');
  const lockMsg = document.getElementById('lockStudentMsg');

  if (lockText) lockText.textContent = `${currentWater} ml / ${target} ml (${percent}%)`;
  if (lockBar) lockBar.style.width = `${percent}%`;
  if (lockMsg) lockMsg.textContent = `${student ? student.name : 'Active Student'} (Target: ${Math.round(target / 250)} glasses)`;

  if (lockScreen) {
    lockScreen.classList.remove('hidden');
    lockScreen.classList.add('flex');
    document.body.style.overflow = 'hidden'; // STRICT AUTO-LOCK: Lock background scrolling
  }

  // 2. Also populate top notification card
  const card = document.getElementById('hydrationPromptCard');
  const badgeEl = document.getElementById('hydrationStudentBadge');
  if (badgeEl && student) {
    badgeEl.textContent = `Student: ${studentFirst}`;
  }
  if (card) {
    card.classList.remove('hidden');
    card.classList.add('animate-toast');
  }

  playChime('general');

  // 3. Voice Out Loud Notification
  if (typeof isSpeechEnabled !== 'undefined' && isSpeechEnabled && typeof speakText === 'function') {
    speakText(`Hydration Alert! Screen locked for ${studentFirst}. Please drink a glass of water to unlock your screen and stay energized.`);
  }

  // 4. Browser System Notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('💧 Hydration Screen Lock Active', {
      body: `Did you drink a glass of water, ${studentFirst}? Screen is locked until you drink a glass!`,
      icon: 'app-icon.svg'
    });
  }
}

function unlockHydrationLockWithWater() {
  const student = getActiveStudent();
  const studentFirst = student ? student.name.split(' ')[0] : 'Student';

  // Log 250ml water to student tracker
  if (typeof addWater === 'function') {
    addWater(250);
  }

  // Release Full-Screen Lock Overlay
  const lockScreen = document.getElementById('fullScreenHydrationLock');
  if (lockScreen) {
    lockScreen.classList.add('hidden');
    lockScreen.classList.remove('flex');
  }
  document.body.style.overflow = ''; // Restore normal scrolling

  dismissHydrationPrompt();

  playChime('success');
  showToastNotification(
    '💧 Hydration Logged • Screen Unlocked!',
    `Awesome, ${studentFirst}! +250 ml recorded. Your screen has been unlocked. Keep up the great focus!`,
    'water'
  );

  if (typeof isSpeechEnabled !== 'undefined' && isSpeechEnabled && typeof speakText === 'function') {
    speakText(`Screen unlocked! Great job drinking water, ${studentFirst}. Two hundred fifty milliliters added to your tracker.`);
  }
}

function snoozeHydrationLock(minutes = 5) {
  const student = getActiveStudent();
  const studentFirst = student ? student.name.split(' ')[0] : 'Student';

  // Temporarily release full-screen lock for the snooze window
  const lockScreen = document.getElementById('fullScreenHydrationLock');
  if (lockScreen) {
    lockScreen.classList.add('hidden');
    lockScreen.classList.remove('flex');
  }
  document.body.style.overflow = '';

  dismissHydrationPrompt();

  if (hydrationSnoozeTimer) clearTimeout(hydrationSnoozeTimer);
  hydrationSnoozeTimer = setTimeout(() => {
    triggerWaterReminder();
  }, minutes * 60 * 1000);

  playChime('general');
  showToastNotification(
    '⏰ Hydration Lock Snoozed',
    `Lock suspended for ${minutes} minutes. We will lock your screen again at the end of the break to ensure you hydrate!`,
    'water'
  );

  if (typeof isSpeechEnabled !== 'undefined' && isSpeechEnabled && typeof speakText === 'function') {
    speakText(`Hydration lock snoozed for ${minutes} minutes. Please drink a glass of water soon.`);
  }
}

function dismissHydrationPrompt() {
  const card = document.getElementById('hydrationPromptCard');
  if (card) card.classList.add('hidden');
}

function respondHydration(choice) {
  if (choice === 'yes') {
    unlockHydrationLockWithWater();
  } else if (choice === 'snooze') {
    snoozeHydrationLock(5);
  } else if (choice === 'no') {
    dismissHydrationPrompt();
    const student = getActiveStudent();
    const studentFirst = student ? student.name.split(' ')[0] : 'Student';
    playChime('general');
    showToastNotification(
      '💡 Study Hydration Tip',
      `No worries, ${studentFirst}! Keep a water bottle on your study desk. Drink whenever you take your next short break.`,
      'general'
    );
  }
}

function triggerProteinReminder() {
  const title = '💪 Protein Intake Check';
  const msg = `Don't forget your muscle recovery target! Have a High-Protein Banana Shake or Paneer Skewers.`;
  showToastNotification(title, msg, 'protein');
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body: msg, icon: 'app-icon.svg' });
  }
}

// --------------------------------------------------------------------------
// 5:00 PM EVENING SNACK NUDGE (EXPERIMENT 8 PPT SLIDE 3 SCREEN 6)
// --------------------------------------------------------------------------
function trigger5PMSnackNudge() {
  const modal = document.getElementById('snackNudgeModal');
  if (modal) {
    modal.classList.remove('hidden');
    playChime('general');
  }

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('🕒 5:00 PM Healthy Snack Nudge', {
      body: 'Hostel evening hunger striking? Swap oily samosas for sprouted moong chaat or roasted chana!',
      icon: 'app-icon.svg'
    });
  }
}

function closeSnackNudge() {
  const modal = document.getElementById('snackNudgeModal');
  if (modal) modal.classList.add('hidden');
}

function check5PMSnackSchedule() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // If between 4:50 PM and 5:15 PM, and not nudged yet today
  const todayKey = `nutriaware_snack_nudge_${now.toDateString()}`;
  if (hours === 17 && !localStorage.getItem(todayKey)) {
    localStorage.setItem(todayKey, 'true');
    setTimeout(() => {
      trigger5PMSnackNudge();
    }, 1500);
  }
}

function showToastNotification(title, message, type = 'general') {
  const toast = document.getElementById('notificationToast');
  const titleEl = document.getElementById('toastTitle');
  const msgEl = document.getElementById('toastMsg');
  const iconEl = document.getElementById('toastIcon');

  if (!toast || !titleEl || !msgEl || !iconEl) return;

  titleEl.textContent = title;
  msgEl.textContent = message;

  if (type === 'water') {
    iconEl.className = 'w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-xl shrink-0';
    iconEl.innerHTML = '<i class="fa-solid fa-droplet"></i>';
  } else if (type === 'protein') {
    iconEl.className = 'w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-xl shrink-0';
    iconEl.innerHTML = '<i class="fa-solid fa-drumstick-bite"></i>';
  } else {
    iconEl.className = 'w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl shrink-0';
    iconEl.innerHTML = '<i class="fa-solid fa-bell"></i>';
  }

  toast.classList.remove('hidden');
  toast.classList.add('animate-toast');

  setTimeout(() => { toast.classList.add('hidden'); }, 6000);
}

function closeToast() {
  document.getElementById('notificationToast')?.classList.add('hidden');
}

/* ==========================================================================
   7. MOBILE NAVIGATION CONTROLS
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => { mobileMenu.classList.toggle('hidden'); });
  }
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu')?.classList.add('hidden');
}


/* ==========================================================================
   8. LOGICQ-INSPIRED SOCRATIC AI CHATBOT & RADIAL SPEED-DIAL QUICK HUB
   ========================================================================== */

// 1. Web Audio API Sound Synthesizer (Exact LogicQ Zero-Asset Chimes)
function playSoundChime(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    if (type === 'open') {
      // Ascending tech chime (320 Hz -> 640 Hz in 80ms)
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else {
      // Descending dismiss chime (540 Hz -> 260 Hz in 80ms)
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.08);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    }
  } catch (e) {
    // Audio context silently ignored if user hasn't interacted with page yet
  }
}

// 2. Radial Speed-Dial Expansion Menu (Exact LogicQ Trigonometry Arc)
let isRadialOpen = false;

function toggleRadialMenu() {
  isRadialOpen = !isRadialOpen;
  const fabIcon = document.getElementById('fabIcon');
  const pingRing = document.getElementById('fabPingRing');
  const newBadge = document.getElementById('fabNewBadge');
  const guidePopover = document.getElementById('radialGuidePopover');
  if (guidePopover) guidePopover.classList.add('hidden');

  const items = [
    document.getElementById('radialBtnChat'),
    document.getElementById('radialBtnCanteen'),
    document.getElementById('radialBtnCompare'),
    document.getElementById('radialBtnSurvey'),
    document.getElementById('radialBtnQuiz'),
    document.getElementById('radialBtnTracker')
  ].filter(Boolean);

  if (isRadialOpen) {
    playSoundChime('open');
    if (fabIcon) fabIcon.style.transform = 'rotate(135deg)';
    if (pingRing) pingRing.style.display = 'none';
    if (newBadge) newBadge.style.display = 'none';

    // Deploy items along arc (-90° to -180°) with radius 114px
    const radius = 114;
    const count = items.length;
    items.forEach((btn, index) => {
      const angleDeg = -90 - index * (90 / (count - 1));
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = Math.round(radius * Math.cos(angleRad));
      const y = Math.round(radius * Math.sin(angleRad));

      btn.style.pointerEvents = 'auto';
      btn.style.opacity = '1';
      btn.style.transform = `translate(${x}px, ${y}px) scale(1)`;
      btn.style.transitionDelay = `${index * 40}ms`;
    });
  } else {
    playSoundChime('close');
    if (fabIcon) fabIcon.style.transform = 'rotate(0deg)';
    const count = items.length;
    items.forEach((btn, index) => {
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0';
      btn.style.transform = `translate(0px, 0px) scale(0.5)`;
      btn.style.transitionDelay = `${(count - 1 - index) * 25}ms`;
    });
  }
}

function dismissRadialGuide() {
  const guide = document.getElementById('radialGuidePopover');
  if (guide) guide.classList.add('hidden');
  localStorage.setItem('nutriaware_radial_guide_seen', 'true');
}

function selectRadialTab(tabId) {
  if (isRadialOpen) toggleRadialMenu();
  switchTab(tabId);
}

function openChatModalFromRadial() {
  if (isRadialOpen) toggleRadialMenu();
  openChatModal();
}

// 3. Socratic AI Chatbot Modal Controller
function openChatModal() {
  const modal = document.getElementById('chatModalBackdrop');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  playSoundChime('open');

  const messagesContainer = document.getElementById('chatMessages');
  if (messagesContainer && messagesContainer.children.length === 0) {
    renderWelcomeGreeting();
  }

  setTimeout(() => {
    document.getElementById('chatInput')?.focus();
  }, 150);
}

function closeChatModal() {
  const modal = document.getElementById('chatModalBackdrop');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  playSoundChime('close');
}

function toggleChatWidget() {
  const modal = document.getElementById('chatModalBackdrop');
  if (modal && !modal.classList.contains('hidden')) {
    closeChatModal();
  } else {
    openChatModal();
  }
}

// 4. Conversation Rendering & State Management
function renderWelcomeGreeting() {
  const messagesContainer = document.getElementById('chatMessages');
  if (!messagesContainer) return;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  messagesContainer.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 text-white shadow-sm mt-0.5 border border-emerald-400/30">
        <i class="fa-solid fa-brain text-xs"></i>
      </div>
      <div class="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3.5 bg-slate-800/90 border border-slate-700/60 text-slate-200 text-sm leading-relaxed shadow-sm space-y-2">
        <p class="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
          <i class="fa-solid fa-sparkles"></i> NutriAware Socratic AI Mentor
        </p>
        <p class="text-slate-200">
          Hello! 👋 I am your <strong>NutriAware Socratic AI Mentor</strong> (Team 18 / G18 — UN SDG 3).
        </p>
        <p class="text-slate-300 text-xs leading-relaxed">
          I won't just dump generic calorie numbers. Instead, I help you understand <em>why</em> foods make you tired, guide you with <strong>smart canteen swaps</strong>, decode confusing package labels, and teach you how to balance your daily mess plate!
        </p>
        <p class="text-slate-300 text-xs">
          Click any suggestion prompt above or ask a question below. How can I help with your food choices today?
        </p>
        <span class="block text-[9px] text-slate-400 text-right pt-1">${timeStr}</span>
      </div>
    </div>
  `;
}

function resetChatConversation() {
  playSoundChime('open');
  renderWelcomeGreeting();
  showToastNotification('🔄 Chat Cleared', 'Conversation history has been reset.');
}

function sendQuickPrompt(promptText) {
  openChatModal();
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.value = promptText;
    document.getElementById('chatForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  }
}

function handleChatSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('chatInput');
  const messagesContainer = document.getElementById('chatMessages');
  if (!input || !messagesContainer) return;

  const userQuery = input.value.trim();
  if (!userQuery) return;

  appendChatMessage('user', userQuery);
  input.value = '';

  const typingId = appendTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator(typingId);
    const aiResponse = generateNutriAIResponse(userQuery);
    appendChatMessage('ai', aiResponse);
  }, 600);
}

// ==========================================================================
// WEB SPEECH SYNTHESIS ENGINE (VOICE SPEAKING FOR NUTRI-AI CHATBOT)
// ==========================================================================
let isSpeechEnabled = true;
let currentSpeechUtterance = null;
let isSpeakingNow = false;

function stripHtmlToPlainText(html) {
  if (!html) return '';
  const temp = document.createElement('div');
  temp.innerHTML = html;
  // Remove interactive buttons, icons, and hidden badges
  temp.querySelectorAll('button, i, svg, .radial-tooltip, script, style').forEach(el => el.remove());
  return (temp.textContent || temp.innerText || '').replace(/\s+/g, ' ').trim();
}

function updateSpeechIndicator(isSpeaking) {
  isSpeakingNow = isSpeaking;
  const indicator = document.getElementById('aiSpeakingIndicator');
  const stopBtn = document.getElementById('stopVoiceBtn');
  if (indicator) {
    if (isSpeaking) {
      indicator.classList.remove('hidden');
    } else {
      indicator.classList.add('hidden');
    }
  }
  if (stopBtn) {
    if (isSpeaking) {
      stopBtn.classList.remove('hidden');
    } else {
      stopBtn.classList.add('hidden');
    }
  }
}

function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  updateSpeechIndicator(false);
}

function toggleSpeechOutput() {
  isSpeechEnabled = !isSpeechEnabled;
  const toggleBtn = document.getElementById('toggleVoiceBtn');
  if (toggleBtn) {
    if (isSpeechEnabled) {
      toggleBtn.className = 'p-2 sm:px-3 sm:py-2 rounded-xl text-emerald-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5';
      toggleBtn.innerHTML = '<i class="fa-solid fa-volume-high text-sm"></i><span class="text-[10px] font-bold hidden sm:inline">Voice ON</span>';
      toggleBtn.title = 'Voice Speech Output is ON (Click to Mute)';
      showToastNotification('🔊 Voice Output Enabled', 'NutriAI will speak out answers aloud.');
      speakText('Voice output enabled. I will read your answers aloud!');
    } else {
      stopSpeaking();
      toggleBtn.className = 'p-2 sm:px-3 sm:py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5';
      toggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark text-sm"></i><span class="text-[10px] font-bold hidden sm:inline">Voice OFF</span>';
      toggleBtn.title = 'Voice Speech Output is MUTED (Click to Enable)';
      showToastNotification('🔇 Voice Output Muted', 'NutriAI will not speak automatically.');
    }
  }
}

function speakText(rawText) {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    return;
  }
  const plainText = stripHtmlToPlainText(rawText).trim();
  if (!plainText) return;

  // Cancel any previous speech
  window.speechSynthesis.cancel();

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(plainText);
  currentSpeechUtterance = utterance;
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.lang = 'en-US';

  // Select suitable voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    const englishVoice = voices.find(v => (v.lang.startsWith('en') || v.lang.includes('US') || v.lang.includes('GB')) && !v.name.includes('Google UK English Male')) || voices[0];
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
  }

  utterance.onstart = () => {
    updateSpeechIndicator(true);
  };
  utterance.onend = () => {
    updateSpeechIndicator(false);
  };
  utterance.onerror = (e) => {
    console.warn('Speech synthesis utterance error:', e);
    updateSpeechIndicator(false);
  };

  window.speechSynthesis.speak(utterance);
}

function speakMessageContent(buttonEl) {
  const messageCard = buttonEl.closest('.rounded-2xl');
  if (messageCard) {
    const contentEl = messageCard.querySelector('.bot-response-content');
    if (contentEl) {
      speakText(contentEl.innerHTML);
    }
  }
}

function appendChatMessage(sender, text) {
  const messagesContainer = document.getElementById('chatMessages');
  if (!messagesContainer) return;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const messageWrapper = document.createElement('div');
  messageWrapper.className = `flex items-start gap-3 max-w-[88%] ${sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`;

  if (sender === 'user') {
    messageWrapper.innerHTML = `
      <div class="w-8 h-8 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center text-xs shrink-0 mt-0.5 border border-slate-700">
        <i class="fa-solid fa-user"></i>
      </div>
      <div class="rounded-2xl rounded-tr-sm px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm leading-relaxed shadow-md shadow-emerald-600/15 space-y-1">
        <p>${escapeHTML(text)}</p>
        <span class="block text-[9px] text-emerald-200 text-right">${timeStr}</span>
      </div>
    `;
    messagesContainer.appendChild(messageWrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  } else {
    messageWrapper.innerHTML = `
      <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 text-white shadow-sm mt-0.5 border border-emerald-400/30">
        <i class="fa-solid fa-brain text-xs"></i>
      </div>
      <div class="rounded-2xl rounded-tl-sm px-4 py-3.5 bg-slate-800/90 border border-slate-700/60 text-slate-200 text-sm leading-relaxed shadow-sm space-y-2 flex-1">
        <div class="flex items-center justify-between">
          <p class="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
            <i class="fa-solid fa-sparkles"></i> NutriAware Socratic AI Mentor
          </p>
          <span class="text-[9px] text-slate-400">${timeStr}</span>
        </div>
        <div class="bot-response-content space-y-2">${text}</div>
        <div class="pt-2 border-t border-slate-700/40 flex items-center justify-between">
          <button onclick="speakMessageContent(this)" class="px-2.5 py-1 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 hover:text-white text-[10px] font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm">
            <i class="fa-solid fa-volume-high text-[10px]"></i> Listen Out Loud
          </button>
          <button onclick="stopSpeaking()" class="text-slate-400 hover:text-white text-[10px] px-2 py-1 rounded-lg hover:bg-slate-700/50 transition">
            <i class="fa-solid fa-stop text-[9px]"></i> Stop
          </button>
        </div>
      </div>
    `;
    messagesContainer.appendChild(messageWrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Speak answer automatically if speech is enabled
    if (isSpeechEnabled) {
      speakText(text);
    }
  }
}

function appendTypingIndicator() {
  const messagesContainer = document.getElementById('chatMessages');
  if (!messagesContainer) return null;
  const typingId = 'typing_' + Date.now();

  const typingWrapper = document.createElement('div');
  typingWrapper.id = typingId;
  typingWrapper.className = 'flex items-start gap-3 max-w-[85%]';
  typingWrapper.innerHTML = `
    <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 text-white shadow-sm mt-0.5 border border-emerald-400/30">
      <i class="fa-solid fa-brain text-xs"></i>
    </div>
    <div class="rounded-2xl rounded-tl-sm px-4 py-3 bg-slate-800/90 border border-slate-700/60 shadow-sm flex items-center gap-1.5">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style="animation-delay: 0ms"></span>
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style="animation-delay: 150ms"></span>
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style="animation-delay: 300ms"></span>
    </div>
  `;

  messagesContainer.appendChild(typingWrapper);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return typingId;
}

function removeTypingIndicator(id) {
  if (id) document.getElementById(id)?.remove();
}

function startVoiceChatInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  showToastNotification('🎙️ Listening...', 'Speak your question out loud!');
  recognition.start();
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    sendQuickPrompt(transcript);
  };
}

function generateNutriAIResponse(query) {
  const q = query.toLowerCase().trim();

  // 1. Greetings & Friendly Small Talk
  if (q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hi ') || q.startsWith('hello ') || q.startsWith('hey ') || q.includes('good morning') || q.includes('good evening') || q.includes('good afternoon') || q === 'yo' || q === 'sup') {
    return `
      <p>Hello! 👋 I am your <strong>NutriAware Socratic AI Voice Assistant</strong> (Team 18 / G18 • SDG 3)!</p>
      <p class="mt-1">I can answer <strong>ANYTHING</strong> from our website and speak it out loud! Ask me about:</p>
      <ul class="list-disc pl-4 space-y-0.5 text-[11px] text-slate-300">
        <li><strong>Any food calories &amp; macros</strong> (Samosa, Poha, Vada Pav, Moong Salad, Maggi, Chaas...)</li>
        <li><strong>Sugar Spoons Rule &amp; WHO Guidelines</strong> (25g sugar / 2000mg sodium)</li>
        <li><strong>50/25/25 Healthy Plate Model</strong> &amp; Socratic Diet Debugger</li>
        <li><strong>Daily Hydration Tracker</strong> &amp; Strict Full-Screen Auto-Lock</li>
        <li><strong>30-Question Nutrition Quiz &amp; Student Survey</strong></li>
        <li><strong>Team 18 (G18) &amp; UN SDG 3 Mission</strong> at Sanjivani University</li>
      </ul>
      <div class="pt-2 flex flex-wrap gap-1.5">
        <button onclick="sendQuickPrompt('How many calories in samosa?')" class="bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-700/50 px-2.5 py-1 rounded-xl text-[10px]">🥟 Samosa Calories</button>
        <button onclick="sendQuickPrompt('Explain sugar spoons rule')" class="bg-amber-950/80 text-amber-300 hover:bg-amber-900 border border-amber-700/50 px-2.5 py-1 rounded-xl text-[10px]">🥄 Sugar Spoons Rule</button>
        <button onclick="sendQuickPrompt('Tell me about hydration auto-lock')" class="bg-sky-950/80 text-sky-300 hover:bg-sky-900 border border-sky-700/50 px-2.5 py-1 rounded-xl text-[10px]">💧 Hydration Auto-Lock</button>
        <button onclick="sendQuickPrompt('Tell me about Team 18 and SDG 3')" class="bg-purple-950/80 text-purple-300 hover:bg-purple-900 border border-purple-700/50 px-2.5 py-1 rounded-xl text-[10px]">👥 Team 18 & SDG 3</button>
      </div>
    `;
  }

  // 1b. No Login or Registration Required Notice & Single-Student Session Lock
  if (q.includes('register') || q.includes('registration') || q.includes('sign in') || q.includes('log in') || q.includes('login') || q.includes('create account') || q.includes('google account') || q.includes('portal') || q.includes('password') || q.includes('single student') || q.includes('one student') || q.includes('lock user')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-unlock-keyhole text-emerald-400"></i> Open Access Platform & Single-Student Session Lock
        </h5>
        <p class="text-slate-300">
          The login barrier has been <strong>completely removed</strong>! NutriAware is 100% open-access with no passwords.
        </p>
        <div class="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-300 space-y-1">
          <p class="font-bold">🔒 LogicQ Single-Student Rule:</p>
          <p class="text-[11px] text-slate-300">
            Exactly <strong>1 student profile</strong> can be active on this device at a time. This keeps daily hydration goals and quiz certificates strictly tied to one active learner. To switch students, use the <em>Switch Student</em> button in Profile.
          </p>
        </div>
      </div>
    `;
  }

  // 1c. Admin Panel Notice
  if (q.includes('admin') || q.includes('admin panel') || q.includes('admin login')) {
    return `
      <div class="space-y-1.5 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5">
          <i class="fa-solid fa-shield-halved text-emerald-400"></i> Admin Panel Notice
        </h5>
        <p class="text-slate-300">The Admin Panel has been completely removed to make NutriAware 100% open and student-first. All features are directly accessible.</p>
      </div>
    `;
  }

  // 2. Team 18 / G18 & SDG 3 & Sanjivani University
  if (q.includes('team 18') || q.includes('g18') || q.includes('sdg 3') || q.includes('sustainable development') || q.includes('sanjivani') || q.includes('who developed') || q.includes('who created') || q.includes('who made') || q.includes('team') || q.includes('developer') || q.includes('members') || q.includes('shreyas') || q.includes('sarthak') || q.includes('kunal') || q.includes('gayatri') || q.includes('ayush') || q.includes('vaishnavi')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-users text-emerald-400"></i> Team 18 (G18) • Project Overview
        </h5>
        <div class="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
          🏆 Team No.: 18 | Team Name: G18 | UN SDG Alignment: SDG 3 (Good Health and Well-Being)
        </div>
        <p class="text-slate-300 font-semibold">Integrated MTech AIML Project Team:</p>
        <ul class="list-disc pl-4 space-y-1 text-slate-300">
          <li><strong class="text-emerald-400">Sarthak Pawar:</strong> Team Leader</li>
          <li><strong class="text-emerald-400">Kunal Jejurkar:</strong> Designer</li>
          <li><strong class="text-emerald-400">Shreyas Shinde:</strong> Web Developer (@shreyasshinde619)</li>
          <li><strong>Ayush Bhosale:</strong> Team Member</li>
          <li><strong>Vaishnavi Bongane:</strong> Team Member</li>
          <li><strong>Gayatri Bhuse:</strong> Team Member</li>
        </ul>
        <p class="text-[11px] text-slate-400">Institution: Sanjivani University, Department of Integrated MTech AI &amp; ML.</p>
      </div>
    `;
  }

  // 3. Problem Statement & Brainstorming Pain Points
  if (q.includes('problem') || q.includes('pain point') || q.includes('selected problem') || q.includes('brainstorm')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-triangle-exclamation text-amber-400"></i> Problem Statement (PDF Page 1)
        </h5>
        <p class="text-slate-300 leading-relaxed">
          Students often choose food based on <strong>taste, convenience, and cost</strong> rather than nutritional value. Many are unaware of daily nutrient requirements, struggle to understand food labels, and lack guidance on making balanced choices in canteens and messes.
        </p>
        <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <p class="font-bold text-emerald-400">6 Brainstorming Pain Points:</p>
          <ul class="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
            <li>1. Junk food reliance due to convenience &amp; tight schedules.</li>
            <li>2. Lack of understanding about balanced diets.</li>
            <li>3. Difficulty reading and interpreting packaged food nutrition labels.</li>
            <li>4. Limited healthy choices in college canteens and messes.</li>
            <li>5. Skipping meals &amp; irregular eating routines.</li>
            <li>6. Low awareness of long-term impact on academics and energy.</li>
          </ul>
        </div>
        <div class="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-200">
          <strong>Selected Core Problem:</strong> College students face difficulties in making healthy food choices due to lack of awareness, confusing nutrition labels, and limited guidance on balanced meals in daily life.
        </div>
      </div>
    `;
  }

  // 4. WHO - WHAT - WHY Diagnostic Framework
  if ((q.includes('who') && (q.includes('what') || q.includes('why'))) || q.includes('diagnostic') || q.includes('framework')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-sitemap text-teal-400"></i> WHO • WHAT • WHY Framework (Page 1)
        </h5>
        <div class="space-y-1.5 text-slate-300">
          <div class="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span class="text-emerald-400 font-bold uppercase text-[10px]">WHO (Stakeholders):</span>
            <p class="text-[11px]">College &amp; university students, young adults living in hostels/PGs, canteen operators, mess managers, and youth in transition to independent living.</p>
          </div>
          <div class="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span class="text-amber-400 font-bold uppercase text-[10px]">WHAT (The Challenge):</span>
            <p class="text-[11px]">Lack of practical nutrition awareness, confusion decoding packaged labels, default reliance on high-sugar &amp; fried foods, and no simple mechanism to balance canteen meals.</p>
          </div>
          <div class="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span class="text-sky-400 font-bold uppercase text-[10px]">WHY (The Root Cause):</span>
            <p class="text-[11px]">Academic pressure, tight student budgets, aggressive marketing of ultra-processed snacks, and absence of an accessible digital guide tailored to college dining environments.</p>
          </div>
        </div>
      </div>
    `;
  }

  // 5. Mission Statement & Value Proposition
  if (q.includes('mission') || q.includes('value proposition') || q.includes('gain') || q.includes('pain') || q.includes('solution')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-bullseye text-rose-400"></i> Mission Statement &amp; Value Proposition
        </h5>
        <p class="text-slate-300 leading-relaxed">
          <strong class="text-emerald-400">Mission:</strong> To empower students with practical nutritional knowledge, simple food label guidance, and smart canteen meal alternatives to make healthier everyday choices.
        </p>
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 rounded-xl bg-rose-950/40 border border-rose-800/60">
            <span class="font-bold text-rose-400 block mb-0.5">Student Pains:</span>
            Confusing labels, afternoon energy crashes, limited healthy canteen options, budget constraints.
          </div>
          <div class="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
            <span class="font-bold text-emerald-400 block mb-0.5">Student Gains:</span>
            Sustained academic energy, quick healthy swaps, simple label decoder, better physical well-being.
          </div>
        </div>
      </div>
    `;
  }

  // 6. 10 Core Features (PDF Page 1 & 2)
  if (q.includes('10 feature') || q.includes('ten feature') || q.includes('core feature') || (q.includes('feature') && !q.includes('login'))) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-list-check text-brand-400"></i> 10 Core System Features (PDF Specifications)
        </h5>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-300">
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><strong>1.</strong> Nutrition Info Display</div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><strong>2.</strong> Healthy Food Awareness</div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><strong>3.</strong> Food Label Guidance</div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><strong>4.</strong> Balanced Meal Suggestions</div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><strong>5.</strong> Portion Balance Tips (50/25/25)</div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><strong>6.</strong> Food Comparison Tool</div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><strong>7.</strong> Healthy Alternatives Swaps</div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><strong>8.</strong> Daily Nutrition Tips</div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><strong>9.</strong> Canteen / Mess Awareness</div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><strong>10.</strong> Personalized Recommendations</div>
        </div>
      </div>
    `;
  }

  // 7. How the System Works (5 Steps Pipeline)
  if (q.includes('how system works') || q.includes('5 step') || q.includes('pipeline') || q.includes('steps')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-arrows-spin text-emerald-400"></i> How the System Works (5 Steps)
        </h5>
        <ol class="list-decimal pl-4 space-y-1.5 text-slate-300 text-[11px]">
          <li><strong>Profile &amp; Goals:</strong> Student inputs physical metrics, activity level, and dietary objectives.</li>
          <li><strong>Interests &amp; Preferences:</strong> System records food preferences, budget ranges, and dining habits.</li>
          <li><strong>Nutrient Lookup:</strong> User inspects packaged food labels or scans cafeteria food items.</li>
          <li><strong>Balanced Suggestions:</strong> System calculates macros, flags excesses (sugar/sodium), and provides alternatives.</li>
          <li><strong>Canteen &amp; Mess Application:</strong> Student applies actionable swaps directly in their college dining hall.</li>
        </ol>
      </div>
    `;
  }

  // 8. Hydration Tracker & Strict Full-Screen Auto-Lock
  if (q.includes('hydration') || q.includes('water') || q.includes('auto lock') || q.includes('auto-lock') || q.includes('screen lock') || q.includes('lock screen') || q.includes('drink water')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-droplet text-sky-400"></i> Daily Hydration Tracker &amp; Strict Auto-Lock
        </h5>
        <p class="text-slate-300">
          Adequate water intake is essential for student cognitive function, memory recall, and avoiding afternoon headaches.
        </p>
        <div class="p-2.5 rounded-xl bg-slate-950 border border-sky-500/40 space-y-1.5">
          <div class="flex justify-between items-center text-sky-300 font-bold">
            <span>🎯 Daily Goal: 2,500 ml / day</span>
            <span>🥛 10 Glasses (250ml each)</span>
          </div>
          <p class="text-[11px] text-slate-300">
            <strong>🔒 Strict Full-Screen Auto-Lock Enforcement:</strong> When a hydration reminder triggers, your entire screen locks with a full-viewport blur overlay (z-index 999999). Scrolling is disabled. You must drink 1 glass of water and tap <em>"I Drank 1 Glass of Water"</em> to release the screen!
          </p>
        </div>
        <div class="flex gap-2">
          <button onclick="triggerWaterReminder()" class="flex-1 py-1.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition text-[11px]">
            🔒 Test Full-Screen Lock Now
          </button>
          <button onclick="switchTab('tracker')" class="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition text-[11px]">
            💧 Open Water Tracker
          </button>
        </div>
      </div>
    `;
  }

  // 9. Sugar Spoons Rule & WHO Sugar Guidelines
  if (q.includes('sugar spoon') || q.includes('spoon') || q.includes('who sugar') || (q.includes('sugar') && !q.includes('sleepy'))) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-spoon text-amber-400"></i> The Sugar Spoons Rule &amp; WHO Limits
        </h5>
        <div class="p-2.5 rounded-xl bg-slate-900 border border-amber-500/40 space-y-1 text-slate-300 text-[11px]">
          <p class="font-bold text-amber-400 text-xs">🥄 The Golden Formula: 4 Grams of Sugar = 1 Teaspoon</p>
          <p>Whenever you read a nutrition label, divide the total sugar in grams by <strong>4</strong> to visualize actual teaspoons of sugar:</p>
          <div class="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5 font-mono text-[11px]">
            <p>• Sugary Cola (39g sugar) ➡️ <strong>9.75 spoons (🥄 × 10)</strong> ⚠️ DANGER</p>
            <p>• Energy Drink (27g sugar) ➡️ <strong>6.75 spoons (🥄 × 7)</strong> ⚠️ DANGER</p>
            <p>• Masala Chai with sugar ➡️ <strong>3.0 spoons (🥄 × 3)</strong></p>
            <p>• Spiced Chaas (Buttermilk) ➡️ <strong>0 added spoons (🥄 × 0)</strong> ✅ HEALTHY</p>
          </div>
        </div>
        <div class="p-2 rounded-xl bg-rose-950/40 border border-rose-700/50 text-[11px] text-rose-200">
          <strong>WHO Guideline:</strong> Maximum recommended intake of added sugars for adults is <strong>25 grams per day</strong> (~6 teaspoons). One single 300ml bottle of soft drink exceeds your entire daily allowance!
        </div>
      </div>
    `;
  }

  // 10. Sodium & Salt Guidelines
  if (q.includes('sodium') || q.includes('salt') || q.includes('bp') || q.includes('blood pressure')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-mortar-pestle text-sky-400"></i> WHO Sodium &amp; Salt Guidelines
        </h5>
        <p class="text-slate-300">
          Excess sodium causes water retention, elevated blood pressure, and strains kidney function.
        </p>
        <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-[11px] text-slate-300">
          <p><strong class="text-amber-400">WHO Daily Ceiling:</strong> Maximum <strong>2,000 mg sodium</strong> per day (equivalent to less than 5g of salt, or 1 level teaspoon).</p>
          <p><strong class="text-rose-400">Packaged Snack Warning:</strong> One pack of instant noodles contains ~980 mg sodium (nearly 50% of your entire day's quota in 2 minutes)!</p>
          <p><strong class="text-emerald-400">Rule of Thumb:</strong> Choose snacks with less than 200mg sodium per single serving.</p>
        </div>
      </div>
    `;
  }

  // 11. Healthy Plate Model (50/25/25 Rule)
  if (q.includes('plate') || q.includes('50/25/25') || q.includes('portion') || q.includes('balanced meal')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-circle-notch text-emerald-400"></i> The 50/25/25 Healthy Plate Model
        </h5>
        <div class="space-y-1.5 text-[11px] text-slate-300">
          <div class="p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/40">
            <span class="text-emerald-400 font-bold">🥗 50% Half Plate: Vegetables, Salads &amp; Greens</span>
            <p>Fiber, micronutrients, digestive enzymes. Slows gastric emptying, prevents insulin spikes.</p>
          </div>
          <div class="p-2 rounded-xl bg-sky-950/50 border border-sky-500/40">
            <span class="text-sky-400 font-bold">🍗 25% Quarter Plate: Lean Protein</span>
            <p>Sprouted moong, boiled eggs, paneer, dal, chana, tofu, curd. Muscle recovery &amp; high satiety.</p>
          </div>
          <div class="p-2 rounded-xl bg-amber-950/50 border border-amber-500/40">
            <span class="text-amber-400 font-bold">🍚 25% Quarter Plate: Complex Carbohydrates</span>
            <p>Brown rice, whole wheat roti, oats, millets. Steady cognitive fuel without crashes.</p>
          </div>
        </div>
      </div>
    `;
  }

  // 12. Socratic Diet Debugger (Post-Lunch Sleepiness)
  if (q.includes('sleepy') || q.includes('tired') || q.includes('afternoon') || q.includes('slump') || q.includes('crash') || q.includes('debugger') || q.includes('socratic') || q.includes('fog')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-bolt text-amber-400"></i> Socratic Diet Debugger • The 2:00 PM Energy Crash
        </h5>
        <p class="text-slate-300 leading-relaxed">
          Why do afternoon college lectures feel so draining? Let's analyze the physiological root cause:
        </p>
        <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <p class="font-bold text-rose-400">🔍 Root Cause Hypothesis:</p>
          <p class="text-slate-300 text-[11px]">
            Did your lunch consist mostly of <strong>refined white rice, maida rotis, fried samosas/pakoras, or sugary tea/soda</strong>?
          </p>
        </div>
        <p class="text-slate-300 leading-relaxed text-[11px]">
          High-glycemic simple carbohydrates trigger an acute surge in blood glucose, prompting excessive insulin release. This causes a steep drop in blood glucose (<em>reactive hypoglycemia</em>), depriving your brain of steady energy and triggering brain fog and sleepiness.
        </p>
        <div class="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-200 space-y-1">
          <p class="font-bold text-emerald-400">💡 The Socratic Fix (The 50/25/25 Plate Model):</p>
          <p>Swap half of your simple starch for fiber and protein: enjoy a glass of <strong>Spiced Chaas (Buttermilk)</strong> and a cup of <strong>Sprouted Moong Salad</strong> before having grains. This slows digestion and keeps your mental focus sharp!</p>
        </div>
      </div>
    `;
  }

  // 13. Specific Foods Database (Calories, Macros, Sugar Spoons, Verdict)
  // Samosa
  if (q.includes('samosa')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center justify-between text-sm">
          <span>🥟 Canteen Samosa (1 piece / ~100g)</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-700/50">High Fat</span>
        </h5>
        <div class="grid grid-cols-4 gap-1.5 text-center text-[10px]">
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Calories</span><strong class="text-white">262 kcal</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Protein</span><strong class="text-emerald-400">3.5g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Carbs</span><strong class="text-amber-400">24g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Fat</span><strong class="text-rose-400">17g</strong></div>
        </div>
        <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1 text-slate-300">
          <p>🥄 <strong>Sugar Spoons:</strong> ~0.3 spoons (1.2g sugar).</p>
          <p>⚠️ <strong>Verdict:</strong> Deep-fried in reused refined oil; low protein and fiber; leads to sluggish digestion.</p>
          <p>✅ <strong>Smart Canteen Swap:</strong> Swap for <strong>Sprouted Moong Salad</strong> or <strong>Roasted Chana</strong> to get 12g protein with zero fry guilt!</p>
        </div>
        <button onclick="compareSpecificFoods('samosa', 'sprouts')" class="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition text-[11px]">
          ⚖️ Compare Samosa vs Sprouted Moong
        </button>
      </div>
    `;
  }

  // Poha
  if (q.includes('poha')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center justify-between text-sm">
          <span>🥣 Veggie Poha (1 medium bowl / ~150g)</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">Clean Carb</span>
        </h5>
        <div class="grid grid-cols-4 gap-1.5 text-center text-[10px]">
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Calories</span><strong class="text-white">180 kcal</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Protein</span><strong class="text-emerald-400">4.5g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Carbs</span><strong class="text-amber-400">32g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Fat</span><strong class="text-sky-400">4.0g</strong></div>
        </div>
        <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1 text-slate-300">
          <p>🥄 <strong>Sugar Spoons:</strong> ~0.5 spoons (2.0g natural sugar).</p>
          <p>🌾 <strong>Fiber:</strong> 4.0g dietary fiber with peanuts and peas.</p>
          <p>✅ <strong>Verdict:</strong> Light, iron-rich, easily digestible breakfast. Pair with a boiled egg or a glass of chaas for complete protein balance!</p>
        </div>
      </div>
    `;
  }

  // Vada Pav
  if (q.includes('vada pav') || q.includes('vadapav')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center justify-between text-sm">
          <span>🍔 Canteen Vada Pav (1 piece / ~120g)</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-700/50">Starch Bomb</span>
        </h5>
        <div class="grid grid-cols-4 gap-1.5 text-center text-[10px]">
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Calories</span><strong class="text-white">290 kcal</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Protein</span><strong class="text-emerald-400">4.0g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Carbs</span><strong class="text-amber-400">38g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Fat</span><strong class="text-rose-400">14g</strong></div>
        </div>
        <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1 text-slate-300">
          <p>🥄 <strong>Sugar Spoons:</strong> ~0.75 spoons (3.0g sugar).</p>
          <p>⚠️ <strong>Verdict:</strong> Double carbohydrate hit (maida pav + potato patty deep fried in oil). Causes severe afternoon brain fog.</p>
          <p>✅ <strong>Smart Swap:</strong> Veggie sandwich with brown bread or steamed Idli-Sambar!</p>
        </div>
      </div>
    `;
  }

  // Sprouted Moong Salad
  if (q.includes('sprout') || q.includes('moong')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center justify-between text-sm">
          <span>🥗 Sprouted Moong Salad (1 bowl / ~150g)</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">Superfood ⭐</span>
        </h5>
        <div class="grid grid-cols-4 gap-1.5 text-center text-[10px]">
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Calories</span><strong class="text-white">145 kcal</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Protein</span><strong class="text-emerald-400">12.0g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Carbs</span><strong class="text-amber-400">22g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Fat</span><strong class="text-sky-400">1.2g</strong></div>
        </div>
        <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1 text-slate-300">
          <p>🥄 <strong>Sugar Spoons:</strong> 0 added sugar (🥄 × 0).</p>
          <p>🌿 <strong>Fiber:</strong> 7.0g of rich prebiotic fiber!</p>
          <p>✅ <strong>Verdict:</strong> Highest protein-per-calorie ratio in student dining. Excellent for sustained study focus and muscle health.</p>
        </div>
      </div>
    `;
  }

  // Maggi / Instant Noodles
  if (q.includes('maggi') || q.includes('noodle') || q.includes('instant noodle')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center justify-between text-sm">
          <span>🍜 Instant Noodles / Maggi (1 pack / 70g)</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-700/50">High Sodium</span>
        </h5>
        <div class="grid grid-cols-4 gap-1.5 text-center text-[10px]">
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Calories</span><strong class="text-white">380 kcal</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Protein</span><strong class="text-emerald-400">7.0g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Carbs</span><strong class="text-amber-400">52g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Fat</span><strong class="text-rose-400">16g</strong></div>
        </div>
        <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1 text-slate-300">
          <p>🧂 <strong>Sodium:</strong> 980 mg (almost 50% of WHO daily ceiling)!</p>
          <p>⚠️ <strong>Verdict:</strong> Flash-fried in palm oil; high refined carbohydrates with very little fiber. Causes water retention and cravings.</p>
          <p>✅ <strong>Smart Swap:</strong> Veggie oats khichdi or homemade dal rice!</p>
        </div>
      </div>
    `;
  }

  // Sugary Cola / Cold Drinks
  if (q.includes('cola') || q.includes('pepsi') || q.includes('coke') || q.includes('soda') || q.includes('soft drink') || q.includes('cold drink')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center justify-between text-sm">
          <span>🥤 Sugary Carbonated Soda (300ml bottle)</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-700/50">Sugar Bomb 💣</span>
        </h5>
        <div class="grid grid-cols-4 gap-1.5 text-center text-[10px]">
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Calories</span><strong class="text-white">140 kcal</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Protein</span><strong class="text-slate-500">0.0g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Carbs</span><strong class="text-amber-400">39g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Sugar</span><strong class="text-rose-400">39g</strong></div>
        </div>
        <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1 text-slate-300">
          <p>🥄 <strong>Sugar Spoons:</strong> <strong>9.75 teaspoons of pure sugar (🥄 × 10)</strong>!</p>
          <p>⚠️ <strong>WHO Violation:</strong> Completely shatters the WHO 25g/day limit in one drink!</p>
          <p>✅ <strong>Smart Swap:</strong> <strong>Spiced Chaas (Buttermilk)</strong> or Fresh Coconut Water (0 added sugar, natural electrolytes).</p>
        </div>
      </div>
    `;
  }

  // Spiced Chaas (Buttermilk)
  if (q.includes('chaas') || q.includes('buttermilk') || q.includes('mattha')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center justify-between text-sm">
          <span>🥛 Spiced Chaas / Buttermilk (1 glass / 200ml)</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">Probiotic Star ⭐</span>
        </h5>
        <div class="grid grid-cols-4 gap-1.5 text-center text-[10px]">
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Calories</span><strong class="text-white">45 kcal</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Protein</span><strong class="text-emerald-400">3.2g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Carbs</span><strong class="text-amber-400">4.8g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Fat</span><strong class="text-sky-400">1.5g</strong></div>
        </div>
        <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1 text-slate-300">
          <p>🥄 <strong>Sugar Spoons:</strong> 0 added sugar (natural lactose only).</p>
          <p>🦠 <strong>Gut Health:</strong> Contains live lactic acid bacteria, jeera, and rock salt.</p>
          <p>✅ <strong>Verdict:</strong> The #1 beverage for college students! Hydrates, aids digestion, and keeps body cool.</p>
        </div>
      </div>
    `;
  }

  // Idli & Dosa
  if (q.includes('idli') || q.includes('dosa')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center justify-between text-sm">
          <span>🥞 Idli-Sambar vs Masala Dosa</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">Fermented</span>
        </h5>
        <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span class="font-bold text-emerald-400 block">2 Steamed Idlis + Sambar</span>
            <p>• <strong>165 kcal</strong> • 6.8g Protein • 1.5g Fat</p>
            <p>• Steamed, zero oil, fermented probiotic batter.</p>
          </div>
          <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span class="font-bold text-amber-400 block">1 Masala Dosa</span>
            <p>• <strong>320 kcal</strong> • 6.0g Protein • 12g Fat</p>
            <p>• Pan-roasted with butter/oil + potato masala.</p>
          </div>
        </div>
        <p class="text-[11px] text-slate-400">💡 <em>Tip:</em> Choose Idli over Dosa for an ultra-clean, easy-to-digest study breakfast!</p>
      </div>
    `;
  }

  // Egg / Eggs / Egg Bhurji
  if (q.includes('egg') || q.includes('bhurji') || q.includes('boiled egg') || q.includes('omelette')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center justify-between text-sm">
          <span>🥚 Eggs (2 Boiled Eggs or Veggie Bhurji)</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">High Protein</span>
        </h5>
        <div class="grid grid-cols-4 gap-1.5 text-center text-[10px]">
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Calories</span><strong class="text-white">155 kcal</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Protein</span><strong class="text-emerald-400">13.0g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Carbs</span><strong class="text-amber-400">1.1g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Fat</span><strong class="text-sky-400">10.5g</strong></div>
        </div>
        <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1 text-slate-300">
          <p>🧠 <strong>Choline &amp; B12:</strong> Rich in brain-boosting choline for memory recall during exams.</p>
          <p>✅ <strong>Verdict:</strong> Complete protein with all 9 essential amino acids. One of the cheapest superfoods for hostel students!</p>
        </div>
      </div>
    `;
  }

  // Paneer
  if (q.includes('paneer')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center justify-between text-sm">
          <span>🧀 Paneer (100g Cottage Cheese)</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">Veg Protein</span>
        </h5>
        <div class="grid grid-cols-4 gap-1.5 text-center text-[10px]">
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Calories</span><strong class="text-white">265 kcal</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Protein</span><strong class="text-emerald-400">18.0g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Carbs</span><strong class="text-amber-400">3.5g</strong></div>
          <div class="p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="text-slate-400 block">Fat</span><strong class="text-sky-400">20.0g</strong></div>
        </div>
        <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1 text-slate-300">
          <p>🦴 <strong>Calcium:</strong> Provides ~480mg calcium (nearly 50% of daily requirement).</p>
          <p>✅ <strong>Tip:</strong> Opt for grilled or raw paneer cubes in salads rather than deep-fried or oily butter masala gravies.</p>
        </div>
      </div>
    `;
  }

  // Tea / Chai / Coffee
  if (q.includes('tea') || q.includes('chai') || q.includes('coffee')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center justify-between text-sm">
          <span>☕ Canteen Cutting Chai / Coffee (1 small cup / 100ml)</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/50">Sugar Watch</span>
        </h5>
        <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1 text-slate-300">
          <p>• <strong>Calories:</strong> ~90 - 120 kcal per cup (due to full-fat buffalo milk &amp; sugar).</p>
          <p>• <strong>Sugar Content:</strong> 12 - 16g sugar (<strong>3 to 4 teaspoons 🥄 × 3</strong> per cup!).</p>
          <p>⚠️ <strong>Hostel Student Trap:</strong> Drinking 3 to 4 cutting chais during exam study sessions adds <strong>45-60g of hidden sugar</strong>!</p>
          <p>✅ <strong>Clean Fix:</strong> Request chai with half-sugar, or switch to black coffee/green tea for alertness without the sugar crash.</p>
        </div>
      </div>
    `;
  }

  // 14. 30-Question Nutrition Quiz Portal
  if (q.includes('quiz') || q.includes('quizzes') || q.includes('test') || q.includes('certificate')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-brain text-amber-400"></i> 30-Question Comprehensive Nutrition Quiz
        </h5>
        <p class="text-slate-300">
          Test your nutrition literacy with our interactive 30-question bank spanning:
        </p>
        <ul class="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
          <li>Macronutrients &amp; Micronutrients</li>
          <li>Packaged Food Labels &amp; 5/20 Rule</li>
          <li>Canteen Food Swaps &amp; Portion Models</li>
          <li>Hydration, Sleep &amp; Exam Performance</li>
        </ul>
        <div class="p-2 rounded-xl bg-amber-950/40 border border-amber-700/50 text-[11px] text-amber-200">
          🏆 Score 80%+ to unlock the official <strong>NutriAware Gold Certified Badge</strong>!
        </div>
        <button onclick="switchTab('quizzes')" class="w-full py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition text-[11px]">
          🧠 Start the 30-Question Quiz Now
        </button>
      </div>
    `;
  }

  // 15. Student Survey Results (Page 2)
  if (q.includes('survey') || q.includes('research') || q.includes('survey result') || q.includes('statistics')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-square-poll-vertical text-purple-400"></i> Student Survey Insights (PDF Page 2)
        </h5>
        <p class="text-slate-300">5 Key Findings from Sanjivani Student Cohort:</p>
        <ul class="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
          <li><strong>Q1 Balanced Meals:</strong> >70% of students struggle to determine if their daily meals are balanced.</li>
          <li><strong>Q2 Food Labels:</strong> >65% find packaged food labels confusing and hard to interpret.</li>
          <li><strong>Q3 Food Choice Driver:</strong> >80% default to taste, cost, or convenience over nutrition.</li>
          <li><strong>Q4 Simple Nutrition Tool:</strong> >90% would actively use an app explaining nutrition in simple language.</li>
          <li><strong>Q5 Canteen Alternatives:</strong> >85% expressed high interest in healthy canteen alternatives.</li>
        </ul>
        <button onclick="switchTab('survey')" class="w-full mt-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-1.5 rounded-xl transition text-[11px]">
          📊 Open Live Student Survey Tab
        </button>
      </div>
    `;
  }

  // 16. Budget Meals on Campus (< ₹50 / ₹100)
  if (q.includes('budget') || q.includes('cheap') || q.includes('cost') || q.includes('money') || q.includes('hostel food') || q.includes('50') || q.includes('100')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-wallet text-emerald-400"></i> Healthy Budget Meals for College Students
        </h5>
        <div class="space-y-1.5 text-[11px] text-slate-300">
          <div class="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <strong class="text-emerald-400">Under ₹30:</strong> Spiced Chaas (₹15) + Roasted Chana (₹15) = 10g protein, high fiber, zero oil.
          </div>
          <div class="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <strong class="text-sky-400">Under ₹50:</strong> 2 Boiled Eggs (₹16) + Veggie Poha / 2 Bananas (₹30) = Complete amino acids and steady study fuel.
          </div>
          <div class="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <strong class="text-purple-400">Under ₹80:</strong> Mess Dal Khichdi + Cup of Curd + Cucumber slices = The complete 50/25/25 balanced plate.
          </div>
        </div>
      </div>
    `;
  }

  // 17. Tech Stack
  if (q.includes('tech') || q.includes('technology') || q.includes('stack') || q.includes('tensorflow') || q.includes('flutter') || q.includes('node') || q.includes('python')) {
    return `
      <div class="space-y-1.5 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5">
          <i class="fa-solid fa-microchip text-sky-400"></i> Technology Stack
        </h5>
        <ul class="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
          <li><strong>UI Frontend:</strong> Modern HTML5, Tailwind CSS, Apple Minimalist Aesthetics</li>
          <li><strong>Speech Engine:</strong> Web Speech Synthesis API (Realtime Voice Readout)</li>
          <li><strong>Speech Input:</strong> Web Speech Recognition API (Microphone Voice Commands)</li>
          <li><strong>Audio Synthesizer:</strong> Web Audio API (Chimes &amp; Alerts without external audio files)</li>
          <li><strong>Storage:</strong> HTML5 LocalStorage with Single-Student Session Lock</li>
          <li><strong>SDG Alignment:</strong> UN Sustainable Development Goal 3 (Good Health and Well-Being)</li>
        </ul>
      </div>
    `;
  }

  // 18. Smart Fallback for any other food or health query
  return `
    <div class="space-y-2 text-xs text-slate-300">
      <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
        <i class="fa-solid fa-brain text-emerald-400"></i> NutriAware Nutrition Knowledge Base
      </h5>
      <p class="leading-relaxed">
        You asked about <strong>"${escapeHTML(query)}"</strong>. NutriAware provides full nutritional science, canteen comparisons, and portion guidance!
      </p>
      <div class="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-[11px] space-y-1">
        <p class="font-bold text-emerald-400">💡 Key Advice for Students:</p>
        <p>• Aim for <strong>1.0g to 1.2g protein per kg</strong> of bodyweight daily.</p>
        <p>• Follow the <strong>50/25/25 plate rule</strong>: 50% fiber salad, 25% protein, 25% complex carbs.</p>
        <p>• Cap added sugar at <strong>25g/day (~6 spoons)</strong> and sodium at <strong>2,000mg/day</strong>.</p>
        <p>• Keep a water bottle handy and hit your <strong>2,500 ml daily hydration goal</strong>.</p>
      </div>
      <div class="flex flex-wrap gap-1.5 pt-1">
        <button onclick="switchTab('canteen')" class="px-2.5 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900 text-[10px]">🥗 Canteen Swaps</button>
        <button onclick="switchTab('compare')" class="px-2.5 py-1 rounded-xl bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 hover:bg-cyan-900 text-[10px]">⚖️ Compare Foods</button>
        <button onclick="switchTab('tracker')" class="px-2.5 py-1 rounded-xl bg-sky-950/80 text-sky-300 border border-sky-700/50 hover:bg-sky-900 text-[10px]">💧 Water Tracker</button>
        <button onclick="switchTab('quizzes')" class="px-2.5 py-1 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-700/50 hover:bg-amber-900 text-[10px]">🧠 30-Q Quiz</button>
      </div>
    </div>
  `;
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}


/* ==========================================================================
   FEATURE IMPLEMENTATIONS ALIGNED WITH PDF SPECIFICATION
   ========================================================================== */

// 1. Food Label Interactive Decoder
function inspectLabelSection(section) {
  const titleEl = document.getElementById('labelExplainTitle');
  const bodyEl = document.getElementById('labelExplainBody');
  if (!titleEl || !bodyEl) return;

  const data = {
    serving: {
      title: "Serving Size & Container Reality",
      content: `
        <div class="space-y-2">
          <span class="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">Step 1: The Multiplier Trap</span>
          <p class="text-slate-200">All numbers shown on nutrition labels represent <strong>only ONE single serving</strong>, not the entire packet! Many student snack packs contain 2 to 3 servings. If you consume the full pack, you must multiply all calories, sodium, and fats accordingly.</p>
          <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-medium">
            💡 Practical Tip: Look at "Servings Per Container" first before checking calories.
          </div>
        </div>
      `
    },
    calories: {
      title: "Calories & Student Energy Balance",
      content: `
        <div class="space-y-2">
          <span class="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">Energy Density</span>
          <p class="text-slate-200">Calories measure food energy. Young adults typically need <strong>2,000 to 2,400 kcal per day</strong>. Highly processed snacks offer "empty calories" with little micronutrient density, leading to sudden sugar crashes and tiredness during lectures.</p>
          <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-medium">
            💡 Practical Tip: A healthy snack should be between 150-200 kcal with at least 4g protein or fiber.
          </div>
        </div>
      `
    },
    fat: {
      title: "Total Fat & Saturated Fat Limits",
      content: `
        <div class="space-y-2">
          <span class="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">Lipid Balance</span>
          <p class="text-slate-200">Fat provides 9 kcal per gram. While unsaturated fats (nuts, seeds) promote brain health, saturated fats from palm oil and reused frying oil should stay below <strong>20g per day</strong>.</p>
          <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 font-medium">
            ⚠️ Canteen Watch: Fried samosas and pakoras often absorb heavy saturated fat from repeated frying cycles.
          </div>
        </div>
      `
    },
    transfat: {
      title: "Trans Fat (Zero Tolerance Rule)",
      content: `
        <div class="space-y-2">
          <span class="inline-block px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/30">Strict Avoidance</span>
          <p class="text-slate-200">Trans fats are produced by hydrogenating oils (vanaspati / bakery shortenings). They raise LDL (bad) cholesterol and lower HDL (good) cholesterol, directly threatening cardiovascular health.</p>
          <div class="p-2.5 rounded-xl bg-slate-950 border border-red-500/30 text-xs text-rose-300 font-medium">
            🚫 Golden Rule: If the ingredient list mentions "partially hydrogenated vegetable oil" or "vanaspati", put it back on the shelf!
          </div>
        </div>
      `
    },
    sodium: {
      title: "Sodium (Salt) & Daily Blood Pressure",
      content: `
        <div class="space-y-2">
          <span class="inline-block px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold border border-sky-500/30">Max 2,000 mg/day</span>
          <p class="text-slate-200">The WHO recommended daily limit for sodium is under <strong>2,000 mg</strong> (about 1 teaspoon of table salt). A single bowl of instant canteen noodles can contain <strong>900 to 1,200 mg</strong> — more than half your entire day's allowance!</p>
          <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-sky-300 font-medium">
            💡 Practical Tip: Low sodium = 140 mg or less per serving. High sodium = 400 mg or more.
          </div>
        </div>
      `
    },
    sugar: {
      title: "Added Sugars & The Afternoon Slump",
      content: `
        <div class="space-y-2">
          <span class="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">WHO Cap: 25g/day</span>
          <p class="text-slate-200">4 grams of sugar equals approximately 1 full teaspoon of sugar. A single 330ml can of soda has <strong>39g of added sugar (nearly 10 teaspoons!)</strong>. This causes rapid glucose spikes followed by severe fatigue and sleepiness.</p>
          <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-purple-300 font-medium">
            💡 Practical Tip: Choose spiced chaas, lemon water, or fresh fruit over canned sweetened beverages.
          </div>
        </div>
      `
    },
    protein: {
      title: "Protein & Dietary Fiber (Satiety Power)",
      content: `
        <div class="space-y-2">
          <span class="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">Muscle & Focus</span>
          <p class="text-slate-200">Protein and dietary fiber slow down digestion, keeping you satisfied and focused for hours. Look for snacks providing at least <strong>5g of protein and 3g of fiber</strong>.</p>
          <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-medium">
            💡 Practical Tip: Sprouts, roasted chana, peanuts, and paneer wraps are the top affordable college protein sources.
          </div>
        </div>
      `
    }
  };

  const item = data[section] || data['serving'];
  titleEl.textContent = item.title;
  bodyEl.innerHTML = item.content;
}


// 2. Side-by-Side Food Comparison Engine
const comparisonItems = {
  samosa: {
    name: "Canteen Fried Samosa (1 Pc)",
    category: "Fried Canteen Snack",
    calories: 262,
    protein: 3.5,
    carbs: 24,
    fat: 17.0,
    fiber: 1.8,
    sugar: 2.1,
    sugarSpoons: 0.5,
    sodium: 420,
    grade: "D",
    gradeColor: "text-amber-400 bg-amber-500/20 border-amber-500/40",
    tags: ["High Saturated Fat", "Refined Maida", "Reused Oil"]
  },
  maggi: {
    name: "Instant 2-Minute Masala Noodles",
    category: "Ultra-Processed Food",
    calories: 380,
    protein: 7.0,
    carbs: 54,
    fat: 15.0,
    fiber: 2.1,
    sugar: 3.0,
    sugarSpoons: 0.8,
    sodium: 980,
    grade: "F",
    gradeColor: "text-rose-400 bg-rose-500/20 border-rose-500/40",
    tags: ["Excessive Sodium (49% DV)", "Refined Flour", "Preservatives"]
  },
  vadapav: {
    name: "Canteen Fried Vada Pav",
    category: "High Carb / Fried",
    calories: 290,
    protein: 4.5,
    carbs: 38,
    fat: 13.5,
    fiber: 2.0,
    sugar: 3.2,
    sugarSpoons: 0.8,
    sodium: 510,
    grade: "D",
    gradeColor: "text-amber-400 bg-amber-500/20 border-amber-500/40",
    tags: ["High Glycemic Index", "Deep Fried Potato", "Refined Pav"]
  },
  cola: {
    name: "Carbonated Sugary Soft Drink (300ml)",
    category: "Liquid Sugar Spike",
    calories: 140,
    protein: 0.0,
    carbs: 39,
    fat: 0.0,
    fiber: 0.0,
    sugar: 39.0,
    sugarSpoons: 10.0,
    sodium: 45,
    grade: "F",
    gradeColor: "text-rose-400 bg-rose-500/20 border-rose-500/40",
    tags: ["10 tsp Added Sugar", "Empty Calories", "Acid Enamel Erosion"]
  },
  fries: {
    name: "Fried Potato French Fries (Regular)",
    category: "Deep Fried Starch",
    calories: 312,
    protein: 3.4,
    carbs: 41,
    fat: 15.0,
    fiber: 3.8,
    sugar: 0.4,
    sugarSpoons: 0.1,
    sodium: 320,
    grade: "D",
    gradeColor: "text-amber-400 bg-amber-500/20 border-amber-500/40",
    tags: ["High Acrylamide", "Reused Frying Oil", "High Glycemic Load"]
  },
  sprouts: {
    name: "Sprouted Moong & Chana Salad (1 Cup)",
    category: "Living Superfood Alternative",
    calories: 145,
    protein: 12.0,
    carbs: 22,
    fat: 1.5,
    fiber: 7.5,
    sugar: 1.2,
    sugarSpoons: 0.0,
    sodium: 60,
    grade: "A+",
    gradeColor: "text-emerald-400 bg-emerald-500/20 border-emerald-500/40",
    tags: ["Active Plant Enzymes", "High Dietary Fiber", "Clean Plant Protein"]
  },
  poha: {
    name: "Veggie Poha with Peanuts",
    category: "Wholesome Breakfast",
    calories: 180,
    protein: 4.8,
    carbs: 33,
    fat: 4.2,
    fiber: 4.1,
    sugar: 1.5,
    sugarSpoons: 0.0,
    sodium: 180,
    grade: "A",
    gradeColor: "text-emerald-400 bg-emerald-500/20 border-emerald-500/40",
    tags: ["Natural Bio-Iron", "Antioxidant Turmeric", "Peanut Healthy Fats"]
  },
  paneerwrap: {
    name: "Multigrain Paneer Roll",
    category: "High-Protein Energy Lunch",
    calories: 230,
    protein: 14.5,
    carbs: 26,
    fat: 7.0,
    fiber: 5.2,
    sugar: 2.0,
    sugarSpoons: 0.5,
    sodium: 240,
    grade: "A+",
    gradeColor: "text-emerald-400 bg-emerald-500/20 border-emerald-500/40",
    tags: ["Whole Wheat Base", "Fresh Paneer Casein", "Crunchy Veggie Fiber"]
  },
  chaas: {
    name: "Spiced Fresh Chaas / Buttermilk (300ml)",
    category: "Natural Probiotic Hydration",
    calories: 45,
    protein: 3.2,
    carbs: 4.8,
    fat: 1.2,
    fiber: 0.2,
    sugar: 0.0,
    sugarSpoons: 0.0,
    sodium: 120,
    grade: "A+",
    gradeColor: "text-emerald-400 bg-emerald-500/20 border-emerald-500/40",
    tags: ["Zero Added Sugar", "Live Probiotic Cultures", "Cooling Cumin & Mint"]
  },
  fruitsalad: {
    name: "Fresh Mixed Fruit Bowl",
    category: "Natural Vitamin & Hydration",
    calories: 95,
    protein: 1.2,
    carbs: 24,
    fat: 0.3,
    fiber: 3.5,
    sugar: 18.0,
    sugarSpoons: 4.5,
    sodium: 5,
    grade: "A",
    gradeColor: "text-emerald-400 bg-emerald-500/20 border-emerald-500/40",
    tags: ["Natural Fruit Fiber", "Vitamin C & Potassium", "Zero Processed Fats"]
  }
};

function runFoodComparison() {
  const selA = document.getElementById('compareFoodA')?.value || 'samosa';
  const selB = document.getElementById('compareFoodB')?.value || 'sprouts';
  const container = document.getElementById('compareResultContainer');
  const verdictBox = document.getElementById('compareVerdictBox');
  if (!container || !verdictBox) return;

  const itemA = comparisonItems[selA] || comparisonItems['samosa'];
  const itemB = comparisonItems[selB] || comparisonItems['sprouts'];

  const calDiff = itemA.calories - itemB.calories;
  const protDiff = (itemB.protein - itemA.protein).toFixed(1);
  const fatDiff = (itemA.fat - itemB.fat).toFixed(1);
  const sugarSaved = (itemA.sugarSpoons - itemB.sugarSpoons).toFixed(1);

  container.innerHTML = `
    <!-- Food A (Option 1) -->
    <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
      <div class="flex justify-between items-start">
        <div>
          <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">Option 1</span>
          <h4 class="font-extrabold text-white text-base mt-1">${itemA.name}</h4>
          <p class="text-xs text-slate-400">${itemA.category}</p>
        </div>
        <span class="text-xs font-black px-2.5 py-1 rounded-full border ${itemA.gradeColor}">Grade ${itemA.grade}</span>
      </div>

      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <p class="text-[10px] text-slate-400 uppercase">Calories</p>
          <p class="text-sm font-extrabold text-white">${itemA.calories} kcal</p>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <p class="text-[10px] text-slate-400 uppercase">Protein</p>
          <p class="text-sm font-extrabold text-emerald-400">${itemA.protein}g</p>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <p class="text-[10px] text-slate-400 uppercase">Fat</p>
          <p class="text-sm font-extrabold ${itemA.fat > 10 ? 'text-rose-400' : 'text-amber-400'}">${itemA.fat}g</p>
        </div>
      </div>

      <!-- PPT Slide 3 Screen 4: Visual Sugar Spoon Count -->
      <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
        <div class="flex items-center justify-between">
          <span class="text-[10px] text-slate-400 uppercase font-bold">Visual Sugar Spoon Count</span>
          <span class="text-xs font-black ${itemA.sugarSpoons >= 4 ? 'text-rose-400' : (itemA.sugarSpoons > 0 ? 'text-amber-400' : 'text-emerald-400')}">
            ${itemA.sugarSpoons === 0 ? '🥄 × 0' : '🥄'.repeat(Math.min(10, Math.max(1, Math.round(itemA.sugarSpoons))))} (${itemA.sugarSpoons} spoons)
          </span>
        </div>
        <p class="text-[10px] text-slate-400 mt-1">Replaced grams with spoons for instant visual awareness (Slide 4 revision)</p>
      </div>

      <div class="space-y-1.5 text-xs text-slate-300">
        <div class="flex justify-between py-1 border-b border-slate-800">
          <span>Carbohydrates:</span>
          <span class="font-bold">${itemA.carbs}g</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-800">
          <span>Dietary Fiber:</span>
          <span class="font-bold text-emerald-400">${itemA.fiber}g</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-800">
          <span>Sodium (Salt):</span>
          <span class="font-bold ${itemA.sodium > 400 ? 'text-rose-400' : 'text-slate-300'}">${itemA.sodium}mg</span>
        </div>
      </div>

      <div class="flex flex-wrap gap-1.5 pt-1">
        ${itemA.tags.map(t => `<span class="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">${t}</span>`).join('')}
      </div>
    </div>

    <!-- Food B (Option 2 - Alternative) -->
    <div class="bg-emerald-950/20 p-6 rounded-2xl border border-emerald-500/40 space-y-4">
      <div class="flex justify-between items-start">
        <div>
          <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">Option 2 (Healthier Swap)</span>
          <h4 class="font-extrabold text-white text-base mt-1">${itemB.name}</h4>
          <p class="text-xs text-emerald-300 font-medium">${itemB.category}</p>
        </div>
        <span class="text-xs font-black px-2.5 py-1 rounded-full border ${itemB.gradeColor}">Grade ${itemB.grade}</span>
      </div>

      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="p-2.5 rounded-xl bg-slate-950 border border-emerald-900/60">
          <p class="text-[10px] text-slate-400 uppercase">Calories</p>
          <p class="text-sm font-extrabold text-white">${itemB.calories} kcal</p>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-950 border border-emerald-900/60">
          <p class="text-[10px] text-slate-400 uppercase">Protein</p>
          <p class="text-sm font-extrabold text-emerald-400">${itemB.protein}g</p>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-950 border border-emerald-900/60">
          <p class="text-[10px] text-slate-400 uppercase">Fat</p>
          <p class="text-sm font-extrabold text-emerald-400">${itemB.fat}g</p>
        </div>
      </div>

      <!-- PPT Slide 3 Screen 4: Visual Sugar Spoon Count -->
      <div class="p-3 rounded-xl bg-slate-950 border border-emerald-900/60">
        <div class="flex items-center justify-between">
          <span class="text-[10px] text-slate-400 uppercase font-bold">Visual Sugar Spoon Count</span>
          <span class="text-xs font-black ${itemB.sugarSpoons >= 4 ? 'text-rose-400' : (itemB.sugarSpoons > 0 ? 'text-amber-400' : 'text-emerald-400')}">
            ${itemB.sugarSpoons === 0 ? '🥄 × 0' : '🥄'.repeat(Math.min(10, Math.max(1, Math.round(itemB.sugarSpoons))))} (${itemB.sugarSpoons} spoons)
          </span>
        </div>
        <p class="text-[10px] text-emerald-400 mt-1">Clean nutritional alternative with zero / low added sugar</p>
      </div>

      <div class="space-y-1.5 text-xs text-slate-300">
        <div class="flex justify-between py-1 border-b border-slate-800">
          <span>Carbohydrates:</span>
          <span class="font-bold">${itemB.carbs}g</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-800">
          <span>Dietary Fiber:</span>
          <span class="font-bold text-emerald-400">${itemB.fiber}g</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-800">
          <span>Sodium (Salt):</span>
          <span class="font-bold text-emerald-400">${itemB.sodium}mg</span>
        </div>
      </div>

      <div class="flex flex-wrap gap-1.5 pt-1">
        ${itemB.tags.map(t => `<span class="text-[10px] px-2 py-0.5 rounded-md bg-emerald-900/60 text-emerald-200 border border-emerald-700/50">${t}</span>`).join('')}
      </div>
    </div>
  `;

  verdictBox.innerHTML = `
    <div class="flex items-center gap-2 text-emerald-400 font-bold mb-1">
      <i class="fa-solid fa-wand-magic-sparkles"></i>
      <span>AI Comparison Verdict • Team 18 SDG 3 Guidance:</span>
    </div>
    <p class="leading-relaxed">
      Switching from <strong>${itemA.name}</strong> to <strong>${itemB.name}</strong> saves 
      <strong class="text-emerald-400">${Math.abs(calDiff)} calories</strong>, cuts 
      <strong class="text-emerald-400">${Math.abs(fatDiff)}g of total fats</strong>, 
      saves <strong class="text-emerald-400">${Math.max(0, parseFloat(sugarSaved))} spoons of sugar (🥄)</strong>, and provides 
      <strong class="text-emerald-400">${Math.abs(protDiff)}g ${protDiff >= 0 ? 'more' : 'less'} clean protein</strong>! 
      This switch directly enhances mental clarity, eliminates afternoon lethargy, and prevents digestive inflammation.
    </p>
  `;
}

// 3. Interactive Student Survey Voting
const recordedSurveyVotes = {};

function voteSurvey(qIndex, choice) {
  recordedSurveyVotes[qIndex] = choice;
  
  const choices = ['yes', 'sometimes', 'no'];
  choices.forEach(c => {
    const btn = document.getElementById(`s${qIndex}-${c}`);
    if (btn) {
      btn.classList.remove('bg-emerald-600', 'bg-sky-600', 'bg-slate-700', 'text-white', 'border-emerald-500');
      btn.classList.add('border-slate-700', 'text-slate-300');
    }
  });

  const selectedBtn = document.getElementById(`s${qIndex}-${choice}`);
  if (selectedBtn) {
    selectedBtn.classList.remove('border-slate-700', 'text-slate-300');
    selectedBtn.classList.add('bg-emerald-600', 'text-white', 'border-emerald-500', 'font-bold');
  }

  showToastNotification('✅ Response Recorded!', `Thank you! Your vote for Question ${qIndex} has been logged in Team 18's SDG 3 dataset.`);
}

// Automatically initialize comparison on script execution
setTimeout(() => {
  if (typeof runFoodComparison === 'function') {
    runFoodComparison();
  }
}, 300);

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}


/* ==========================================================================
   9. 30-QUESTION NUTRITION CERTIFICATION QUIZ & HD CERTIFICATE GENERATOR
   ========================================================================== */
const quiz30Data = [
  { q: "Q1: Which macronutrient is the body's primary quick energy source?", options: ["Proteins", "Carbohydrates", "Dietary Fats", "Vitamins"], answer: 1, tip: "Carbohydrates break down into glucose, fueling body & brain!" },
  { q: "Q2: Which vitamin synthesized from sunlight is crucial for bone health?", options: ["Vitamin D", "Vitamin C", "Vitamin B12", "Vitamin E"], answer: 0, tip: "Vitamin D promotes calcium absorption in the gut." },
  { q: "Q3: What is the recommended minimum daily water intake for adults?", options: ["1.0 Liters", "2.5 Liters", "5.0 Liters", "0.5 Liters"], answer: 1, tip: "2.5L (approx 8-10 glasses) maintains optimal hydration." },
  { q: "Q4: Which macronutrient is essential for muscle repair and hormone synthesis?", options: ["Carbohydrates", "Proteins", "Fiber", "Sodium"], answer: 1, tip: "Proteins supply amino acids necessary for muscle tissue repair." },
  { q: "Q5: Which of the following is a healthy source of monounsaturated fats?", options: ["Avocados & Olive Oil", "Deep fried chips", "Commercial margarine", "Trans fats"], answer: 0, tip: "Avocados and olive oil support cardiovascular health." },
  { q: "Q6: How many calories are in 1 gram of Dietary Fat?", options: ["4 kcal", "7 kcal", "9 kcal", "12 kcal"], answer: 2, tip: "Fats provide 9 calories per gram, making them energy dense." },
  { q: "Q7: How many calories are in 1 gram of Protein?", options: ["4 kcal", "9 kcal", "2 kcal", "6 kcal"], answer: 0, tip: "Protein provides 4 kcal per gram." },
  { q: "Q8: How many calories are in 1 gram of Carbohydrate?", options: ["9 kcal", "4 kcal", "7 kcal", "5 kcal"], answer: 1, tip: "Carbohydrates yield 4 kcal per gram." },
  { q: "Q9: Which essential mineral is required for hemoglobin to transport oxygen in blood?", options: ["Iron", "Zinc", "Calcium", "Magnesium"], answer: 0, tip: "Iron forms the core of hemoglobin in red blood cells." },
  { q: "Q10: Deficiency of which vitamin causes Scurvy?", options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"], answer: 1, tip: "Vitamin C is essential for collagen synthesis." },
  { q: "Q11: Which non-digestible plant component aids digestion and prevents constipation?", options: ["Dietary Fiber", "Starch", "Glucose", "Fructose"], answer: 0, tip: "Fiber promotes healthy gut motility." },
  { q: "Q12: Which electrolyte helps regulate blood pressure and fluid balance?", options: ["Potassium", "Chlorine", "Sulfur", "Phosphorus"], answer: 0, tip: "Potassium counteracts excess sodium to maintain blood pressure." },
  { q: "Q13: What color should healthy urine ideally be as a sign of proper hydration?", options: ["Dark Amber", "Pale Straw Yellow", "Bright Orange", "Clear Transparent"], answer: 1, tip: "Pale straw yellow indicates optimal hydration status." },
  { q: "Q14: What does HDL stand for in cholesterol tests?", options: ["High Density Lipoprotein", "Heavy Diet Lipid", "Hyper Density Liver", "Hydro Level"], answer: 0, tip: "HDL is often called 'good' cholesterol." },
  { q: "Q15: What does LDL stand for in cholesterol tests?", options: ["Low Density Lipoprotein", "Light Diet Lipid", "Low Level Liver", "Low Energy Lipid"], answer: 0, tip: "LDL is commonly referred to as 'bad' cholesterol." },
  { q: "Q16: Which vitamin is essential for good night vision and eye health?", options: ["Vitamin A", "Vitamin B6", "Vitamin C", "Vitamin D"], answer: 0, tip: "Vitamin A (retinol) forms pigments in the retina." },
  { q: "Q17: Which vitamin plays a critical role in blood coagulation (clotting)?", options: ["Vitamin K", "Vitamin E", "Vitamin B12", "Folic Acid"], answer: 0, tip: "Vitamin K is essential for synthesizing blood clotting proteins." },
  { q: "Q18: Which Omega-3 fatty acids are abundant in flaxseeds, chia, and fatty fish?", options: ["EPA & DHA", "Trans fats", "Lauric acid", "Palmitic acid"], answer: 0, tip: "Omega-3 EPA & DHA reduce inflammation and support brain function." },
  { q: "Q19: What effect do high Glycemic Index (GI) foods have on blood sugar?", options: ["Rapid blood sugar spike", "Slow gradual release", "No effect", "Decreases insulin"], answer: 0, tip: "High GI foods digest rapidly causing sharp spikes in blood glucose." },
  { q: "Q20: What is the main benefit of choosing Complex Carbohydrates over Simple Sugars?", options: ["Sustained energy & fiber", "Instant sugar crash", "Higher sodium", "Zero nutrients"], answer: 0, tip: "Complex carbs release energy gradually over time." },
  { q: "Q21: What is the recommended daily limit of sodium intake for adults by WHO?", options: ["2,000 mg (2g)", "5,000 mg", "10,000 mg", "500 mg"], answer: 0, tip: "Keeping sodium under 2,000 mg per day protects against hypertension." },
  { q: "Q22: Which B-vitamin (B9) is crucial for cell division and fetal development?", options: ["Folate (Folic Acid)", "Thiamine", "Riboflavin", "Niacin"], answer: 0, tip: "Folate prevents neural tube defects during early pregnancy." },
  { q: "Q23: What active anti-inflammatory compound is found in Turmeric?", options: ["Curcumin", "Capsaicin", "Allicin", "Gingerol"], answer: 0, tip: "Curcumin possesses potent antioxidant and anti-inflammatory properties." },
  { q: "Q24: What is the optimal anabolic window for post-workout protein consumption?", options: ["30 to 60 Minutes", "5 Hours", "24 Hours", "12 Hours"], answer: 0, tip: "Consuming 20-30g protein within 30-60 mins maximizes muscle synthesis." },
  { q: "Q25: Which mineral is essential for thyroid gland hormone production?", options: ["Iodine", "Copper", "Selenium", "Zinc"], answer: 0, tip: "Iodine is key for synthesizing T3 and T4 thyroid hormones." },
  { q: "Q26: Which vitamin enhances the intestinal absorption of Calcium?", options: ["Vitamin D", "Vitamin C", "Vitamin A", "Vitamin B12"], answer: 0, tip: "Vitamin D increases calcium transport protein synthesis." },
  { q: "Q27: Which type of fat is typically solid at room temperature?", options: ["Saturated Fat", "Polyunsaturated Fat", "Monounsaturated Fat", "Omega-3"], answer: 0, tip: "Saturated fats (like butter/coconut oil) remain solid at room temp." },
  { q: "Q28: What is the primary storage form of glucose in the human liver and muscles?", options: ["Glycogen", "Starch", "Glucagon", "Insulin"], answer: 0, tip: "Glycogen provides reserve glucose during exercise and fasting." },
  { q: "Q29: What is the primary dietary source of artificial Trans Fats?", options: ["Partially Hydrogenated Oils", "Olive Oil", "Fresh Fruit", "Steamed Veggies"], answer: 0, tip: "Partially hydrogenated oils increase LDL and lower HDL." },
  { q: "Q30: Why is drinking water before study sessions recommended for university students?", options: ["Enhances focus & memory", "Makes you sleepy", "Decreases metabolism", "Causes fatigue"], answer: 0, tip: "Even 1-2% dehydration impairs cognitive performance and focus!" }
];

let quizCurrentIndex = 0;
let quizUserScore = 0;

function initQuizPortal() {
  quizCurrentIndex = 0;
  quizUserScore = 0;
  renderQuiz30Question();
}

function renderQuiz30Question() {
  const container = document.getElementById('quiz30Container');
  const counterEl = document.getElementById('quiz30Counter');
  const progressEl = document.getElementById('quiz30ProgressBar');
  const scoreEl = document.getElementById('quiz30ScoreDisplay');

  if (!container) return;

  if (quizCurrentIndex >= quiz30Data.length) {
    renderQuiz30Certificate();
    return;
  }

  const current = quiz30Data[quizCurrentIndex];
  const pct = Math.round(((quizCurrentIndex + 1) / 30) * 100);

  if (counterEl) counterEl.textContent = `Question ${quizCurrentIndex + 1} of 30`;
  if (progressEl) progressEl.style.width = `${pct}%`;
  if (scoreEl) scoreEl.textContent = `Score: ${quizUserScore}/${quiz30Data.length}`;

  container.innerHTML = `
    <div class="space-y-4">
      <div class="bg-brand-50/80 p-4 rounded-2xl border border-brand-200">
        <h4 class="font-display font-extrabold text-slate-900 text-lg sm:text-xl">
          ${current.q}
        </h4>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        ${current.options.map((opt, idx) => `
          <button onclick="handleAnswerQuiz30(${idx})" class="p-4 rounded-2xl border-2 border-slate-200 hover:border-brand-500 hover:bg-brand-50/60 text-left font-bold text-sm text-slate-800 transition flex items-center gap-3 group">
            <span class="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center text-xs font-black transition shrink-0">
              ${String.fromCharCode(65 + idx)}
            </span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>

      <div id="quiz30Feedback" class="hidden p-4 rounded-2xl text-xs font-bold leading-relaxed transition-all"></div>
    </div>
  `;
}

function handleAnswerQuiz30(selectedIndex) {
  const current = quiz30Data[quizCurrentIndex];
  const feedbackEl = document.getElementById('quiz30Feedback');
  if (!feedbackEl) return;

  const isCorrect = selectedIndex === current.answer;
  if (isCorrect) {
    quizUserScore++;
    feedbackEl.className = 'p-4 rounded-2xl text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300';
    feedbackEl.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 text-sm mr-1.5"></i> Correct! ${current.tip}`;
  } else {
    feedbackEl.className = 'p-4 rounded-2xl text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300';
    feedbackEl.innerHTML = `<i class="fa-solid fa-circle-xmark text-amber-600 text-sm mr-1.5"></i> Incorrect (Correct answer: ${current.options[current.answer]}). ${current.tip}`;
  }

  feedbackEl.classList.remove('hidden');

  setTimeout(() => {
    quizCurrentIndex++;
    renderQuiz30Question();
  }, 1800);
}

function renderQuiz30Certificate() {
  const container = document.getElementById('quiz30Container');
  if (!container) return;

  const pct = Math.round((quizUserScore / 30) * 100);
  const currentUser = sessionStorage.getItem('nutriaware_user_name') || 'Student';
  const certCode = 'NA-' + Math.floor(100000 + Math.random() * 900000);

  container.innerHTML = `
    <div class="bg-gradient-to-b from-brand-50 via-white to-emerald-50 p-8 rounded-3xl border-2 border-brand-300 text-center space-y-6 shadow-xl">
      <div class="w-20 h-20 bg-brand-600 text-white rounded-full flex items-center justify-center text-4xl mx-auto shadow-lg shadow-brand-600/30">
        🏆
      </div>
      <div class="space-y-2">
        <span class="bg-brand-100 text-brand-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          Official Certification of Completion
        </span>
        <h3 class="font-display text-3xl font-extrabold text-slate-900">Certificate Awarded!</h3>
        <p class="text-sm text-slate-600">
          This certifies that <strong class="text-brand-700 text-base">${currentUser}</strong> scored <strong class="text-brand-700 text-lg">${quizUserScore} out of 30</strong> (${pct}% Accuracy).
        </p>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 max-w-sm mx-auto text-xs space-y-1 text-left font-mono">
        <p class="font-bold text-slate-800">Verification ID: ${certCode}</p>
        <p class="text-slate-500">Platform: NutriAware 3D AI Platform</p>
        <p class="text-slate-500">Lead Developer: @shreyasshinde619</p>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-3">
        <button onclick="window.print()" class="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow transition flex items-center gap-2">
          <i class="fa-solid fa-download"></i> Print / Save HD Certificate
        </button>

        <button onclick="initQuizPortal()" class="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow transition">
          Restart 30-Question Quiz
        </button>
      </div>
    </div>
  `;
}

let currentWaterIntake = 1250;
const targetWaterIntake = 2500;

function addWater(amount) {
  currentWaterIntake = Math.min(targetWaterIntake, currentWaterIntake + amount);
  updateWaterUI();
}

function updateWaterUI() {
  const valEl = document.getElementById('waterIntakeVal');
  const barEl = document.getElementById('waterProgressBar');
  const pctEl = document.getElementById('waterPercentage');

  if (valEl) valEl.textContent = currentWaterIntake;
  if (barEl && pctEl) {
    const pct = Math.round((currentWaterIntake / targetWaterIntake) * 100);
    barEl.style.width = `${pct}%`;
    pctEl.textContent = `${pct}% Goal Reached`;
  }
  updateDashboardWaterUI();
}

function initProgressChart() {
  const canvas = document.getElementById('macroChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        { label: 'Protein (g)', data: [75, 82, 90, 88, 95, 100, 85], backgroundColor: '#059669', borderRadius: 8 },
        { label: 'Carbs (g)', data: [210, 190, 230, 205, 220, 240, 200], backgroundColor: '#34d399', borderRadius: 8 },
        { label: 'Healthy Fats (g)', data: [55, 60, 50, 65, 58, 62, 54], backgroundColor: '#a7f3d0', borderRadius: 8 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' }, usePointStyle: true } }
      }
    }
  });
}

/* ==========================================================================
   10. INTERACTIVE DASHBOARD WELLNESS SUITE (REFERENCE WEBSITE ENGINE)
   ========================================================================== */
const dashboardFoodsData = [
  { name: 'Veggie Poha', cal: 180, protein: 4.2, carbs: 32, fat: 3.8, sugar: 1.2, sugarSpoons: 0.3 },
  { name: 'Idli (2 Pcs) + Sambar', cal: 130, protein: 4.5, carbs: 26, fat: 0.6, sugar: 0.4, sugarSpoons: 0.1 },
  { name: 'Canteen Fried Samosa', cal: 262, protein: 3.5, carbs: 24, fat: 17.0, sugar: 2.1, sugarSpoons: 0.5 },
  { name: 'Sprouted Moong Chaat', cal: 145, protein: 12.0, carbs: 22, fat: 1.2, sugar: 1.5, sugarSpoons: 0.3 },
  { name: 'Cooked Rice (1 Bowl)', cal: 130, protein: 2.7, carbs: 28, fat: 0.3, sugar: 0.1, sugarSpoons: 0.0 },
  { name: 'Yellow Dal Tadka', cal: 140, protein: 9.0, carbs: 20, fat: 2.4, sugar: 0.8, sugarSpoons: 0.2 },
  { name: 'Plain Probiotic Curd', cal: 98, protein: 5.5, carbs: 7.0, fat: 4.0, sugar: 4.5, sugarSpoons: 1.0 },
  { name: 'Fresh Apple', cal: 95, protein: 0.5, carbs: 25, fat: 0.3, sugar: 19.0, sugarSpoons: 4.5 },
  { name: 'Boiled Egg (1 Pc)', cal: 78, protein: 6.3, carbs: 0.6, fat: 5.3, sugar: 0.6, sugarSpoons: 0.1 },
  { name: 'Roasted Chana', cal: 160, protein: 9.5, carbs: 24, fat: 2.8, sugar: 1.1, sugarSpoons: 0.2 }
];

const dashboardMealsData = {
  breakfast: {
    title: 'Veggie Poha + Plain Curd + Seasonal Fruit',
    calories: '320 kcal',
    protein: '11g Protein',
    desc: 'Light, iron-rich flattened rice topped with roasted peanuts and fresh lemon, paired with probiotic curd for calm morning digestion.',
    swap: 'Swap deep-fried medu vada for poha or steamed idlis.'
  },
  lunch: {
    title: '2 Whole Wheat Rotis + Dal + Mixed Sabzi + Salad',
    calories: '440 kcal',
    protein: '18g Protein',
    desc: 'Complex carbohydrate energy that prevents the 2:00 PM post-lunch lecture crash while providing balanced amino acids.',
    swap: 'Swap oily canteen gravies for yellow dal and cucumber salad.'
  },
  snack: {
    title: 'Roasted Chana + Spiced Lemon Chaas / Green Tea',
    calories: '180 kcal',
    protein: '10g Protein',
    desc: 'Clean 5:00 PM hostel snack that crushes evening sugar urges and sustains evening study focus without trans fats.',
    swap: 'Swap packaged potato chips or samosas for roasted chana.'
  },
  dinner: {
    title: 'Vegetable Khichdi / Roti + Paneer Bhurji + Cucumber',
    calories: '390 kcal',
    protein: '19g Protein',
    desc: 'Easy-to-digest light evening plate that supports natural sleep melatonin release and restorative muscle repair.',
    swap: 'Swap midnight instant noodles for light vegetable khichdi.'
  }
};

function searchDashboardFood() {
  const input = document.getElementById('dashFoodSearch');
  const container = document.getElementById('dashFoodResults');
  if (!container) return;
  const q = (input?.value || '').toLowerCase().trim();
  const list = q 
    ? dashboardFoodsData.filter(f => f.name.toLowerCase().includes(q))
    : dashboardFoodsData.slice(0, 4);

  if (!list.length) {
    container.innerHTML = '<p class="text-xs text-slate-400 col-span-1 sm:col-span-2 py-4 text-center">No matching food found. Try: poha, idli, samosa, dal, apple, curd...</p>';
    return;
  }

  container.innerHTML = list.map(f => `
    <div class="bg-neutral-900/80 p-3.5 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition">
      <div class="flex justify-between items-start">
        <strong class="text-xs font-semibold text-white">${f.name}</strong>
        <span class="text-xs font-bold text-emerald-400">${f.cal} kcal</span>
      </div>
      <div class="text-[11px] text-slate-400 mt-1">
        P ${f.protein}g • C ${f.carbs}g • F ${f.fat}g
      </div>
      <div class="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
        <span>Sugar: ${f.sugar}g</span>
        <span class="text-amber-400 font-medium">🥄 × ${f.sugarSpoons} spoons</span>
      </div>
    </div>
  `).join('');
}

function selectDashboardMeal(mealKey) {
  const data = dashboardMealsData[mealKey];
  const titleEl = document.getElementById('dashMealTitle');
  const calEl = document.getElementById('dashMealCal');
  const protEl = document.getElementById('dashMealProt');
  const descEl = document.getElementById('dashMealDesc');
  const swapEl = document.getElementById('dashMealSwap');

  if (!data || !titleEl) return;

  titleEl.textContent = data.title;
  if (calEl) calEl.textContent = data.calories;
  if (protEl) protEl.textContent = data.protein;
  if (descEl) descEl.textContent = data.desc;
  if (swapEl) swapEl.textContent = data.swap;

  ['breakfast', 'lunch', 'snack', 'dinner'].forEach(key => {
    const btn = document.getElementById(`dashMealBtn-${key}`);
    if (btn) {
      if (key === mealKey) {
        btn.className = 'px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-sm transition';
      } else {
        btn.className = 'px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 transition';
      }
    }
  });

  playChime('general');
}

function quickUpdateDashboardWater(amount) {
  currentWaterIntake = Math.max(0, Math.min(targetWaterIntake, currentWaterIntake + amount));
  updateWaterUI();
  updateDashboardWaterUI();
  playChime('water');
}

function updateDashboardWaterUI() {
  const val = document.getElementById('dashWaterCount');
  const bar = document.getElementById('dashWaterBar');
  const msg = document.getElementById('dashWaterMsg');
  if (val) val.textContent = `${currentWaterIntake} ml`;
  if (bar) {
    const pct = Math.min(100, Math.round((currentWaterIntake / targetWaterIntake) * 100));
    bar.style.width = `${pct}%`;
  }
  if (msg) {
    const glasses = Math.floor(currentWaterIntake / 250);
    msg.textContent = `${glasses} of 10 glasses logged today (Target: ${targetWaterIntake}ml)`;
  }
}

function quickCalcDashboardBMI() {
  const h = Number(document.getElementById('dashHeight')?.value);
  const w = Number(document.getElementById('dashWeight')?.value);
  const res = document.getElementById('dashBmiResult');
  if (!res) return;

  if (!h || !w || h <= 0 || w <= 0) {
    res.innerHTML = '<span class="text-rose-400">Please enter a valid height (cm) and weight (kg).</span>';
    res.classList.remove('hidden');
    return;
  }

  const bmi = w / ((h / 100) ** 2);
  let cat = bmi < 18.5 ? 'Below Reference Range' : bmi < 24.9 ? 'Healthy Adult Range' : bmi < 29.9 ? 'Above Reference Range' : 'Higher Range';
  let badgeColor = bmi < 18.5 ? 'text-amber-400 border-amber-500/40 bg-amber-950/60' : bmi < 24.9 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60' : 'text-rose-400 border-rose-500/40 bg-rose-950/60';

  res.innerHTML = `
    <div class="flex items-center justify-between">
      <span>Your BMI: <strong class="text-white text-base">${bmi.toFixed(1)}</strong></span>
      <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}">${cat}</span>
    </div>
    <p class="text-[11px] text-slate-400 mt-1">Adult BMI is a screening indicator. Pair with whole-food canteen choices and hydration.</p>
  `;
  res.classList.remove('hidden');
  playChime('success');
}

// Initialise dashboard widgets
document.addEventListener('DOMContentLoaded', () => {
  searchDashboardFood();
  updateDashboardWaterUI();
});
