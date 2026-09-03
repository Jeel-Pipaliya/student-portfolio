function Projects() {
  return (
    <section className="page">
      <h1>My Projects</h1>

      <div className="projects">
        <div className="project-card">
          <h2>SignBridge AI</h2>
          <p>
            An AI-powered platform for real-time Indian Sign Language
            recognition and communication.
          </p>
        </div>

        <div className="project-card">
          <h2>CreditWise</h2>
          <p>
            A machine learning based loan approval prediction system.
          </p>
        </div>

        <div className="project-card">
          <h2>Enterprise Intelligence Platform</h2>
          <p>
            An analytics and AI assistant platform for enterprise data.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Projects;