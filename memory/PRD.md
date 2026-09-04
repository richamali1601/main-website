# The Vision Hive — PRD

## Original Problem Statement
Premium, modern digital marketing agency website inspired by navbardigital.com — minimal, editorial, technology-focused. Smooth scrolling, horizontal marquee, image/text reveals, custom branding ("The Vision Hive"), sections: Hero, Services, Work, Insights, Contact. Client-provided logo must be used cleanly. Dark/neutral palette, sticky responsive nav, scroll animations, interactive service cards, fully responsive.

## Architecture
- Frontend: React (single-page landing), custom CSS (flexbox/grid, CSS animations, media queries)
- Backend: FastAPI template (not yet wired to features)
- Database: MongoDB (available, not yet modeled)

## User Personas
- Prospective clients browsing services/work on desktop and mobile
- Agency owner managing brand presentation and incoming enquiries

## Core Requirements (static)
- Premium dark aesthetic, teal accent, editorial typography (Manrope + DM Mono)
- Sticky blurred nav, mobile hamburger full-screen menu
- Hero with staggered reveals, orbs, scroll indicator
- Infinite services marquee, stats counters, service accordion rows
- Process, Work, Insights, Why Us, Testimonial, Final CTA, Footer
- Fully responsive, no horizontal overflow

## Implemented
- 2026-09: Full landing page UI — all sections, animations, marquee, accordions, ARIA semantics, insights articles, frontend-validated contact form
- 2026-09-04: Logo fix — trimmed transparent padding from source asset (521×479 → 476×275), saved locally as /frontend/public/logo.png, replaced 5 conflicting CSS override blocks with single clean `contain` rules; verified visually on desktop, mobile, and footer

## Backlog
- P1: Backend contact form — POST /api/contact endpoint persisting to MongoDB (currently MOCKED frontend-only)
- P2: Portfolio/Case Studies CMS wiring when real projects supplied
- P2: Refactor App.js into modular components (Navbar, Hero, Services, Footer)

## Credentials
None (no auth).
