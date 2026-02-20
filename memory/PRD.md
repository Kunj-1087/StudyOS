# studyOS - Academic Intelligence System PRD

## Original Problem Statement
Build a production-level web application called "studyOS" — an Academic Intelligence System for college students. A scalable startup-grade platform serving as a domain intelligence command center covering high-value domains (FinTech, Finance, AI, Machine Learning, Data Science, Cybersecurity, Quant, Web3).

## User Personas
1. **College Students** - Primary users seeking career intelligence in tech domains
2. **Contributors** - Users who can add and verify resources
3. **Admins** - Platform administrators managing content

## Core Requirements (Static)
- ✅ Landing Page with "Enter the System" hero
- ✅ Domain Selection Hub with 8 domain cards
- ✅ Domain Intelligence Brief pages
- ✅ Resource Toolkit pages with categorization
- ✅ Operator Profile page with stats
- ✅ JWT-based authentication (email/password)
- ✅ Role-based access (student, contributor, admin)
- ✅ Tactical dark theme UI

## What's Been Implemented (Feb 20, 2026)

### Backend
- FastAPI server with /api prefix routing
- In-memory storage (Supabase-ready architecture)
- Auth endpoints: /api/auth/register, /api/auth/login, /api/auth/me
- Domain endpoints: /api/domains, /api/domains/{slug}
- Resource endpoints: /api/domains/{slug}/resources
- Progress tracking: /api/progress/*
- Personal plan: /api/personal-plan/*
- User stats: /api/user/stats
- 8 pre-populated domains with 35+ resources

### Frontend
- React 19 with React Router
- Tactical dark theme (Barlow Condensed, JetBrains Mono, Inter fonts)
- Color scheme: #0D0F14 bg, #00C2FF primary, #16F2A5 secondary
- Pages: Landing, Hub, Domain, Toolkit, Profile, Auth
- Components: Navigation, DomainCard, ResourceCard, StatsComponents
- Context: AuthContext for authentication state
- Sonner for toast notifications

## Prioritized Backlog

### P0 - Critical (Next Session)
- [ ] Integrate Supabase PostgreSQL (awaiting user credentials)
- [ ] Set up Alembic migrations
- [ ] Implement Google OAuth login

### P1 - High Priority
- [ ] Admin dashboard for content management
- [ ] Resource submission by contributors
- [ ] Domain completion certificates

### P2 - Medium Priority
- [ ] Advanced analytics and charts
- [ ] Community features (comments, discussions)
- [ ] Mobile-responsive improvements

### P3 - Nice to Have
- [ ] Email notifications
- [ ] PDF export of learning plans
- [ ] Integration with external APIs (job listings)

## Next Tasks
1. User to provide Supabase Transaction Pooler credentials
2. Set up PostgreSQL schema via Alembic
3. Implement Google OAuth integration
4. Add admin CRUD endpoints for domains/resources
