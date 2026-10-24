# NeuroKids Allies — Redesigned Nonprofit Website

Official modern redesign for **NeuroKids Allies Inc.** — *Choosing To Understand*. An empathy-centered allyship nonprofit dedicated to creating belonging for neurodivergent children and their families.

Founded by **Omotayo Senbore**, based in Ontario, Hamilton (Canada).

---

## 🚀 Features

- **Modern Editorial Aesthetic:** Pure white theme with warm terracotta accents (`#C2410C`), high-contrast typography, and generous whitespace inspired by the Drive/Found design language.
- **Real Extracted Content & Full-Resolution Assets:** Authentic images including the hero classroom photo, founder portrait, and pillar cards directly extracted from the client's live presence.
- **Configurable Resource Downloads:** Built-in dual-mode engine in `app.js`:
  - **Gated Mode (Default):** Funnels visitors to Omotayo's verified MailerLite subscription page to grow her email community.
  - **Direct Download Mode:** Instant native file downloads (`<a download>`) once static guide files are placed in `/resources/`.
- **Accessible & Semantic:** WCAG AA-compliant contrast ratios (5.6:1+), keyboard navigation with skip links, ARIA labels, descriptive image alt attributes, and responsive legal modals.
- **Vercel Ready:** Fully static with zero build steps, clean URLs, and optimized asset caching via `vercel.json`.

---

## 🛠️ Tech Stack

- **HTML5:** Semantic architecture with proper heading hierarchy.
- **CSS3:** Vanilla CSS design tokens with responsive layout utilities.
- **JavaScript (ES6):** Client-side configuration, mobile navigation drawer, and modal interactions.
- **Hosting:** Optimized for instant deployment on [Vercel](https://vercel.com).

---

## 📁 Project Structure

```text
├── index.html        # Main semantic single-page layout
├── styles.css        # Design tokens, typography, and responsive styles
├── app.js            # Resource configuration, navigation, and modals
├── vercel.json       # Vercel deployment configuration & caching headers
├── .gitignore        # Standard ignore rules
└── Images/           # Full-resolution cropped brand assets and photos
    ├── logo-cropped.png
    ├── hero-library-kids-cropped.png
    ├── founder-omotayo-full.jpg
    ├── about-neuro-bias.png
    ├── about-isolation.png
    ├── about-community-segregation.png
    └── favicon.png
```

---

## ⚙️ How to Configure Resource Downloads

In `app.js`:

```javascript
const config = {
  // 1. Upload guide PDFs to /resources/ and populate paths here:
  resourceFiles: [
    // '/resources/for-children-guide.pdf',
    // '/resources/for-individuals-guide.pdf',
    // '/resources/for-communities-guide.pdf'
  ],

  // 2. Set to false for direct downloads; true to keep email gate:
  gateDownloadsBehindSubscribe: true,

  // 3. Client's real MailerLite funnel link:
  subscribeFormUrl: 'https://preview.mailerlite.io/forms/2009995/176619972987978844/share'
};
```

---

## 🌐 Deployment to Vercel

1. Push this repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), select **Import Project** and choose this repository.
3. Keep the default settings (Framework Preset: *Other*, Root Directory: `./`).
4. Click **Deploy**.
