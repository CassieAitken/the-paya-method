# Bookmark - Back Nav + Layout Fix (May 4, 2026)

**Project State**: Complete snapshot saved in `snapshots/may4-back-nav/`

## Changes since Monday Draft

- Moved "The Vitality Index" (Mandate/Method) block above the 7 pillar cards on the landing page
- Removed "Restart" button entirely (prevents users from resetting or re-doing assessment)
- Added "Back" button in nav that navigates one step at a time through the flow
- Back logic handles audit pillar navigation (goes to previous pillar before leaving audit)
- Going back to audit from reflection returns to the last pillar
- No back button on landing, analyzing, or results pages
- Removed unused RefreshCcw icon, added ArrowLeft icon

## How to restore to Back Nav version

```
cp -r snapshots/may4-back-nav/src ./
cp -r snapshots/may4-back-nav/public ./
cp -r snapshots/may4-back-nav/supabase ./
cp snapshots/may4-back-nav/index.html ./
cp snapshots/may4-back-nav/package.json ./
cp snapshots/may4-back-nav/package-lock.json ./
cp snapshots/may4-back-nav/tailwind.config.js ./
cp snapshots/may4-back-nav/postcss.config.js ./
cp snapshots/may4-back-nav/vite.config.ts ./
cp snapshots/may4-back-nav/tsconfig.json ./
cp snapshots/may4-back-nav/tsconfig.app.json ./
cp snapshots/may4-back-nav/tsconfig.node.json ./
cp snapshots/may4-back-nav/eslint.config.js ./
npm install
```

---

# Bookmark - Monday Draft (May 4, 2026)

**Project State**: Complete snapshot saved in `snapshots/mondaydraft/`

## Changes since Almost Final

- Removed TierModal auto-popup on results load (users see archetype/score first)
- Simplified pre-purchase section in ResultsHero (single locked directive + clean CTA)
- Updated breed field helper text ("If you know it, great. If not, leave blank.")

## How to restore to Monday Draft

```
cp -r snapshots/mondaydraft/src ./
cp -r snapshots/mondaydraft/public ./
cp -r snapshots/mondaydraft/supabase ./
cp snapshots/mondaydraft/index.html ./
cp snapshots/mondaydraft/package.json ./
cp snapshots/mondaydraft/package-lock.json ./
cp snapshots/mondaydraft/tailwind.config.js ./
cp snapshots/mondaydraft/postcss.config.js ./
cp snapshots/mondaydraft/vite.config.ts ./
cp snapshots/mondaydraft/tsconfig.json ./
cp snapshots/mondaydraft/tsconfig.app.json ./
cp snapshots/mondaydraft/tsconfig.node.json ./
cp snapshots/mondaydraft/eslint.config.js ./
npm install
```

---

# Bookmark - Almost Final (May 3, 2026)

**Project State**: Complete snapshot saved in `snapshots/almost-final/`

## What's in this version

- Landing page with founder teaser ("Meet Cassie" bolded, trimmed copy)
- Full audit flow: Intake -> Audit -> Results (Blueprint + Hero)
- Founder Message modal, Book Consultation modal, Check-in modal
- Pillar and Tier modals on results
- Password gate
- Waitlist / email signup
- Share badge with consent notice for social featuring
- Supabase: email_signups, vitality_program, consultation_bookings tables
- Edge functions: signup-email, verify-password, enroll-vitality-program, send-results-pdf
- State management: props passed from App.tsx (no Context or global store)

## Architecture notes

- React + Vite + Tailwind CSS + TypeScript
- Supabase for DB and edge functions
- All page state (dog name, audit answers, results) lives in App.tsx useState hooks, passed as props
- No router -- page switching via state variable in App.tsx

## How to restore to Almost Final

Copy everything from the snapshot back to the project root:

```
cp -r snapshots/almost-final/src ./
cp -r snapshots/almost-final/public ./
cp -r snapshots/almost-final/supabase ./
cp snapshots/almost-final/index.html ./
cp snapshots/almost-final/package.json ./
cp snapshots/almost-final/package-lock.json ./
cp snapshots/almost-final/tailwind.config.js ./
cp snapshots/almost-final/postcss.config.js ./
cp snapshots/almost-final/vite.config.ts ./
cp snapshots/almost-final/tsconfig.json ./
cp snapshots/almost-final/tsconfig.app.json ./
cp snapshots/almost-final/tsconfig.node.json ./
cp snapshots/almost-final/eslint.config.js ./
npm install
```

## Previous bookmarks

- `snapshots/may1/` - May 1 baseline

## Email Configuration

- **From address**: hello@send.payalabs.net
- **Reply-To**: payalabs01@gmail.com
- **Provider**: Resend (API key deployed as edge function secret)
