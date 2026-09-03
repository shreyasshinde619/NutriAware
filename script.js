/**
 * NutriAware - Smart Nutrition Awareness Platform
 * Front-end Logic & Interactive Features
 * Presented by Integrated MTech AIML, Sanjivani University
 * Developer: @shreyasshinde619
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
   2. AI FOOD SCANNER MODAL & SIMULATION (100% Beef-Free Clean Food Options)
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
   3. FLOATING AI CHATBOT WIDGET ("NutriAssist AI") - 15+ DIET RECIPES
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

  // Append User Message Bubble
  appendChatMessage('user', userQuery);
  input.value = '';

  // Append Typing Indicator
  const typingId = appendTypingIndicator();

  // Simulate AI Response Engine with Recipe Database
  setTimeout(() => {
    removeTypingIndicator(typingId);
    const aiResponse = generateNutriAIResponse(userQuery);
    appendChatMessage('ai', aiResponse);
  }, 900);
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

/* 15+ HEALTHY DIET RECIPE DATABASE FOR NUTRIASSIST AI */
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
  `,

  avocado_salad: `
    <div class="space-y-1.5">
      <h5 class="font-bold text-slate-900 text-sm">🥑 Healthy Avocado & Quinoa Salad</h5>
      <p class="text-xs text-brand-700 font-semibold">Macros: 350 kcal | Protein: 10g | Carbs: 38g | Fats: 18g</p>
      <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
        <strong class="block text-slate-800">Ingredients:</strong>
        • 1/2 ripe diced avocado<br/>
        • 1/2 cup cooked quinoa<br/>
        • Cherry tomatoes & cucumber<br/>
        • Lemon-olive oil dressing
      </div>
      <p class="text-xs"><strong>Steps:</strong> Combine cooked quinoa with fresh veggies & avocado. Drizzle lemon dressing for heart-healthy fats.</p>
    </div>
  `,

  paneer_skewers: `
    <div class="space-y-1.5">
      <h5 class="font-bold text-slate-900 text-sm">🍢 Grilled Paneer & Veggie Skewers</h5>
      <p class="text-xs text-brand-700 font-semibold">Macros: 280 kcal | Protein: 20g | Carbs: 12g | Fats: 16g</p>
      <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
        <strong class="block text-slate-800">Ingredients:</strong>
        • 150g low-fat paneer cubes<br/>
        • Bell peppers & onion wedges<br/>
        • Marinate: Curd, turmeric, Kashmiri chili & kasuri methi
      </div>
      <p class="text-xs"><strong>Steps:</strong> Thread on wooden skewers and air-fry or grill for 10 minutes until charred.</p>
    </div>
  `,

  chia_pudding: `
    <div class="space-y-1.5">
      <h5 class="font-bold text-slate-900 text-sm">🍧 Overnight Chia Seed Berry Pudding</h5>
      <p class="text-xs text-brand-700 font-semibold">Macros: 210 kcal | Protein: 7g | Carbs: 26g | Fats: 9g</p>
      <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
        <strong class="block text-slate-800">Ingredients:</strong>
        • 3 tbsp chia seeds<br/>
        • 1 cup unsweetened almond milk<br/>
        • 1 tsp honey or maple syrup<br/>
        • Fresh berries for topping
      </div>
      <p class="text-xs"><strong>Steps:</strong> Mix chia seeds & milk in a jar. Chill overnight. Top with berries in the morning!</p>
    </div>
  `,

  egg_white_omelette: `
    <div class="space-y-1.5">
      <h5 class="font-bold text-slate-900 text-sm">🍳 Egg White & Spinach Muscle Omelette</h5>
      <p class="text-xs text-brand-700 font-semibold">Macros: 160 kcal | Protein: 22g | Carbs: 4g | Fats: 5g</p>
      <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
        <strong class="block text-slate-800">Ingredients:</strong>
        • 3 egg whites + 1 whole egg<br/>
        • 1/2 cup fresh baby spinach<br/>
        • Diced tomatoes & green chilies
      </div>
      <p class="text-xs"><strong>Steps:</strong> Whisk eggs, pour into a lightly oiled pan with spinach. Cook 3 minutes until fluffy.</p>
    </div>
  `,

  peanut_butter_toast: `
    <div class="space-y-1.5">
      <h5 class="font-bold text-slate-900 text-sm">🍞 Whole Wheat Peanut Butter & Banana Toast</h5>
      <p class="text-xs text-brand-700 font-semibold">Macros: 270 kcal | Protein: 10g | Carbs: 38g | Fats: 9g</p>
      <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
        <strong class="block text-slate-800">Ingredients:</strong>
        • 2 slices toasted whole wheat bread<br/>
        • 1.5 tbsp unsweetened peanut butter<br/>
        • 1/2 sliced banana & sprinkle of flaxseeds
      </div>
      <p class="text-xs"><strong>Steps:</strong> Spread peanut butter on warm toast, layer banana slices, top with flaxseeds.</p>
    </div>
  `,

  dal_spinach_soup: `
    <div class="space-y-1.5">
      <h5 class="font-bold text-slate-900 text-sm">🍲 High-Fiber Lentil & Spinach Soup (Dal)</h5>
      <p class="text-xs text-brand-700 font-semibold">Macros: 200 kcal | Protein: 12g | Carbs: 34g | Fats: 3g</p>
      <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
        <strong class="block text-slate-800">Ingredients:</strong>
        • 1/2 cup yellow/red lentils<br/>
        • Chopped spinach, garlic & cumin<br/>
        • Lemon squeeze
      </div>
      <p class="text-xs"><strong>Steps:</strong> Pressure cook lentils with turmeric. Temper with garlic & cumin in olive oil. Mix in spinach.</p>
    </div>
  `,

  berry_smoothie: `
    <div class="space-y-1.5">
      <h5 class="font-bold text-slate-900 text-sm">🥤 Berry Antioxidant Almond Smoothie</h5>
      <p class="text-xs text-brand-700 font-semibold">Macros: 220 kcal | Protein: 15g | Carbs: 28g | Fats: 4g</p>
      <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
        <strong class="block text-slate-800">Ingredients:</strong>
        • 1 cup frozen strawberries/blueberries<br/>
        • 1/2 cup Greek yogurt<br/>
        • 1 cup almond milk<br/>
        • 1 tbsp ground flaxseed
      </div>
      <p class="text-xs"><strong>Steps:</strong> Blend until smooth for a refreshing antioxidant boost!</p>
    </div>
  `,

  quinoa_power_bowl: `
    <div class="space-y-1.5">
      <h5 class="font-bold text-slate-900 text-sm">🍲 Quinoa & Black Bean Power Bowl</h5>
      <p class="text-xs text-brand-700 font-semibold">Macros: 410 kcal | Protein: 16g | Carbs: 62g | Fats: 10g</p>
      <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
        <strong class="block text-slate-800">Ingredients:</strong>
        • 3/4 cup cooked quinoa<br/>
        • 1/2 cup cooked black beans/rajma<br/>
        • Sweet corn, guacamole & fresh salsa
      </div>
      <p class="text-xs"><strong>Steps:</strong> Layer warm quinoa, beans, corn & salsa. Excellent meal-prep option!</p>
    </div>
  `,

  yogurt_parfait: `
    <div class="space-y-1.5">
      <h5 class="font-bold text-slate-900 text-sm">🫐 Greek Yogurt Honey & Walnut Parfait</h5>
      <p class="text-xs text-brand-700 font-semibold">Macros: 240 kcal | Protein: 17g | Carbs: 24g | Fats: 8g</p>
      <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
        <strong class="block text-slate-800">Ingredients:</strong>
        • 1 cup plain Greek yogurt<br/>
        • 1 tbsp honey<br/>
        • 4 crushed walnuts & fresh berries
      </div>
      <p class="text-xs"><strong>Steps:</strong> Layer yogurt, honey, walnuts, and berries in a glass. Probiotic rich!</p>
    </div>
  `,

  roasted_chickpeas: `
    <div class="space-y-1.5">
      <h5 class="font-bold text-slate-900 text-sm">🧆 Crunch Oven-Roasted Garlic Chickpeas</h5>
      <p class="text-xs text-brand-700 font-semibold">Macros: 190 kcal | Protein: 9g | Carbs: 30g | Fats: 4g</p>
      <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
        <strong class="block text-slate-800">Ingredients:</strong>
        • 1 cup boiled chickpeas (dried)<br/>
        • 1 tsp olive oil<br/>
        • Garlic powder, cumin & sea salt
      </div>
      <p class="text-xs"><strong>Steps:</strong> Toss chickpeas in oil & spices. Roast at 200°C for 20 mins until crunchy.</p>
    </div>
  `,

  green_detox: `
    <div class="space-y-1.5">
      <h5 class="font-bold text-slate-900 text-sm">🍏 Refreshing Cucumber & Ginger Green Detox</h5>
      <p class="text-xs text-brand-700 font-semibold">Macros: 120 kcal | Protein: 3g | Carbs: 26g | Fats: 0.5g</p>
      <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
        <strong class="block text-slate-800">Ingredients:</strong>
        • 1 cucumber & 1 green apple<br/>
        • Handful spinach leaves<br/>
        • 1/2 inch ginger & lemon juice
      </div>
      <p class="text-xs"><strong>Steps:</strong> Juice or blend with coconut water. Serve chilled for digestion & detoxing.</p>
    </div>
  `
};

function generateNutriAIResponse(query) {
  const q = query.toLowerCase();

  // Recipe Matches
  if (q.includes('banana') || q.includes('shake')) {
    return dietRecipes.banana_shake;
  } else if (q.includes('oat') || q.includes('porridge')) {
    return dietRecipes.oats_porridge;
  } else if (q.includes('chilla') || q.includes('moong dal')) {
    return dietRecipes.moong_chilla;
  } else if (q.includes('sprout') || q.includes('chickpea salad')) {
    return dietRecipes.sprouted_salad;
  } else if (q.includes('avocado')) {
    return dietRecipes.avocado_salad;
  } else if (q.includes('paneer') || q.includes('skewer')) {
    return dietRecipes.paneer_skewers;
  } else if (q.includes('chia') || q.includes('pudding')) {
    return dietRecipes.chia_pudding;
  } else if (q.includes('egg') || q.includes('omelette')) {
    return dietRecipes.egg_white_omelette;
  } else if (q.includes('toast') || q.includes('peanut butter')) {
    return dietRecipes.peanut_butter_toast;
  } else if (q.includes('dal') || q.includes('soup')) {
    return dietRecipes.dal_spinach_soup;
  } else if (q.includes('berry') || q.includes('smoothie')) {
    return dietRecipes.berry_smoothie;
  } else if (q.includes('quinoa')) {
    return dietRecipes.quinoa_power_bowl;
  } else if (q.includes('yogurt') || q.includes('parfait')) {
    return dietRecipes.yogurt_parfait;
  } else if (q.includes('roasted') || q.includes('chana')) {
    return dietRecipes.roasted_chickpeas;
  } else if (q.includes('detox') || q.includes('green juice')) {
    return dietRecipes.green_detox;
  } else if (q.includes('all') || q.includes('list') || q.includes('recipe') || q.includes('book')) {
    return `
      <div class="space-y-2">
        <h5 class="font-bold text-slate-900 text-sm">📖 NutriAssist AI 15 Diet Recipes Book</h5>
        <p class="text-xs text-slate-600">Click or type any recipe name below to get full step-by-step ingredients &amp; macros:</p>
        <div class="grid grid-cols-2 gap-1 text-[11px] font-medium">
          <button onclick="sendQuickPrompt('Banana Shake Recipe')" class="p-1 bg-slate-100 rounded text-left hover:bg-brand-50 hover:text-brand-700">1. 🍌 Banana Shake</button>
          <button onclick="sendQuickPrompt('Oats Porridge')" class="p-1 bg-slate-100 rounded text-left hover:bg-brand-50 hover:text-brand-700">2. 🥣 Oats Porridge</button>
          <button onclick="sendQuickPrompt('Moong Dal Chilla')" class="p-1 bg-slate-100 rounded text-left hover:bg-brand-50 hover:text-brand-700">3. 🥞 Moong Chilla</button>
          <button onclick="sendQuickPrompt('Sprouted Salad')" class="p-1 bg-slate-100 rounded text-left hover:bg-brand-50 hover:text-brand-700">4. 🥗 Sprouted Salad</button>
          <button onclick="sendQuickPrompt('Avocado Salad')" class="p-1 bg-slate-100 rounded text-left hover:bg-brand-50 hover:text-brand-700">5. 🥑 Avocado Salad</button>
          <button onclick="sendQuickPrompt('Paneer Skewers')" class="p-1 bg-slate-100 rounded text-left hover:bg-brand-50 hover:text-brand-700">6. 🍢 Paneer Skewers</button>
          <button onclick="sendQuickPrompt('Chia Pudding')" class="p-1 bg-slate-100 rounded text-left hover:bg-brand-50 hover:text-brand-700">7. 🍧 Chia Pudding</button>
          <button onclick="sendQuickPrompt('Egg White Omelette')" class="p-1 bg-slate-100 rounded text-left hover:bg-brand-50 hover:text-brand-700">8. 🍳 Egg Omelette</button>
          <button onclick="sendQuickPrompt('Peanut Butter Toast')" class="p-1 bg-slate-100 rounded text-left hover:bg-brand-50 hover:text-brand-700">9. 🍞 PB Toast</button>
          <button onclick="sendQuickPrompt('Lentil Spinach Soup')" class="p-1 bg-slate-100 rounded text-left hover:bg-brand-50 hover:text-brand-700">10. 🍲 Dal Spinach Soup</button>
          <button onclick="sendQuickPrompt('Berry Smoothie')" class="p-1 bg-slate-100 rounded text-left hover:bg-brand-50 hover:text-brand-700">11. 🥤 Berry Smoothie</button>
          <button onclick="sendQuickPrompt('Quinoa Power Bowl')" class="p-1 bg-slate-100 rounded text-left hover:bg-brand-50 hover:text-brand-700">12. 🍲 Quinoa Bowl</button>
          <button onclick="sendQuickPrompt('Yogurt Parfait')" class="p-1 bg-slate-100 rounded text-left hover:bg-brand-50 hover:text-brand-700">13. 🫐 Yogurt Parfait</button>
          <button onclick="sendQuickPrompt('Roasted Chickpeas')" class="p-1 bg-slate-100 rounded text-left hover:bg-brand-50 hover:text-brand-700">14. 🧆 Roasted Chana</button>
          <button onclick="sendQuickPrompt('Green Detox Smoothie')" class="p-1 bg-slate-100 rounded text-left hover:bg-brand-50 hover:text-brand-700">15. 🍏 Green Detox</button>
        </div>
      </div>
    `;
  } else if (q.includes('dorm') || q.includes('budget') || q.includes('snack')) {
    return dietRecipes.banana_shake + "<hr class='my-2 border-slate-200'/>" + dietRecipes.moong_chilla;
  } else {
    return `
      <p>I can help you prepare healthy diet meals! Type <strong>"Banana Shake"</strong>, <strong>"Oats"</strong>, <strong>"Moong Chilla"</strong>, or ask for the <strong>"Full Recipe Book"</strong> to see all 15+ student diet recipes!</p>
    `;
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
