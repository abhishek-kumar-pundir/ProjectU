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

## 🏎️ `react-fastload` Implementation Details & Benchmarks

The frontend leverages **[`react-fastload`](https://www.npmjs.com/package/react-fastload)** for prioritized, non-blocking component scheduling:

### 📊 Measured Performance Gains

| Metric | Monolithic Bundle (Before) | With `react-fastload` (After) | Improvement |
|---|---|---|---|
| **Initial JS Payload** | **306.85 kB** | **154.46 kB** | **-49.7% (~152.4 kB saved)** |
| **Gzipped Transfer** | 95.03 kB | 50.15 kB | **-47.2% network savings** |
| **First Contentful Paint** | Blocked by ~300 kB script parse | Instant paint (~154 kB) | **Progressive non-blocking load** |

### 🛠️ Architecture

1. **Adaptive Provider (`src/main.jsx`)**:
   ```jsx
   <FastLoadProvider strategy="adaptive" concurrency={4} preloadDistance={800}>
     <App />
   </FastLoadProvider>
   ```
2. **Prioritized Code-Splitting (`lazyComponent`)**:
   - `HomePage` / `LoginPage`: `priority="CRITICAL"` with `strategy="eager"`
   - `MusicPanel`: `priority="HIGH"` (core synchronized audio player)
   - `MoodBoard`: `priority="NORMAL"`
   - `LinkPanel`: `priority="NORMAL"`
   - `UploadSong`: `priority="LOW"` (deferred modal)
3. **Smooth Suspense & Skeletons**:
   - Each view mounts with zero layout shift (CLS = 0) via coordinated `<PanelFallback />` components.
