# The Vision Hive — PRD

## Original Problem Statement
Create a premium, modern digital marketing agency website inspired by navbardigital.com. The experience should feel polished, minimal, editorial, and technology-focused, with smooth scrolling, a horizontal marquee, image/text reveals, custom Vision Hive branding, and Hero, Services, Work, Insights, and Contact sections. The supplied company logo must be presented cleanly.

## User Personas
- Prospective clients evaluating the agency, services, and work on desktop or mobile
- The agency owner receiving and following up on qualified project enquiries

## Core Requirements
- Premium dark/neutral visual direction with teal accents and editorial typography
- Sticky responsive navigation and mobile menu
- Scroll-triggered reveals, marquee motion, and interactive service rows
- Hero content that fits standard viewport heights without clipping
- Responsive layouts without horizontal overflow
- A reliable project enquiry flow that stores submitted leads
- A lightweight guided concierge that helps visitors find relevant content without AI dependencies

## Architecture
- Frontend: React 19 single-page website, Framer Motion, custom responsive CSS, Sonner notifications
- Backend: FastAPI with all routes under `/api`
- Database: MongoDB via `MONGO_URL` and `DB_NAME`
- Contact API: `POST /api/contact`
- Concierge: deterministic React rule engine with browser-persisted session state; no external chatbot API

## Contact Data Model
- `id`: UUID string
- `name`: required string, 2–120 characters
- `email`: required validated email
- `company`: optional string, up to 160 characters
- `message`: required string, 10–5000 characters
- `status`: defaults to `new`
- `created_at`: timezone-aware ISO timestamp

## Implemented
- 2026-09: Full premium landing-page UI with responsive navigation, animations, marquee, service accordions, work/insight sections, contact area, and footer
- 2026-09-04: Trimmed transparent logo padding, corrected header/footer logo presentation, and added browser favicon assets
- 2026-09-04: Adjusted hero typography and spacing so the complete first-screen message fits common desktop viewports
- 2026-09-04: Added the live `POST /api/contact` endpoint with Pydantic validation and MongoDB persistence
- 2026-09-04: Replaced the MOCKED contact timeout with a real frontend API request, loading state, inline errors, success state, and reusable clean form
- 2026-09-04: Added backend regression coverage for valid submissions, invalid payloads, response safety, and MongoDB persistence
- 2026-09-04: Added a premium floating normal chatbot with guided quick prompts, typed intent matching, service recommendations, internal section routing, contact-form prefilling, conversation reset, and browser session persistence
- 2026-09-04: Added rule coverage for website development, SEO, performance marketing/lead generation, digital marketing, social media, branding, UI/UX, automation, portfolio, agency information, insights, and explicit contact intent
- 2026-09-04: Confirmed the chatbot is deterministic and does not send visitor messages or contact details to an AI/third-party service
- 2026-09-04: Replaced illustrative results with three verified metrics: 10+ projects delivered, 4.9/5 client satisfaction, and 5+ industries served; removed the performance-score metric and placeholder disclaimer

## Verification
- Production frontend build: passed
- Backend Python compile: passed
- Contact API valid request: 201 passed
- Contact API invalid request: 422 passed
- MongoDB persistence and safe response fields: passed
- Testing agent backend suite: 4/4 passed
- Desktop live contact submission and success state: passed
- Fresh isolated mobile contact submission and overflow check: passed
- Core site regression (navigation, menu, services, insights, logo, CTAs): passed
- Concierge testing agent regression: launcher, prompts, routing, reset, persistence, keyboard behavior, contact prefill, existing contact API, and desktop/mobile layouts passed
- Lead-intent matrix retest: `paid leads`, `paid ads`, and `lead generation` all map to Performance Marketing
- Production frontend build after chatbot implementation: passed
- Verified the three exact metric values on desktop and confirmed the mobile stats layout has no horizontal overflow

## Prioritized Roadmap
### P0 — Current blockers
- None

### P1 — Next
- Replace the three portfolio placeholders with real case studies, project visuals, services, and verified outcomes once content is supplied
- Replace placeholder email, phone, location, and social links with the agency's real contact details
- Add approved external chatbot destinations such as booking or WhatsApp when real URLs are supplied

### P2 — Future / Backlog
- Refactor the monolithic `App.js` into focused components such as Navbar, Hero, Services, Work, ContactForm, and Footer
- Replace the remaining editorial/testimonial placeholders with verified agency proof
- Add an internal lead-notification or enquiry-management workflow so new MongoDB leads are surfaced immediately
- Optionally add anonymized concierge intent analytics to identify which services visitors request most often

## Credentials
None. The website has no authentication.