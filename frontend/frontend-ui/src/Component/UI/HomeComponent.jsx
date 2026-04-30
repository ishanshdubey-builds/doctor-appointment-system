// -------------------------------------------------------------
// HomeComponent.jsx - Landing Page for Doctor Appointment System
// Displays information about the platform, features, and patient guides
// -------------------------------------------------------------

// Import React to create functional components
import React from "react";

// Import Link for internal client-side navigation (currently unused here, but good practice)
import { Link } from "react-router-dom";

// Import scoped CSS for the Home component
import "./Home.css";

// Import static assets (e.g., doctor banner image)
import img from "./img/doctor-image.jpg";

// Export the main landing page component
export default function HomeComponent() {
  // Render the landing page structure
  return (
    // Main container wrapping the entire home layout
    <div className="home-container">

      {/* Hero/Banner section with a premium welcome message */}
      <section className="banner glass-panel">
        <h1 className="banner-title">Welcome to DAS Healthcare</h1>
        <p className="banner-subtitle">
          Book appointments effortlessly and access cutting-edge healthcare services.
        </p>
      </section>

      {/* Grid container to hold two columns of content for better desktop layout */}
      <div className="home-grid">
        {/* Left Column: About and Caution sections */}
        <div className="grid-col-left">

          {/* About Section details the platform's purpose */}
          <section className="content-card glass-panel">
            <h2>About Our Healthcare Platform</h2>
            <p>
              Our platform connects patients with top-tier healthcare providers,
              ensuring convenient access to medical care from the comfort of your home or office.
            </p>
            <p>
              Whether you're seeking routine check-ups, specialized treatments, or
              expert medical advice, our platform streamlines appointment scheduling,
              making healthcare more accessible for everyone.
            </p>
            <p>
              The Doctor Appointment System reduces manual administrative burdens
              and ensures smooth, user-friendly operation without requiring deep technical knowledge.
            </p>
          </section>

          {/* Caution section with public health information */}
          <section className="content-card glass-panel caution-section">
            <h2>Stay Informed About Public Health</h2>
            <p>
              Amidst the changing landscape of infectious diseases, taking necessary
              precautions is crucial to safeguard your community's well-being.
            </p>
            <ul className="styled-list">
              <li>Stay updated on the latest developments regarding viral outbreaks.</li>
              <li>Learn about preventive measures to minimize the risk of transmission.</li>
              <li>Access reliable info from trusted healthcare authorities.</li>
              <li>Find providers offering vaccination services and proactive screenings.</li>
            </ul>
          </section>
        </div>

        {/* Right Column: Innovation, Steps, and Booking Guidelines */}
        <div className="grid-col-right">

          {/* Innovations section highlighting new technologies */}
          <section className="content-card glass-panel doctor-section">
            <h2>Explore Modern Innovations</h2>
            <div className="doctor-card">
              {/* Image representing modern healthcare */}
              <div className="image-wrapper">
                <img src={img} alt="Healthcare Professional" className="modern-img" />
              </div>
              <div className="doctor-info">
                <h3>Emerging Medical Technologies</h3>
                <ul className="styled-list compact-list">
                  <li><strong>Telemedicine:</strong> Remote consultations via video.</li>
                  <li><strong>AI Diagnostics:</strong> Accurate, personalized treatment plans.</li>
                  <li><strong>Remote Monitoring:</strong> Track vital signs from home.</li>
                  <li><strong>Robotics:</strong> Enhanced precision in surgeries.</li>
                  <li><strong>Health Apps:</strong> User-friendly wellness management.</li>
                </ul>
                <div className="learn-more-container">
                  {/* External link to external health tech resource */}
                  <a
                    href="https://www.fortec.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn primary-btn"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Full width container for Process Guides */}
      <div className="process-guides">
        {/* Guide for signing up on the platform */}
        <section className="content-card glass-panel process-card">
          <h2>How to Signup</h2>
          <div className="step-grid">
            <div className="step-item">
              <span className="step-number">1</span>
              <h4>Fill Details</h4>
              <p>Enter your personal info (name, email, DOB, contact).</p>
            </div>
            <div className="step-item">
              <span className="step-number">2</span>
              <h4>Choose Role</h4>
              <p>Select Patient or Doctor (requires extra credentials).</p>
            </div>
            <div className="step-item">
              <span className="step-number">3</span>
              <h4>Set Password</h4>
              <p>Create a secure password with letters and numbers.</p>
            </div>
            <div className="step-item">
              <span className="step-number">4</span>
              <h4>Submit</h4>
              <p>Review and click sign up to complete registration.</p>
            </div>
          </div>
        </section>

        {/* Guide for booking an appointment */}
        <section className="content-card glass-panel process-card">
          <h2>How to Book an Appointment</h2>
          <div className="booking-instructions">
            <ol className="styled-ordered-list">
              <li>Log in to your patient account and navigate to Booking.</li>
              <li>Provide patient name, age, and contact number in the form.</li>
              <li>Select your preferred date and time from the interactive calendar.</li>
              <li>Choose a specialized doctor from the available dropdown menu.</li>
              <li>Specify the appointment type (e.g., Regular Checkup, Emergency).</li>
              <li>Select your payment method and submit your request.</li>
              <li>Receive instant confirmation once your booking is processed!</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
