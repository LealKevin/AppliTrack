# ApplyTrack Frontend

Job application tracking system built with React 19, TypeScript, and Tailwind CSS.

## Environment Setup

### Development
```bash
npm install
npm run dev
```
The app will run on `http://localhost:5173` with API proxy to `http://localhost:8080`.

### Production Build
```bash
npm run build
```
Builds to `dist/` folder ready for deployment.

## Environment Variables

### Development (`.env.local`)
```bash
VITE_API_URL=http://localhost:8080
```

### Production (`.env.production`)
```bash
VITE_API_URL=https://your-production-api-domain.com
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set root directory: `frontend/applitrack`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-api-domain.com`

### Netlify
1. Connect repository with build settings:
   - Base directory: `frontend/applitrack`
   - Build command: `npm run build`
   - Publish directory: `frontend/applitrack/dist`
2. Add environment variable: `VITE_API_URL=https://your-api-domain.com`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI
- **State Management:** TanStack Query
- **Routing:** React Router v7
- **Build Tool:** Vite
- **HTTP Client:** Axios
