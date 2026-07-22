# Bookmark - May 1, 2026

**Project State**: Saved and stable

## What's in this version

- Landing page with founder teaser ("Meet Cassie" bolded, trimmed copy)
- Full audit flow: Intake -> Audit -> Results (Blueprint + Hero)
- Founder Message modal, Book Consultation modal, Check-in modal
- Pillar and Tier modals on results
- Password gate
- Waitlist / email signup
- Supabase: email_signups, vitality_program, consultation_bookings tables
- Edge functions: signup-email, verify-password, enroll-vitality-program, send-results-pdf
- State management: props passed from App.tsx (no Context or global store)

## Architecture notes

- React + Vite + Tailwind CSS + TypeScript
- Supabase for DB and edge functions
- All page state (dog name, audit answers, results) lives in App.tsx useState hooks, passed as props
- No router -- page switching via state variable in App.tsx

## Resume here

Open the project and continue development from this point. Next planned work: photo upload and "Founding Member" tag.
