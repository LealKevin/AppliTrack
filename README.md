# ApplyTrack

**A production-ready job application tracking system with analytics and interview management**

Helps job seekers organize applications, track interview rounds, and analyze their success patterns through a modern web dashboard.

---

##  Problem & Solution

Managing multiple job applications across different companies is chaotic - tracking deadlines, interview stages, and follow-ups becomes overwhelming without proper organization.

ApplyTrack centralizes this process with an intuitive dashboard that transforms job searching from chaos into organized, data-driven activity.

---

##  Core Features

- **Application Lifecycle Management** - Track from submission to final outcome
- **Multi-Stage Interview Tracking** - Manage phone screens, technical rounds, final interviews
- **Analytics Dashboard** - Visualize success rates and application trends
- **Smart Reminders** - Automated follow-up notifications
- **Data Import/Export** - CSV bulk operations for easy migration
- **GDPR Compliance** - Privacy-focused with complete data control

---

##  Technology Stack

**Backend**
- **Go 1.23** with Echo framework for high-performance API
- **PostgreSQL** with UUID primary keys and automated migrations
- **JWT Authentication** with Argon2id password hashing
- **Type-safe SQL** queries using sqlc code generation

**Frontend**
- **React 19 + TypeScript** for type-safe UI development
- **Tailwind CSS + Radix UI** for modern, accessible components
- **TanStack Query** for efficient server state management
- **Recharts** for interactive data visualization

**Production Infrastructure**
- **Docker + Docker Compose** for containerized deployment
- **Caddy** reverse proxy with automatic HTTPS
- **GitHub Actions** CI/CD with automated testing
- **PostgreSQL** with health monitoring and backups

---

##  Security Implementation

Production-grade security with multiple protection layers:

- **Authentication**: JWT tokens with secure HttpOnly cookies
- **Password Security**: Argon2id hashing with cryptographic salts  
- **Rate Limiting**: 100 req/min general + 5 auth attempts per 15min
- **CSRF Protection**: Token-based validation on state-changing operations
- **Security Headers**: CSP, HSTS, XSS protection, clickjacking prevention
- **Input Validation**: Server-side validation with sanitization

---

##  Quick Start

```bash
git clone https://github.com/LealKevin/ApplyTrack.git
cd ApplyTrack
cp .env.example .env

# Configure environment variables, then:
docker-compose up -d

# Access at http://localhost
```

**Local Development**
```bash
make db-up    # Setup database with migrations
make dev      # Start development server
make test     # Run comprehensive test suite
```

---

##  Quality Assurance

- **Backend Testing**: Unit and integration tests with testcontainers
- **Frontend Testing**: End-to-end testing with Playwright  
- **Security Scanning**: gosec static analysis in CI pipeline
- **Code Quality**: golangci-lint with security-focused rules
- **Automated CI/CD**: Testing, building, and deployment validation

---

##  Architecture

```
React/TypeScript Frontend → Go/Echo API → PostgreSQL Database
                    ↓
                Caddy Proxy (HTTPS + Compression)
```

**Key Design Decisions:**
- RESTful API design with proper HTTP semantics
- Database-first approach with migration-controlled schema
- Stateless authentication for horizontal scaling
- Container-first deployment for consistent environments

---

##  Development Highlights

- **Database Migrations**: Version-controlled schema changes with Tern
- **Type Safety**: End-to-end type safety from database to frontend
- **Hot Reload**: Fast development iteration with live updates
- **Comprehensive Linting**: Automated code quality enforcement
- **Security-First**: Security considerations built into development workflow

---

**Demonstrates full-stack development capabilities with production-ready architecture, security best practices, and modern development workflows.**
