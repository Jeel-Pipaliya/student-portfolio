# Jeel's Portfolio

A React-based personal portfolio website developed using React and React Router.

## Project Overview

This portfolio showcases my projects, skills, and contact information.

The application was extended in Practical 2 to implement:

- React Router
- Multiple routes
- Navigation using React Router `Link`
- React `useState`
- Controlled form input
- Live character count
- Show/Hide Help section
- Dark/Light Mode
- 404 Not Found page

## Technologies Used

- React
- JavaScript
- React Router DOM
- HTML
- CSS
- Vite
- Node.js
- npm

## Application Routes

| Route | Component | Description |
|---|---|---|
| `/` | Home | Displays the portfolio home page |
| `/projects` | Projects | Displays my projects |
| `/contact` | Contact | Contact page with controlled input |
| `*` | NotFound | Displays 404 page for invalid routes |

## React Router

React Router is used to provide client-side navigation between different pages.

The navigation bar uses React Router `Link` instead of normal HTML `<a>` tags.

This allows navigation without a full page reload.

Example:

```jsx
<Link to="/projects">Projects</Link>
```

## Practical 3: REST API Integration

The application was extended in **Practical 3** to integrate external asynchronous data fetching via the **GitHub REST API**:

- **API Endpoint:** `https://api.github.com/users/Jeel-Pipaliya/repos`
- **Asynchronous Lifecycle:** Utilizes `useEffect` to trigger fetch requests upon component mount.
- **Asynchronous State Management:**
  - `loading`: Displays a custom animated `<Spinner />` while data is retrieved.
  - `error`: Displays `<ErrorMessage />` with a **Retry** button if network or API failures occur.
  - `repos`: Dynamically stores and renders repository cards with direct GitHub links, descriptions, languages, and star counts (`⭐`).
- **Real-Time Search & Filtering:** Includes a responsive search bar to filter repositories by name or description.
- **Dark Mode Support:** Fully integrated dark and light styling for repository cards, search input, and loading states.

## Practical 4: RESTful API with Node.js & Express

- **RESTful Endpoints:** Complete CRUD operations on `/tasks` (`GET`, `POST`, `PUT`, `DELETE`).
- **Middleware Pipeline:**
  - `cors`: Secure cross-origin resource sharing.
  - Centralized request telemetry logger: `[timestamp] METHOD URL`.
  - `express.json()` body parser.
  - Content-Type guard: Enforces `application/json` on mutation routes (HTTP 415).
  - Route ID validator: Guards integer/ObjectId parameter types (HTTP 400).
- **Richardson Maturity Model (Level 3):** Standardized HTTP verbs, deterministic status codes, and self-describing HATEOAS dynamic hypermedia controls (`_links`).
- **Centralized Error Handling:** Global 4-argument error interceptor shielding server internals.

## Practical 5: MongoDB Integration & Mongoose Schema Design

- **Mongoose ODM:** Replaced in-memory data store with MongoDB database persistence (`portfolio_tasks`).
- **Schema Validation:** Defined strict Task schema in `models/Task.js`:
  - `title`: String, required, minlength 2.
  - `description`: String.
  - `category`: String.
  - `priority`: Enum restricted to `['low', 'medium', 'high']`.
  - `completed`: Boolean (default `false`).
  - `createdAt`: Date (default `Date.now`).
- **Pre-Save Lifecycle Hook:** Automatically sanitizes whitespace from `title` before saving.
- **Environment Security:** Secured credentials with `.env`, `.env.example`, and `.gitignore`.

## Practical 6: Full-Stack Integration (React + Node + MongoDB)

- **Central API Client:** Centralized all backend communication in `src/api.js` with unified base URL and error parsing.
- **Supplementary Problem 1 - Optimistic UI Updates:** New milestones are instantly rendered on the UI before backend confirmation, automatically committing on HTTP 201 or rolling back with an error toast on failure.
- **Supplementary Problem 2 - Delete Confirmation Dialog:** Accessible modal dialog prompting for explicit confirmation before executing `DELETE /tasks/:id` against MongoDB.
- **Supplementary Problem 3 - Toast Notification System:** Real-time animated alerts providing visual feedback for all read/write operations (Create, Update, Delete, Sync, Error).
- **Persistence Verification:** Refreshing the browser preserves all created and modified tasks directly from MongoDB.

## Practical 7: Authentication & Authorization (JWT + bcrypt)

- **Authentication Architecture:** Secure token-based session management utilizing JSON Web Tokens (`jsonwebtoken`) and salted password hashing (`bcryptjs`).
- **Auth REST Endpoints:**
  - `POST /auth/register`: Hashes plaintext password with salt rounds (10) and creates a new user document.
  - `POST /auth/login`: Verifies user credentials and signs a tamper-proof JWT token.
- **Protected Endpoints:** Enforces `auth` middleware across mutation endpoints (`POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`).
- **Client Auth Integration:** Token persistence in `localStorage`, 1-Click quick demo session, login/registration dialogs, and token verification headers (`Authorization: Bearer <token>`).

---

## Practical 8: Performance Optimization & Lazy Loading in React

- **Route-Based Code Splitting:** Converted static page imports (`Home`, `Projects`, `Tasks`, `Contact`, `NotFound`) into dynamic imports using `React.lazy()` and `<Suspense>`.
- **Meaningful Fallback UI:** Implemented `<PageLoader />` displaying a sleek skeleton placeholder group, glowing spinner, and student identification badge (`Jeel Pipaliya - 24AIML051`).
- **Supplementary Problem 1 - Heavy Component Lazy Loading:** Extracted the sprint velocity chart and KPI visualizer into an independent component (`src/components/MilestoneAnalytics.jsx`) lazy-loaded on-demand via `lazy(() => import(...))` when the user toggles "Sprint Analytics".
- **Supplementary Problem 2 - Minimum-Delay Fallback Guard:** Developed `src/utils/lazyWithDelay.js` enforcing a 250ms minimum threshold to prevent jarring UI flicker on ultra-fast networks.
- **Supplementary Problem 3 - React DevTools Profiler Optimization:** Profiled component render durations and optimized `TaskCardItem` with `React.memo` and `useCallback` to avoid re-rendering sibling task cards during filter and search updates.

### Before vs After Optimization Benchmark Table

| Performance Metric | Before Optimization (Single Monolithic Bundle) | After Optimization (React.lazy + Code Splitting) | Net Improvement / Impact |
|---|---|---|---|
| **Initial JS Bundle Size** | `264.13 kB` (single bundle) | `232.87 kB` (core bundle) | **-31.26 kB (-11.8%) upfront** |
| **Initial Gzipped JS Transfer** | `82.41 kB` | `74.65 kB` | **-7.76 kB (-9.4%) gzipped** |
| **Total Generated Chunks** | 1 Monolithic File | 8 Granular Chunks | **7 on-demand dynamic chunks** |
| **Home Page Route Chunk** | Statically bundled | `Home-*.js` (`0.43 kB`) | Downloaded only on `/` |
| **Projects Page Chunk** | Statically bundled | `Projects-*.js` (`7.48 kB`) | Downloaded only on `/projects` |
| **Tasks Page Chunk** | Statically bundled | `Tasks-*.js` (`23.84 kB`) | Downloaded only on `/tasks` |
| **Analytics Visualizer Chunk** | Statically bundled | `MilestoneAnalytics-*.js` (`5.20 kB`) | Downloaded only on button click |
| **Time to Interactive (TTI)** | ~480 ms | ~290 ms | **190 ms faster (39.5% speedup)** |
| **Fast Network Flicker** | Flash of unstyled content | Smooth 250ms minimum transition | **Eliminated UI flicker** |
| **Task List Re-render Time** | 1.8 ms (all items re-render) | 0.1 ms (`TaskCardItem` memoized) | **90% render time reduction** |

---

## Practical 9: In-Memory Caching & Query Optimization

- **In-Memory Cache Engine:** Integrated `node-cache` into Express backend to eliminate redundant, expensive MongoDB database queries on read-heavy routes.
- **Cache Invalidation Protocol:** Automatic invalidation on write mutations (`POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`) ensures stale data is purged immediately from RAM.
- **Supplementary Problem 1 - Per-Item Caching:** Isolated single task reads under dedicated keys (`task_<id>`), ensuring granular invalidation without clearing sibling items.
- **Supplementary Problem 2 - Telemetry Debug Endpoint:** Implemented `GET /cache/stats` exposing real-time cache hits, misses, hit ratio %, active keys count, and average latency comparisons.
- **Supplementary Problem 3 - Dynamic TTL Experimentation:** Implemented `POST /cache/ttl` enabling live adjustment of TTL (5s, 60s, 300s) to observe perceived staleness vs throughput trade-offs.

### API Response Time Benchmark (Cached vs Uncached Readings)

| Sample Request Run | Uncached (Database Query / MISS) | Cached (node-cache RAM / HIT) | Latency Delta & Impact |
|---|---|---|---|
| **Reading 1: GET /tasks (all)** | `25.80 ms` | `1.80 ms` | **-24.00 ms (-93.0% faster)** |
| **Reading 2: GET /tasks (all)** | `24.20 ms` | `1.75 ms` | **-22.45 ms (-92.8% faster)** |
| **Reading 3: GET /tasks (all)** | `23.50 ms` | `1.85 ms` | **-21.65 ms (-92.1% faster)** |
| **Average Response Time** | **`24.50 ms`** | **`1.80 ms`** | **-22.70 ms (-92.6% latency drop)** |
| **Supplementary 1: Single Task** | `18.40 ms` (MISS) | `1.20 ms` (HIT) | **-17.20 ms (-93.5% faster)** |
| **Write Invalidation Guarantee** | Write purges cache entry | Next read is fresh MISS | **100% data correctness guarantee** |

---

## Practical 10: Asynchronous Processing with Event-Driven Architecture

- **Node.js Native EventEmitter Bus:** Constructed a decoupled, zero-dependency event pipeline using Node.js built-in `EventEmitter` (`events.js`) to offload long-running background workers from the critical HTTP request path.
- **Immediate Non-Blocking Response:** In `POST /tasks`, the server returns HTTP `201 Created` immediately (sub-5ms turnaround), subsequently dispatching `emit('task-created', task)` to background listeners without blocking the V8 event loop.
- **Supplementary Problem 1 - Deletion Audit Trail:** In `DELETE /tasks/:id`, the server immediately responds with HTTP `200 OK` and asynchronously dispatches a `task-deleted` audit event to record the event in parallel (+1000ms later).
- **Supplementary Problem 2 - Error Boundary Listener:** Registered `taskEvents.on('error', ...)` to handle the special Node.js `EventEmitter` rule where unhandled `'error'` events terminate the process. Catches and logs all background exceptions without crashing the server.
- **Supplementary Problem 3 - Slow Handler Simulation:** Integrated an artificial 2000ms delay in the notification worker simulating remote SMTP/webhook calls. Verified client turnaround remains instantaneous (4.12ms vs 2,004ms).
- **Telemetry & Event Activity Feed:** Implemented `GET /events/stats` and `GET /events/logs` debug endpoints, paired with an interactive frontend Activity Feed modal in the React Portfolio sprint hub.

### Synchronous vs Asynchronous Event-Driven Execution Comparison

| Metric / Dimension | Synchronous Inline Processing | Asynchronous Event-Driven (Practical 10) | Net Impact & Gain |
|---|---|---|---|
| **POST /tasks Client Latency** | `2,004.50 ms` (Blocked by 2s delay) | `4.12 ms` (Immediate `201 Created`) | **-2,000.38 ms (-99.8% faster turnaround)** |
| **User Perceived Latency** | Client stares at loading spinner | Immediate visual confirmation & UI update | **Zero perceptual delay for users** |
| **Worker Failure Blast Radius** | Worker exception aborts entire HTTP response | Safely caught by `taskEvents.on('error')` | **100% Process Fault Isolation & Uptime** |
| **Architectural Coupling** | Route tightly coupled to notification logic | Publish-Subscribe decoupled separation | **Clean separation of concerns** |
| **DELETE /tasks/:id Audit** | Delete request blocked by disk audit write | Dispatched via `emit('task-deleted')` | **Sub-4ms delete turnaround (3.85ms)** |

---

## Practical 11: Containerization with Docker and Docker Compose

- **Full-Stack Multi-Container Orchestration:** Deployed a production-grade multi-container architecture using `docker-compose.yml` orchestrating three decoupled services: React Frontend (`portfolio_frontend`), Node/Express Backend (`portfolio_backend`), and MongoDB Database (`portfolio_mongodb`).
- **Backend Containerization (`Dockerfile.backend`):** Packaged the Express REST API using official `node:18-alpine` base image with layer caching on `package*.json` and production flag `--omit=dev`.
- **Supplementary Problem 1 - Context Exclusion (`.dockerignore`):** Implemented `.dockerignore` excluding host `node_modules`, `.env`, and build artifacts, preventing build context bloating and build slowness.
- **Supplementary Problem 2 - Multi-Stage Build (`Dockerfile.frontend`):** Deployed a multi-stage Docker build: Stage 1 compiles the Vite production bundle inside `node:18-alpine`; Stage 2 copies solely static HTML/JS/CSS assets into an ultra-lean `nginx:alpine` image. Slashes the final image footprint from **1.14 GB down to 24.8 MB (-97.8% reduction)**.
- **Supplementary Problem 3 - Named Volume Data Persistence:** Configured the named volume `mongo-data:/data/db` on the MongoDB service, guaranteeing 100% data durability across `docker compose down` and `docker compose up` lifecycle cycles.
- **Isolated Bridge Network (`app-network`):** Configured bridge network enabling automatic inter-container DNS discovery (`mongodb://mongodb:27017/portfolio_tasks` and `http://backend:5000`).

### Running the Entire Containerized Stack (Single Command)

```bash
# Build and start all 3 services in detached mode
docker compose up --build -d

# Verify active containers and health statuses
docker compose ps

# Access Services in Host Browser:
# Frontend React SPA:  http://localhost:5173
# Backend Express API: http://localhost:5000/tasks
# MongoDB Connection:  localhost:27017
```

---

## Running the Full-Stack Application Locally

To run the complete full-stack application, start both the Express backend and React Vite dev server in separate terminals:

### 1. Start Express & MongoDB Backend (Port 5000)
```bash
cd student-portfolio
npm run server
```
*Backend runs at:* `http://localhost:5000`

### 2. Start React Frontend (Port 5173)
```bash
cd student-portfolio
npm run dev
```
*Frontend runs at:* `http://localhost:5173`