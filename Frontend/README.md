# ProjectU — Frontend Client 💻

The React 18 single-page application for **ProjectU**, featuring live Socket.IO chat, synchronized music playback, live mood sharing, collaborative link boards, and optimized resource scheduling with **[`react-fastload`](https://www.npmjs.com/package/react-fastload)**.

---

## ⚡ Tech Stack

- **Framework**: [React 18.2](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Resource Scheduler**: [`react-fastload`](https://www.npmjs.com/package/react-fastload)
- **State Store**: [Zustand 5](https://zustand-demo.pmnd.rs/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Typography**: Cormorant Garamond & DM Sans via Fontsource
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Resizable Layout**: React Resizable Panels

---

## 🚀 Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create or edit `.env`:
```env
VITE_BACKEND_URL=http://localhost:6500
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Lint & Build
```bash
# Lint with ESLint
npm run lint

# Production bundle
npm run build
```

---

## 🏎️ `react-fastload` Implementation Details

The frontend implements:
1. **`<FastLoadProvider>`**: Configured in `src/main.jsx` with adaptive strategy (`concurrency=4`, `preloadDistance=800`, `debug=import.meta.env.DEV`).
2. **`lazyComponent()`**: Applied in `src/App.jsx` (`HomePage`, `LoginPage`), `src/pages/HomePage.jsx` (`MusicPanel`, `MoodBoard`, `LinkPanel`), and `src/components/music/MusicPanel.jsx` (`UploadSong`). Cuts initial bundle down by nearly 50%.
3. **`SmartImage`**: Applied for neon brand marks (`LoginPage`, `Navbar`), partner avatars (`ChatBox`), and lazy favicon previews (`LinkPanel`).
4. **`useFastLoadMetrics()`**: Integrated inside `src/components/shared/Navbar.jsx` dropdown for live scheduler stats and Core Web Vitals telemetry.
