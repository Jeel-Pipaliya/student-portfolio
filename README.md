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