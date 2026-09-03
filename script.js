/**
 * NutriAware - Smart Nutrition Awareness Platform
 * Front-end Logic, Authentication Portal, Tab Navigation & 30-Question Quiz Engine
 * Presented by Integrated MTech AIML, Sanjivani University
 * Lead Developer: @shreyasshinde619
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initProgressChart();
  initQuizPortal();
  registerPWA();
  
  // Check if session exists (default launch show login portal)
  const isLoggedIn = sessionStorage.getItem('nutriaware_logged_in');
  if (isLoggedIn === 'true') {
    showMainApp();
  } else {
    showLoginPortal();
  }
});

/* Service Worker Registration for PWA & Play Store / App Store Support */
function registerPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((err) => console.log('SW Registration Failed:', err));
    });
  }
}

/* ==========================================================================
   1. AUTHENTICATION & LOGIN PORTAL LOGIC
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

function handleLoginSubmit(event) {
  event.preventDefault();
  const emailInput = document.getElementById('loginEmail')?.value || 'student@sanjivani.edu.in';
  setLoggedInUser(emailInput.split('@')[0]);
  showMainApp();
}

function handleGoogleLogin() {
  setLoggedInUser('shreyasshinde619 (Google Account)');
  showMainApp();
}

function handleGuestLogin() {
  setLoggedInUser('Sanjivani Student (Guest)');
  showMainApp();
}

function handleLogout() {
  sessionStorage.removeItem('nutriaware_logged_in');
  showLoginPortal();
}

function setLoggedInUser(name) {
  const nameEls = document.querySelectorAll('.user-display-name');
  nameEls.forEach(el => el.textContent = name);
}


/* ==========================================================================
   2. DEDICATED SEPARATE DASHBOARD TABS NAVIGATION
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
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}


/* ==========================================================================
   3. AI FOOD SCANNER MODAL & SIMULATION (100% Beef-Free Clean Food Options)
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
  }, 1200);
}


/* ==========================================================================
   4. FLOATING AI CHATBOT WIDGET ("NutriAssist AI") - 15+ DIET RECIPES
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
  }, 800);
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
        <i class="fa-solid fa-leaf"></i>
      </div>
      <div class="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-slate-700 space-y-2 leading-relaxed">
        <p class="font-bold text-brand-700 flex items-center gap-1.5">
          <i class="fa-solid fa-utensils text-xs"></i> NutriAssist AI Recipe Engine
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

const dietRecipes = {
  banana_shake: `
    <div class="space-y-1.5">
      <h5 class="font-bold text-slate-900 text-sm">🍌 High-Protein Banana Peanut Butter Shake</h5>
      <p class="text-xs text-brand-700 font-semibold">Macros: 380 kcal | Protein: 18g | Carbs: 52g | Fats: 12g</p>
      <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
        <strong class="block text-slate-800">Ingredients:</strong>
        • 1 medium ripe banana<br/>
        • 1 cup low-fat milk (or almond milk)<br/>
        • 1 tbsp natural peanut butter<br/>
        • 2 tbsp rolled oats<br/>
        • 1 tsp honey or chia seeds (optional)
      </div>
      <p class="text-xs"><strong>Steps:</strong> Blend all ingredients in a high-speed blender for 45 seconds until creamy. Serve chilled post-workout or for breakfast!</p>
    </div>
  `,

  oats_porridge: `
    <div class="space-y-1.5">
      <h5 class="font-bold text-slate-900 text-sm">🥣 Nutritious Protein Oats Porridge</h5>
      <p class="text-xs text-brand-700 font-semibold">Macros: 290 kcal | Protein: 12g | Carbs: 45g | Fats: 6g</p>
      <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
        <strong class="block text-slate-800">Ingredients:</strong>
        • 1/2 cup rolled oats<br/>
        • 1 cup water/skim milk<br/>
        • 1 tbsp chia seeds<br/>
        • 1/2 sliced apple or fresh blueberries<br/>
        • Pinch of cinnamon powder
      </div>
      <p class="text-xs"><strong>Steps:</strong> Simmer oats in milk/water for 5-7 minutes. Stir in cinnamon & chia seeds. Top with fruits!</p>
    </div>
  `,

  moong_chilla: `
    <div class="space-y-1.5">
      <h5 class="font-bold text-slate-900 text-sm">🥞 High-Fiber Moong Dal Veggie Chilla</h5>
      <p class="text-xs text-brand-700 font-semibold">Macros: 220 kcal | Protein: 14g | Carbs: 32g | Fats: 4g</p>
      <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
        <strong class="block text-slate-800">Ingredients:</strong>
        • 1 cup soaked yellow moong dal (blended into batter)<br/>
        • Finely chopped spinach, onion & coriander<br/>
        • 50g grated low-fat paneer<br/>
        • 1/2 tsp cumin & turmeric
      </div>
      <p class="text-xs"><strong>Steps:</strong> Spread batter on a non-stick tawa, sprinkle chopped veggies & paneer, cook with 1/2 tsp olive oil until golden brown.</p>
    </div>
  `,

  sprouted_salad: `
    <div class="space-y-1.5">
      <h5 class="font-bold text-slate-900 text-sm">🥗 Sprouted Moong & Chickpea Protein Salad</h5>
      <p class="text-xs text-brand-700 font-semibold">Macros: 190 kcal | Protein: 13g | Carbs: 30g | Fats: 2.5g</p>
      <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
        <strong class="block text-slate-800">Ingredients:</strong>
        • 1 cup sprouted green moong & boiled chickpeas<br/>
        • 1/2 chopped cucumber, tomato & onion<br/>
        • 1 tbsp lemon juice & chaat masala
      </div>
      <p class="text-xs"><strong>Steps:</strong> Toss all ingredients in a bowl. Refreshing, crisp, and loaded with digestive enzymes!</p>
    </div>
  `
};

function generateNutriAIResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('banana') || q.includes('shake')) {
    return dietRecipes.banana_shake;
  } else if (q.includes('oat') || q.includes('porridge')) {
    return dietRecipes.oats_porridge;
  } else if (q.includes('chilla') || q.includes('moong dal')) {
    return dietRecipes.moong_chilla;
  } else if (q.includes('sprout') || q.includes('chickpea salad')) {
    return dietRecipes.sprouted_salad;
  } else {
    return `
      <p>I can help you prepare healthy diet meals! Type <strong>"Banana Shake"</strong>, <strong>"Oats"</strong>, <strong>"Moong Chilla"</strong>, or explore our dedicated <strong>Diet Recipes Tab</strong>!</p>
    `;
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

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
        <p class="font-bold text-slate-800">Presented by Integrated MTech AIML</p>
        <p class="text-slate-500">Sanjivani University | Lead: @shreyasshinde619</p>
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
