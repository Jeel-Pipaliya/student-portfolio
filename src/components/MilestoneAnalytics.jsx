import React, { useMemo } from "react";

/**
 * Practical 8: Supplementary Problem 1
 * Heavy Analytics & Milestone Visualization Component
 * Designed to be lazy-loaded on-demand via React.lazy() and Suspense inside Tasks view.
 */
export default function MilestoneAnalytics({ tasks = [], onClose }) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter((t) => t.priority === "high").length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const categories = tasks.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});

    return { total, completed, pending, highPriority, completionRate, categories };
  }, [tasks]);

  // Sprint Velocity Simulated History Data for SVG Chart
  const sprintData = [
    { sprint: "Sprint 1", completed: 3, target: 4 },
    { sprint: "Sprint 2", completed: 5, target: 5 },
    { sprint: "Sprint 3", completed: 4, target: 6 },
    { sprint: "Sprint 4", completed: 6, target: 6 },
    { sprint: "Sprint 5 (Current)", completed: stats.completed, target: stats.total || 6 },
  ];

  const maxVal = Math.max(...sprintData.map((d) => Math.max(d.completed, d.target)), 8);
  const chartHeight = 140;

  return (
    <div className="analytics-modal-backdrop" onClick={onClose}>
      <div className="analytics-card" onClick={(e) => e.stopPropagation()}>
        <div className="analytics-header">
          <div className="analytics-title-group">
            <span className="analytics-icon">📊</span>
            <div>
              <h3 className="analytics-heading">Milestone &amp; Sprint Velocity Analytics</h3>
              <p className="analytics-subheading">
                Dynamic Component • Loaded On-Demand via React.lazy()
              </p>
            </div>
          </div>
          <button className="analytics-close-btn" onClick={onClose} aria-label="Close Analytics">
            ✕
          </button>
        </div>

        <div className="analytics-badge-row">
          <span className="analytics-tech-pill">⚡ Chunk: MilestoneAnalytics.chunk.js</span>
          <span className="analytics-tech-pill">📦 Lazy Code-Split Active</span>
          <span className="analytics-tech-pill">🎓 Student: Jeel Pipaliya (24AIML051)</span>
        </div>

        {/* KPI Cards Grid */}
        <div className="analytics-kpi-grid">
          <div className="analytics-kpi-card">
            <span className="kpi-label">Completion Velocity</span>
            <span className="kpi-val text-green">{stats.completionRate}%</span>
            <div className="kpi-progress-bar">
              <div
                className="kpi-progress-fill"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
            <span className="kpi-meta">{stats.completed} of {stats.total} tasks verified</span>
          </div>

          <div className="analytics-kpi-card">
            <span className="kpi-label">Active Work Items</span>
            <span className="kpi-val text-blue">{stats.pending}</span>
            <span className="kpi-meta">High Priority: {stats.highPriority} items</span>
          </div>

          <div className="analytics-kpi-card">
            <span className="kpi-label">Domain Allocation</span>
            <div className="kpi-category-list">
              {Object.entries(stats.categories).map(([cat, count]) => (
                <div key={cat} className="kpi-cat-row">
                  <span className="cat-name">{cat}</span>
                  <span className="cat-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SVG Velocity Chart */}
        <div className="analytics-chart-section">
          <h4 className="chart-title">Sprint Execution Velocity (Completed vs Target)</h4>
          <div className="svg-chart-wrapper">
            <svg viewBox="0 0 520 180" className="velocity-svg">
              {/* Grid Lines */}
              <line x1="50" y1="20" x2="500" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="50" y1="65" x2="500" y2="65" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="50" y1="110" x2="500" y2="110" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="50" y1="150" x2="500" y2="150" stroke="#94a3b8" />

              {/* Y Axis labels */}
              <text x="35" y="25" fontSize="10" fill="#64748b" textAnchor="end">8</text>
              <text x="35" y="70" fontSize="10" fill="#64748b" textAnchor="end">4</text>
              <text x="35" y="115" fontSize="10" fill="#64748b" textAnchor="end">2</text>
              <text x="35" y="154" fontSize="10" fill="#64748b" textAnchor="end">0</text>

              {/* Bars for Sprints */}
              {sprintData.map((d, i) => {
                const x = 70 + i * 90;
                const barWidth = 24;
                const targetH = (d.target / maxVal) * chartHeight;
                const compH = (d.completed / maxVal) * chartHeight;
                const targetY = 150 - targetH;
                const compY = 150 - compH;

                return (
                  <g key={d.sprint} className="sprint-bar-group">
                    {/* Target Bar (Dotted/Ghost) */}
                    <rect
                      x={x}
                      y={targetY}
                      width={barWidth}
                      height={targetH}
                      rx="4"
                      fill="#e0e7ff"
                    />
                    {/* Completed Bar */}
                    <rect
                      x={x + 4}
                      y={compY}
                      width={barWidth - 8}
                      height={compH}
                      rx="3"
                      fill="#4f46e5"
                    />
                    {/* Labels */}
                    <text
                      x={x + barWidth / 2}
                      y="168"
                      fontSize="9"
                      fill="#475569"
                      textAnchor="middle"
                      fontWeight="500"
                    >
                      {d.sprint.replace("Sprint ", "S")}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={compY - 4}
                      fontSize="9"
                      fill="#312e81"
                      textAnchor="middle"
                      fontWeight="700"
                    >
                      {d.completed}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-color completed"></span> Actual Completed
            </span>
            <span className="legend-item">
              <span className="legend-color target"></span> Target Capacity
            </span>
          </div>
        </div>

        <div className="analytics-footer">
          <span className="analytics-profiler-tag">
            🎯 Render Optimization: Pure component memoization prevents parent re-render cascades
          </span>
          <button className="analytics-btn-primary" onClick={onClose}>
            Done Exploring
          </button>
        </div>
      </div>
    </div>
  );
}
