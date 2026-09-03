import { useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  return (
    <section className="page">
      <h1>Contact Me</h1>

      <div className="contact-form">
        <label htmlFor="message">
          Your Message
        </label>

        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message..."
          rows="6"
        />

        <p>
          Your message:
          <strong> {message || "Nothing entered yet."}</strong>
        </p>

        <p>
          Character count: {message.length}
        </p>

        <button onClick={() => setShowHelp(!showHelp)}>
          {showHelp ? "Hide Help" : "Show Help"}
        </button>

        {showHelp && (
          <p className="help">
            Please enter your message above. Your input is displayed
            in real time using React state.
          </p>
        )}
      </div>
    </section>
  );
}

export default Contact;