/**
 * NutriAware - Smart Nutrition Platform v3.0 (Cinematic 3D & AI Vision Edition)
 * Three.js 3D Engine, Google Account Chooser, WebRTC Live Camera Vision AI & Smart Chatbot
 * Lead Developer: @shreyasshinde619
 */

document.addEventListener('DOMContentLoaded', () => {
  init3DBackground();
  initMobileMenu();
  initProgressChart();
  initQuizPortal();
  registerPWA();
  initNotificationSystem();
  
  // Check session login state
  const isLoggedIn = sessionStorage.getItem('nutriaware_logged_in');
  const storedUser = sessionStorage.getItem('nutriaware_user_name');
  if (isLoggedIn === 'true') {
    if (storedUser) setLoggedInUser(storedUser);
    showMainApp();
  } else {
    showLoginPortal();
  }
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
   1. THREE.JS 3D CINEMATIC BACKGROUND & HERO PORTAL ENGINE
   ========================================================================== */
let scene3d, camera3d, renderer3d, particleSystem, orbMesh;

function init3DBackground() {
  const canvas = document.getElementById('bg3dCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  scene3d = new THREE.Scene();
  camera3d = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera3d.position.z = 30;

  renderer3d = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer3d.setSize(window.innerWidth, window.innerHeight);
  renderer3d.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create 3D Glowing Particle Network
  const particleCount = 180;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color('#10b981');
  const color2 = new THREE.Color('#34d399');

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 80;
    positions[i + 1] = (Math.random() - 0.5) * 80;
    positions[i + 2] = (Math.random() - 0.5) * 60;

    const mixedColor = Math.random() > 0.5 ? color1 : color2;
    colors[i] = mixedColor.r;
    colors[i + 1] = mixedColor.g;
    colors[i + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });

  particleSystem = new THREE.Points(geometry, material);
  scene3d.add(particleSystem);

  // Rotating Wireframe Icosahedron (Floating Health Core)
  const orbGeo = new THREE.IcosahedronGeometry(8, 2);
  const orbMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  orbMesh = new THREE.Mesh(orbGeo, orbMat);
  orbMesh.position.set(15, -5, -10);
  scene3d.add(orbMesh);

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    if (particleSystem) {
      particleSystem.rotation.y += 0.0008;
      particleSystem.rotation.x += 0.0004;
    }
    if (orbMesh) {
      orbMesh.rotation.x += 0.003;
      orbMesh.rotation.y += 0.005;
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
   2. AUTHENTICATION, REGISTER & PROFESSIONAL GOOGLE ACCOUNT PICKER
   ========================================================================== */
function showLoginPortal() {
  document.getElementById('loginPortal')?.classList.remove('hidden');
  document.getElementById('mainApp')?.classList.add('hidden');
}

function showMainApp() {
  document.getElementById('loginPortal')?.classList.add('hidden');
  document.getElementById('mainApp')?.classList.remove('hidden');
  sessionStorage.setItem('nutriaware_logged_in', 'true');
  switchTab('home');
}

function switchAuthTab(mode) {
  const loginForm = document.getElementById('loginFormContainer');
  const registerForm = document.getElementById('registerFormContainer');
  const tabLoginBtn = document.getElementById('tabAuthLogin');
  const tabRegisterBtn = document.getElementById('tabAuthRegister');

  if (mode === 'register') {
    loginForm?.classList.add('hidden');
    registerForm?.classList.remove('hidden');
    tabLoginBtn?.classList.remove('border-b-2', 'border-brand-600', 'text-brand-600', 'font-extrabold');
    tabLoginBtn?.classList.add('text-slate-400');
    tabRegisterBtn?.classList.add('border-b-2', 'border-brand-600', 'text-brand-600', 'font-extrabold');
    tabRegisterBtn?.classList.remove('text-slate-400');
  } else {
    registerForm?.classList.add('hidden');
    loginForm?.classList.remove('hidden');
    tabRegisterBtn?.classList.remove('border-b-2', 'border-brand-600', 'text-brand-600', 'font-extrabold');
    tabRegisterBtn?.classList.add('text-slate-400');
    tabLoginBtn?.classList.add('border-b-2', 'border-brand-600', 'text-brand-600', 'font-extrabold');
    tabLoginBtn?.classList.remove('text-slate-400');
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const emailInput = document.getElementById('loginEmail')?.value || 'user@example.com';
  const displayName = emailInput.split('@')[0];
  setLoggedInUser(displayName);
  showMainApp();
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  const nameInput = document.getElementById('regName')?.value || 'New User';
  showToastNotification('🎉 Account Created!', `Welcome to NutriAware, ${nameInput}! Registration complete.`);
  setLoggedInUser(nameInput);
  showMainApp();
}

// Google Account Picker Modal Trigger
function openGoogleAccountPicker() {
  const modal = document.getElementById('googleAccountPickerModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeGoogleAccountPicker() {
  const modal = document.getElementById('googleAccountPickerModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function selectGoogleAccount(email, name) {
  const statusBox = document.getElementById('googleSigningState');
  const accountsBox = document.getElementById('googleAccountsList');

  if (statusBox && accountsBox) {
    accountsBox.classList.add('hidden');
    statusBox.classList.remove('hidden');
    document.getElementById('signingEmailText').textContent = email;

    setTimeout(() => {
      closeGoogleAccountPicker();
      accountsBox.classList.remove('hidden');
      statusBox.classList.add('hidden');
      setLoggedInUser(name);
      showToastNotification('⚡ Google Authentication', `Signed in successfully as ${name}`);
      showMainApp();
    }, 1200);
  }
}

function handleGuestLogin() {
  setLoggedInUser('Guest Student');
  showMainApp();
}

function handleLogout() {
  sessionStorage.removeItem('nutriaware_logged_in');
  sessionStorage.removeItem('nutriaware_user_name');
  showLoginPortal();
}

function setLoggedInUser(name) {
  sessionStorage.setItem('nutriaware_user_name', name);
  const nameEls = document.querySelectorAll('.user-display-name');
  nameEls.forEach(el => el.textContent = name);
}


/* ==========================================================================
   3. LIVE CAMERA ACCESS (WEBRTC) & AI VISION MEAL RECOGNITION
   ========================================================================== */
let mediaStream = null;

async function startLiveCamera() {
  const videoEl = document.getElementById('webcamVideo');
  const initBox = document.getElementById('scanInitialState');
  const resultsBox = document.getElementById('scanResultsState');
  const camBtn = document.getElementById('startCamBtn');
  const capBtn = document.getElementById('captureCamBtn');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showToastNotification('⚠️ Camera Access Failed', 'Webcam is not supported on this browser context.');
    return;
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
    });

    if (videoEl) {
      videoEl.srcObject = mediaStream;
      videoEl.classList.remove('hidden');
      initBox?.classList.add('hidden');
      resultsBox?.classList.add('hidden');
      camBtn?.classList.add('hidden');
      capBtn?.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Camera Error:', err);
    showToastNotification('⚠️ Camera Permission Denied', 'Please allow camera permission in browser settings.');
  }
}

function stopLiveCamera() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  document.getElementById('webcamVideo')?.classList.add('hidden');
  document.getElementById('startCamBtn')?.classList.remove('hidden');
  document.getElementById('captureCamBtn')?.classList.add('hidden');
}

function captureAndAnalyzeCamera() {
  const videoEl = document.getElementById('webcamVideo');
  const canvasEl = document.getElementById('snapshotCanvas');

  if (!videoEl || !canvasEl) return;

  const ctx = canvasEl.getContext('2d');
  canvasEl.width = videoEl.videoWidth || 640;
  canvasEl.height = videoEl.videoHeight || 480;
  ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

  stopLiveCamera();

  // Analyze canvas snapshot pixel data
  const imageData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
  const detected = classifyImageData(imageData);

  selectSampleFood(detected.name, detected.cals, detected.prot, detected.carbs, detected.fats, detected.grade, detected.tip);
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvasEl = document.getElementById('snapshotCanvas');
      const ctx = canvasEl.getContext('2d');
      canvasEl.width = img.width;
      canvasEl.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const detected = classifyImageData(imageData);
      selectSampleFood(detected.name, detected.cals, detected.prot, detected.carbs, detected.fats, detected.grade, detected.tip);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Client-side Vision AI Pixel Classifier
function classifyImageData(imageData) {
  const data = imageData.data;
  let rSum = 0, gSum = 0, bSum = 0;
  const totalPixels = data.length / 4;

  for (let i = 0; i < data.length; i += 16) {
    rSum += data[i];
    gSum += data[i + 1];
    bSum += data[i + 2];
  }

  const rAvg = rSum / (totalPixels / 4);
  const gAvg = gSum / (totalPixels / 4);
  const bAvg = bSum / (totalPixels / 4);

  // Classification heuristic based on color dominance & brightness
  if (gAvg > rAvg && gAvg > bAvg) {
    return { name: "Green Garden Avocado Salad", cals: 390, prot: "16g", carbs: "38g", fats: "18g", grade: "A+", tip: "Rich in chlorophyll, fiber, and healthy Omega-3 fats!" };
  } else if (rAvg > 140 && gAvg > 100 && bAvg < 90) {
    return { name: "Veggie Protein Burger", cals: 460, prot: "22g", carbs: "52g", fats: "14g", grade: "B+", tip: "Swap refined bun for Whole Wheat or Multigrain Bun." };
  } else if (rAvg > 130 && bAvg > 110 && gAvg < 110) {
    return { name: "Berry Antioxidant Yogurt Bowl", cals: 280, prot: "15g", carbs: "34g", fats: "5g", grade: "A", tip: "Probiotics in yogurt enhance gut health & immunity." };
  } else {
    return { name: "Quinoa & Roasted Veggie Grain Bowl", cals: 480, prot: "24g", carbs: "62g", fats: "11g", grade: "A+", tip: "Complete protein profile with all 9 essential amino acids!" };
  }
}

function selectSampleFood(name, cals, prot, carbs, fats, grade, tip) {
  const scanLine = document.getElementById('scanLine');
  const initialState = document.getElementById('scanInitialState');
  const resultsState = document.getElementById('scanResultsState');

  if (!initialState || !resultsState || !scanLine) return;

  scanLine.classList.remove('hidden');
  initialState.classList.add('hidden');

  setTimeout(() => {
    scanLine.classList.add('hidden');
    resultsState.classList.remove('hidden');

    document.getElementById('detectedFoodName').textContent = name;
    document.getElementById('detectedGrade').textContent = `NutriScore: Grade ${grade}`;
    document.getElementById('detectedCals').textContent = `${cals} kcal`;
    document.getElementById('detectedProt').textContent = prot;
    document.getElementById('detectedCarbs').textContent = carbs;
    document.getElementById('detectedFats').textContent = fats;
    document.getElementById('detectedTip').textContent = `Smart Alternative Swap: ${tip}`;
  }, 1000);
}


/* ==========================================================================
   4. DAILY PROTEIN & WATER NOTIFICATION SYSTEM
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
   5. SEPARATE DASHBOARD TABS NAVIGATION
   ========================================================================== */
function switchTab(tabId) {
  const tabs = ['home', 'scanner', 'recipes', 'quizzes', 'tracker', 'dashboard'];
  
  tabs.forEach(t => {
    const pageEl = document.getElementById(`view-${t}`);
    const navBtn = document.getElementById(`nav-link-${t}`);
    const mobileBtn = document.getElementById(`mobile-link-${t}`);

    if (t === tabId) {
      pageEl?.classList.remove('hidden');
      navBtn?.classList.add('text-brand-600', 'border-b-2', 'border-brand-600', 'bg-brand-50/50');
      navBtn?.classList.remove('text-slate-600');
      mobileBtn?.classList.add('text-brand-600', 'font-bold', 'bg-brand-50');
    } else {
      pageEl?.classList.add('hidden');
      navBtn?.classList.remove('text-brand-600', 'border-b-2', 'border-brand-600', 'bg-brand-50/50');
      navBtn?.classList.add('text-slate-600');
      mobileBtn?.classList.remove('text-brand-600', 'font-bold', 'bg-brand-50');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

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
   6. ADVANCED SMART AI CHATBOT ("NutriAssist Pro AI")
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

function generateNutriAIResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('project') || q.includes('how') && (q.includes('built') || q.includes('tech') || q.includes('developer'))) {
    return `
      <div class="space-y-1.5 text-xs">
        <h5 class="font-bold text-slate-900">💻 NutriAware Platform Architecture</h5>
        <p>NutriAware is built with high-performance web standards:</p>
        <ul class="list-disc pl-4 space-y-0.5">
          <li><strong>3D Graphics:</strong> Three.js WebGL Particle Scene</li>
          <li><strong>AI Camera Vision:</strong> HTML5 WebRTC + Canvas Histogram Classification</li>
          <li><strong>PWA:</strong> Service Workers (`sw.js`) & Green Theme Manifest</li>
          <li><strong>Styling & UI:</strong> Tailwind CSS & FontAwesome 6</li>
          <li><strong>Developer:</strong> @shreyasshinde619</li>
        </ul>
      </div>
    `;
  } else if (q.includes('banana') || q.includes('shake')) {
    return `
      <div class="space-y-1.5">
        <h5 class="font-bold text-slate-900 text-sm">🍌 High-Protein Banana Peanut Butter Shake</h5>
        <p class="text-xs text-brand-700 font-semibold">Macros: 380 kcal | Protein: 18g | Carbs: 52g | Fats: 12g</p>
        <p class="text-xs">Blend 1 ripe banana, 1 cup milk, 1 tbsp peanut butter & 2 tbsp oats for 45s!</p>
      </div>
    `;
  } else if (q.includes('oat') || q.includes('porridge')) {
    return `
      <div class="space-y-1.5">
        <h5 class="font-bold text-slate-900 text-sm">🥣 Protein Oats Porridge</h5>
        <p class="text-xs text-brand-700 font-semibold">Macros: 290 kcal | Protein: 12g | Carbs: 45g | Fats: 6g</p>
        <p class="text-xs">Simmer rolled oats in milk for 5 mins, top with chia seeds & apple slices.</p>
      </div>
    `;
  } else if (q.includes('chilla') || q.includes('moong')) {
    return `
      <div class="space-y-1.5">
        <h5 class="font-bold text-slate-900 text-sm">🥞 High-Fiber Moong Dal Veggie Chilla</h5>
        <p class="text-xs text-brand-700 font-semibold">Macros: 220 kcal | Protein: 14g | Carbs: 32g | Fats: 4g</p>
        <p class="text-xs">Spread yellow moong dal batter on tawa, top with spinach & low-fat paneer.</p>
      </div>
    `;
  } else if (q.includes('protein') || q.includes('muscle')) {
    return `
      <p>Target protein requirement for students & active adults is <strong>1.2g - 1.6g per kg of bodyweight</strong>. Best sources: Paneer, Moong Sprouts, Greek Yogurt, Oats, Lentils & Almonds!</p>
    `;
  } else if (q.includes('water') || q.includes('hydration')) {
    return `
      <p>Maintain at least <strong>2,500 ml (2.5 Liters)</strong> daily water intake! Proper hydration boosts memory retention and cognitive focus during study sessions by up to 20%.</p>
    `;
  } else {
    return `
      <p>I am <strong>NutriAssist Pro AI</strong>! You can ask me about <em>Diet Recipes</em>, <em>Protein Targets</em>, <em>Hydration Advice</em>, or <em>How NutriAware was built</em>!</p>
    `;
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}


/* ==========================================================================
   7. 30-QUESTION NUTRITION CERTIFICATION QUIZ PORTAL
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

  container.innerHTML = `
    <div class="bg-gradient-to-b from-brand-50 via-white to-emerald-50 p-8 rounded-3xl border-2 border-brand-300 text-center space-y-6 shadow-xl">
      <div class="w-20 h-20 bg-brand-600 text-white rounded-full flex items-center justify-center text-4xl mx-auto shadow-lg shadow-brand-600/30">
        🏆
      </div>
      <div class="space-y-2">
        <span class="bg-brand-100 text-brand-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          Nutrition Literacy Certificate
        </span>
        <h3 class="font-display text-3xl font-extrabold text-slate-900">Quiz Completed!</h3>
        <p class="text-sm text-slate-600">
          You scored <strong class="text-brand-700 text-lg">${quizUserScore} out of 30</strong> (${pct}% Accuracy).
        </p>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 max-w-sm mx-auto text-xs space-y-1">
        <p class="font-bold text-slate-800">NutriAware Health Platform</p>
        <p class="text-slate-500">Lead Developer: @shreyasshinde619</p>
      </div>

      <button onclick="initQuizPortal()" class="bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg transition">
        Restart 30-Question Quiz
      </button>
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
