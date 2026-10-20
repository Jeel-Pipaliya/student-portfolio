import React from "react";

/**
 * Practical 8: Fallback UI Component for React.lazy & Suspense
 * Renders a polished skeleton loader and spinner while route or component chunks download.
 */
export default function PageLoader({ message = "Loading view...", isComponent = false }) {
  if (isComponent) {
    return (
      <div className="component-loader-container" role="status" aria-live="polite">
        <div className="loader-spinner mini"></div>
        <div className="component-loader-text">
          <span className="loader-title">{message}</span>
          <span className="loader-sub">Fetching component chunk asynchronously</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-loader-overlay" role="status" aria-live="polite" aria-label="Loading page content">
      <div className="page-loader-card">
        <div className="loader-badge">
          <span className="loader-badge-dot"></span>
          <span>Code Splitting &amp; Lazy Loading Active</span>
        </div>

        <div className="loader-spinner-wrapper">
          <div className="loader-spinner"></div>
          <div className="loader-glow"></div>
        </div>

        <h3 className="loader-heading">{message}</h3>
        <p className="loader-caption">
          Downloading dynamic chunk on demand • Minimizing initial bundle footprint
        </p>

        {/* Skeleton Placeholders */}
        <div className="loader-skeleton-group">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-body-1"></div>
          <div className="skeleton-line skeleton-body-2"></div>
        </div>

        <div className="loader-footer-meta">
          <span>Student: Jeel Pipaliya (24AIML051)</span>
          <span>•</span>
          <span>React.lazy() &amp; Suspense</span>
        </div>
      </div>
    </div>
  );
}
