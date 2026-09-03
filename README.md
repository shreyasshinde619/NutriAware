# NutriAware - Smart Nutrition Awareness Platform

**Academic Presentation**: Presented by **Integrated MTech AIML, Sanjivani University**  
**Developer**: [@shreyasshinde619](https://github.com/shreyasshinde619)  
**UI/UX Design**: Aligned with Designer **Kunal**  
**Live PWA & Web URL**: [https://shreyasshinde619.github.io/NutriAware/](https://shreyasshinde619.github.io/NutriAware/)

---

## 🌟 Key Features

1. **⚡ EventPulse-Inspired Login Portal**:
   - Campus Health Pass authentication window launching first.
   - **Google Sign-In**: "Continue with Google Account" integration.
   - **Instant Student / Guest Login**: 1-click presentation access mode.

2. **🗂️ Separate Feature Workspaces**:
   - 🏠 **Home Hub**: Quick launch cards & student overview.
   - 📷 **AI Food Scanner**: TensorFlow computer vision model integration.
   - 🥗 **15+ Healthy Diet Recipes**: High-protein Indian & Global student meals (Banana Shake, Moong Chilla, Oats Porridge, Sprouted Salad, etc.).
   - 🧠 **30-Question Nutrition Quiz**: Interactive exam with progress bar, explanations, and printable certificate.
   - 💧 **Water Tracker**: Daily 2500 ml hydration gauge.
   - 📊 **Progress Analytics**: Weekly caloric & macro breakdown via Chart.js.

---

## 📱 How to Publish as Mobile App (Google Play Store & Apple App Store)

### 📲 Method 1: Instant PWA Mobile App Installation (Zero Cost)
- **Android**: Open `https://shreyasshinde619.github.io/NutriAware/` in Chrome, tap the 3 dots menu -> **"Install App"** / **"Add to Home Screen"**.
- **iOS (iPhone/iPad)**: Open `https://shreyasshinde619.github.io/NutriAware/` in Safari, tap Share -> **"Add to Home Screen"**.

### 🤖 Method 2: Publish to Google Play Store (Android APK / AAB)
1. Open **[PWABuilder.com](https://www.pwabuilder.com/)**.
2. Paste your live site link: `https://shreyasshinde619.github.io/NutriAware/`.
3. Click **Package for Store** -> Choose **Android**.
4. Download the generated `.apk` or `.aab` file.
5. Upload `.aab` to [Google Play Console](https://play.google.com/console).

### 🍎 Method 3: Publish to Apple App Store (iOS)
1. Install [Capacitor CLI](https://capacitorjs.com/):
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/ios
   npx cap init NutriAware com.shreyasshinde619.nutriaware
   npx cap add ios
   npx cap open ios
   ```
2. Build in Xcode and publish to **App Store Connect**.

---

## 🛠️ Technology Stack
- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript (ES6), FontAwesome 6, Chart.js.
- **PWA & Offline**: `manifest.json`, Service Worker (`sw.js`).
- **AI Recognition**: TensorFlow Computer Vision Model Hook.
- **AI Chatbot**: REST API integration point (Gemini / OpenAI API).
