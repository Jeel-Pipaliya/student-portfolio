import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Machine Learning Internship",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert("Please fill in all required fields before submitting.");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      // Create mailto link as fallback to initiate native mail client
      const mailtoLink = `mailto:24aiml051@charusat.edu.in?subject=${encodeURIComponent(
        `[Portfolio] ${formData.subject} - from ${formData.name}`
      )}&body=${encodeURIComponent(
        `From: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}`
      )}`;
      window.open(mailtoLink, "_blank");
    }, 800);
  };

  const prefillInquiry = (type) => {
    if (type === "internship") {
      setFormData({
        name: "Recruitment Team",
        email: "recruiter@techcorp.com",
        subject: "Machine Learning & Data Science Internship Opportunity",
        message:
          "Hi Jeel, we reviewed your machine learning projects (CreditWise and SmartCart) and your academic performance (CGPA 8.18). We would love to discuss an internship opportunity with our data team."
      });
    } else if (type === "collaboration") {
      setFormData({
        name: "Research Collaborator",
        email: "peer@university.edu",
        subject: "Research & Applied Machine Learning Project Collaboration",
        message:
          "Hi Jeel, I am interested in collaborating with you on a predictive modeling and computer vision project. Let's connect!"
      });
    }
    setSubmitted(false);
  };

  return (
    <div className="contact-page-container">
      {/* Header */}
      <section className="page-header-block">
        <span className="section-eyebrow">Direct Communications</span>
        <h1 className="page-main-title">Get in Touch with Jeel</h1>
        <p className="page-main-subtitle">
          Open to Machine Learning internships, data science projects, and technical engineering collaborations.
        </p>
      </section>

      <div className="contact-layout-grid">
        {/* Left Column: Direct Info & Social Cards */}
        <div className="contact-info-column">
          <div className="glass-card contact-profile-summary">
            <div className="contact-badge-status">
              <span className="pulse-dot"></span>
              <span>Actively Responding to Inquiries</span>
            </div>
            <h2 className="contact-col-title">Jeel Pipaliya</h2>
            <p className="contact-col-subtitle">
              B.Tech Artificial Intelligence & Machine Learning (Rank Holder)
            </p>
            <p className="contact-col-body">
              Feel free to reach out directly via institutional email, mobile, or connect on LinkedIn and GitHub.
            </p>
          </div>

          <div className="contact-cards-list">
            <a href="mailto:24aiml051@charusat.edu.in" className="glass-card contact-channel-card">
              <div className="channel-icon-wrap email-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="channel-info">
                <span className="channel-label">Institutional Email</span>
                <span className="channel-value">24aiml051@charusat.edu.in</span>
              </div>
              <span className="channel-arrow">→</span>
            </a>

            <a href="tel:+919328105383" className="glass-card contact-channel-card">
              <div className="channel-icon-wrap phone-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="channel-info">
                <span className="channel-label">Mobile & WhatsApp</span>
                <span className="channel-value">(+91) 9328105383</span>
              </div>
              <span className="channel-arrow">→</span>
            </a>

            <a
              href="https://www.linkedin.com/in/jeelpipaliya/"
              target="_blank"
              rel="noreferrer"
              className="glass-card contact-channel-card"
            >
              <div className="channel-icon-wrap linkedin-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <div className="channel-info">
                <span className="channel-label">LinkedIn Profile</span>
                <span className="channel-value">linkedin.com/in/jeelpipaliya</span>
              </div>
              <span className="channel-arrow">↗</span>
            </a>

            <a
              href="https://github.com/Jeel-Pipaliya"
              target="_blank"
              rel="noreferrer"
              className="glass-card contact-channel-card"
            >
              <div className="channel-icon-wrap github-icon">
                <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
              </div>
              <div className="channel-info">
                <span className="channel-label">GitHub Repositories</span>
                <span className="channel-value">github.com/Jeel-Pipaliya</span>
              </div>
              <span className="channel-arrow">↗</span>
            </a>

            <div className="glass-card contact-channel-card location-card">
              <div className="channel-icon-wrap location-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="channel-info">
                <span className="channel-label">Academic Location</span>
                <span className="channel-value">CSPIT - CHARUSAT University, Changa, Gujarat, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="contact-form-column">
          <div className="glass-card contact-form-wrapper">
            <div className="form-header-area">
              <h3 className="form-title">Send a Direct Message</h3>
              <p className="form-subtitle">Fill in the message parameters to initiate direct communication.</p>

              {/* Quick Template Buttons */}
              <div className="quick-templates-wrap">
                <span className="quick-label">Quick Fill:</span>
                <button
                  type="button"
                  className="quick-fill-btn"
                  onClick={() => prefillInquiry("internship")}
                >
                  💼 Internship Offer
                </button>
                <button
                  type="button"
                  className="quick-fill-btn"
                  onClick={() => prefillInquiry("collaboration")}
                >
                  🤝 Project Collaboration
                </button>
              </div>
            </div>

            {submitted && (
              <div className="form-success-banner">
                <span className="success-icon">✅</span>
                <div>
                  <strong>Message Prepared Successfully!</strong>
                  <p>Your mail client has been launched with the pre-filled dispatch payload. Thank you!</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="portfolio-contact-form">
              <div className="form-row-dual">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Your Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="form-control"
                    placeholder="e.g. Dr. Alex Mercer / HR Manager"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Your Email Address <span className="required-star">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="form-control"
                    placeholder="e.g. recruiter@company.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  Subject Category
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="form-control"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <option value="Machine Learning Internship">Machine Learning & Data Science Internship</option>
                  <option value="Research & ML Collaboration">Research & Predictive Modeling Collaboration</option>
                  <option value="Full-Stack Web Engineering">Full-Stack Web Development Project</option>
                  <option value="General Academic Inquiry">General Academic or Professional Inquiry</option>
                </select>
              </div>

              <div className="form-group">
                <div className="label-with-meta">
                  <label htmlFor="message" className="form-label">
                    Message Body <span className="required-star">*</span>
                  </label>
                  <span className="char-count-pill">
                    {formData.message.length} characters
                  </span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="6"
                  className="form-control textarea-control"
                  placeholder="Share details regarding your opportunity, project scope, or inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions-bar">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? "Hide Preview" : "Preview Message"}
                </button>

                <button type="submit" className="btn btn-primary submit-btn">
                  <span>Send Message via Email</span>
                  <span>🚀</span>
                </button>
              </div>
            </form>

            {/* Live Message Preview Accordion */}
            {showPreview && (
              <div className="message-live-preview glass-card">
                <h4 className="preview-heading">Live Payload Preview</h4>
                <div className="preview-meta">
                  <p><strong>To:</strong> Jeel Pipaliya (24aiml051@charusat.edu.in)</p>
                  <p><strong>From:</strong> {formData.name || "Anonymous Sender"} ({formData.email || "No email entered"})</p>
                  <p><strong>Subject:</strong> [Portfolio] {formData.subject}</p>
                </div>
                <div className="preview-body">
                  <strong>Content:</strong>
                  <p>{formData.message || "No message written yet."}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;