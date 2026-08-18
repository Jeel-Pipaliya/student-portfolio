function Projects() {
  const projects = [
    "SignBridge AI",
    "CreditWise Loan Approval System",
    "Smart Internship Matchmaker"
  ];

  return (
    <section className="section">
      <h2>My Projects</h2>

      <ul className="projects-list">
        {projects.map((project) => (
          <li key={project}>{project}</li>
        ))}
      </ul>
    </section>
  );
}

export default Projects;