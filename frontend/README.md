# SkillCache Frontend

React + Vite + Tailwind CSS (PWA-ready)

## Setup
```bash
npm install
npm run dev
```

## Features
- ✅ Vite + React 19
- ✅ Tailwind CSS with dark/light theme
- ✅ React Router v7 with routing structure
- ✅ PWA-ready manifest and meta tags
- ✅ Mobile-first responsive design
- ✅ Lucide React icons

## Project Structure
```
src/
├── components/
│   └── Layout.jsx          # Main layout with navigation and theme toggle
├── context/
│   └── ThemeContext.jsx    # Theme management (dark/light mode)
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   ├── Dashboard.jsx       # Main dashboard
│   └── AddNote.jsx         # Add/edit note page
├── App.jsx                 # Main app component with routing
├── main.jsx                # Entry point
└── index.css               # Global styles with theme variables
```

## Routes
- `/` - Dashboard (main page)
- `/login` - User login
- `/register` - User registration  
- `/add-note` - Add new note

## Theme System
- Dark/light mode toggle
- CSS custom properties for consistent theming
- Automatic system preference detection
- Persistent theme storage

## Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Next Steps
1. Integrate Firebase Auth
2. Connect to Azure Functions API
3. Add Gemini AI integration
4. Implement note CRUD operations
5. Add search and filtering
6. Implement PWA service worker
