/**
 * NutriAware - Smart Nutrition Awareness Platform
 * Front-end Logic & Interactive Features
 * Presented by Integrated MTech AIML, Sanjivani University
 * UI/UX Design System strictly enforced (Green & White Theme)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initProgressChart();
});

/* ==========================================================================
   1. MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}


/* ==========================================================================
   2. AI FOOD SCANNER MODAL & SIMULATION
   ========================================================================== */
function openScannerModal() {
  const modal = document.getElementById('scannerModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeScannerModal() {
  const modal = document.getElementById('scannerModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function selectSampleFood(name, cals, prot, carbs, fats, grade, tip) {
  const scanLine = document.getElementById('scanLine');
  const initialState = document.getElementById('scanInitialState');
  const resultsState = document.getElementById('scanResultsState');

  if (!initialState || !resultsState || !scanLine) return;

  // Show scanline animation
  scanLine.classList.remove('hidden');
  initialState.classList.add('hidden');

  /* BACKEND HANDOFF HOOK: 
   * Integrate Python TensorFlow model endpoint here (e.g., fetch('http://localhost:5000/api/predict-image', { body: formData }))
   */

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
  }, 1200);
}


/* ==========================================================================
   3. FLOATING AI CHATBOT WIDGET ("NutriAssist AI")
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

  // Append User Message Bubble
  appendChatMessage('user', userQuery);
  input.value = '';

  // Append Typing Indicator
  const typingId = appendTypingIndicator();

  /* BACKEND HANDOFF HOOK:
   * Node.js & Firebase endpoint integration point:
   * 
   * async function sendToBackend(message) {
   *   const res = await fetch('https://your-firebase-node-backend.cloudfunctions.net/nutriChat', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({ message: message, userId: firebase.auth().currentUser.uid })
   *   });
   *   return await res.json();
   * }
   */

  // Simulate AI Response Engine
  setTimeout(() => {
    removeTypingIndicator(typingId);
    const aiResponse = generateNutriAIResponse(userQuery);
    appendChatMessage('ai', aiResponse);
  }, 1000);
}

function appendChatMessage(sender, text) {
  const messagesContainer = document.getElementById('chatMessages');
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const messageWrapper = document.createElement('div');
  messageWrapper.className = `flex items-start gap-2 max-w-[85%] ${sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`;

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
        <i class="fa-solid fa-leaf"></i>
      </div>
      <div class="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-slate-700 space-y-1">
        <p class="font-bold text-brand-700">NutriAssist AI</p>
        <p>${escapeHTML(text)}</p>
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
      <i class="fa-solid fa-leaf"></i>
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
  const el = document.getElementById(id);
  if (el) el.remove();
}

function generateNutriAIResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('dorm') || q.includes('budget') || q.includes('snack')) {
    return "Great question! Top budget-friendly student snacks include Greek yogurt with almonds, peanut butter on banana slices, or roasted chickpeas. High protein, affordable, and keeps focus high during study hours!";
  } else if (q.includes('avocado') || q.includes('toast')) {
    return "Avocado toast provides excellent healthy monounsaturated fats and fiber (~300-400 kcal per serving). To boost protein, top it with a poached egg or hemp seeds!";
  } else if (q.includes('protein') || q.includes('muscle')) {
    return "For active students, target 1.2 to 2.0g of protein per kg of body weight daily. Great sources include eggs, lentils, tofu, chicken breast, and cottage cheese.";
  } else if (q.includes('water') || q.includes('hydrate')) {
    return "Aim for at least 2.5 Liters of water daily! Proper hydration reduces fatigue during lectures and improves mental performance.";
  } else {
    return `Thanks for asking! As an AI nutrition assistant, I recommend focusing on whole foods, balanced macros (40% carbs, 30% protein, 30% healthy fats), and staying hydrated. Need specific meal swap ideas for "${query}"?`;
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}


/* ==========================================================================
   4. INTERACTIVE QUIZ LOGIC
   ========================================================================== */
const quizData = [
  {
    q: "Q1: Which macronutrient is the body's primary quick energy source?",
    options: ["A) Proteins", "B) Carbohydrates", "C) Dietary Fats"],
    answer: 1,
    tip: "Correct! Carbohydrates break down into glucose, the primary fuel source for your brain and muscles."
  },
  {
    q: "Q2: Which vitamin synthesized from sunlight is crucial for bone health and immunity?",
    options: ["A) Vitamin D", "B) Vitamin C", "C) Vitamin B12"],
    answer: 0,
    tip: "Spot on! Vitamin D helps absorb calcium and supports immune system strength."
  },
  {
    q: "Q3: What is the recommended minimum daily water intake for adults?",
    options: ["A) 1.0 Liters", "B) 2.5 Liters", "C) 5.0 Liters"],
    answer: 1,
    tip: "Correct! 2.5L (approx 8-10 glasses) maintains optimal cognitive function and digestion."
  }
];

let currentQuizIndex = 0;
let userQuizScore = 0;

function answerQuiz(optionIndex) {
  const current = quizData[currentQuizIndex];
  const feedbackEl = document.getElementById('quizFeedback');
  const scoreEl = document.getElementById('quizScore');

  if (!feedbackEl || !scoreEl) return;

  if (optionIndex === current.answer) {
    userQuizScore++;
    feedbackEl.className = 'p-3 rounded-xl text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300';
    feedbackEl.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i> ${current.tip}`;
  } else {
    feedbackEl.className = 'p-3 rounded-xl text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300';
    feedbackEl.innerHTML = `<i class="fa-solid fa-circle-xmark text-amber-600 mr-1"></i> Incorrect. ${current.tip}`;
  }

  feedbackEl.classList.remove('hidden');
  scoreEl.textContent = `Score: ${userQuizScore}/3`;

  setTimeout(() => {
    currentQuizIndex++;
    if (currentQuizIndex < quizData.length) {
      renderQuizQuestion();
    } else {
      renderQuizFinish();
    }
  }, 2200);
}

function renderQuizQuestion() {
  const qObj = quizData[currentQuizIndex];
  const qText = document.getElementById('quizQuestion');
  const optionsDiv = document.getElementById('quizOptions');
  const feedbackEl = document.getElementById('quizFeedback');

  if (!qText || !optionsDiv) return;

  feedbackEl.classList.add('hidden');
  qText.textContent = qObj.q;

  optionsDiv.innerHTML = qObj.options.map((opt, i) => `
    <button onclick="answerQuiz(${i})" class="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-sm font-semibold transition">
      ${opt}
    </button>
  `).join('');
}

function renderQuizFinish() {
  const container = document.getElementById('quizContainer');
  if (container) {
    container.innerHTML = `
      <div class="text-center py-6 space-y-3">
        <div class="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-3xl mx-auto">
          🏆
        </div>
        <h4 class="font-bold text-lg text-slate-900">Quiz Completed!</h4>
        <p class="text-xs text-slate-600">You scored <span class="font-bold text-brand-700 text-sm">${userQuizScore} out of 3</span> in Nutrition Literacy.</p>
        <button onclick="resetQuiz()" class="bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-brand-700 transition">
          Take Quiz Again
        </button>
      </div>
    `;
  }
}

function resetQuiz() {
  currentQuizIndex = 0;
  userQuizScore = 0;
  document.getElementById('quizScore').textContent = 'Score: 0/3';
  const container = document.getElementById('quizContainer');
  container.innerHTML = `
    <p id="quizQuestion" class="font-bold text-slate-800 text-base"></p>
    <div id="quizOptions" class="space-y-2"></div>
    <div id="quizFeedback" class="hidden p-3 rounded-xl text-xs font-semibold"></div>
  `;
  renderQuizQuestion();
}


/* ==========================================================================
   5. WATER REMINDER / TRACKER LOGIC
   ========================================================================== */
let currentWaterIntake = 1250;
const targetWaterIntake = 2500;

function addWater(amount) {
  currentWaterIntake = Math.min(targetWaterIntake, currentWaterIntake + amount);
  updateWaterUI();
}

function resetWater() {
  currentWaterIntake = 0;
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


/* ==========================================================================
   6. PROGRESS DASHBOARD CHART (Chart.js Integration)
   ========================================================================== */
function initProgressChart() {
  const canvas = document.getElementById('macroChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Protein (g)',
          data: [75, 82, 90, 88, 95, 100, 85],
          backgroundColor: '#059669',
          borderRadius: 8
        },
        {
          label: 'Carbs (g)',
          data: [210, 190, 230, 205, 220, 240, 200],
          backgroundColor: '#34d399',
          borderRadius: 8
        },
        {
          label: 'Healthy Fats (g)',
          data: [55, 60, 50, 65, 58, 62, 54],
          backgroundColor: '#a7f3d0',
          borderRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: '#064e3b',
          titleFont: { family: 'Outfit', size: 14 },
          bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
          padding: 12,
          cornerRadius: 12
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Plus Jakarta Sans', weight: '600' } }
        },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: { font: { family: 'Plus Jakarta Sans', weight: '600' } }
        }
      }
    }
  });
}
