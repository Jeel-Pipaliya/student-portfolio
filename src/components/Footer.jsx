import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="portfolio-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-accent">Jeel</span> Pipaliya
          </div>
          <p className="footer-tagline">
            B.Tech AI-ML Undergraduate & Rank Holder at CSPIT-CHARUSAT University.
            Passionate about predictive modeling, feature engineering, and high-performance web systems.
          </p>
          <div className="footer-badges">
            <span className="footer-badge">ID: 24AIML051</span>
            <span className="footer-badge">CGPA: 8.18</span>
            <span className="footer-badge">Rank Holder</span>
          </div>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Quick Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Portfolio Home</Link></li>
            <li><Link to="/projects">Featured Projects</Link></li>
            <li><Link to="/tasks">Dev Roadmap & Milestones</Link></li>
            <li><Link to="/contact">Contact & Inquiries</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Key ML Projects</h4>
          <ul className="footer-links">
            <li>
              <a
                href="https://github.com/Jeel-Pipaliya/CreditWise-Loan-Approval-Prediction-System"
                target="_blank"
                rel="noreferrer"
              >
                CreditWise Loan Approval
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Jeel-Pipaliya/SmartCart-Customer-Segmentation-System-"
                target="_blank"
                rel="noreferrer"
              >
                SmartCart Customer Clustering
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Jeel-Pipaliya/student-portfolio"
                target="_blank"
                rel="noreferrer"
              >
                Student Portfolio & Task API
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Connect & Socials</h4>
          <ul className="footer-links">
            <li>
              <a href="mailto:24aiml051@charusat.edu.in">
                📧 24aiml051@charusat.edu.in
              </a>
            </li>
            <li>
              <a href="tel:+919328105383">
                📱 (+91) 9328105383
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/jeelpipaliya/"
                target="_blank"
                rel="noreferrer"
              >
                💼 LinkedIn Profile
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Jeel-Pipaliya"
                target="_blank"
                rel="noreferrer"
              >
                💻 GitHub Profile
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Jeel Pipaliya (24AIML051). CSPIT - CHARUSAT University. All rights reserved.
        </p>
        <div className="footer-bottom-links">
          <span>ITUE301 Advanced Web Development</span>
          <span>•</span>
          <span>Continuous Integration & Deployment</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;