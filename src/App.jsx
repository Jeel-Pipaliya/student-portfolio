import { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import PageLoader from "./components/PageLoader";
import { lazyWithDelay } from "./utils/lazyWithDelay";

// ============================================================================
// Practical 8: Performance Optimization & Lazy Loading
// Route-based code splitting via React.lazy() & Suspense.
// Supplementary Problem 2: lazyWithDelay enforces a smooth 250ms minimum threshold
// preventing flickering layout flashes on ultra-fast networks.
// ============================================================================
const Home = lazyWithDelay(() => import("./pages/Home"), 250);
const Projects = lazyWithDelay(() => import("./pages/Projects"), 250);
const Tasks = lazyWithDelay(() => import("./pages/Tasks"), 250);
const Contact = lazyWithDelay(() => import("./pages/Contact"), 250);
const NotFound = lazyWithDelay(() => import("./pages/NotFound"), 250);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? "app dark" : "app"}>
      <NavBar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      <main>
        {/* Suspense fallback renders while route-level chunk downloads */}
        <Suspense fallback={<PageLoader message="Loading requested module..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;