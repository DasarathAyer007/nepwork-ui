# NepWork UI

> A unified marketplace for jobs, services, freelancers, and local work — built for Nepal, designed for everyone.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Login, signup, and secure session management |
| 💼 Job & Service Browsing | Browse listings with filters and categories |
| 🗺️ Map-Based Discovery | Find nearby jobs and workers on an interactive map |
| 👤 Freelancer Profiles | Rich profiles for freelancers and service providers |
| 💬 Real-Time Chat | In-app messaging between clients and workers |
| 📋 Job Applications | Apply to jobs and manage application status |
| 💳 Payment Support | Payment integration via backend API |
| 🤖 Recommendations | AI-powered job suggestions based on user profile |
| 📱 Responsive Design | Optimized for desktop, tablet, and mobile |

---

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Routing**: React Router
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS
- **Backend**: Django REST Framework (separate repo)

---

## 📦 Installation

### Prerequisites

- Node.js `v18+`
- npm `v9+`

### Clone & Install

```bash
git clone <repo-url>
cd nepwork-ui
npm install
```

---

## ▶️ Running the Project

### Development

```bash
npm run dev
```

App runs at → **http://localhost:5173**

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---



## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
