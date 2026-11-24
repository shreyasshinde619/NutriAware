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
  initSpeechRecognition();
  
  // Direct open access - No login portal
  showMainApp();
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

  const navBtns = document.querySelectorAll('header nav button');
  navBtns.forEach(btn => {
    btn.classList.remove('border-b-2', 'border-brand-400', 'text-brand-400', 'bg-brand-950/60');
    btn.classList.add('text-slate-300');
  });

  const activeBtn = document.getElementById(`nav-link-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.remove('text-slate-300');
    activeBtn.classList.add('text-brand-400', 'font-bold', 'border-b-2', 'border-brand-400', 'bg-brand-950/60');
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
   6. DAILY PROTEIN & WATER NOTIFICATION SYSTEM
   ========================================================================== */
function initNotificationSystem() {
  if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    setTimeout(() => { Notification.requestPermission(); }, 4000);
  }

  setInterval(() => {
    Math.random() > 0.5 ? triggerWaterReminder() : triggerProteinReminder();
  }, 240000);
}

function triggerWaterReminder() {
  const title = '💧 Hydration Alert';
  const msg = `Time to drink a glass of water (250 ml)! Stay hydrated to hit your 2,500 ml goal.`;
  showToastNotification(title, msg, 'water');
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body: msg, icon: 'app-icon.svg' });
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
   8. ADVANCED SMART AI CHATBOT ("NutriAssist Pro AI")
   ========================================================================== */
let isChatOpen = false;

function toggleChatWidget() {
  const chatBox = document.getElementById('chatBox');
  if (!chatBox) return;

  isChatOpen = !isChatOpen;
  if (isChatOpen) {
    chatBox.classList.remove('hidden');
    chatBox.classList.add('flex');
    document.getElementById('chatInput')?.focus();
  } else {
    chatBox.classList.add('hidden');
    chatBox.classList.remove('flex');
  }
}

function sendQuickPrompt(promptText) {
  if (!isChatOpen) toggleChatWidget();
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
  }, 700);
}

function appendChatMessage(sender, text) {
  const messagesContainer = document.getElementById('chatMessages');
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const messageWrapper = document.createElement('div');
  messageWrapper.className = `flex items-start gap-2 max-w-[90%] ${sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`;

  if (sender === 'user') {
    messageWrapper.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs shrink-0 mt-1">
        <i class="fa-solid fa-user"></i>
      </div>
      <div class="bg-brand-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm space-y-1">
        <p>${escapeHTML(text)}</p>
        <span class="block text-[9px] text-brand-200 text-right">${timeStr}</span>
      </div>
    `;
  } else {
    messageWrapper.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs shrink-0 mt-1">
        <i class="fa-solid fa-brain"></i>
      </div>
      <div class="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-slate-700 space-y-2 leading-relaxed">
        <p class="font-bold text-brand-700 flex items-center gap-1.5">
          <i class="fa-solid fa-sparkles text-xs"></i> NutriAssist Pro AI
        </p>
        <div>${text}</div>
        <span class="block text-[9px] text-slate-400 text-right">${timeStr}</span>
      </div>
    `;
  }

  messagesContainer.appendChild(messageWrapper);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function appendTypingIndicator() {
  const messagesContainer = document.getElementById('chatMessages');
  const typingId = 'typing_' + Date.now();

  const typingWrapper = document.createElement('div');
  typingWrapper.id = typingId;
  typingWrapper.className = 'flex items-start gap-2 max-w-[85%]';
  typingWrapper.innerHTML = `
    <div class="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs shrink-0 mt-1">
      <i class="fa-solid fa-brain"></i>
    </div>
    <div class="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-slate-400 flex items-center gap-1">
      <span class="animate-bounce">●</span>
      <span class="animate-bounce delay-100">●</span>
      <span class="animate-bounce delay-200">●</span>
    </div>
  `;

  messagesContainer.appendChild(typingWrapper);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return typingId;
}

function removeTypingIndicator(id) {
  document.getElementById(id)?.remove();
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
      <p>Hello! 👋 Welcome to the <strong>Nutrition & Healthy Food Awareness System</strong> (Team 18 / G18 • SDG 3)!</p>
      <p class="mt-1">I am your official assistant aligned with our project document. Ask me about <strong>Team 18</strong>, <em>SDG 3</em>, <em>Problem Statement</em>, <em>10 Features</em>, <em>Canteen Swaps</em>, <em>Food Label Guide</em>, <em>Survey Results</em>, or <em>Plate Portions</em>!</p>
      <div class="pt-2 flex flex-wrap gap-1.5">
        <button onclick="sendQuickPrompt('Tell me about Team 18 and SDG 3')" class="bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-700/50 px-2.5 py-1 rounded-xl text-[10px]">👥 Team 18 & SDG 3</button>
        <button onclick="sendQuickPrompt('What is the Problem Statement and Mission?')" class="bg-sky-950/80 text-sky-300 hover:bg-sky-900 border border-sky-700/50 px-2.5 py-1 rounded-xl text-[10px]">🎯 Problem & Mission</button>
      </div>
    `;
  }

  // 1b. No Login or Registration Required Notice
  if (q.includes('register') || q.includes('registration') || q.includes('sign in') || q.includes('log in') || q.includes('login') || q.includes('create account') || q.includes('google account') || q.includes('portal') || q.includes('password')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-unlock-keyhole text-emerald-400"></i> Open Access Platform (No Login Required)
        </h5>
        <p class="text-slate-300">
          The login portal has been <strong>completely removed</strong>! NutriAware is now 100% open-access. You don't need to register or sign in to explore any feature.
        </p>
        <p class="text-emerald-300 font-semibold">You have immediate access to:</p>
        <ul class="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
          <li><strong>Canteen Nutrition Guide &amp; Swaps</strong></li>
          <li><strong>Food Comparison Side-by-Side Tool</strong></li>
          <li><strong>Interactive Student Survey</strong></li>
          <li><strong>Daily Hydration &amp; Water Tracker</strong></li>
          <li><strong>30-Question Nutrition Quiz &amp; Certificates</strong></li>
        </ul>
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
        <p class="text-slate-300">The Admin Panel option has been completely removed from the platform. The platform is now fully accessible directly without any login credentials.</p>
      </div>
    `;
  }

  // 2. Team 18 / G18 & SDG 3
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
        <p class="text-[11px] text-slate-400">Institution: Sanjivani University, Department of Integrated MTech AI & ML.</p>
      </div>
    `;
  }

  // 3. Problem Statement & Brainstorming Pain Points
  if (q.includes('problem') || q.includes('problem statement') || q.includes('brainstorm') || q.includes('pain point') || q.includes('selected problem')) {
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
            <li>1. Junk food reliance due to convenience & schedules.</li>
            <li>2. Lack of understanding about balanced diets.</li>
            <li>3. Difficulty reading and interpreting packaged food nutrition labels.</li>
            <li>4. Limited healthy choices in college canteens and messes.</li>
            <li>5. Skipping meals & irregular eating routines.</li>
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
  if (q.includes('who') && (q.includes('what') || q.includes('why')) || q.includes('diagnostic') || q.includes('framework')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-sitemap text-teal-400"></i> WHO • WHAT • WHY Framework (Page 1)
        </h5>
        <div class="space-y-1.5 text-slate-300">
          <div class="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span class="text-emerald-400 font-bold uppercase text-[10px]">WHO (Stakeholders):</span>
            <p class="text-[11px]">College & university students, young adults living in hostels/PGs, canteen operators, mess managers, and youth in transition to independent living.</p>
          </div>
          <div class="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span class="text-amber-400 font-bold uppercase text-[10px]">WHAT (The Challenge):</span>
            <p class="text-[11px]">Lack of practical nutrition awareness, confusion decoding packaged labels, default reliance on high-sugar & fried foods, and no simple mechanism to balance canteen meals.</p>
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
          <i class="fa-solid fa-bullseye text-rose-400"></i> Mission Statement & Value Proposition
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

  // 8. Student Survey Results (Page 2)
  if (q.includes('survey') || q.includes('question') || q.includes('research') || q.includes('survey result')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-square-poll-vertical text-purple-400"></i> Student Survey Insights (PDF Page 2)
        </h5>
        <p class="text-slate-300">5 Survey Questions &amp; Expected Analysis:</p>
        <ul class="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
          <li><strong>Q1 Balanced Meals:</strong> >70% of students struggle to determine if their daily meals are balanced.</li>
          <li><strong>Q2 Food Labels:</strong> >65% find packaged food labels confusing and difficult to interpret.</li>
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

  // 9. Stakeholder Benefits
  if (q.includes('benefit') || q.includes('stakeholder') || q.includes('parent') || q.includes('college')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-award text-amber-400"></i> Stakeholder Benefits (PDF Page 2 & 3)
        </h5>
        <div class="space-y-1.5 text-[11px] text-slate-300">
          <div class="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <strong class="text-emerald-400">👨‍🎓 For Students:</strong> Better energy, sharper academic focus, sustainable lifelong dietary habits, and immunity boost.
          </div>
          <div class="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <strong class="text-sky-400">🏫 For Colleges & Canteens:</strong> Healthier campus dining culture, demand data for nutritious meal items, improved student well-being.
          </div>
          <div class="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <strong class="text-purple-400">👨‍👩‍👧 For Parents:</strong> Peace of mind knowing their children have reliable guidance for hostel dining nutrition.
          </div>
        </div>
      </div>
    `;
  }

  // 10. Future Scope & Conclusion
  if (q.includes('future') || q.includes('scope') || q.includes('conclusion') || q.includes('roadmap')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-rocket text-indigo-400"></i> Future Scope & Conclusion (Page 3)
        </h5>
        <ul class="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
          <li><strong>AI Smart Recommendations:</strong> Deep learning model tailored to regional Indian student diets.</li>
          <li><strong>Personalized Meal Planning:</strong> Budget-conscious hostel grocery and mess meal planners.</li>
          <li><strong>Campus Canteen Rating:</strong> Student-driven digital nutrition scorecards for cafeteria menus.</li>
          <li><strong>Smartwatch Sync:</strong> Automatic synchronization with fitness wearables.</li>
        </ul>
        <div class="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-200">
          <strong>Conclusion:</strong> NutriAware directly advances <em>SDG 3 (Good Health and Well-Being)</em> by shifting youth dining from reactive illness treatment to proactive nutritional literacy.
        </div>
      </div>
    `;
  }

  // 11. Canteen Swaps & Food Label Guidance
  if (q.includes('swap') || q.includes('canteen') || q.includes('mess') || q.includes('samosa') || q.includes('sprout') || q.includes('chaas') || q.includes('poha')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-utensils text-emerald-400"></i> Top Canteen Healthy Swaps
        </h5>
        <div class="space-y-1 text-[11px] text-slate-300">
          <p>🥟 <strong>Samosa (262 kcal, 17g fat)</strong> ➡️ <strong>Sprouted Moong Salad (145 kcal, 12g protein)</strong></p>
          <p>🍜 <strong>Instant Noodles (380 kcal, 980mg sodium)</strong> ➡️ <strong>Veggie Poha (180 kcal, 4g fiber)</strong></p>
          <p>🥤 <strong>Sugary Cola (140 kcal, 39g sugar)</strong> ➡️ <strong>Spiced Chaas (45 kcal, natural probiotic)</strong></p>
        </div>
        <button onclick="switchTab('canteen')" class="w-full mt-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-xl transition text-[11px]">
          🥗 Open Canteen Guide Tab
        </button>
      </div>
    `;
  }

  if (q.includes('label') || q.includes('sugar') || q.includes('sodium') || q.includes('trans fat')) {
    return `
      <div class="space-y-2 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5 text-sm">
          <i class="fa-solid fa-tag text-amber-400"></i> Food Label Quick Tips (Feature 3)
        </h5>
        <ul class="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
          <li><strong>Check Serving Size:</strong> Packets often hide high calories by splitting into 3 servings.</li>
          <li><strong>5/20 Rule:</strong> 5% DV or less is LOW; 20% DV or more is HIGH.</li>
          <li><strong>Sodium Warning:</strong> Keep single snack under 200mg sodium (Daily max: 2,000mg).</li>
          <li><strong>Added Sugars:</strong> WHO cap is 25g/day. One soda has 39g!</li>
        </ul>
        <button onclick="switchTab('canteen')" class="w-full mt-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 rounded-xl transition text-[11px]">
          🏷️ Open Interactive Label Decoder
        </button>
      </div>
    `;
  }

  // 12. Tech Stack
  if (q.includes('tech') || q.includes('technology') || q.includes('stack') || q.includes('tensorflow') || q.includes('flutter') || q.includes('node') || q.includes('python')) {
    return `
      <div class="space-y-1.5 text-xs">
        <h5 class="font-bold text-white flex items-center gap-1.5">
          <i class="fa-solid fa-microchip text-sky-400"></i> Technology Stack
        </h5>
        <ul class="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
          <li><strong>UI Frontend:</strong> Flutter (Mobile) + Modern HTML5/Tailwind Web Portal</li>
          <li><strong>Backend Services:</strong> Node.js, Express &amp; Supabase Cloud Auth</li>
          <li><strong>Database:</strong> Cloud PostgreSQL (Supabase) / MySQL / Firestore</li>
          <li><strong>AI Engine:</strong> Python with TensorFlow (CNN / Transfer Learning)</li>
        </ul>
      </div>
    `;
  }

  // Fallback Catch-All
  return `
    <div class="space-y-1.5 text-xs text-slate-300">
      <p class="text-white font-bold">NutriAssist AI • Team 18 (G18) • SDG 3</p>
      <p>I can help answer questions from our official project specification document:</p>
      <ul class="list-disc pl-4 space-y-0.5 text-[11px] text-slate-400">
        <li><strong>Team 18 &amp; SDG 3</strong> (Team members &amp; University info)</li>
        <li><strong>Problem Statement &amp; Mission</strong> (6 pain points &amp; WHO-WHAT-WHY)</li>
        <li><strong>10 Core Features</strong> (Detailed specifications)</li>
        <li><strong>Canteen Swaps &amp; Food Labels</strong> (Practical dining advice)</li>
        <li><strong>Student Survey Results</strong> (5 questions &amp; expected analysis)</li>
        <li><strong>Login &amp; Registration</strong> (Secure authentication guide)</li>
      </ul>
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
      <strong class="text-emerald-400">${Math.abs(fatDiff)}g of total fats</strong>, and provides 
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

  if (!valEl || !barEl || !pctEl) return;

  valEl.textContent = currentWaterIntake;
  const pct = Math.round((currentWaterIntake / targetWaterIntake) * 100);
  barEl.style.width = `${pct}%`;
  pctEl.textContent = `${pct}% Goal Reached`;
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
