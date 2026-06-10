# Vanshika Agrawal — Portfolio Website

**Tech Stack:** React 18 · Vite 5 · CSS Modules · Vanilla JS Hooks  
**Design:** Dark & Techy · Glassmorphism · Cyan-Violet Accents  
**Fonts:** Syne (display) · DM Sans (body) · Fira Code (mono)

---

## 📁 Folder Structure

```
vanshika-portfolio/
├── index.html                    # Root HTML (fonts, meta tags)
├── vite.config.js                # Vite config
├── package.json                  # Dependencies
├── README.md
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # Root component, composes all sections
    ├── data.js                   # ← ALL YOUR CONTENT LIVES HERE
    ├── styles/
    │   └── global.css            # Design tokens, resets, utilities
    ├── hooks/
    │   ├── useScrollReveal.js    # Intersection Observer reveal animation
    │   ├── useTypewriter.js      # Typewriter role cycling effect
    │   └── useCountUp.js         # Animated number count-up
    └── components/
        ├── Navbar/
        │   ├── Navbar.jsx        # Fixed nav with glass scroll effect
        │   └── Navbar.module.css
        ├── Hero/
        │   ├── Hero.jsx          # Typewriter + terminal card + stat counters
        │   └── Hero.module.css
        ├── About/
        │   ├── About.jsx         # Bio + avatar card + quick facts
        │   └── About.module.css
        ├── Skills/
        │   ├── Skills.jsx        # Grouped skill pills
        │   └── Skills.module.css
        ├── Experience/
        │   ├── Experience.jsx    # Vertical timeline cards
        │   └── Experience.module.css
        ├── Projects/
        │   ├── Projects.jsx      # Featured card + project grid
        │   └── Projects.module.css
        ├── Certifications/
        │   ├── Certifications.jsx # Badge-style cert cards
        │   └── Certifications.module.css
        ├── Contact/
        │   ├── Contact.jsx       # Info cards + contact form
        │   └── Contact.module.css
        └── Footer/
            ├── Footer.jsx        # Brand + nav + social + copyright
            └── Footer.module.css
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ installed ([download](https://nodejs.org))
- npm 9+ (comes with Node)

### Step 1 — Install dependencies
```bash
cd vanshika-portfolio
npm install
```

### Step 2 — Start development server
```bash
npm run dev
```
Opens at **http://localhost:5173**. Hot-reload is enabled.

### Step 3 — Build for production
```bash
npm run build
```
Output goes to `/dist`. Ready to deploy.

### Step 4 — Preview production build
```bash
npm run preview
```

---

## ✏️ Customization

**All content is in one place:** `src/data.js`

Edit these values before deploying:

```js
// src/data.js
export const personal = {
  email:     "your-real-email@gmail.com",   // ← Replace
  github:    "github.com/your-username",    // ← Replace
  linkedin:  "linkedin.com/in/your-profile",// ← Already set
  resumeUrl: "https://drive.google.com/...",// ← Replace with PDF link
};
```

For each project, update the `github` and `live` fields:
```js
{ github: "https://github.com/you/kidshield-ai", live: "https://kidshield.vercel.app" }
```

---

## 🌐 Deployment

### GitHub Pages (free)
```bash
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

npm run deploy
```

### Netlify (recommended — free)
1. Push this folder to a GitHub repo
2. Go to netlify.com → "New site from Git"
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy ✓

### Vercel (also free)
```bash
npm install -g vercel
vercel
```

---

## 📝 Adding Form Submission

The contact form is ready for a backend. Replace the mock delay in `Contact.jsx`:

**Option A — EmailJS (no backend needed)**
```bash
npm install @emailjs/browser
```
```js
import emailjs from '@emailjs/browser';
await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', form, 'PUBLIC_KEY');
```

**Option B — Formspree (free tier)**
```jsx
<form action="https://formspree.io/f/YOUR_ID" method="POST">
```

**Option C — Netlify Forms**
Add `data-netlify="true"` to the `<form>` tag.

---

## 🎨 Design System Reference

| Token | Value | Used for |
|-------|-------|----------|
| `--cyan` | `#00D4FF` | Primary accent, links, CTAs |
| `--violet` | `#7C3AED` | Secondary accent, gradient |
| `--amber` | `#F59E0B` | Awards, featured items |
| `--emerald` | `#10B981` | Success, "open to work" |
| `--bg-base` | `#070B14` | Page background |
| `--font-display` | Syne | Headings, brand |
| `--font-body` | DM Sans | Body text |
| `--font-mono` | Fira Code | Labels, code, tags |

---

Built with intention. No templates. No page builders.
