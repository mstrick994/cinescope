# CineScope

CineScope is a **streaming-style movie and TV browsing experience** built with React, inspired by platforms like Apple TV and Hulu.

The project focuses on **real-world frontend challenges** such as genre accuracy, performance-conscious data fetching, responsive UI design, and scalable component architecture using live data from **The Movie Database (TMDB)**.

This is a **portfolio project** designed to demonstrate practical frontend engineering decisions rather than a production clone.

---

## What CineScope Does

- Displays a **full-bleed hero** with dynamically loaded backdrops
- Provides tabbed browsing for **Movies**, **TV Shows**, and **Animation**
- Renders **curated horizontal rows** with smooth scrolling and responsive controls
- Includes a **plans & pricing UI** with monthly/annual billing toggle
- Adapts cleanly across mobile, tablet, and desktop layouts

---

## Core Technical Focus

### Genre-Accurate Browsing
TMDB titles often belong to multiple genres, which can lead to misplaced results.  
CineScope enforces **“shelf accuracy”** by:

- Prioritizing **primary genre matching**
- Supporting include / exclude genre rules
- Allowing strict vs mixed genre behavior per row
- Adding optional refiners (language, keywords like “anime” or “sitcom”)

This prevents issues like sitcoms appearing in drama shelves or animation overtaking action rows.

### Performance-Minded Fetching
- Lightweight **in-memory caching** with expiration
- Minimal API requests per row (fetches more only when needed)
- Client-side filtering where TMDB endpoints lack discover options
- Designed to reduce over-fetching and rate-limit pressure

---

## Tech Stack

- **React 19**
- **Vite**
- **Tailwind CSS v4** (custom design tokens)
- **Axios** (TMDB API client)
- **ESLint** (React Hooks + Vite rules)

Additional libraries installed for future expansion:
Framer Motion, React Hook Form, Zod, MUI (Emotion)

---

## Project Structure (High Level)

```text
src/
  API/
    tmdb.js            # API client + discover/trending helpers
    tmdbGenres.js      # Centralized genre constants & exclusions
  components/
    Header/            # Desktop & mobile navigation
    Hero/              # Hero banner & trending content
    Browse Categories/ # Tabs, rows, title cards
    Pick A Plan/       # Pricing & billing UI
    Modal/             # Placeholder for future features
