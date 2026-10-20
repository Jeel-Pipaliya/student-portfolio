import { Link } from "react-router-dom";

function NavBar({ isDarkMode, toggleTheme }) {
  return (
    <nav className="navbar">
      <div className="logo">
        Jeel's Portfolio
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/projects">
          Projects
        </Link>

        <Link to="/tasks">
          Tasks & API
        </Link>

        <Link to="/contact">
          Contact
        </Link>

        <button
          className="theme-button"
          onClick={toggleTheme}
        >
          {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;