import { useState, useEffect, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";
import { lazyWithDelay } from "./utils/lazyWithDelay";

// ============================================================================
// Practical 8: Performance Optimization & Lazy Loading
// Route-based code splitting via React.lazy() & Suspense.
// Supplementary Problem 2: lazyWithDelay enforces a smooth 250ms threshold
// ============================================================================
const Home = lazyWithDelay(() => import("./pages/Home"), 250);
const Projects = lazyWithDelay(() => import("./pages/Projects"), 250);
const Tasks = lazyWithDelay(() => import("./pages/Tasks"), 250);
const Contact = lazyWithDelay(() => import("./pages/Contact"), 250);
const NotFound = lazyWithDelay(() => import("./pages/NotFound"), 250);

function App() {
  // Default to sleek dark mode for rich aesthetics, preserving user preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("portfolio_theme");
    return saved !== null ? saved === "dark" : true;
  });

  useEffect(() => {
    localStorage.setItem("portfolio_theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className={isDarkMode ? "app dark" : "app"}>
      <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <main className="main-content">
        {/* Suspense fallback renders while route-level chunk downloads */}
        <Suspense fallback={<PageLoader message="Loading portfolio module..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default App;