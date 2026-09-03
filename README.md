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